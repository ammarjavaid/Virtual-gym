import React, { useEffect, useState } from "react";
import "./workout-program.scss";
import Topbar from "../../../components/topbar/Topbar";
import { Search } from "../../../assets";
import WorkOutTable from "../../../components/workout-table/WorkOutTable";
import { Modal, Pagination, message } from "antd";
import { useNavigate } from "react-router";
import { async } from "validate.js";
import { setLoader } from "../../../Redux/actions/GernalActions";
import { useDispatch, useSelector } from "react-redux";
import { ApiCall } from "../../../Services/Apis";
import usePermissionCheck from "../../../../utils/usePermissionCheck";

const inititalState = {
  title: "",
  no_of_days: "",
  description: "",
  programImage: "",
};

const WorkoutProgram = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.userToken);
  const { checkSubPermissions } = usePermissionCheck();

  const dispatch = useDispatch();
  const [allWorkoutsPrograms, setAllWorkoutsPrograms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState(inititalState);
  const [imageToUpload, setImageToUpload] = useState(null);
  const [errors, setErrors] = useState({ full_name: "" });
  const [filteredData, setFilteredData] = useState([]);

  const handleImageUpload = (e) => {
    const imageFile = e.target.files[0];
    const name = e.target.name;
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormValues({
          ...formValues,
          [name]: event.target.result,
        });
      };
      reader.readAsDataURL(imageFile);
      setImageToUpload(imageFile);
    }
  };

  const handleInputChange = (e) => {
    const { value, name } = e.target;
    setErrors({ ...errors, [name]: "" });
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setFormValues(inititalState);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setFormValues(inititalState);
  };

  const handleSubmit = async () => {
    // validation
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      // console.log("Form submitted:", formValues);
    } else {
      setErrors(validationErrors);
      return;
    }

    // console.log("click");

    const numberOfDays = parseInt(formValues?.no_of_days);
    const workoutArray = [];

    for (let i = 1; i <= numberOfDays; i++) {
      workoutArray.push({ workoutDay: `day ${i}` });
    }

    try {
      dispatch(setLoader(true));
      const formData = new FormData();

      formData.append("no_of_days", formValues?.no_of_days);
      formData.append("description", formValues?.description);
      formData.append("title", formValues?.title);
      formData.append("program_Image", imageToUpload);
      formData.append("workouts", JSON.stringify(workoutArray));

      const res = await ApiCall({
        params: formData,
        route: "program/add_program",
        verb: "post",
        token: token,
      });

      if (res?.status == "200") {
        dispatch(setLoader(false));
        message.success(res.response?.message);
        // console.log(res);
        handleOk();
        getAllWorkouts();
      } else {
        console.log("error", res.response);
        dispatch(setLoader(false));
        message.error(res.response?.message);
      }
    } catch (e) {
      dispatch(setLoader(false));
      console.log("error -- ", e.toString());
    }
  };

  // console.log(formValues);

  const getAllWorkouts = async () => {
    try {
      dispatch(setLoader(true));
      const res = await ApiCall({
        params: "",
        route: "program/all_programs",
        verb: "get",
        token: token,
      });

      if (res?.status == "200") {
        dispatch(setLoader(false));
        setAllWorkoutsPrograms(res?.response?.detail);
      } else {
        console.log("error", res.response);
        dispatch(setLoader(false));
        message.error(res.response?.message);
      }
    } catch (e) {
      dispatch(setLoader(false));
      console.log("error -- ", e.toString());
    }
  };

  useEffect(() => {
    getAllWorkouts();
  }, []);

  // console.log(allWorkoutsPrograms);

  const validateForm = () => {
    const errors = {};
    if (!formValues.title) {
      errors.title = "Title is required";
    }
    if (!formValues.no_of_days) {
      errors.no_of_days = "No. of days is required";
    }
    if (!formValues.description) {
      errors.description = "Description is required";
    }
    if (!formValues.programImage) {
      errors.programImage = "Image is required";
    }
    return errors;
  };

  useEffect(() => {
    setFilteredData(allWorkoutsPrograms);
  }, [allWorkoutsPrograms]);

  const handleChange = (e) => {
    setFilteredData(
      allWorkoutsPrograms.filter((el) =>
        JSON.stringify(el)
          ?.toString()
          ?.toLowerCase()
          ?.includes(e.target.value.toLowerCase())
      )
    );
  };

  const deleteSingleProgram = async (id) => {
    try {
      dispatch(setLoader(true));
      const res = await ApiCall({
        params: "",
        route: `program/delete_program/${id}`,
        verb: "put",
        token: token,
      });

      if (res?.status == "200") {
        dispatch(setLoader(false));
        getAllWorkouts();
      } else {
        console.log("error", res.response);
        dispatch(setLoader(false));
        message.error(res.response?.message);
      }
    } catch (e) {
      dispatch(setLoader(false));
      console.log("error -- ", e.toString());
    }
  };

  return (
    <>
      <Topbar title="Workout Programs" />
      <div className="workout-program">
        <div className="workout-program-head">
          <div className="input-workout">
            <img src={Search} alt="" />
            <input type="text" placeholder="Search" onChange={handleChange} />
          </div>
          {checkSubPermissions("workout-program", "addWorkoutPrograms")
            ?.status ? (
            <div
              className="btn"
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              Create program
            </div>
          ) : null}
        </div>

        <div className="workout-table">
          <WorkOutTable
            deleteSingleProgram={deleteSingleProgram}
            data={filteredData}
          />
        </div>
        <Modal
          centered
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <div className="modal">
            <h2> Create Program </h2>
            <form className="create-workout-form">
              <div className="input-group">
                <label> Program title </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Program title"
                  onChange={handleInputChange}
                  value={formValues?.title}
                />
                {errors.title && (
                  <span className="error_email">{errors.title}</span>
                )}
              </div>

              <div className="input-group">
                <label> No. of days </label>
                <input
                  type="number"
                  name="no_of_days"
                  placeholder="No. of days"
                  onChange={handleInputChange}
                  value={formValues?.no_of_days}
                />
                {errors.no_of_days && (
                  <span className="error_email">{errors.no_of_days}</span>
                )}
              </div>

              <div className="input-group">
                <label> Program description </label>
                <textarea
                  type="text"
                  name="description"
                  placeholder="Program description"
                  onChange={handleInputChange}
                  value={formValues?.description}
                />
                {errors.description && (
                  <span className="error_email">{errors.description}</span>
                )}
              </div>

              <div className="single-image-upload-item">
                {!formValues.programImage ? (
                  <label
                    htmlFor="programImage"
                    className={`id-placeholder-box`}
                  >
                    Click to upload program image
                  </label>
                ) : (
                  <div className="id-image-container">
                    <img src={formValues.programImage} />
                    <label
                      htmlFor="programImage"
                      className="upload-icon-container"
                    >
                      ↥
                    </label>
                  </div>
                )}
                <input
                  id="programImage"
                  className="image-input"
                  name="programImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
              {errors.programImage && !formValues.programImage && (
                <span className="error_email" style={{ textAlign: "center" }}>
                  {errors.programImage}
                </span>
              )}
              <div className="buttons">
                <p className="cancel" onClick={handleCancel}>
                  Cancel
                </p>
                <p
                  className="add-category"
                  type="submit"
                  onClick={handleSubmit}
                >
                  Add new program
                </p>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default WorkoutProgram;
