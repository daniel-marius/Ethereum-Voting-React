const Election = artifacts.require("./Election.sol");

module.exports = (deployer) => {
  deployer.deploy(Election, arg1="First Election");
};
