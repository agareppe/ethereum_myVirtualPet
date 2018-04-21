var VirtualPet = artifacts.require("./VirtualPet.sol");

module.exports = function(deployer) {
  deployer.deploy(VirtualPet);
};
