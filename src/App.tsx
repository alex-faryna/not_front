import './App.css'
import {useShopStore} from "./state/state.ts";
import {useShallow} from "zustand/react/shallow";
import {Link, Route, Routes, useNavigate, useParams} from "react-router";
import {useEffect} from "react";
import {backButton} from "@telegram-apps/sdk-react";

function Profile() {

  return <span>Hello profile</span>
}

function Home() {
  return <div>
    <Link to="/item/34">Item</Link>
    <span>Heello home</span>
  </div>
}

function Item() {
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (backButton.show.isAvailable()) {
      backButton.show();
    }

    const offClick = backButton.onClick(() => navigate('/'));

    return () => {
      if (backButton.hide.isAvailable()) {
        offClick();
        backButton.hide();
      }
    }
  }, []);

  return <span>Heello item { params.itemId }</span>
}

function App() {
  const { bears, increase } = useShopStore(
    useShallow((state) => ({ bears: state.bears, increase: state.increase })),
  );

  return <Routes>
    <Route index element={<Home />} />
    <Route path="item/:itemId" element={<Item />} />
    <Route path="profile" element={<Profile /> as React.ReactNode} />
  </Routes>;

  /* return (
    <>
      <h1>Bears: { bears }</h1>
      <div className="card">
        <button onClick={() => increase(1)}>
          Increase
        </button>
      </div>
    </>
  ) */
}

export default App
