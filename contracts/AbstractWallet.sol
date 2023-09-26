// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

error IncorrectPassword();
error FailedToSendEth();
error InsufficientBalance();

contract AbstractWallet {
    string public walletName;
    bytes32 passwordHash;

    constructor(string memory name, string memory password) payable {
        walletName = name;
        passwordHash = keccak256(abi.encodePacked(password));
    }

    modifier authenticated(string calldata password) {
      if (keccak256(abi.encodePacked(password)) != passwordHash) revert IncorrectPassword();
      _;
   }

    function transferEth(string calldata password, address to, uint amount) public authenticated(password) {
        if (address(this).balance < amount) revert InsufficientBalance();

        (bool sent, ) = to.call{value: amount}("");
        if (!sent) revert FailedToSendEth();
    }

    function transferERC20(string calldata password, address token, address to, uint amount) public authenticated(password) {
        IERC20(token).transfer(to, amount);
    }

    receive() external payable {}
    fallback() external payable {}
}
