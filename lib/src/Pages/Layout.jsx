import React from "react";
import "./Layout.css";
import { Header, Footer } from "./Components"
import { Outlet } from "react-router-dom";


export default function Layout() {
  
  return (
    <div className="layout--container">
        <Header/>
        <div className="layout--content">
            <Outlet />
        </div>
        <Footer />
    </div>
  );
}
