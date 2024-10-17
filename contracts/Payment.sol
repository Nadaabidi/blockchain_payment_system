// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Payment {
    address public owner;

    event PaymentReceived(address indexed sender, uint256 amount);

    struct PaymentDetail {
        address sender;
        uint256 amount;
        uint256 timestamp;
    }

    PaymentDetail[] public payments;

    constructor() {
        owner = msg.sender;
    }

       // Function to reset payments
    function resetPayments() public {
        require(msg.sender == owner, "Only the owner can reset payments"); 
        delete payments; 
    }

    // Fallback function to receive ETH
    receive() external payable {
        emit PaymentReceived(msg.sender, msg.value);
        payments.push(PaymentDetail(msg.sender, msg.value, block.timestamp));
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

     // Get the total number of payments
    function getPaymentCount() public view returns (uint256) {
        return payments.length;
    }

    // Get a specific payment detail by index
    function getPayment(uint256 index) public view returns (address, uint256, uint256) {
        require(index < payments.length, "Payment index out of bounds");
        PaymentDetail storage payment = payments[index];
        return (payment.sender, payment.amount, payment.timestamp);
    }
}
