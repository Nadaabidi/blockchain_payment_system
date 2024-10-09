

const web3 = new Web3(window.ethereum);
const contractAddress = "0x7E3a298FD3feA113696B68b6d2Ee7fCFC039DEaE"; 
const abi = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "PaymentReceived",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "balances",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "paymentLimit",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "payments",
      "outputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "stateMutability": "payable",
      "type": "receive",
      "payable": true
    },
    {
      "inputs": [],
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_limit",
          "type": "uint256"
        }
      ],
      "name": "setPaymentLimit",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "sendPayment",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function",
      "payable": true
    },
    {
      "inputs": [],
      "name": "refund",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "getPayment",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getPaymentCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
  ]; 

const contract = new web3.eth.Contract(abi, contractAddress);
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('sendPayment')) {
        document.getElementById('sendPayment').addEventListener('click', sendPayment);
    }

    if (document.getElementById('getBalance')) {
        document.getElementById('getBalance').addEventListener('click', getBalance);
    }

    if (document.getElementById('withdrawFunds')) {
        document.getElementById('withdrawFunds').addEventListener('click', withdrawFunds);
    }

    if (document.getElementById('requestRefund')) {
        document.getElementById('requestRefund').addEventListener('click', requestRefund);
    }

    if (document.getElementById('setPaymentLimit')) {
        document.getElementById('setPaymentLimit').addEventListener('click', setPaymentLimit);
    }

    if (document.getElementById('savePreferences')) {
        document.getElementById('savePreferences').addEventListener('click', savePreferences);
    }

    // Load specific content based on the current page
    if (window.location.pathname.includes('transactions.html')) {
        loadPaymentHistory();
    }

    if (window.location.pathname.includes('profile.html')) {
        loadWalletAddress();
    }
});

// Helper function to open the modal with a message
function openModal(title, message) {
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalContent').innerText = message;
    document.getElementById('outputModal').style.display = 'block';
}

// Helper function to close the modal
function closeModal() {
    document.getElementById('outputModal').style.display = 'none';
}

// Send Payment Function
async function sendPayment() {
    try {
        const accounts = await web3.eth.requestAccounts();
        await contract.methods.sendPayment().send({
            from: accounts[0],
            value: web3.utils.toWei('0.1', 'ether'),  // Amount of Ether to send
            gas: 3000000 // Adjust this value if needed
        })
        .on('transactionHash', function(hash) {
            openModal("Send Payment", "Payment sent successfully! Transaction hash: " + hash);
        })
        .on('error', function(error) {
            openModal("Send Payment", "Error sending payment: " + error.message);
        });
    } catch (err) {
        console.error(err);
        openModal("Send Payment", "Error sending payment.");
    }
}

// Get Contract Balance
async function getBalance() {
    try {
        const balance = await contract.methods.getBalance().call();
        openModal("Contract Balance", "Contract Balance: " + web3.utils.fromWei(balance, 'ether') + " ETH");
    } catch (err) {
        openModal("Contract Balance", "Error getting balance.");
    }
}

// Withdraw Funds
async function withdrawFunds() {
    try {
        const accounts = await web3.eth.requestAccounts();
        await contract.methods.withdraw().send({
            from: accounts[0]
        });
        openModal("Withdraw Funds", "Funds withdrawn successfully!");
    } catch (err) {
        openModal("Withdraw Funds", "Error withdrawing funds: " + err.message);
    }
}

// Request Refund
async function requestRefund() {
    try {
        const accounts = await web3.eth.requestAccounts();
        await contract.methods.refund().send({
            from: accounts[0]
        });
        openModal("Request Refund", "Refund successful!");
    } catch (err) {
        openModal("Request Refund", "Error requesting refund: " + err.message);
    }
}

// Set Payment Limit (if needed for future use)
async function setPaymentLimit() {
    const limit = document.getElementById('paymentLimit').value;
    try {
        const accounts = await web3.eth.requestAccounts();
        await contract.methods.setPaymentLimit(web3.utils.toWei(limit, 'ether')).send({
            from: accounts[0]
        });
        openModal("Set Payment Limit", "Payment limit set successfully!");
    } catch (err) {
        openModal("Set Payment Limit", "Error setting payment limit: " + err.message);
    }
}


// Load Payment History
async function loadPaymentHistory() {
    const paymentCount = await contract.methods.getPaymentCount().call();
    const paymentTableBody = document.getElementById('paymentHistory');

    paymentTableBody.innerHTML = '';

    for (let i = 0; i < paymentCount; i++) {
        const payment = await contract.methods.getPayment(i).call();
        const sender = payment[0];
        const amountInWei = payment[1];
        const timestamp = payment[2];
        const amountInEth = web3.utils.fromWei(amountInWei, 'ether');
        const date = new Date(timestamp * 1000).toLocaleString();

        const row = `
            <tr>
                <td>${sender}</td>
                <td>${amountInEth}</td>
                <td>${date}</td>
            </tr>
        `;
        paymentTableBody.innerHTML += row;
    }
}

// Load Wallet Address
async function loadWalletAddress() {
    const accounts = await web3.eth.requestAccounts();
    document.getElementById('walletAddress').innerText = accounts[0];
}

// Helper Function to Update Status
function setStatus(message) {
    document.getElementById('status').innerText = message;
}

function savePreferences() {
    const paymentLimit = document.getElementById('paymentLimit').value;
    const notifications = document.getElementById('notifications').value;
    const currency = document.getElementById('currency').value;

    console.log('Preferences saved:');
    console.log('Payment Limit:', paymentLimit);
    console.log('Email Notifications:', notifications);
    console.log('Preferred Currency:', currency);
    
    document.getElementById('preferenceStatus').innerText = "Preferences saved successfully!";
}

