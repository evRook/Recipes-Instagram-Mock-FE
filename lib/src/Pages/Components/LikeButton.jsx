import React, { useState } from "react";
import "./LikeButton.css";
import { HiOutlineHeart } from "react-icons/hi2";

export default function LikeButton(props) {
  const [liked, setLiked] = useState(props.like);
  const handleLikeButton = () => {
    setLiked(!liked);
    const reqOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };
    fetch(`http://localhost:4000/recipes/like/${props.id}`, reqOptions);
  };

  return (
    <div
      className="like-btn--container"
      style={{
        backgroundImage: liked
          ? "linear-gradient(to bottom right, #000000, #8e2c2c)"
          : "linear-gradient(to bottom right, #000000, #464646)",
        color: liked ? "#ac1414" : "#727272",
      }}
      onClick={() => handleLikeButton()}
    >
      <HiOutlineHeart />
    </div>
  );
}
