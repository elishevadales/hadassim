const express = require("express");
const router = express.Router();
const { validUser, validVaccination, validPositiveResult, validRecoveryDate } = require("../validations/userValidation")
const { UserModel } = require("../models/userModel");



router.get("/", (req, res) => {
  res.json({ msg: "clalit users work" })
})

// get users list by filter
router.get("/usersList", async (req, res) => {

  try {
    let data;
    
    
    if (req.query.city) {
      let searchByCityAdress = req.query.city.toLowerCase();
      data = await UserModel.find({ "personalInfo.address.city": searchByCityAdress });
    }
    else if (req.query.mobilePhone) {
      let searchByMobilePhone = req.query.mobilePhone.toLowerCase();
      data = await UserModel.find({ "personalInfo.mobilePhone": searchByMobilePhone });
    }
    else if (req.query.lastName) {
      let searchByLastName = req.query.lastName.toLowerCase();
      let searchReg = new RegExp(searchByLastName, "i")
      data = await UserModel.find({ "personalInfo.lastName": searchReg });
    }
    else {
      data = await UserModel.find({});

    }
    res.json({ data })
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})



// get Corona infornation about a specific user
router.get("/coronaInfo/:userId", async (req, res) => {
  try {
    let userId = req.params.userId;
    let user = await UserModel.findOne({ "personalInfo.IDNumber": userId });
    if (!user) {
      return res.status(404).send(`User with ID ${userId} not found`);
    }
    res.json(user.coronaInfo);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})

// get personal infornation about a specific user
router.get("/personalInfo/:userId", async (req, res) => {
  try {
    let userId = req.params.userId;
    let user = await UserModel.findOne({ "personalInfo.IDNumber": userId });
    if (!user) {
      return res.status(404).send(`User with ID ${userId} not found`);
    }
    res.json(user.personalInfo);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})

// get all infornation about a specific user
router.get("/userInfo/:userId", async (req, res) => {
  try {
    let userId = req.params.userId;
    let userInfo = await UserModel.findOne({ "personalInfo.IDNumber": userId });
    if (!userInfo) {
      return res.status(404).send(`User with ID ${userId} not found`);
    }
    res.json(userInfo);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})



// get all users who are not vaccinated
router.get("/usersNotVaccinated", async (req, res) => {
  try {
    let data = await UserModel.find({});
    const usersNotVaccinated = data.filter(item => item.coronaInfo.vaccinations.length === 0);
    const numOfUsersWithoutVaccinations = usersNotVaccinated.length;

    res.json({ numOfUsersWithoutVaccinations })
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})

//Get the number of patients who have previously been sick with Corona.
router.get("/sickUsers", async (req, res) => {
  try {
    let data = await UserModel.find({});
    const sickUsers = data.filter(user => user.coronaInfo.positiveResultDate);
    const numSickUsers = sickUsers.length;

    res.json({ numSickUsers })
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})

//add new user to DB
router.post("/", async (req, res) => {
  let validBody = validUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let user = new UserModel(req.body);
    user.personalInfo.address.city = user.personalInfo.address.city.toLowerCase();
    user.personalInfo.lastName =user.personalInfo.lastName.toLowerCase();
    user.personalInfo.firstName = user.personalInfo.firstName.toLowerCase();
    user.personalInfo.address.street = user.personalInfo.address.street.toLowerCase();
    await user.save();
    res.status(201).json(user);
  }
  catch (err) {
    if (err.code == 11000) {
      return res.status(500).json({ msg: "user already in system", code: 11000 })

    }
    console.log(err);
    res.status(500).json({ msg: "err", err })
  }
})


//add vaccinations to user
router.post("/:userId/vaccinations", async (req, res) => {
  const { error } = validVaccination(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const userId = req.params.userId;
  const vaccination = req.body;
  vaccination.manufacturer = vaccination.manufacturer.toLowerCase();
  vaccination.dateGiven = new Date(req.body.dateGiven);

  try {
    const user = await UserModel.findOne({ "personalInfo.IDNumber": userId });
    if (!user) {
      return res.status(404).send(`User with ID ${userId} not found`);
    }

    if (user.coronaInfo.vaccinations.length >= 4) {
      return res.status(400).send("A user cannot have more than 4 vaccinations");
    }

    // Makes sure there are no 2 vaccines given on the same day
    const foundVaccination = user.coronaInfo.vaccinations.find((item) => {
      return vaccination.dateGiven.getTime() === item.dateGiven.getTime();
    });

    if (foundVaccination) {
      return res.status(400).json({ message: 'This user has a vaccine given on this date already' });
    }

    //push the new vaccine to the array
    user.coronaInfo.vaccinations.push(vaccination);
    await user.save();

    res.send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
})

//add positive result date to user
router.post("/:userId/positiveResult", async (req, res) => {
  const { error } = validPositiveResult(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const userId = req.params.userId;
  const positiveResult = new Date(req.body.positiveResultDate);

  try {
    const user = await UserModel.findOne({ "personalInfo.IDNumber": userId });
    if (!user) {
      return res.status(404).send(`User with id ${userId} not found`);
    }
    if (user.coronaInfo.positiveResultDate) {
      return res.status(400).json({ message: 'A user can only get sick once' });

    }
    if (!positiveResult) {
      return res.status(400).json({ message: 'Positive result date is required' });
    }

    user.coronaInfo.positiveResultDate = positiveResult;
    await user.save();

    res.send(user);
    // return res.status(200).json({ message: 'Positive result date updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
})


//add recovery date to user
router.post("/:userId/recoveryDate", async (req, res) => {
  const { error } = validRecoveryDate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const userId = req.params.userId;
  const recoveryDate = new Date(req.body.recoveryDate);

  try {
    const user = await UserModel.findOne({ "personalInfo.IDNumber": userId });
    if (!user) {
      return res.status(404).send(`User with id ${userId} not found`);
    }
    if (user.coronaInfo.recoveryDate) {
      return res.status(400).json({ message: 'A user can heal only once' });

    }
    if (!recoveryDate) {
      return res.status(400).json({ message: 'recovery date is required' });
    }
    if (!user.coronaInfo.positiveResultDate) {
      return res.status(400).send(`User cannot have recovery date without a positive result date`);
    }
    if (user.coronaInfo.positiveResultDate.getTime() >= recoveryDate.getTime()) {
      return res.status(400).send(`recovery date must be leter than the positive result date`);
    }



    user.coronaInfo.recoveryDate = recoveryDate;
    await user.save();

    res.send(user);
    // return res.status(200).json({ message: 'recovery date updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
})


module.exports = router;