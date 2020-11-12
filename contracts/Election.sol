pragma solidity >= 0.5.0 < 0.7.5;

contract Election {

    struct Candidate {
        string name;
        uint voteCount; // how many votes a candidate got
    }

    struct Voter {
        bool authorized; // the voter has to be authorized to vote
        bool voted; // voted yes or not
        uint voteIndex; // the candidate that i have to vote for is referenced by an index position in the array of candidates
    }

    uint totalVotes = 0;
    string electionName;
    address owner;
    Candidate[] public candidates; // array of candidates
    mapping(address => Voter) public voters; // keep track of voters

    modifier restricted() {
        require(msg.sender == owner);
        _;
    }

    constructor(string memory _electionName) public {
        owner = msg.sender;
        electionName = _electionName;
    }

    function getTotalVotes() public view returns (uint) {
        return totalVotes;
    }

    function getElectionName() public view returns (string memory) {
        return electionName;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function getNumCandidates() public view returns (uint) {
        return candidates.length;
    }

    function addCandidate(string memory _name) public {
        uint numVotes = 0;
        candidates.push(Candidate(_name, numVotes));
    }

    function authorizeVoter(address _voter) public restricted {
        voters[_voter].authorized = true;
    }

    function vote(uint _voteIndex) public {
        // Make sure that the voter is authorized to vote
        require(voters[msg.sender].authorized);
        // Make sure that the voter has not voted
        require(!voters[msg.sender].voted);

        // Update voters mapping
        voters[msg.sender].voted = true;
        voters[msg.sender].voteIndex = _voteIndex;

        // Update candidates array
        candidates[_voteIndex].voteCount += 1;
        totalVotes += 1;
    }

    function endElection() public restricted {
        // Destroy contract
        selfdestruct(payable(owner));
    }
}
