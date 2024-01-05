import React, { useState } from "react";
import "./client.scss";
import Topbar from "../../../components/topbar/Topbar";
import { ApiCall } from "../../../Services/Apis";
import { setLoader } from "../../../Redux/actions/GernalActions";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, message } from "antd";
import { TextField } from "@mui/material";

const AddNewClient = () => {
  const token = useSelector((state) => state.auth.userToken);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    weight: "",
    height: "",
  });

  const [errors, setErrors] = useState({ full_name: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setErrors({ ...errors, [name]: "" });

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
      // console.log("Form submitted:", formData);
    } else {
      setErrors(validationErrors);
      return;
    }

    dispatch(setLoader(true));
    try {
      const res = await ApiCall({
        params: formData,
        route: "admin/add_client",
        verb: "post",
        token: token,
      });

      if (res?.status == "200") {
        dispatch(setLoader(false));
        // console.log("Form data submitted:", formData);
        navigate("/client");
        message.success(res.response?.message);
      } else {
        console.log("error", res.response);
        dispatch(setLoader(false));

        message.error(res?.response?.message);
      }
    } catch (e) {
      console.log("login error -- ", e.toString());
    }
  };

  // validation

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.full_name) {
      errors.full_name = "Name is required";
    }
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      errors.email = "Invalid email address";
    }
    if (!formData.weight) {
      errors.weight = "Weight is required";
    }
    if (!formData.height) {
      errors.height = "Height is required";
    }
    return errors;
  };

  return (
    <>
      <Topbar
        title="Add new client"
        arrow={true}
        titleOne="Clients"
        titleTwo="Add client"
      />
      <div className="add-new-client">
        <form className="input-groups" onSubmit={handleSubmit}>
          <label> Full name </label>
          <input
            type="text"
            placeholder="Full name"
            name="full_name"
            value={formData.full_name}
            onChange={handleInputChange}
          />
          {errors.full_name && (
            <span className="error_email">{errors.full_name}</span>
          )}

          <label> Email address </label>
          <input
            type="email"
            placeholder="Email address"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          {errors.email && <span className="error_email">{errors.email}</span>}

          <label> Weight in kg </label>
          <input
            type="number"
            placeholder="Weight in kg"
            name="weight"
            value={formData.weight}
            onChange={handleInputChange}
          />
          {errors.weight && (
            <span className="error_email">{errors.weight}</span>
          )}

          <label> Height in cm </label>
          <input
            type="number"
            placeholder="Height in cm"
            name="height"
            value={formData.height}
            onChange={handleInputChange}
          />
          {errors.height && (
            <span className="error_email">{errors.height}</span>
          )}
          <div className="buttons">
            <p className="cancel" onClick={() => navigate(-1)}>
              Cancel
            </p>
            <button className="add-client" type="submit">
              Add client
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddNewClient;
