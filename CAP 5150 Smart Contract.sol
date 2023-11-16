// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FileStorage {
    address public owner;

    mapping(address => bool) public authorizedAccess;
    mapping(uint256 => string) public storedCIDs;

    event CIDStored(uint256 indexed id, string cid);

    constructor(address _trustedUser1) {
        owner = msg.sender;
        authorizeAccess(_trustedUser1);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function");
        _;
    }

    modifier onlyAuthorized() {
        require(authorizedAccess[msg.sender] || msg.sender == owner, "Caller is not authorized");
        _;
    }

    function authorizeAccess(address user) public onlyOwner {
        authorizedAccess[user] = true;
    }

    function revokeAccess(address user) public onlyOwner {
        delete authorizedAccess[user];
    }

    function storeCID(string memory cid) public onlyAuthorized {
        uint256 id = uint256(keccak256(abi.encodePacked(cid, block.timestamp)));
        storedCIDs[id] = cid;
        emit CIDStored(id, cid);
    }
}
