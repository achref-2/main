const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["candidate", "recruiter", "admin"],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    googleId: { type: String, unique: true },
  },
  { timestamps: true }
);

// Indexes for better performance
userSchema.index({ email: 1 });

// Virtual for full name
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} `;
});

// Method to generate auth token
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: `${this.firstName} `,
      role: this.role,
    },
    process.env.JWTPRIVATEKEY,
    { expiresIn: "7d" }
  );
  return token;
};

// Validation function
const validateUser = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(50).required().label("First Name"),
   
    email: Joi.string().email().required().label("Email"),
    password: passwordComplexity().required().label("Password"),
    role: Joi.string().valid("candidate", "recruiter", "admin").required(),
  });
  return schema.validate(data);
};

const User = mongoose.model("User", userSchema);

module.exports = { User, validateUser };
