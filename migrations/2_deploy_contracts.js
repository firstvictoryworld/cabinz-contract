const NailzToken = artifacts.require("NailzToken");

module.exports = function (deployer) {
  deployer.deploy(NailzToken);
};
