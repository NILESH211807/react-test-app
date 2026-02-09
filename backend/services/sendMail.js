const transporter = require("../config/mail.config");
const asyncHandler = require("express-async-handler");

module.exports.sendMailForOTP = asyncHandler(async (to, otp) => {
  const info = await transporter.sendMail({
    from: '"Verify Account"', // sender address
    to: to, // list of recipients
    subject: "OTP for your account",
    text: `Your OTP is ${otp} valid for 10 minute.`,
  });
  console.log("Message sent: %s", info.messageId);
});
