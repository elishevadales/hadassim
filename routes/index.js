const express= require("express");
const router = express.Router();

router.get("/" , (req,res)=> {
  res.json({msg:"mission 2 hadassim works !"})
})

module.exports = router;