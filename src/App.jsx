import { useAddress, useMetamask } from '@thirdweb-dev/react';

const App = () => {
  // hooks provieded for thirdweb
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  console.log("👋 Address: ", address);

  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to Bao DAO</h1>
        <button onClick={connectWithMetamask} className="btn-hero">
          Connect to wallet
        </button>
      </div>
    );
  }
  return (
    <div className="landing">
      <h1>👀 wallet connected, now what!   </h1>
    </div>
  );
};

export default App;
