// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract Transaction {
    uint256 transactionCount;

    event Transfer(address from, address to, uint256 amount, uint256 timestamp);
    
    struct TransferStruct {
        address from;
        address to;
        uint256 amount;
        uint256 timestamp;
    }

    TransferStruct[] transfers;

    function addToBlockchain(address from, address to, uint256 amount, uint256) public {
        TransferStruct memory transfer = TransferStruct({ from: from, to: to, amount: amount, timestamp: block.timestamp });
        transfers.push(transfer);
        transactionCount += 1;

        emit Transfer(from, to, amount, block.timestamp);
    }

    function getAllTransactions() public view returns (TransferStruct[] memory) {
        return transfers;
    }

    function getTransactionCount() public view returns (uint256) {
        return transactionCount;
    }
}
