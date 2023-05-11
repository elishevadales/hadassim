const mongoose = require("mongoose");
const Joi = require("joi");

let userSchema = new mongoose.Schema({
  personalInfo: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    //TO DO validation
    IDNumber: {
      type: String,
      required: true
    },
    address: {
      city: {
        type: String,
        required: true
      },
      street: {
        type: String,
        required: true
      },
      number: {
        type: Number,
        required: true
      }
    },
    birthDate: {
      type: Date,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    mobilePhone: {
      type: String,
      required: true
    },
    img_url: {
      type: String,
      required: false
    },
    img_url_preview:{
      type: String,
      required: false
    },
    date_created: {
      type: Date,
      default: Date.now()
    }
  },
  coronaInfo: {
    vaccinations: [{
      dateGiven: {
        type: Date,
        required: true
      },
      manufacturer: {
        type: String,
        required: true
      }
    }],
    positiveResultDate: {
      type: Date,
      required: false
    },
    recoveryDate: {
      type: Date,
      required: false
    }
  }

})

// Validator function to ensure that no more than 4 vaccinations are added for each user
userSchema.path('coronaInfo.vaccinations').validate(function(vaccinations) {
  return vaccinations.length <= 4;
}, 'A user cannot have more than 4 vaccinations');

exports.UserModel = mongoose.model("users", userSchema);




