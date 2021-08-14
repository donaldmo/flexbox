const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const schema = new Schema({
  role: String,
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  firstName: String,
  lastName: String,
  gender: String,
  address: {
    street: String,
    suburb: String,
    zipcode: String,
    province: String,
    city: String,
    apartment: String
  },

  featuredImage: {
    imageName: String,
    url: String
  },

  workspaces: [
    {
      workspaceId: {
        type: Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true
      },
      workspaceName: {
        type: String,
        required: true
      }
    }
  ],

  confirmedEmail: {
    type: Boolean,
    default: false
  },

  resetPassword: {
    type: Boolean,
    default: false
  },

});

schema.index({
  firstName: 'text',
  lastName: 'text',
}, {
  weights: {
    firstName: 5,
    lastName: 1,
  },
});

schema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  }
  catch (error) {
    throw error;
  }
}

schema.methods.generatePassword = async function (password) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }
  catch (error) {
    next(error);
  }
}

const Student = mongoose.model('Student', schema);
module.exports = Student;