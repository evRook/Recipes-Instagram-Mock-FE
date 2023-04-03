
import React, { useEffect, useState } from "react";
import "./GroceriesItem.css";
import { GiCheckMark } from "react-icons/gi";
import { RiDeleteBinFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";

export default function GroceriesItem(props) {
  const { name, deleted, checked, recipe, createdAt, _id } = props.data;
  const [checkStatus, setCheckStatus] = useState(checked);
  const [deleteStatus, setDeleteStatus] = useState(deleted);
  const navigate = useNavigate();

  const date = new Date(createdAt);

  function handleCheck() {
    setCheckStatus(!checkStatus);
    const reqOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };
    fetch(`http://localhost:4000/groceries/check/${_id}`, reqOptions);
  }

  function handleDelete() {
    setDeleteStatus(!deleteStatus);
    const reqOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };
    fetch(`http://localhost:4000/groceries/delete/${_id}`, reqOptions);
  }
  //fetch request to redirect back to recipes page from groceries page
  function handleRecipeNavigate() {
    //encodeURI removes %20 from url when sending the fetch request
    fetch(`http://localhost:4000/recipes/redirect/${encodeURI(recipe)}`)
      .then((res) => res.json())
      .then((d) =>
        //navigate function allows to navigate based on deired routes
        navigate(`/recipe/${d._id}`)
      );
  }

  const capitalizedName = name
    .split(" ")
    .map((newName) => newName.charAt(0).toUpperCase() + newName.slice(1))
    .join(" ");

  if (!deleted && !deleteStatus)
    return (
      <div className="groceriesItem--container">
        <p className="groceriesItem--name">{capitalizedName}</p>
        <div className="groceriesItem--from">
          <p>
            Recipe:{" "}
            <Link
              className="groceriesItem--recipe"
              onClick={handleRecipeNavigate}
            >
              {recipe}
            </Link>
          </p>
        </div>
        <div className="groceriesItem--createdAt">
          <p>
            {(date.getMonth()+1) + "/" + date.getDate()+ "/" + date.getFullYear()}
          </p>
        </div>
        <div>
          <div className="groceriesItem--btns">
            <div
              onClick={() => handleCheck()}
              className={
                checkStatus
                  ? "groceriesItem--checkBox__checked"
                  : "groceriesItem--checkBox"
              }
            >
              <GiCheckMark />
            </div>
            <div
              onClick={() => handleDelete()}
              className="groceriesItem--delete"
            >
              <RiDeleteBinFill />
            </div>
          </div>
        </div>
      </div>
    );
}
