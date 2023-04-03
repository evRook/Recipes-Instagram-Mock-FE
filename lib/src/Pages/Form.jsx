import React, { useEffect, useState, useRef } from "react";
import "./Form.css";
import { useNavigate, useParams } from "react-router-dom";

export default function Form() {
  // This state is used to add more instruction item, when click Add Instruction Button,
  // this state will be incresed by one, and one more line of instruction input will be added
  const [instructionItemNumber, setIntructionItemNumber] = useState(1);
  // This state is used to store body data that will be sent in request body
  const [bodyData, setBodyData] = useState({});
  // This state is used to store the instruction input when the Add Instruciton button is hitted
  const [instructionInput, setInstructionInput] = useState({});
  // This state is used to track whether the add instruction btn is clicked or not.
  const [isOneMoreInstructionAdded, setIsOneMoreInstructionAdded] =
    useState(false);
  // Use this imgURL that get from cloudinary to preview the uploaded img
  const [imgURL, setImgURL] = useState();
  // This state is used to show the loading status if th img
  const [loadingImg, setLoadingImg] = useState();
  const imgInputRef = useRef();
  const navigate = useNavigate();
  const params = useParams();

  // This side effect is used to set some initial states based on params
  // If params is recipe id instead of 'add', we need to set some initial state to display the default value.
  useEffect(() => {
    if (params.id !== "add") {
      const reqOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };
      fetch(`http://localhost:4000/recipes/${params.id}`, reqOptions)
        .then((res) => res.json())
        .then((d) => {
          setBodyData(d);
          setIntructionItemNumber(d.instruction.length);
          setInstructionInput(d.instruction);
        });
    } else {
      setBodyData(null);
      setInstructionInput(null);
      setIntructionItemNumber(1);
    }
  }, [params.id]);

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
    // cuz instruction data has a nested object (hard to explain)
    if (e.target.name === "instruction") {
      setBodyData((pre) => {
        if (pre && pre.instruction) {
          let i = pre.instruction;
          if (!isOneMoreInstructionAdded) {
            i = pre.instruction.map((d) => {
              if (d.position === +e.target.id) {
                return {
                  position: +e.target.id,
                  display_text: e.target.value,
                };
              } else {
                return d;
              }
            });
          } else {
            i.push({ position: +e.target.id, display_text: e.target.value });
            setIsOneMoreInstructionAdded(false);
          }
          return { ...pre, instruction: i };
        } else {
          return {
            ...pre,
            instruction: [
              {
                position: +e.target.id,
                display_text: e.target.value,
              },
            ],
          };
        }
      });
    }
    if (e.target.name === "cook_time") {
      setBodyData((preData) => {
        return { ...preData, cook_time_minutes: +e.target.value };
      });
    }
    if (e.target.name === "img") {
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      formData.append("upload_preset", "ml_default");
      setLoadingImg(true);
      // host img to cloudianry
      fetch("https://api.cloudinary.com/v1_1/duambh2yn/image/upload", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((d) => {
          // get the url back from cloudinary
          setImgURL(d.secure_url);
          setLoadingImg(false);
          setBodyData((preData) => {
            return { ...preData, img: d.secure_url };
          });
        });
    }
  }

  // When the Add Instruction button is hitted, this function will be excuted.
  //  This will add one more line of instruction input
  function handleAdd() {
    setIntructionItemNumber(instructionItemNumber + 1);
    setIsOneMoreInstructionAdded(true);
  }

  function handleSubmit() {
    if (params.id === "add") {
      const reqOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        enctype: "multipart/form-data",
        body: JSON.stringify(bodyData),
      };
      fetch("http://localhost:4000/recipes/", reqOptions)
        .then((res) => res.json())
        .then((d) => {
          fetch(`http://localhost:4000/recipes/${d._id}`)
            .then((res) => res.json())
            .then((recipe) => {
              navigate(`/recipe/${recipe._id}`);
            });
        });
    } else {
      const reqOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        // needed for multer package
        enctype: "multipart/form-data",
        body: JSON.stringify(bodyData),
      };
      fetch(`http://localhost:4000/recipes/${params.id}`, reqOptions)
        .then((res) => res.json())
        .then((d) => {
          fetch(`http://localhost:4000/recipes/${d._id}`)
            .then((res) => res.json())
            .then((recipe) => {
              navigate(`/recipe/${recipe._id}`);
              // console.log(d)
            });
        });
    }
  }

  function handleDeleteImg(e) {
    e.stopPropagation();
    setImgURL("");
    setBodyData((pre) => {
      return { ...pre, img: "" };
    });
  }

  // handleImgloading
  function handleImgLoading() {
    imgInputRef.current.click();
  }

  function whenToShowAddImg() {
    if (!loadingImg && !imgURL && !bodyData) {
      return <p>Add Image</p>;
    } else if (bodyData && !bodyData.img && !loadingImg) {
      return <p>Add Image</p>;
    } else {
      return;
    }
  }
  return (
    <div className="form--container">
      <form onSubmit={(e) => e.preventDefault()} className="form--content">
        {/* Name Input */}
        <label htmlFor="" className="form--label">
          Recipe Name:
          <input
            type="text"
            name="name"
            className="form--input"
            onChange={(e) => handleChange(e)}
            defaultValue={bodyData && bodyData.name}
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
            defaultValue={bodyData && bodyData.description}
            // value={bodyData.description}
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
            defaultValue={bodyData && bodyData.components}
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
                    name="instruction"
                    className="form--input"
                    onChange={(e) => handleChange(e)}
                    defaultValue={
                      instructionInput &&
                      instructionInput[i] &&
                      instructionInput[i].display_text
                    }
                  />
                );
              })}
          </div>
          <button
            onClick={() => handleAdd()}
            className="form--btn form--btn__add"
          >
            {/* <GrAdd style={{color: "#fffbf3"}}/> */}
            Add Instruction
          </button>
        </label>

        {/* Cook_time Input */}
        <label htmlFor="" className="form--label">
          Cook_time_minutes:
          <input
            type="text"
            name="cook_time"
            className="form--input"
            onChange={(e) => handleChange(e)}
            defaultValue={bodyData && bodyData.cook_time_minutes}
            // value={bodyData.cook_time_minutes}
          />
        </label>

        {/* Image Input */}
        <label htmlFor="" className="form--label">
          Image:
          <input
            type="file"
            ref={imgInputRef}
            name="img"
            className="form--input form--input__img"
            onChange={(e) => handleChange(e)}
          />
        </label>

        <div onClick={handleImgLoading} className="form--btn__addImg">
          {/* {!loadingImg && !imgURL && <p>add img</p>}
          {bodyData && !bodyData.img && <p>add img</p>} */}
          {whenToShowAddImg()}
          {loadingImg && <p>loading...</p>}
          {(imgURL || (bodyData && bodyData.img)) && (
            <img src={imgURL || bodyData.img} alt="img" className="form--img" />
          )}
          {/* {bodyData && bodyData.img && (
            <img src={bodyData.img} alt="img" className="form--img"></img>
          )} */}
          {((bodyData && bodyData.img) || imgURL) && (
            <button
              className="form--img__delete"
              onClick={(e) => handleDeleteImg(e)}
            >
              X
            </button>
          )}
        </div>

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
