const generateOTP = (length = 6) => {
  const numbers = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  return otp;
};

module.exports = generateOTP;
