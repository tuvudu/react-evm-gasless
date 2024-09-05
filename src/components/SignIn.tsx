import { useAccount, useConnect, useDisconnect } from "wagmi";

const SignIn = () => {
  const { connect, connectors, isPending, isIdle } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (address && isConnected) {
    return (
      <div className="sign-in-container">
        <p>Account:</p>
        <button onClick={() => connect({ connector: connectors[0] })}>
          {address}
        </button>
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    );
  }

  return (
    <div className="sign-in-container">
      <button onClick={() => connect({ connector: connectors[0] })}>
        {isPending
          ? "Loading..."
          : isIdle
          ? "Connect Metamask"
          : "Connecting..."}
      </button>

      <button onClick={() => connect({ connector: connectors[1] })}>
        {isPending ? "Loading..." : isIdle ? "Connect Magic" : "Connecting..."}
      </button>
    </div>
  );
};

export default SignIn;
