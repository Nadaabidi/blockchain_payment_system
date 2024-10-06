// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Payment {
    address public owner;

    event PaymentReceived(address indexed sender, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    // Fallback function to receive ETH
    receive() external payable {
        emit PaymentReceived(msg.sender, msg.value);
    }

    // Function to withdraw all funds
    function withdraw() public {
        require(msg.sender == owner, "Only owner can withdraw funds");
        payable(owner).transfer(address(this).balance);
    }

    // Get the balance of the contract
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
