// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NailzToken is ERC20, Ownable {
    
  // this variable will start the count for the inflactionMinting function    
  uint8 public mintedTimes = 1;

  // this constructor will mint the initial total supply of 1,000,000 Nailz tokens
  constructor() public ERC20("Nailz", "NLZ") {
    _mint(msg.sender, 1000000 * 10**9);
  }
  
  
  // this is an override function to change the ERC 20 token decimals to 9 instade of 18
  function decimals() public view virtual override returns (uint8) {
    return 9;
  }

  //only the owner of this contract (the deployer) can implement this function and no one else
  //this function will be used only 7 times and no more
  //this function will allow you to mint more tokens  
  function inflationMinting() public onlyOwner  {
      require(mintedTimes <= 7 , " you can't mint more Nailz tokens");
   if(mintedTimes==1) {
    _mint(msg.sender, 500000 * 10**9);
    mintedTimes ++;
   } else if(mintedTimes ==2){
     _mint(msg.sender, 250000 * 10**9);
     mintedTimes ++;
   } else if(mintedTimes ==3){
     _mint(msg.sender, 125000 * 10**9);
     mintedTimes ++;
   } else if(mintedTimes==4) {
     _mint(msg.sender, 62500 * 10**9);
     mintedTimes ++;
   } else if(mintedTimes ==5) {
     _mint(msg.sender, 31250 * 10**9);
     mintedTimes ++;
   } else if(mintedTimes ==6) {
     _mint(msg.sender, 15621 * 10**9);
     mintedTimes ++;
   }else if(mintedTimes == 7) {
     _mint(msg.sender, 15621 * 10**9);
     mintedTimes ++;
   }
}}
