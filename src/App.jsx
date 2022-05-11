import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import { Header, Hero } from "./components";
import dehiddenCollection from "./utils/DehiddenCollections.json";
import "./App.css";

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const askContractToMintNft = async () => {
    const CONTRACT_ADDRESS = "0x77d98038655bD48fea150f3D7a999a36ABe59a00";

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          dehiddenCollection.abi,
          signer
        );

        console.log("Going to pop wallet now to pay gas...");
        let nftTxn = await connectedContract.makeDehiddenNFT();

        console.log("Mining...please wait.");
        await nftTxn.wait();

        console.log(
          `Mined, see transaction: https://mumbai.polygonscan.com//tx/${nftTxn.hash}`
        );
        console.log(
          `NFT Mined, see on opensea: https://testnets.opensea.io/${currentAccount}`
        );
        alert(
          `NFT Mined, see on opensea: https://testnets.opensea.io/${currentAccount}`
        );
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [currentAccount]);

  return (
    <div className="App">
      <Header currentAccount={currentAccount} connectWallet={connectWallet} />
      <Hero
        currentAccount={currentAccount}
        askContractToMintNft={askContractToMintNft}
      />
    </div>
  );
}

export default App;
