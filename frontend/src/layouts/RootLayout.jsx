import React from "react";
import { NavLink, Outlet } from "react-router-dom";
const RootLayout = () => {
 return (
  <div className="container">
   <header>
    <nav>
     <NavLink to="/">Home</NavLink>
     <NavLink to="/meals">Meals</NavLink>
    </nav>
   </header>
   <main>
    <Outlet />
   </main>
  </div>
 );
};

export default RootLayout;
