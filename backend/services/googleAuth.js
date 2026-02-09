const { default: axios } = require("axios");

module.exports.getGoogleProfile = async (accessToken) => {
  const result = await axios.get(
    "https://www.googleapis.com/oauth2/v1/userinfo",
    {
      params: {
        alt: "json",
        access_token: accessToken,
      },
    },
  );

  return result.data;
};
