import React, { useEffect, useState } from "react";
import "./add-new-exercise-modal.scss";
import { Select, message } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Clipper, Minus, Plus, Toggle, ToggleModal } from "../../assets";
import { ApiCall } from "../../Services/Apis";
import { setLoader } from "../../Redux/actions/GernalActions";

const initialState = {
  exerciseName: "",
  category: "",
  message: "",
  sets: [{ reps: 0, lebs: 0, rest_time: "", min: "", parameter: "" }],
  video: "",
  exerciseTime: "",
  notes: "",
};

const formatWithLeadingZero = (number) => {
  return number < 10 ? `0${number}` : number;
};

const AddNewExerciseModal = () => {
  const token = useSelector((state) => state.auth.userToken);
  const [errors, setErrors] = useState({ exerciseName: "" });

  const [allCategories, setAllCategories] = useState([]);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [incDec, setIncDec] = useState(1);

  dayjs.extend(customParseFormat);

  const onExcerciseTimeChange = (time, timeString, e) => {
    setMyData((prev) => ({ ...prev, exerciseTime: timeString }));
  };

  const handleIncrement = () => {
    setIncDec(incDec + 1);
    setMyData((prev) => ({
      ...prev,
      sets: [
        ...prev?.sets,
        {
          reps: 0,
          lebs: 0,
          rest_time: "00:05:00",
          // hours: "",
          min: "",
          // sec: "",
        },
      ],
    }));
  };
  const handleDecrement = () => {
    if (incDec - 1 < 0) {
      return;
    }
    setIncDec(incDec - 1);
    setMyData((prev) => ({
      ...prev,
      sets: prev.sets.slice(0, incDec - 1),
    }));
  };

  const [myData, setMyData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setErrors({ ...errors, [name]: "" });

    setMyData({
      ...myData,
      [name]: value,
    });
  };

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const [showData, setShowData] = useState(true);

  const handleShow = () => {
    setShowData(!showData);
  };

  const handleFinish = async () => {
    const transformedSets = myData?.sets?.map((set) => ({
      ...set,
      rest_time: `${formatWithLeadingZero(set?.min)}`,
    }));

    const formData = new FormData();
    if (selectedFile) {
      formData.append("video", selectedFile);
    } else {
      formData.append("video", myData?.video);
    }
    formData.append("exercise_name", myData?.exerciseName);
    formData.append("exercise_time", myData?.exerciseTime);
    formData.append("category", myData?.category);
    formData.append("no_of_sets", incDec);
    formData.append("description", myData?.message);
    formData.append("notes", myData?.notes);
    formData.append("sets", JSON.stringify(transformedSets));

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      try {
        dispatch(setLoader(true));
        const res = await ApiCall({
          params: formData,
          route: "exercise/add_exercise",
          verb: "post",
          token: token,
        });

        if (res?.status == "200") {
          dispatch(setLoader(false));
          message.success(res.response?.message);
          setMyData(initialState);
          setIncDec(1);
          navigate("/library");
        } else {
          console.log("error", res.response);
          dispatch(setLoader(false));
          message.error(res.response?.message);
          console.log("error");
        }
      } catch (e) {
        console.log("error -- ", e.toString());
      }
    } else {
      setErrors(validationErrors);
      return;
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  const handleChangeSetsData = (index, name, value) => {
    setMyData((prev) => ({
      ...prev,
      sets: prev.sets?.map((set, i) =>
        i === index ? { ...set, [name]: value } : set
      ),
    }));
  };

  const getAllCategories = async () => {
    try {
      const res = await ApiCall({
        params: "",
        route: "category/all_categories",
        verb: "get",
        token: token,
      });

      if (res?.status == "200") {
        dispatch(setLoader(false));
        setAllCategories(res.response?.category_list);
      } else {
        console.log("error", res.response);
        dispatch(setLoader(false));
      }
    } catch (e) {
      console.log("Error getting clients -- ", e.toString());
    }
  };

  // validation
  const validateForm = () => {
    const errors = {};
    if (!myData.exerciseName) {
      errors.exerciseName = "Exercise name is required";
    }
    if (!myData.message) {
      errors.message = "Message is required";
    }
    if (!myData.video && !selectedFile) {
      errors.video = "Video is required";
    }
    if (!myData.exerciseTime) {
      errors.exerciseTime = "Exercise time is required";
    }
    if (
      !myData.notes &&
      myData.sets.every((set) => Object.values(set).every((value) => !value))
    ) {
      errors.notes = "Either notes or at least one set is required";
    }
    return errors;
  };

  const selectParameter = [
    { name: "weight", label: "Weight (kg)" },
    { name: "seconds", label: "Seconds (s)" },
    { name: "distance", label: "Distance (miles)" },
    { name: "reps", label: "Reps & lbs" },
  ];

  const onSearch = (value) => {};

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <>
      <div className="exercise-inputs-modal">
        <div className="exercise-inputs">
          <div className="form-wrapper">
            <form>
              <div className="input-group">
                <label> Exercise name </label>
                <input
                  type="text"
                  placeholder="Exercise name"
                  name="exerciseName"
                  onChange={handleChange}
                  value={myData.exerciseName}
                />
                {errors.exerciseName && (
                  <span className="error_email">{errors.exerciseName}</span>
                )}
                {/* </Form.Item> */}
              </div>

              <div className="input-group">
                <div className="time">
                  <div className="min">
                    <label> Time </label>
                    <input
                      type="number"
                      name="exerciseTime"
                      placeholder="0"
                      onChange={handleChange}
                      value={myData.exerciseTime}
                    />
                    {errors.exerciseTime && (
                      <span className="error_email">{errors.exerciseTime}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="input-group">
                <label> Description / Details </label>
                <textarea
                  rows={7}
                  placeholder="Description / Details"
                  name="message"
                  value={myData.message}
                  onChange={handleChange}
                />
                {errors.message && (
                  <span className="error_email">{errors.message}</span>
                )}
                {/* </Form.Item> */}
              </div>
              <div className="input-group-attach">
                <div className="video-link-attach">
                  <div className="video-link">
                    <label> Video link </label>
                    <input
                      type="text"
                      placeholder="Video link"
                      name="video"
                      value={myData.video}
                      onChange={handleChange}
                    />
                    {errors.video && (
                      <span className="error_email">{errors.video}</span>
                    )}
                  </div>
                  <p className="or"> Or </p>
                  <div className="video-attach">
                    <label> Attach video </label>
                    <div className="file_input">
                      <label htmlFor="fileInput" className="label">
                        <img src={Clipper} alt="" className="img_gal" />
                        {selectedFile ? (
                          <p>{selectedFile?.name}</p>
                        ) : (
                          <p> Attach video </p>
                        )}
                      </label>
                      <input
                        type="file"
                        accept="video/mp4"
                        id="fileInput"
                        placeholder="Attach video"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="notes">
                <label> Notes </label>
                <textarea
                  rows={5}
                  cols={5}
                  placeholder="Enter notes"
                  name="notes"
                  onChange={handleChange}
                  value={myData.notes}
                />

                {errors.notes && (
                  <span className="error_email">{errors.notes}</span>
                )}
              </div>

              <div className="input-group increment-decrement">
                {/* <Form.Item> */}
                <input disabled placeholder="No. of sets" value={incDec} />
                {/* </Form.Item> */}
                <div className="plus-minus">
                  <img src={Minus} alt="" onClick={handleDecrement} />
                  <img src={Plus} alt="" onClick={handleIncrement} />
                </div>
              </div>
            </form>

            <div className="site-setting-toggle">
              <img
                src={ToggleModal}
                alt=""
                className={showData ? "togglehide" : "toggleShow"}
                onClick={handleShow}
              />
              <h2> Sets settings </h2>
            </div>

            {showData && (
              <>
                {Array.from({ length: incDec }, (_, index) => (
                  <div className="site-settings">
                    <p className="numbring"> {index + 1} </p>

                    <div className="select">
                      <label> Parameters </label>
                      <Select
                        className="select-box"
                        showSearch
                        placeholder="Select a parameter"
                        optionFilterProp="children"
                        value={myData?.sets[index]?.parameter}
                        onChange={(v) =>
                          handleChangeSetsData(index, "parameter", v)
                        }
                        onSearch={onSearch}
                        filterOption={filterOption}
                        options={selectParameter.map((el) => ({
                          value: el.name,
                          label: el.label,
                        }))}
                      />
                    </div>
                    {selectParameter.map(
                      (el) =>
                        el.name === myData?.sets[index]?.parameter &&
                        (myData?.sets[index]?.parameter !== "reps" ? (
                          <>
                            <div className="input-group">
                              <label> {el.label} </label>
                              <input
                                type="number"
                                value={myData?.sets[index]?.[el?.name] || ""}
                                name={el.name}
                                placeholder={el?.label}
                                onChange={(e) =>
                                  handleChangeSetsData(
                                    index,
                                    e.target.name,
                                    e.target.value
                                  )
                                }
                              />
                              {errors.sets &&
                                errors.sets[index] &&
                                errors.sets[index][el.name] && (
                                  <span className="error_email">
                                    {errors.sets[index][el.name]}
                                  </span>
                                )}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="site-settings-one">
                              <div className="input-group reps">
                                <label> Reps </label>
                                <input
                                  type="number"
                                  placeholder="Reps"
                                  name="reps"
                                  value={myData?.sets[index]?.reps || ""}
                                  onChange={(e) =>
                                    handleChangeSetsData(
                                      index,
                                      e.target.name,
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              <div className="input-group lbs">
                                <label> Lbs </label>
                                <input
                                  label="Lbs"
                                  type="number"
                                  placeholder="Lbs"
                                  name="lebs"
                                  value={myData?.sets[index]?.lebs || ""}
                                  onChange={(e) =>
                                    handleChangeSetsData(
                                      index,
                                      e.target.name,
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </div>
                          </>
                        ))
                    )}

                    {incDec - 1 !== index && (
                      <div className="site-settings-one-stop-watch">
                        <p className="rest-time"> Rest time </p>

                        <div className="input-group">
                          <div className="time">
                            <input
                              type="number"
                              placeholder="0"
                              name="min"
                              value={myData?.sets[index]?.min || ""}
                              onChange={(e) =>
                                handleChangeSetsData(
                                  index,
                                  "min",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
            <div className="add-cancel-btns">
              <p className="cancel" onClick={() => navigate(-1)}>
                Cancel
              </p>
              <p className="add-exercise" onClick={handleFinish}>
                Add exercise
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddNewExerciseModal;
