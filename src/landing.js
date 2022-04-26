import React from 'react';

const Landing = ({connectWithMetamask}) => {
  return (
    <div className="landing">
      <h1>Welcome to Bao DAO</h1>
      <img className='daoLogo' alt="DAO Logo" src="https://ipfs.thirdweb.com/ipfs/QmVk2tietNzii6boPEp9KS4QG5ReHqo5s7s2F6ifrxBCU8/0"></img>
      <button onClick={connectWithMetamask} className="btn-hero">
        Connect to wallet
      </button>
    </div>
  );
}

export default Landing
