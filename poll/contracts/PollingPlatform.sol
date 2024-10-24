// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PollingPlatform {
    struct Poll {
        uint256 id;
        string question;
        string description;
        uint256 createdAt;
        uint256 closeAt;
        bool isOpen;
        bool isDeleted;
        address owner;
        string[] options;
        uint256[] votes;
        mapping(address => uint256) userVotes;
    }

    struct PollInfo {
        uint256 id;
        string question;
        string description;
        uint256 createdAt;
        uint256 closeAt;
        bool isOpen;
        address owner;
        string[] options;
        uint256[] votes;
        uint256 userVote;
    }

    Poll[] public polls;
    uint256 public pollCounter = 0;

    event PollCreated(uint256 pollId, string question, address creator);
    event PollDeleted(uint256 pollId);
    event Voted(uint256 pollId, uint256 optionIndex, address voter);

    modifier onlyOwner(uint256 _pollId) {
        require(
            polls[_pollId].owner == msg.sender,
            "Not the owner of this poll."
        );
        require(!polls[_pollId].isDeleted, "Poll is deleted.");
        _;
    }

    modifier pollIsOpen(uint256 _pollId) {
        require(polls[_pollId].isOpen, "Poll is closed.");
        require(!polls[_pollId].isDeleted, "Poll is deleted.");
        _;
    }

    modifier canVote(uint256 _pollId) {
        require(polls[_pollId].isOpen, "Poll is closed.");
        require(!polls[_pollId].isDeleted, "Poll is deleted.");
        require(
            polls[_pollId].userVotes[msg.sender] == 0,
            "You have already voted."
        );
        _;
    }

    function createPoll(
        string memory _question,
        string memory _description,
        string[] memory _options,
        uint256 _duration
    ) public {
        require(_options.length > 1, "Poll must have at least two options.");

        Poll storage newPoll = polls.push();
        newPoll.id = pollCounter;
        newPoll.question = _question;
        newPoll.description = _description;
        newPoll.createdAt = block.timestamp;
        newPoll.closeAt = block.timestamp + _duration;
        newPoll.isOpen = true;
        newPoll.isDeleted = false;
        newPoll.owner = msg.sender;
        newPoll.options = _options;
        newPoll.votes = new uint256[](_options.length);
        newPoll.userVotes[msg.sender] = 0;

        emit PollCreated(pollCounter, _question, msg.sender);
        pollCounter++;
    }

    function vote(
        uint256 _pollId,
        uint256 _optionIndex
    ) public pollIsOpen(_pollId) canVote(_pollId) {
        require(
            _optionIndex < polls[_pollId].options.length,
            "Invalid option index."
        );

        polls[_pollId].votes[_optionIndex]++;
        polls[_pollId].userVotes[msg.sender] = _optionIndex + 1;
        emit Voted(_pollId, _optionIndex, msg.sender);
    }

    function getPolls() public view returns (PollInfo[] memory) {
        uint256 activePollsCount = 0;

        for (uint256 i = 0; i < pollCounter; i++) {
            if (!polls[i].isDeleted) {
                activePollsCount++;
            }
        }

        PollInfo[] memory pollInfos = new PollInfo[](activePollsCount);
        uint256 index = 0;

        for (uint256 i = 0; i < pollCounter; i++) {
            Poll storage currentPoll = polls[i];

            if (!currentPoll.isDeleted) {
                uint256 userVote = currentPoll.userVotes[msg.sender];

                pollInfos[index] = PollInfo({
                    id: currentPoll.id,
                    question: currentPoll.question,
                    description: currentPoll.description,
                    createdAt: currentPoll.createdAt,
                    closeAt: currentPoll.closeAt,
                    isOpen: currentPoll.isOpen,
                    owner: currentPoll.owner,
                    options: currentPoll.options,
                    votes: currentPoll.votes,
                    userVote: userVote
                });

                index++;
            }
        }

        return pollInfos;
    }

    function getUserPolls() public view returns (PollInfo[] memory) {
        uint256 userPollCounter = 0;

        for (uint256 i = 0; i < pollCounter; i++) {
            if (polls[i].owner == msg.sender && !polls[i].isDeleted) {
                userPollCounter++;
            }
        }

        PollInfo[] memory userPolls = new PollInfo[](userPollCounter);
        uint256 index = 0;

        for (uint256 i = 0; i < pollCounter; i++) {
            Poll storage currentPoll = polls[i];

            if (currentPoll.owner == msg.sender && !currentPoll.isDeleted) {
                uint256 userVote = currentPoll.userVotes[msg.sender];

                userPolls[index] = PollInfo({
                    id: currentPoll.id,
                    question: currentPoll.question,
                    description: currentPoll.description,
                    createdAt: currentPoll.createdAt,
                    closeAt: currentPoll.closeAt,
                    isOpen: currentPoll.isOpen,
                    owner: currentPoll.owner,
                    options: currentPoll.options,
                    votes: currentPoll.votes,
                    userVote: userVote
                });

                index++;
            }
        }

        return userPolls;
    }

    function deletePoll(uint256 _pollId) public onlyOwner(_pollId) {
        polls[_pollId].isDeleted = true;
        emit PollDeleted(_pollId);
    }

    function closePoll(uint256 _pollId) public onlyOwner(_pollId) {
        require(!polls[_pollId].isDeleted, "Poll is deleted.");
        polls[_pollId].isOpen = false;
    }

    function openPoll(uint256 _pollId) public onlyOwner(_pollId) {
        require(!polls[_pollId].isDeleted, "Poll is deleted.");
        polls[_pollId].isOpen = true;
    }

    function getPollCount() public view returns (uint256) {
        return pollCounter;
    }
}
