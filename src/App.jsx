import axios from "axios";
import "./App.css";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SideBarNav from "./components/SideBarNav";

function App() {
  return (
    <>
      <div className="app-container page-wrapper">
      <Header />
        <div className="main-layout">
        <SideBarNav />
        <main className=" main-content content page-fade">
          <Outlet />
        </main>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
