import React from 'react';

// A fancy function to shorten someones wallet address, no need to show the whole thing.
const shortenAddresses = (str) => {
  return str.substring(0,6) + "..." + str.substring(str.length - 4);
};

const Header = ({address}) => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-container">
          <div className="wallet-conection">
            { address ? <p> Wallet: {shortenAddresses(address.toString())} </p> : <p> Not connected </p> }
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header