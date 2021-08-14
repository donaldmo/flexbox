const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const UserSchema = new Schema({
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

  paymentGateway: {
    secret_key: String,
    public_key: String
  },

  workspaces: [{
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true
    },
    workspaceName: {
      type: String,
      required: true
    }
  }]
  ,

  adminPaymentGateway: {
    name: String,
    secret_key: String,
    public_key: String,
  },
  confirmedEmail: {
    type: Boolean,
    default: false
  },
  resetPassword: {
    type: Boolean,
    default: false
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          required: true
        }
      }
    ]
  }
});

UserSchema.index({
  firstName: 'text',
  lastName: 'text',
}, {
  weights: {
    firstName: 5,
    lastName: 1,
  },
});

UserSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  }
  catch (error) {
    throw error;
  }
}

UserSchema.methods.generatePassword = async function (password) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }
  catch (error) {
    next(error);
  }
}

const User = mongoose.model('user', UserSchema);
module.exports = User;