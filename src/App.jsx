import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import { Header, Hero } from "./components";
import { dehiddenAddress, dehiddenAbi } from "./lib/constants"

import "./App.css";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const merkleScript = document.createElement("script");
  merkleScript.src =
    "https://cdn.jsdelivr.net/npm/merkletreejs@latest/merkletree.js";
  merkleScript.async = true;
  document.body.appendChild(merkleScript);

  const keccakScript = document.createElement("script");
  merkleScript.src =
    "https://cdn.jsdelivr.net/npm/keccak256@latest/keccak256.js";
  keccakScript.async = true;
  document.body.appendChild(keccakScript);

   const isWhitelisted = () => {
    //   //whitelist logic
    const addresses = [
      "0x0659347bC2E6f3896F27dfE0fE22FBDFbe590812",
      "0xc1D0479C7D7800B998a2cc8A1d259024e0c8948b",
      "0x87fFcCc921aFE16340c28f1b1c27aAd74eA9A874",
      "0x440819162fb095CBCE2E5716CC59008C62DD5cE6",
    ];
    const leaves = addresses.map((x) => keccak256(x));
    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });

    const buf2hex = (x) => "0x" + x.toString("hex");

    if(!currentAccount) return;
    const leaf = keccak256(currentAccount);
    const proof = tree.getProof(leaf).map((x) => buf2hex(x.data));
    console.log(proof);
    return proof;
  }

  isWhitelisted()
  // Wallet connection logic
  const isWalletConnected = async () => {
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({ method: "eth_accounts" });
      console.log("accounts: ", accounts);

      if (accounts.length > 0) {
        const account = accounts[0];
        console.log("wallet is connected! " + account);
      } else {
        console.log("make sure MetaMask is connected");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("please install MetaMask");
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          dehiddenAddress,
          dehiddenAbi,
          signer
        );

        console.log("Going to pop wallet now to pay gas...");
        let nftTxn = await connectedContract.makeDehiddenNFT(isWhitelisted());

        console.log("Mining...please wait.");
        await nftTxn.wait();

        console.log(
          `Mined, see transaction: https://mumbai.polygonscan.com//tx/${nftTxn.hash}`
        );
        console.log(
          `NFT Mined, see on opensea: https://testnets.opensea.io/${currentAccount}`
        );
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const shortenAddress = (address) =>
    `${address.slice(0, 5)}...${address.slice(address.length - 4)}`;

  useEffect(() => {
    isWalletConnected();
  }, [currentAccount]);

  return (
    <div className="App">
      <Header
        connectWallet={connectWallet}
        currentAccount={currentAccount}
        shortenAddress={shortenAddress}
      />
      <Hero currentAccount={currentAccount} askContractToMintNft={askContractToMintNft}/>
    </div>
  );
};

export default App;
