pragma solidity ^0.5.0;

contract Contest{
	struct Contestant{
		uint id;
		string name;
		uint voteCount;
	}
	// mapping function fetches data 
	mapping(uint=>Contestant) public contestants;
	//to save list of people who already voted
	mapping(address =>bool) public voters;
	// length(contestants) canot be used as default values exist till the end
	uint public contestantsCount=0 ;
	
	function addContestant (string memory _name) private{
	// underscore is added as name is private entity so public can't add contestants 
		contestantsCount++;
		contestants[contestantsCount] = Contestant(contestantsCount, _name, 0);
		
	} 
	//event function used to catch event and reload thw pgae when tx happens
	event votedEvent(
		uint indexed _contestantId
	);

	constructor() public{
		addContestant("abc");
		addContestant("def");
	}

	function vote(uint _contestantId) public{
		//restrict perosn who already cast vote
		require(!voters[msg.sender]);//msg.sender not present in voters mapping
		require(_contestantId>0 && _contestantId<= contestantsCount);//to check if valid user is voted for 
		contestants[_contestantId].voteCount++;
		voters[msg.sender] = true;// msg.sender is the metadeta, we can browse it by using this command
		emit votedEvent(_contestantId); //emit is used on new version to call event
	}
} 