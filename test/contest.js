
var Contest = artifacts.require("./contest.sol")
contract("Contest", function(accounts){
	//checking if initialized with two  people or not
	
	it("initializes with two contestants", function(){
		return Contest.deployed().then(function(instance){
			return instance.contestantsCount();
		}).then(function(count){
			assert.equal(count,2);// anything except 2 is failed equates the two argument values
		});
	});
// this snippet helps in testing the values stored in contestants of the blockchain
	it("it initializedtializes with correct values", function(){
		return Contest.deployed().then(function(instance){
			contestantInstance = instance;
			return contestantInstance.contestants(1);
		}).then(function(contestant){
			assert.equal(contestant[0],1);//conestant[0] is id, con..[1] is name, con..[2] is vote count
			return contestantInstance.contestants(2);
		}).then(function(contestant){
			assert.equal(contestant[0],2)//same as above
		});
	});

	it("allows a voter to cast a vote only once",function(){
	return Contest.deployed().then(function(instance){
		contestantInstance = instance;
		contestantId = 2;
		return contestantInstance.vote(contestantId, {from : accounts[0]});

	}).then(function(receipt){	
		return contestantInstance.voters(accounts[0]); 
	}).then(function(voted){
		assert(voted, "voter was markd as voted");
		return contestantInstance.contestants(contestantId);
	}).then(function(contestant){
		var voteCount = contestant[2];
		assert.equal(voteCount,1, "increments contestats  vote count");
		})
	});
});