import React from 'react';

// A fancy function to shorten someones wallet address, no need to show the whole thing.
const shortenAddresses = (str) => {
  return str.substring(0,6) + "..." + str.substring(str.length - 4);
};

const AsideMenu = ({address, openSeaLink, disconnectMetamask}) => {
  return (
    <div className='aside-menu'>
      <div className='memberNFT'>
        <a href={openSeaLink}>
        <img className='membershipNFT' alt='Membership NFT' src='https://ipfs.thirdweb.com/ipfs/QmUhQr4gMR1aavi6Wdps32omboUDVebitepVmR4ftxC2gx/0' />
        </a>
        <div className="wallet-conection">
          { address ? <p> Wallet: {shortenAddresses(address.toString())} </p> : <p> Not connected </p> }
        </div>
        <p>Congratulations on being a member</p>
      </div>
      <div>
      <button onClick={disconnectMetamask} className="btn-hero">
        Log out
      </button>
      </div>
    </div>
  )
}

export default AsideMenu