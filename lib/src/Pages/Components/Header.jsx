import React from "react";
import "./Header.css";
import HeaderIconBtn from "./HeaderIconBtn";
import Search from "./Search";
import { CiShoppingCart, CiSquarePlus } from "react-icons/ci";

import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div className="header--container">
      <div className="header--content">
        <Link to="/" className="header--logo__container">
          <div className="header--logo--icon">
            <div className="logo--layer1">
              <div className="logo--layer2"></div>
            </div>
          </div>
          <p className="header--logo--text">Platefuls</p>
        </Link>
        <div className="header--btns">
          <div className="icon--container">
            <Search />
            <div className="groceries--container" id="show--text">
              <HeaderIconBtn icon={CiShoppingCart} text="" link="groceries" />
              <p className="groceries--text" id="hidden--text-1">
                Groceries
              </p>
            </div>
            <div className="add-recipe--container" id="show--text">
              <HeaderIconBtn icon={CiSquarePlus} text="" link="form/add" />
              <p className="add-recipe--text" id="hidden--text-2">
                + Recipe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
