import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import SignIn from "./components/SignIn";
import MintToken from "./components/MintToken";
import { useAccount } from "wagmi";

function App() {
  const { address } = useAccount();

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <SignIn />
      <div style={{ marginBottom: 4 }} />
      {address && <MintToken />}
    </>
  );
}

export default App;
