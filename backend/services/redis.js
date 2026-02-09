const redisConfig = require("../config/redisConfig");

module.exports.addCache = async (key, value) => {
  await redisConfig.set(key, value, "EX", 60 * 10); // 10 minutes
};

module.exports.getCache = async (key) => {
  return await redisConfig.get(key);
};

module.exports.deleteCache = async (key) => {
  return await redisConfig.del(key);
};
