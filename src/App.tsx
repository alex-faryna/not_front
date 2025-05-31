import './App.css'
import {useShopStore} from "./state/state.ts";
import {useShallow} from "zustand/react/shallow";

function App() {
  const { bears, increase } = useShopStore(
    useShallow((state) => ({ bears: state.bears, increase: state.increase })),
  );

  return (
    <>
      <h1>Bears: { bears }</h1>
      <div className="card">
        <button onClick={() => increase(1)}>
          Increase
        </button>
      </div>
    </>
  )
}

export default App
