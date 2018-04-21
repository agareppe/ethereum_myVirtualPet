pragma solidity ^0.4.21;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/VirtualPet.sol";

contract TestVirtualPet {
  VirtualPet virtualPet = VirtualPet(DeployedAddresses.VirtualPet());

  //function testAddUser() public {
  //  string alvaro = "Alvaro";
  //  string testPet = "testPet";
  //  string img = "img";
  //  virtualPet.addPlayer(alvaro,testPet,img);
  //  address found = virtualPet.getPlayerAddress(0);
  //  string petName;
  //  string petImage;
  //  string userName;
  //  uint energyLength;
  //  (userName,petName,petImage,energyLength) = virtualPet.getPetDataByPlayer(found);
  //  string expected = "testPet";
  //  Assert.equal(petName, expected, "TestPet not set");
  //}  

  function testSelfPlayRequest() public {
      var a = virtualPet.addPlayer("alvaro","testPet","img");
      virtualPet.sendPlayRequest(a);

      //virtualPet.decrementEnergyLevel(msg.sender,10);

      uint length = virtualPet.getPlayRequestLength();
      Assert.equal(length, 1, "Should have some requests");

      virtualPet.letsPlay(a);

      uint finalLength = virtualPet.getPlayRequestLength();
      Assert.equal(finalLength, 0, "Still some requests");
  }

}

