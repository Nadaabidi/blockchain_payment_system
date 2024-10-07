// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Payment {
    address public owner;

    uint256 public paymentLimit;

    mapping(address => uint256) public balances;

    struct PaymentInfo {
        address sender;
        uint256 amount;
        uint256 timestamp;
    }

    PaymentInfo[] public payments;

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

    function setPaymentLimit(uint256 _limit) public {
        require(msg.sender == owner, "Only the owner can set the payment limit");
        paymentLimit = _limit;
    }

    function sendPayment() public payable {
        require(msg.value <= paymentLimit, "Payment exceeds the limit");
        balances[msg.sender] += msg.value;
        payments.push(PaymentInfo(msg.sender, msg.value, block.timestamp)); 
        emit PaymentReceived(msg.sender, msg.value);
    }

    function refund() public {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No balance to refund");
        balances[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }

    function getPayment(uint256 index) public view returns (address, uint256, uint256) {
        PaymentInfo memory payment = payments[index]; 
        return (payment.sender, payment.amount, payment.timestamp);
    }

    
    function getPaymentCount() public view returns (uint256) {
        return payments.length;
    }
}
