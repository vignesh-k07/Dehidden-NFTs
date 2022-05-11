import React from "react";
import { FaUserAlt } from "react-icons/fa"
import logo from "../../assets/logo.jpg";
import "./Header.css";

const Header = ({currentAccount, connectWallet}) => {

  const shortenAddress = (address) => (`${address.slice(0, 5)}...${address.slice(address.length - 4)}`)
  
  return (
    <div className="header">
      <div className="logoContainer">
        <img src={logo} className="logo" />
        <div className="logoText">Dehidden</div>
      </div>
      <ul className="headerItems">
        {currentAccount === "" ? (
          <li className="headerItem">
            <button onClick={connectWallet} className="connectWalletBtn">Connect Wallet</button>
          </li>
        ): (
          <li className="headerItem">
            <FaUserAlt /><span className="address">{shortenAddress(currentAccount)}</span>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Header;
