const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    otp: { type: String, select: false },
    expireAt: {
      type: Date,
      required: true,
      expires: 0,
    },
  },
  { timestamps: true },
);

// otp encryption
otpSchema.pre("save", async function (next) {
  if (!this.isModified("otp")) return next();
  const otp = this.otp;
  const salt = await bcrypt.genSalt(10);
  this.otp = await bcrypt.hash(otp, salt);
});

module.exports = mongoose.model("OTP", otpSchema);
