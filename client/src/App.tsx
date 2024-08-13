import { useState } from 'react';
import './App.css'

function App() {
  const [address, setAddress] = useState("")

  const walletConnect = async () => {
    try {
      const { ethereum }: any = window;
      if (!ethereum) {
        return;
      } else {
        const walletAccounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        setAddress(walletAccounts[0]);
      }
      // Switch to Sepolia Network
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }], // Each Blockchain has a unique chain id like for ethereum it is 0x00
      });
    } catch (error) {
      console.error((error as Error).message);
    }
  }

  return (
    <div className='w-full h-screen flex justify-center items-center'>
      { !address ?
        <button type='button' className="border-2 border-cyan-700 text-white bg-transparent rounded-md px-4 py-2 cursor-pointer" onClick={walletConnect}>
          Connect to Metamask
        </button>
        :
        <p>Wallet Connected with: {address.substring(0, 5)}...{address.substring(address.length - 3)}</p>
      }
    </div>
  )
}

export default App
