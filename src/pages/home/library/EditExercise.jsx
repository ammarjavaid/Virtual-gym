import React, { useEffect, useState } from "react";
import "./EditExercise.scss";
import Topbar from "../../../components/topbar/Topbar";
import { Form, Input, Select, message } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { TimePicker } from "antd";
import { Clipper, Minus, Plus, Toggle } from "../../../assets";
import { useNavigate, useParams } from "react-router-dom";
import { ApiCall } from "../../../Services/Apis";
import { setLoader } from "../../../Redux/actions/GernalActions";
import { useDispatch, useSelector } from "react-redux";
import { async } from "validate.js";

const initialState = {
  exerciseName: "",
  category: "",
  message: "",
  sets: [{ reps: 0, lebs: 0, rest_time: "00:00:00" }],
  video: "",
  exerciseTime: "",
  notes: "",
};

const EditExercise = () => {
  const { id } = useParams();
  const token = useSelector((state) => state.auth.userToken);
  const navigate = useNavigate();
  const [exercise, setExercise] = useState(null);
  const [myData, setMyData] = useState(initialState);
  const [incDec, setIncDec] = useState(1);
  const [form] = Form.useForm();

  const getExcerciseData = async () => {
    try {
      const res = await ApiCall({
        params: "",
        route: `exercise/detail_exercise/${id}`,
        verb: "get",
        token: token,
      });

      if (res?.status == "200") {
        dispatch(setLoader(false));
        console.log(res.response?.exercise, "edit exercise");
        setExercise(res.response?.exercise);
      } else {
        console.log("error", res.response);
        dispatch(setLoader(false));
      }
    } catch (e) {
      console.log("Error getting clients -- ", e.toString());
    }
  };

  useEffect(() => {
    if (id) {
      getExcerciseData();
    } else {
      navigate(-1);
    }
  }, [id]);

  useEffect(() => {
    if (exercise) {
      setIncDec(parseInt(exercise?.no_of_sets));
      setMyData({
        exerciseName: exercise?.exercise_name,
        category: exercise?.category,
        message: exercise?.description,
        notes: exercise?.notes,
        video: exercise?.video,
        exerciseTime: exercise?.exercise_time,
        sets: exercise?.sets,
      });
      form.setFieldsValue({
        exerciseName: exercise?.exercise_name,
        category: exercise?.category,
        message: exercise?.description,
        notes: exercise?.notes,
        video: exercise?.video,
        exerciseTime: exercise?.exercise_time,
        sets: exercise?.sets,
      });
    }
  }, [exercise]);

  // useEffect(() => {

  // }, [exercise]);

  const [allCategories, setAllCategories] = useState([]);
  const dispatch = useDispatch();

  dayjs.extend(customParseFormat);

  const onExcerciseTimeChange = (time, timeString) => {
    console.log(timeString);
    setMyData((prev) => ({ ...prev, exerciseTime: timeString }));
  };

  const handleIncrement = () => {
    setIncDec(incDec + 1);
    setMyData((prev) => ({
      ...prev,
      sets: [...prev.sets, { reps: 0, lebs: 0, rest_time: "00:00:00" }],
    }));
  };

  const handleDecrement = () => {
    if (incDec - 1 < 0) {
      return;
    }
    setIncDec(incDec - 1);
    setMyData((prev) => ({
      ...prev,
      sets: prev.sets?.slice(0, incDec - 1),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMyData({
      ...myData,
      [name]: value,
    });
  };

  // console.log(myData);

  const [showData, setShowData] = useState(false);

  const handleShow = () => {
    setShowData(!showData);
  };

  const handleFinish = async () => {
    // console.log("started");

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
    formData.append("sets", JSON.stringify(myData?.sets));

    try {
      dispatch(setLoader(true));

      const res = await ApiCall({
        params: formData,
        route: `exercise/edit_exercise/${id}`,
        verb: "put",
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
      }
    } catch (e) {
      console.log("error -- ", e.toString());
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

  console.log(myData, myData?.notes, "notes");

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const selectParameter = [
    { name: "weight", label: "Weight (kg)" },
    { name: "seconds", label: "Seconds (s)" },
    { name: "distance", label: "Distance (miles)" },
    { name: "reps", label: "Reps & lbs" },
  ];

  const onSearch = (value) => {
    // console.log("search:", value);
  };
  // Filter `option.label` match the user type `input`
  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  console.log(myData?.exerciseTime, "exerciseTime");

  return (
    <>
      <Topbar
        title="Edit exercise"
        titleOne="Library"
        titleTwo="Edit exercise"
        arrow={true}
      />
      <div className="exercise-inputs">
        <div className="form-wrapper">
          <form form={form}>
            <div className="input-group">
              {/* <Form.Item name="exerciseName"> */}
              <label> Exercise name </label>
              <input
                type="text"
                placeholder="Exercise name"
                name="exerciseName"
                onChange={handleChange}
                value={myData.exerciseName}
              />
              {/* </Form.Item> */}
            </div>
            <div className="input-group">
              {/* <TimePicker
                value={dayjs(myData?.exerciseTime, "HH:mm:ss")}
                onChange={onExcerciseTimeChange}
              /> */}
              <label> Time (min) </label>
              <input
                type="number"
                placeholder="0 min"
                name="exerciseTime"
                onChange={handleChange}
                value={myData.exerciseTime}
              />
            </div>
            <div className="input-group">
              {/* <Form.Item name="message"> */}
              <label> Description / Details </label>
              <textarea
                autosize={{ minRows: 35, maxRows: 75 }}
                placeholder="Description / Details"
                name="message"
                value={myData.message}
                onChange={handleChange}
              />
              {/* </Form.Item> */}
            </div>
            <div className="input-group">
              <div className="video-link-attach">
                <div className="video-link">
                  <label> Video link </label>
                  <input
                    type="text"
                    placeholder="Video link"
                    name="video"
                    value={myData.video}
                    onChange={handleChange}
                    disabled={selectedFile ? true : false}
                  />
                  {/* {errors.video && (
                    <span className="error_email">{errors.video}</span>
                  )} */}
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
                      id="fileInput"
                      placeholder="Akmkas"
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
              src={Toggle}
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

                  {/* 
                  <div className="site-settings-one">
                    <p className="numbring"> {index + 1} </p>
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
                  </div> */}
                  {incDec - 1 !== index && (
                    <div className="site-settings-one-stop-watch">
                      <p className="rest-time"> Rest time (min) </p>
                      <div className="input-group">
                        <div className="time">
                          <input
                            type="number"
                            placeholder="0"
                            name="rest_time"
                            // name="min"
                            // onChange={handleChangeSetsData}
                            value={myData?.sets[index]?.rest_time || ""}
                            // value={myData?.sets[index]?.min || ""}
                            onChange={(e) =>
                              handleChangeSetsData(
                                index,
                                e.target.name,
                                // "restTime",
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
              Update exercise
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditExercise;
