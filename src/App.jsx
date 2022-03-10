import logo from "./logo.svg";
import "./App.css";
//import create from "zustand";
import create from "./my-simple-zustand";

const createState = (setState) => ({
  n: 0,
  setN: (n) => setState({ n }), // setState's param is not func
  increment: () =>
    // setState's param is func
    setState((state) => ({
      n: state.n + 1,
    })),
});
const useStore = create(createState);

function App() {
  const Counter = () => {
    const count = useStore((state) => state.n);
    const setCount = useStore((state) => state.setN);
    const inc = useStore((state) => state.increment);
    return (
      <div>
        <div>
          <div>count is {count}</div>
          <button onClick={() => setCount(0)}>Reset</button>
          <button type="button" onClick={inc}>
            +1
          </button>
        </div>
      </div>
    );
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Counter />
      </header>
    </div>
  );
}

export default App;
