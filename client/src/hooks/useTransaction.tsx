import { useEffect, useState } from "react";
import { contractABI, contractAddress } from "../utils/constants";
import Web3 from "web3";

export interface structuredTransactionProps {
  addressTo: any;
  addressFrom: any;
  timestamp: string;
  amount: number;
}

const { ethereum }: any = window;

const createEthereumContract = () => {
  const web3 = new Web3(ethereum);
  return new web3.eth.Contract(contractABI, contractAddress);
};

const isValidAddress = (address: string) => {
  return Web3.utils.isAddress(address);
};

const TransactionsProvider = () => {
  const [formData, setformData] = useState({ addressTo: "", amount: "" });
  const [currentAccount, setCurrentAccount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transactionCount, setTransactionCount] = useState<any>(0);
  const [transactions, setTransactions] = useState<structuredTransactionProps[]>([]);

  useEffect(() => {
    const count = localStorage.getItem("transactionCount");
    setTransactionCount(count ? parseInt(count) : 0)
  }, [])

  const handleChange = (e: any, name: any) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const getAllTransactions = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const transactionsContract = createEthereumContract();
      const availableTransactions = await transactionsContract.methods.getAllTransactions().call({ from: currentAccount });

      const structuredTransactions = availableTransactions!.map((transaction: any) => ({
        addressTo: transaction.to,
        addressFrom: transaction.from,
        timestamp: new Date(parseInt(transaction.timestamp) * 1000).toLocaleString(),
        amount: parseInt(transaction.amount) / (10 ** 18)
      }));

      setTransactions(structuredTransactions as structuredTransactionProps[]);
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  const checkIfWalletIsConnect = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);

      ethereum.on("accountsChanged", (changedAccounts: string[]) => {
        setCurrentAccount(changedAccounts[0]);
      });

        getAllTransactions();
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  const checkIfTransactionsExists = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const transactionsContract = createEthereumContract();
      const currentTransactionCount: any = await transactionsContract.methods.getTransactionCount().call({ from: currentAccount });

      localStorage.setItem("transactionCount", currentTransactionCount.toString());
      setTransactionCount(currentTransactionCount);
    } catch (error) {
      console.log((error as Error).message);

      throw new Error("No ethereum object");
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_requestAccounts", });
      setCurrentAccount(accounts[0]);

      // Switch to Sepolia Network
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }],
      });
    } catch (error) {
      console.log((error as Error).message);

      throw new Error("No ethereum object");
    }
  };

  const sendTransaction = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const { addressTo, amount } = formData;

      if (!isValidAddress(addressTo) || !isValidAddress(currentAccount)) {
        console.error("Invalid address provided.");
        return;
      }

      setIsLoading(true);

      const transactionsContract = createEthereumContract();
      const parsedAmount = Web3.utils.toWei(amount.toString(), "ether");

      const web3 = new Web3(ethereum);
      const gasEstimate = await web3.eth.estimateGas({
        from: currentAccount,
        to: addressTo,
        value: parsedAmount,
      });

      await ethereum.request({
        method: "eth_sendTransaction",
        params: [{
          from: currentAccount,
          to: addressTo,
          gas: Web3.utils.toHex(gasEstimate),
          value: parsedAmount,
        }],
      });

      const transactionHash = await transactionsContract.methods.addToBlockchain(currentAccount, addressTo, parsedAmount).send({ from: currentAccount });
      const transactionsCount: any = await transactionsContract.methods.getTransactionCount().call({ from: currentAccount });

      setTransactionCount(transactionsCount);

      console.log(`Success - ${transactionHash.transactionHash}`);
      setIsLoading(false);
    } catch (error) {
      console.log((error as Error).message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnect();
    checkIfTransactionsExists();
  }, [transactionCount, currentAccount]);

  return {
    currentAccount,
    connectWallet,
    formData,
    handleChange,
    sendTransaction,
    transactions,
    isLoading
  }
};

export default TransactionsProvider;