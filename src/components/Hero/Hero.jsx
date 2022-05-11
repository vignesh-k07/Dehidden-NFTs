import React from "react";

import dehiddenNFT from "../../assets/coin.gif";
import "./Hero.css";

const Hero = ({ currentAccount, askContractToMintNft }) => {
  return (
    <div className="container">
      <div className="header-container">
        <p className="header gradient-text">Dehidden NFT Collection</p>
        <p className="sub-text">The Next Generation of NFTS .</p>
        <img src={dehiddenNFT} className="nft" />
        {currentAccount === "" ? (
          <p className="sub-text2">Please Connect your Metamask Wallet.</p>
        ) : (
          <>
            <button
              onClick={askContractToMintNft}
              className="cta-button mint-button"
            >
              Mint NFT
            </button>
            <a
            href={`https://testnets.opensea.io/${currentAccount}`}
              className="cta-button view-mint-button"
              target="_blank" rel="noreferrer"
            >
              View on Opensea
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default Hero;
