const Joi = require("joi");

//new user validate
exports.validUser = (_reqBody) => {
  let joiSchema = Joi.object({
    personalInfo: Joi.object({
      firstName: Joi.string().min(2).max(25).required(),
      lastName: Joi.string().min(2).max(25).required(),

      // cheks if the ID is legal
      IDNumber: Joi.string().pattern(/^(?:\d{8}|\d{9}[a-zA-Z]?)$/)
      .custom((value, _helpers) => {
        const idNum = value.toString().trim();
    
        // Check the number's format
        if (!/^(\d{9}|\d{8}[a-zA-Z])$/.test(idNum)) {
          return _helpers.message("ID number must be 9 digits or 8 digits and a letter");
        }
    
        // Validate the checksum
        const factors = [1, 2, 1, 2, 1, 2, 1, 2, 1];
        const digits = idNum.split('').map(Number);
        let sum = 0;
    
        for (let i = 0; i < factors.length; i++) {
          let product = factors[i] * digits[i];
    
          if (product > 9) {
            product -= 9;
          }
    
          sum += product;
        }
    
        if (sum % 10 !== 0) {
          return _helpers.message("Invalid ID number checksum");
        }
    
        return value;
      }).required(),
      address: Joi.object({
        city: Joi.string().min(2).max(25).required(),
        street: Joi.string().min(2).max(50).required(),
        number: Joi.number().integer().min(1).max(999).required(),
      }),
      birthDate: Joi.date().max('now').required(),
      phone: Joi.string().pattern(/^[0-9]{9}$/),
      mobilePhone: Joi.string().pattern(/^[0-9]{10}$/).required(),
      img_url: Joi.string().min(0).max(1000).allow()
    })

  })

  return joiSchema.validate(_reqBody);
}

//adding Vaccinations validate
exports.validVaccination = (_reqBody) => {
  let joiSchema = Joi.object({
    dateGiven: Joi.date().max('now').required(),
    manufacturer: Joi.string().required()
  });

  return joiSchema.validate(_reqBody);
}

//adding positive result date validate
exports.validPositiveResult = (_reqBody) => {
  let joiSchema = Joi.object({

    positiveResultDate: Joi.date().max('now').required()
  });

  return joiSchema.validate(_reqBody);
}

//adding recovery date validate
exports.validRecoveryDate = (_reqBody) => {
  let joiSchema = Joi.object({

    recoveryDate: Joi.date().max('now').required()
  });

  return joiSchema.validate(_reqBody);
}


//update userInfo validate
exports.validInfo = (_reqBody) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(2).max(25).allow(),
    img_url: Joi.string().min(0).max(1000).allow()
  })
  return joiSchema.validate(_reqBody);
}


