// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
 
contract NailzToken is ERC20{
    constructor() public ERC20("Nailz", "NLZ") {
    _mint(msg.sender, 101988 * 10**9);
  }
  
  function decimals() public view virtual override returns (uint8) {
  return 9;
}
}