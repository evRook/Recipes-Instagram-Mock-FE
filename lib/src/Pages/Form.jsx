import React, { useEffect, useState } from "react";
import { GrAdd } from "react-icons/gr";

// import cloudinary from "cloudinary";
// import { fill } from "cloudinary/url-gen/actions/resize";
// import { CloudinaryImage } from "cloudinary/url-gen";
import "./Form.css";

export default function Form() {
  // This state is used to add more instruction item, when click Add Instruction Button,
  // this state will be incresed by one, and one more line of instruction input will be added
  const [instructionItemNumber, setIntructionItemNumber] = useState(1);

  // This state is used to store body data that will be sent in request body
  const [bodyData, setBodyData] = useState({});

  // This state is used to store the instruction input when the Add Instruciton button is hitted
  const [instructionInput, setInstructionInput] = useState({});

  // use this imgURL that get from cloudinary to preview the uploaded img
  const [imgURL, setImgURL] = useState();

  //This function is used to handle the input change
  function handleChange(e) {
    if (e.target.name === "name") {
      setBodyData((preData) => {
        return { ...preData, name: e.target.value };
      });
    }
    if (e.target.name === "description") {
      setBodyData((preData) => {
        return { ...preData, description: e.target.value };
      });
    }
    if (e.target.name === "ingredients") {
      setBodyData((preData) => {
        return { ...preData, components: e.target.value.split(",") };
      });
    }
    // set the data of instruction is slightly different from other input data,
    // cuz instruction data has a nested object (hard to explain).
    // I created a instructionInput state to store the instruction data first, and
    // then use handleAdd()  function to set it into bodyData
    if (e.target.name === "instrunction") {
      setInstructionInput({
        position: e.target.id,
        display_text: e.target.value,
      });
    }
    if (e.target.name === "cook_time") {
      setBodyData((preData) => {
        return { ...preData, cook_time_minutes: +e.target.value };
      });
    }
    if (e.target.name === "img") {
      // setImgData(e.target.files[0]);
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      formData.append("upload_preset", "ml_default");
      // host img to cloudianry
      fetch("https://api.cloudinary.com/v1_1/duambh2yn/image/upload", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((d) => {
          // get the url back from cloudinary
          setImgURL(d.secure_url);
          setBodyData((preData) => {
            return { ...preData, img: d.secure_url };
          });
        });
    }
  }

  // When the Add Instruction button is hitted, this function will be excuted.
  //  This will add one more line of instruction input, and also set the instruction data
  // into bodyData
  function handleAdd() {
    setIntructionItemNumber(instructionItemNumber + 1);
    setBodyData((preData) => {
      if (preData.instruction) {
        return {
          ...preData,
          instruction: [...preData.instruction, instructionInput],
        };
      } else {
        return {
          ...preData,
          instruction: [instructionInput],
        };
      }
    });
  }

  // Handle submit
  function handleSubmit() {
    const reqOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // needed for multer package
      enctype: "multipart/form-data",
      body: JSON.stringify(bodyData),
    };
    fetch("http://localhost:4000/recipes", reqOptions)
      .then((res) => res.json())
      .then((d) => console.log(d));
  }

  return (
    <div className="form--container">
      <form onSubmit={(e) => e.preventDefault()} className="form--content">
        {/* Recipe Name Input */}
        <label htmlFor="" className="form--label">
          Recipe Name:
          <input
            type="text"
            name="name"
            className="form--input"
            onChange={(e) => handleChange(e)}
          />
        </label>
        {/* Description Input */}
        <label htmlFor="" className="form--label">
          Description:
          <input
            type="text"
            name="description"
            className="form--input"
            onChange={(e) => handleChange(e)}
          />
        </label>
        {/* Ingredients Input */}
        <label htmlFor="" className="form--label">
          Ingredients:
          <input
            type="text"
            name="ingredients"
            className="form--input"
            onChange={(e) => handleChange(e)}
          />
        </label>
        {/* Instruction Input */}
        <label htmlFor="" className="form--label">
          Instruction:
          <div className="form--instructions__container">
            {Array(instructionItemNumber)
              .fill(null)
              .map((d, i) => {
                return (
                  <input
                    type="text"
                    key={i}
                    id={i + 1}
                    name="instrunction"
                    className="form--input"
                    onChange={(e) => handleChange(e)}
                  />
                );
              })}
            <button
              onClick={() => handleAdd()}
              className="form--btn form--btn__add"
            >
              <GrAdd />
              Add Instruction
            </button>
          </div>
        </label>
        {/* Cook_time Input */}
        <label htmlFor="" className="form--label">
          Cook_time_minutes:
          <input
            type="text"
            name="cook_time"
            className="form--input"
            onChange={(e) => handleChange(e)}
          />
        </label>
        {/* Image Input */}
        <label htmlFor="" className="form--label">
          Image:
          <input
            type="file"
            name="img"
            className="form--input"
            onChange={(e) => handleChange(e)}
          />
        </label>
        <img src={imgURL} alt="img" />
        {/* Submit */}
        <button
          type="submit"
          className="form--btn form--btn__submit"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
