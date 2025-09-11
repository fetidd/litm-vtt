import { APITester } from "./APITester";
import { GameTable } from "./components/GameTable";
import "./index.css";


export function App() {
  return (
    <div className="app">
      <GameTable />
      <APITester />
    </div>
  );
}

export default App;
