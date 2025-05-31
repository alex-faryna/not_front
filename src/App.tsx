import './App.css'
import {useShopStore} from "./state/state.ts";
import {useShallow} from "zustand/react/shallow";
import {useState} from "react";
import {HomePage} from "@/pages/home.tsx";
import {ItemPage} from "@/pages/item.tsx";
import {ProfilePage} from "@/pages/profile.tsx";
import {Route} from "react-router";
import SlideRoutes from "react-slide-routes";

function App() {
  const [page, setPage] = useState('home');
  const { bears, increase } = useShopStore(
    useShallow((state) => ({ bears: state.bears, increase: state.increase })),
  );

  /* return <div className='main-layout'>
    { page === 'home' && <HomePage /> }
    { page === 'item' && <ItemPage /> }
    { page === 'profile' && <ProfilePage /> }
  </div> */;

  return <SlideRoutes>
    <Route index element={<HomePage /> as React.ReactNode} />
    <Route path="item/:itemId" element={<ItemPage /> as React.ReactNode} />
    <Route path="profile" element={<ProfilePage /> as React.ReactNode} />
  </SlideRoutes>;

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
