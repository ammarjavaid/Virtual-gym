import React, { useState } from "react";
import Topbar from "../../../components/topbar/Topbar";
import { useNavigate } from "react-router-dom";
import { Form, Input, Select } from "antd";
import "./add_new_workout.scss";
import { Pencil, Cross } from "../../../assets";

const Add_new_workout = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    workout: "",
    desc: "",
    category: "",
  });

  const [errors, setErrors] = useState({ workout: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validation
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      // window.open(
      //   `mailto:contactus.webwrite@gmail.com?&subject=${formData.subject}&body=${formData.message}`,
      //   "_blank"
      // );
      // console.log("Form submitted:", formData);
    } else {
      setErrors(validationErrors);
      return;
    }
  };

  // validation

  const validateForm = () => {
    const errors = {};
    if (!formData.workout) {
      errors.workout = "Workout is required";
    }
    if (!formData.desc) {
      errors.desc = "Description is required";
    }
    if (!formData.category) {
      errors.category = "Category is required";
    }
    return errors;
  };

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  return (
    <>
      <Topbar
        title="Add new workout"
        titleOne="Library"
        titleTwo="Add workout"
        arrow={true}
      />
      <div className="add-new-workout">
        <form className="input-groups" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Workout name"
            name="Workout"
            value={formData.workout}
            onChange={handleInputChange}
          />
          {errors.workout && (
            <span className="error_email">{errors.workout}</span>
          )}
          <textarea
            rows={7}
            cols={8}
            type="text"
            placeholder="Description / Details"
            name="desc"
            value={formData.desc}
            onChange={handleInputChange}
          />
          {errors.desc && <span className="error_email">{errors.desc}</span>}

          <div className="input-group">
            <p className="section-name"> Exercises </p>
            <Select
              defaultValue="jack"
              style={{
                width: 120,
              }}
              options={[
                {
                  value: "jack",
                  label: "Jack",
                },
                {
                  value: "lucy",
                  label: "Lucy",
                },
              ]}
              name="category"
              value={formData.category}
              onChange={handleInputChange}
            />
            {errors.category && (
              <span className="error_email">{errors.category}</span>
            )}

            <div className="edit-new-exercise">
              <div className="edit-new-exercise-left">
                <p> Exercise name </p>
                <img src={Cross} alt="" className="cross" />
                <img src={Pencil} alt="" className="pencil" />
              </div>
              <div className="edit-new-exercise-right">
                <p> + Add new exercise </p>
              </div>
            </div>
          </div>

          <div className="buttons">
            <p className="cancel" onClick={() => navigate(-1)}>
              Cancel
            </p>
            <button className="add-client" type="submit">
              Add workout
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Add_new_workout;
