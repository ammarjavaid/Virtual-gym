import React, { useEffect, useState } from "react";
import Topbar from "../../../components/topbar/Topbar";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../../../Redux/actions/GernalActions";
import {
  Delete,
  Edit,
  Edit_Icon,
  Eye,
  Minus,
  Plus,
  Profile,
  Toggle,
} from "../../../assets";
import { ApiCall } from "../../../Services/Apis";
import "./program-details.scss";
import { Button, Form, Modal, Select, Space, Tag, message } from "antd";
import VideoIframe from "../../../common/VideoIframe";
import usePermissionCheck from "../../../../utils/usePermissionCheck";
import AddNewExerciseModal from "../../../common/add-new-exercise-modal/AddNewExerciseModal";
import InputsTags from "./InputsTags";

const inititalState = {
  workoutName: "",
  description: "",
  sets: [],
  notes: "",
  exercises: [
    {
      exerciseName: "",
      sets: [],
      notes: "",
      exerciseTime: "",
      parameter: "",
    },
  ],
  exerciseName: "",
  category: "",
  message: "",
  video: "",
  notes: "",
  exerciseTime: "",
  parameter: "",
};

const ProgramDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.userToken);
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState(inititalState);
  const [errors, setErrors] = useState({ workoutName: "" });
  const [allExcercises, setAllExcercises] = useState([]);
  const [selectedWorkout, setSelectedWokout] = useState(null);
  const [selectedWorkoutDay, setSelectedWokoutDay] = useState(null);
  const { checkSubPermissions } = usePermissionCheck();

  // --------------------------------------

  // const [formValues, setMyData] = useState({
  //   exerciseName: "",
  //   sets: [],
  //   notes: "",
  //   exerciseTime: "",
  //   parameter: "",
  // });
  const [incDec, setIncDec] = useState(0);
  const [showData, setShowData] = useState(true);
  const [showSets, setShowSets] = useState(false);
  const [getExerciseData, setGetExerciseData] = useState();
  const [selectedTagData, setselectedTagData] = useState([]);
  const [singleTags, setSingleTag] = useState({});

  // --------------------------------------

  const selectedTag = (id) => {
    console.log(id, "id");
    const finaldata = [];
    for (let i = 0; i < id?.length; i++) {
      for (let j = 0; j < getExerciseData?.length; j++) {
        if (id?.[i] == getExerciseData?.[j]?._id) {
          finaldata?.push(getExerciseData[j]);
        }
      }
    }

    setselectedTagData(finaldata);

    // allExcercises.find((item)=>item?.)
  };

  const handleInputChange = (e) => {
    const { value, name } = e.target;
    setErrors({ ...errors, [name]: "" });
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // console.log(formValues, "formValues");

  const handleOk = () => {
    setIsModalOpen(false);
    setFormValues(inititalState);
    setSelectedWokout(null);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setFormValues(inititalState);
    setSelectedWokout(null);
  };

  // console.log(allExcercises, "getExerciseData");
  // console.log(getExerciseData, "getExerciseData");

  const handleEditWorkout = (workout) => {
    // console.log(workout, "51");
    const allExcercises = workout?.exercise?.map((el) => el?._id) || [];
    selectedTag(allExcercises);

    setSelectedWokout(workout);
    setFormValues({
      workoutName: workout?.workoutName,
      description: workout?.description,
      exercises: [...workout?.exercise?.map((el) => el?._id)],
    });
    setIsModalOpen(true);
  };

  const handleSingleWorkoutSubmit = async () => {
    // validation
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      try {
        dispatch(setLoader(true));

        const res = await ApiCall({
          params: {
            ...(selectedWorkout && { workoutId: selectedWorkout?.workoutId }),
            ...(selectedWorkoutDay && { objId: selectedWorkoutDay?._id }),
            ...(selectedWorkoutDay && { inner_objId: selectedWorkout?._id }),
            workoutName: formValues.workoutName,
            description: formValues.description,
            notes: formValues.notes,
            exercise: getExerciseData?.filter((el) =>
              formValues.exercises?.includes(el?._id)
            ),
            exercise: selectedTagData,
          },
          route: `program/${
            selectedWorkout ? "edit_workout" : "add_workout"
          }/${id}`,
          verb: "put",
          token: token,
        });

        if (res?.status == "200") {
          dispatch(setLoader(false));
          getWorkoutProgram();
          handleOk();
          message.success(res.response?.message);
          setShowWorkoutModal(false);
          setSelectedWokout(null);
          setSelectedWokoutDay(null);
          setFormValues(inititalState);
          setselectedTagData([]);
        } else {
          dispatch(setLoader(false));
          message.error(res.response?.message);
        }
      } catch (e) {
        console.log("error", e);
        dispatch(setLoader(false));
      }
    } else {
      setErrors(validationErrors);
      return;
    }
  };

  const handleDeleteSingleWorkout = async (workoutId, objId, inner_objId) => {
    try {
      dispatch(setLoader(true));

      const res = await ApiCall({
        params: {
          workoutId,
          objId,
          inner_objId,
        },
        route: `program/delete_workout/${id}`,
        verb: "put",
        token: token,
      });

      if (res?.status == "200") {
        dispatch(setLoader(false));
        getWorkoutProgram();
        message.success(res.response?.message);
        setShowWorkoutModal(false);
        setSelectedWokout(null);
        setSelectedWokoutDay(null);
      } else {
        dispatch(setLoader(false));
        message.error(res.response?.message);
      }
    } catch (e) {
      console.log("error", e);
      dispatch(setLoader(false));
    }
  };

  const getWorkoutProgram = async () => {
    try {
      dispatch(setLoader(true));
      const res = await ApiCall({
        params: "",
        route: `program/detail_program/${id}`,
        verb: "get",
        token: token,
      });

      if (res?.status == "200") {
        dispatch(setLoader(false));
        setData(res.response?.detail);
      } else {
        console.log("error", res.response);
      }
    } catch (e) {
      dispatch(setLoader(false));
      console.log("Error getting clients -- ", e.toString());
    }
  };

  const getAllExcercises = async () => {
    try {
      dispatch(setLoader(true));
      const res = await ApiCall({
        params: "",
        route: "exercise/all_exercises",
        verb: "get",
        token: token,
      });

      if (res?.status == "200") {
        dispatch(setLoader(false));
        setGetExerciseData(res?.response?.exercise_list);
        setAllExcercises(
          res.response?.exercise_list
            // ?.filter((exercise) => exercise.isDeleted === false)
            .map((exercise) => ({
              value: exercise?._id,
              label: exercise?.exercise_name,
            })) || []
        );
      } else {
        console.log("error", res.response);
      }
    } catch (e) {
      dispatch(setLoader(false));
      console.log("Error getting clients -- ", e.toString());
    }
  };

  useEffect(() => {
    if (id) {
      getWorkoutProgram();
      getAllExcercises();
    } else {
      navigate(-1);
    }
  }, [id]);

  const handleAddDay = async () => {
    try {
      dispatch(setLoader(true));

      const res = await ApiCall({
        params: {
          workoutDay: `day ${data?.workouts?.length + 1 || 1}`,
        },
        route: `program/add_new_day/${id}`,
        verb: "put",
        token: token,
      });

      if (res?.status == "200") {
        dispatch(setLoader(false));
        getWorkoutProgram();
        message.success(res.response?.message);
      } else {
        dispatch(setLoader(false));
        message.error(res.response?.message);
      }
    } catch (e) {
      dispatch(setLoader(false));
    }
  };

  // validation

  const validateForm = () => {
    const errors = {};
    if (!formValues.workoutName) {
      errors.workoutName = "Workout name is required";
    }
    if (!formValues.description) {
      errors.description = "Description is required";
    }
    if (formValues.exercises.length === 0) {
      errors.exercises = "At least one exercise is required";
    }
    return errors;
  };

  // for add new exercise

  const [isAddExerciseModalOpen, setIsAddExerciseModalOpen] = useState(false);
  const showModal = () => {
    setIsAddExerciseModalOpen(true);
    setIsModalOpen(false);
  };
  const handleAddExerciseOk = () => {
    setIsAddExerciseModalOpen(false);
  };
  const handleAddExerciseCancel = () => {
    setIsAddExerciseModalOpen(false);
  };

  // console.log(data, "data");
  const test = data?.workouts?.map((el) =>
    el?.innerWorkout?.map((elm) => elm?.exercise)
  );

  const handleTagClose = (_id) => {
    // Implement logic to remove the tag with the given exercise from the state
    const updatedExercises = selectedTagData.filter((ex) => ex?._id !== _id);
    setselectedTagData(updatedExercises);
    setFormValues({ ...formValues, notes: "", sets: [] });
    setFormValues({
      ...formValues,
      exercises: updatedExercises,
    });
    if (_id == singleTags?._id) {
      setSingleTag({});
    }
  };

  const handleShow = () => {
    setShowData(!showData);
  };

  const handleIncrement = () => {
    setIncDec(incDec + 1);
    setFormValues((prev) => ({
      ...prev,
      sets: [
        ...prev?.sets,
        {
          reps: 0,
          lebs: 0,
          rest_time: "00:05:00",
          // hours: "",
          min: "",
          parameter: "",
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
    setFormValues((prev) => ({
      ...prev,
      sets: prev?.sets?.slice(0, incDec - 1),
    }));
  };

  const onSearch = (value) => {
    // console.log("search:", value);
  };

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const handleChangeSetsData = (index, name, value) => {
    setFormValues((prev) => ({
      ...prev,
      sets: prev.sets?.map((set, i) =>
        i === index ? { ...set, [name]: value } : set
      ),
    }));
  };

  console.log(formValues, "formValues");
  const selectParameter = [
    { name: "weight", label: "Weight (kg)" },
    { name: "seconds", label: "Seconds (s)" },
    { name: "distance", label: "Distance (miles)" },
    { name: "reps", label: "Reps & lbs" },
  ];

  const handleTags = (value) => {
    setSingleTag(value);
    setIncDec(value?.sets?.length);
    setFormValues({ ...formValues, notes: value?.notes, sets: value?.sets });
    setShowSets(!showSets);
  };

  const [activeTag, setActiveTag] = useState(null);

  const handleActive = (tagId) => {
    setActiveTag(tagId === activeTag ? null : tagId);
  };

  console.log(formValues, "formValues?.sets");

  return (
    <>
      <Topbar
        title="Workout program"
        titleOne="Workout programs"
        titleTwo="Workout program"
        arrow={true}
      />
      <div className="profile-name program-image">
        <img src={data?.program_Image || Profile} alt="" />
        <p>{data?.title}</p>
      </div>

      <div className="program-workouts-container">
        {data?.workouts.map((workoutDay) => (
          <>
            <div className="single-day-container">
              <div className="day-head">
                <p>{workoutDay?.workoutDay}</p>
              </div>
              <div className="day-workouts-container">
                {workoutDay?.innerWorkout?.map((workout) => (
                  <>
                    <div className="day-workouts-content">
                      <h2> {workout?.workoutName} </h2>
                      {workout?.exercise?.map((exercise) => (
                        <>
                          <div className="day-workouts-content-detail">
                            <div className="day-workouts-content-detail-left">
                              {/* <img src={Profile} alt="" /> */}
                              <VideoIframe
                                className="exercise-video-iframe"
                                // style={{ backgroundColor: "red" }}
                                height={"40px"}
                                width={"40px"}
                                url={exercise?.video}
                              />
                            </div>
                            <div className="day-workouts-content-detail-right">
                              <>
                                <h4> {exercise?.exercise_name} </h4>
                                <p>
                                  {exercise?.exercise_time} mins |
                                  {exercise?.no_of_sets}
                                  sets | {exercise?.sets[0]?.reps} reps
                                </p>
                              </>
                            </div>
                          </div>
                        </>
                      ))}
                    </div>
                  </>
                ))}
              </div>
              <div className="day-footer">
                {workoutDay?.innerWorkout?.length > 0 ? (
                  <div className="edit-btn">
                    {checkSubPermissions(
                      "workout-program",
                      "editWorkoutProgramDays"
                    )?.status ? (
                      <button
                        className="edit"
                        onClick={() => {
                          setIsModalOpen(true);
                          setSelectedWokoutDay(workoutDay);
                          handleEditWorkout(workoutDay?.innerWorkout[0]);
                        }}
                      >
                        Edit
                      </button>
                    ) : null}
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedWokoutDay(workoutDay);
                      setIsModalOpen(true);
                    }}
                  >
                    Add a session
                  </button>
                )}
              </div>
            </div>
          </>
        ))}

        {checkSubPermissions("workout-program", "addWorkoutProgramDays")
          ?.status ? (
          <div className="add-day-container">
            <button onClick={handleAddDay}>Add a Day</button>
          </div>
        ) : null}
      </div>

      <Modal
        centered
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        maskClosable={false}
      >
        <div className="modal">
          <h2>{selectedWorkout ? "Edit" : "Add"} Workout</h2>
          <form className="create-workout-form">
            <div className="input-group">
              <label> Workout name </label>
              <input
                type="text"
                name="workoutName"
                placeholder="Workout Name"
                onChange={handleInputChange}
                value={formValues?.workoutName}
              />
              {errors.workoutName && (
                <span className="error_email">{errors.workoutName}</span>
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
            <div className="input-group">
              <Select
                style={{
                  width: "80%",
                }}
                mode="multiple"
                name="exercise_name"
                placeholder="Choose exercises"
                value={formValues.exercises}
                onChange={(value) => {
                  console.log(value, "excersise list");
                  selectedTag(value);
                  handleInputChange({
                    target: {
                      name: "exercises",
                      value: value,
                    },
                  });
                }}
                dropdownRender={(menu) => (
                  <>
                    {menu}

                    <Space
                      style={{
                        padding: "0 8px 4px",
                      }}
                    >
                      <Button
                        type="text"
                        className="add-exercise-btn"
                        onClick={showModal}
                      >
                        Add exercise
                      </Button>
                    </Space>
                  </>
                )}
              >
                {getExerciseData?.map((item) => (
                  <Select.Option value={item?._id}>
                    {item?.exercise_name}
                  </Select.Option>
                ))}
              </Select>
              <div
                style={{
                  marginTop: "8px",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "5px",
                }}
              >
                {selectedTagData?.map((item) => (
                  <Tag
                    key={item?._id}
                    closable
                    onClose={() => {
                      handleTagClose(item?._id);
                      setShowSets(true);
                    }}
                    style={{ cursor: "pointer" }}
                    className={activeTag === item?._id ? "tag active" : "tag"}
                    onClick={() => {
                      handleActive(item?._id);
                      handleTags(item);
                    }}
                  >
                    {item?.exercise_name}
                  </Tag>
                ))}
              </div>
              {errors.exercises && (
                <span className="error_email">{errors.exercises}</span>
              )}

              {/* --------------------sets-----------------------  */}
              {singleTags?._id ? (
                <>
                  <div className="notes">
                    <label> Notes </label>
                    <textarea
                      rows={5}
                      cols={5}
                      placeholder="Enter notes"
                      name="notes"
                      onChange={handleInputChange}
                      value={formValues.notes}
                    />

                    {errors.notes && (
                      <span className="error_email">{errors.notes}</span>
                    )}
                  </div>
                  <div className="input-group increment-decrement">
                    <input disabled placeholder="No. of sets" value={incDec} />
                    <div className="plus-minus">
                      <img src={Minus} alt="" onClick={handleDecrement} />
                      <img src={Plus} alt="" onClick={handleIncrement} />
                    </div>
                  </div>

                  <div className="site-setting-toggle">
                    <img
                      src={Toggle}
                      alt=""
                      className={showData ? "togglehide" : "toggleShow"}
                      onClick={handleShow}
                    />
                    <h2> Sets settings </h2>
                  </div>

                  {singleTags?._id ? (
                    <>
                      {Array?.from({ length: incDec }, (_, index) => (
                        <div className="site-settings">
                          <p className="numbring"> {index + 1} </p>

                          <div className="select">
                            <label> Parameters </label>
                            <Select
                              className="select-box"
                              showSearch
                              placeholder="Select a parameter"
                              optionFilterProp="children"
                              value={formValues?.sets}
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
                              el.name === formValues?.sets &&
                              (formValues?.sets !== "reps" ? (
                                <>
                                  <div
                                    className="input-group"
                                    style={{ marginTop: "20px" }}
                                  >
                                    <label style={{ color: "#000" }}>
                                      {el.label}
                                    </label>
                                    <input
                                      type="number"
                                      value={
                                        formValues?.sets[index]?.[el?.name] ||
                                        ""
                                      }
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

                                    {!formValues?.sets[index]?.[el?.name] && (
                                      <span className="error_email">
                                        {el?.label} is required.
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
                                        value={
                                          formValues?.sets[index]?.reps || ""
                                        }
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
                                        value={
                                          formValues?.sets[index]?.lebs || ""
                                        }
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
                          {errors.notes &&
                            errors.sets &&
                            errors.sets.length === 0 && (
                              <span className="error_email">
                                {errors.notes}
                              </span>
                            )}

                          {incDec - 1 !== index && (
                            <div className="site-settings-one-stop-watch">
                              <p className="rest-time"> Rest time (min)</p>

                              <div className="input-group">
                                <div className="time">
                                  <input
                                    type="number"
                                    placeholder="0 min"
                                    name="min"
                                    value={
                                      // formValues?.sets[index]?.rest_time || ""
                                      formValues?.sets
                                    }
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
                  ) : null}
                </>
              ) : null}
            </div>

            <div className="buttons">
              <p className="cancel" onClick={handleCancel}>
                Cancel
              </p>
              <p
                className="add-category"
                type="submit"
                onClick={handleSingleWorkoutSubmit}
              >
                {selectedWorkout ? "Edit" : "Add"} workout
              </p>
            </div>
          </form>
        </div>
      </Modal>
      {/* ))} */}
      <Modal
        centered
        open={showWorkoutModal}
        onOk={() => {
          setShowWorkoutModal(false);
        }}
        onCancel={() => {
          setShowWorkoutModal(false);
        }}
      >
        <div className="single-workout-container">
          <div className="workout-header">
            <div className="workout-detail-item">
              <p>Name</p> <h4>{selectedWorkout?.workoutName}</h4>
            </div>
            <div className="action-icons">
              <img
                onClick={() => {
                  handleEditWorkout(selectedWorkout);
                  setShowWorkoutModal(false);
                }}
                src={Edit_Icon}
                alt=""
              />
              <img
                onClick={() =>
                  handleDeleteSingleWorkout(
                    selectedWorkout?.workoutId,
                    selectedWorkoutDay?._id,
                    selectedWorkout?._id
                  )
                }
                src={Delete}
                alt=""
              />
            </div>
          </div>
          <div className="workout-detail-item">
            <p>Description</p> <h4>{selectedWorkout?.description}</h4>
          </div>
          <div className="workout-detail-item">
            <p>Exercises</p>
            <div className="exercises-container">
              {selectedWorkout?.exercise?.map((excercise) => (
                <span>
                  {excercise?.exerciseId?.exercise_name}
                  <img
                    onClick={() => {
                      navigate(
                        `/library/exercise-details/${excercise?.exerciseId?._id}`
                      );
                    }}
                    src={Eye}
                    alt=""
                  />
                </span>
              ))}
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        title="Add new exercise"
        open={isAddExerciseModalOpen}
        onOk={handleAddExerciseOk}
        onCancel={handleAddExerciseCancel}
      >
        <AddNewExerciseModal />
      </Modal>
    </>
  );
};

export default ProgramDetails;
