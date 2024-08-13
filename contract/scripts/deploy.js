const { ethers } = require("hardhat")

const main = async () => {
    const Transactions = await ethers.getContractFactory("Transaction")
    const transactions = await Transactions.deploy();
    console.log("Transactions deployed to:", transactions.target);
}

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

runMain();