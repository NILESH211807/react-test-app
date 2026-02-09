const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      min: 3,
      max: 20,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      require: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      require: true,
      trim: true,
      min: 6,
      max: 20,
      select: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    profile: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

// password encryption
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const password = this.password;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(password, salt);
});

module.exports = mongoose.model("User", userSchema);
