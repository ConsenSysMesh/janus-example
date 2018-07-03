pragma solidity ^0.4.17;

contract JanusTest {
  address public owner;
  uint public intValue;
  address[] public partyOTAddresses;
  string public transactionId;

  function JanusTest(string txnId, address party1, address party2) public {
    owner = msg.sender;
    transactionId = txnId;
    setParties(party1, party2);
  }

  modifier onlyOwner() {
    if (msg.sender == owner) _;
  }
  
  modifier onlyParties() {
    bool hasAccess = false;
    for(uint i=0;i<partyOTAddresses.length;i++) {
      if (msg.sender == partyOTAddresses[i]) {
        hasAccess = true;
        break;
      }
    }
    if(!hasAccess)
      revert();
    _;
  }

  function setParties(address party1, address party2) public onlyOwner {
    partyOTAddresses = [party1, party2];
  }

  function setValue(uint value) public onlyParties {
    intValue = value;
  }
}
