const PoolingPlatform = artifacts.require("PollingPlatform");
module.exports = function (deployer) {
  deployer.deploy(PoolingPlatform);
};
