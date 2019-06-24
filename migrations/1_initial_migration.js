var Migrations = artifacts.require("./Migrations.sol");
// use truffle migrate --reset to not get error
module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
