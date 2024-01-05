import React, { useEffect, useState } from "react";
import "./client.scss";
import Topbar from "../../../components/topbar/Topbar";
import {
  Client__details,
  Eye,
  Minus,
  Plus,
  Profile,
  Toggle,
} from "../../../assets";
import MyChart from "../../../components/charts/MyChart";
import { useMediaQuery } from "react-responsive";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ApiCall } from "../../../Services/Apis";
import { setLoader } from "../../../Redux/actions/GernalActions";
import Message from "./Message";
import {
  Button,
  DatePicker,
  Input,
  Modal,
  Select,
  Space,
  Tag,
  message,
} from "antd";
import VideoIframe from "../../../common/VideoIframe";
import usePermissionCheck from "../../../../utils/usePermissionCheck";
import AddNewExerciseModal from "../../../common/add-new-exercise-modal/AddNewExerciseModal";

const localizer = momentLocalizer(moment);

const inititalState = {
  // workoutName: "",
  // description: "",
  // exercises: [],
  workoutName: "",
  description: "",
  sets: [{ reps: 0, lebs: 0, rest_time: "00:00:00", parameter: "" }],
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

const ClientDetails = (props) => {
  // const navigate = useNavigate();
  // const dispatch = useDispatch();
  // const { id } = useParams();
  // const location = useLocation();
  // const queryParams = new URLSearchParams(location.search);
  // const tabActive = queryParams.get("tab");
  // const currentDate = new Date();
  // const options = { month: "long" };
  // const { checkSubPermissions } = usePermissionCheck();
  // const monthString = currentDate.toLocaleString("en-US", options);
  // const token = useSelector((state) => state.auth.userToken);
  // const [clientDetails, setClientDetails] = useState([]);
  // const [clientPlan, setClientPlan] = useState([]);
  // const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  // const [selectedWorkout, setSelectedWorkout] = useState(null);
  // const [formValues, setFormValues] = useState(inititalState);
  // // const [errors, setErrors] = useState({ workoutName: "" });
  // const [errors, setErrors] = useState({
  //   workoutName: "",
  //   description: "",
  //   exercises: "",
  // });
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [selectedWorkoutDay, setSelectedWokoutDay] = useState(null);
  // const [allExcercises, setAllExcercises] = useState([]);
  // const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  // const [currentMonth, setcurrentMonth] = useState(monthString);
  // const [activeTabs, setActiveTabs] = useState(tabActive || "PersonalInfo");
  // const months = [
  //   "january",
  //   "february",
  //   "march",
  //   "april",
  //   "may",
  //   "june",
  //   "july",
  //   "august",
  //   "september",
  //   "october",
  //   "november",
  //   "december",
  // ];
  // const isMonthBeforeCurrent = (month) => {
  //   const current = new Date().getMonth();
  //   if (months.indexOf(month) < current) {
  //     return true;
  //   }
  //   return false;
  // };
  // const isDateGreaterThanOrEqualToToday = (givenDate) => {
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);
  //   const provided = new Date(givenDate);
  //   provided.setHours(0, 0, 0, 0);
  //   return provided >= today;
  // };
  // const isLastDayOfMonth = (providedDate) => {
  //   const provided = new Date(providedDate);
  //   const lastDayOfMonth = new Date(
  //     provided.getFullYear(),
  //     provided.getMonth() + 1,
  //     0
  //   );

  //   return provided.toDateString() === lastDayOfMonth.toDateString();
  // };
  // const getClientDetails = async () => {
  //   dispatch(setLoader(true));
  //   try {
  //     const res = await ApiCall({
  //       params: "",
  //       route: `admin/view_client_by_userId/${id}`,
  //       verb: "get",
  //       token: token,
  //     });
  //     if (res?.status == "200") {
  //       dispatch(setLoader(false));
  //       setClientDetails(res.response?.client);
  //     } else {
  //       console.log("error", res.response);
  //       dispatch(setLoader(false));
  //     }
  //   } catch (e) {
  //     console.log("Error getting client detail -- ", e.toString());
  //   }
  // };
  // const getClientPlan = async () => {
  //   dispatch(setLoader(true));
  //   try {
  //     const res = await ApiCall({
  //       params: "",
  //       route: `assignProgram/given_month_plan/${
  //         clientDetails?.plan_id
  //       }&${currentMonth}&${new Date(currentDate)?.getFullYear()}`,
  //       verb: "get",
  //       token: token,
  //     });
  //     if (res?.status == "200") {
  //       console.log(res?.response);
  //       dispatch(setLoader(false));
  //       setClientPlan(res.response?.AssignedProgram?.workout);
  //     } else {
  //       dispatch(setLoader(false));
  //       console.log("error", res.response);
  //     }
  //   } catch (e) {
  //     dispatch(setLoader(false));
  //     console.log("Error getting client detail -- ", e.toString());
  //   }
  // };
  // const handleInputChange = (e) => {
  //   const { value, name } = e.target;
  //   setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  //   // setErrors({ ...errors, [name]: "" });
  //   setFormValues((prev) => ({ ...prev, [name]: value }));
  // };
  // const handleOk = () => {
  //   setIsModalOpen(false);
  //   setFormValues(inititalState);
  //   setSelectedWorkout(null);
  // };
  // const handleCancel = () => {
  //   setIsModalOpen(false);
  //   setFormValues(inititalState);
  //   setSelectedWorkout(null);
  // };
  // const handleSingleWorkoutSubmit = async () => {
  //   setIsFormSubmitted(true);
  //   const validationErrors = validateForm();
  //   if (Object.keys(validationErrors).length === 0) {
  //     try {
  //       const res = await ApiCall({
  //         params: {
  //           ...(selectedWorkout && { workoutId: selectedWorkout?.workoutId }),
  //           ...(selectedWorkoutDay && { objId: selectedWorkoutDay?._id }),
  //           ...(selectedWorkoutDay && { inner_objId: selectedWorkout?._id }),
  //           workoutName: formValues.workoutName,
  //           description: formValues.description,
  //           exercise: allExcercises.filter((e) =>
  //             formValues.exercises?.includes(e?._id)
  //           ),
  //         },
  //         route: `assignProgram/${
  //           selectedWorkout
  //             ? "edit_workout_in_assignPlan"
  //             : "add_workout_in_assignPlan"
  //         }/${clientDetails?.plan_id}`,
  //         verb: "post",
  //         token: token,
  //       });

  //       console.log(res, "res");
  //       if (res?.status == 200) {
  //         setIsModalOpen(false);
  //         dispatch(setLoader(false));
  //         getClientPlan();
  //         handleOk();
  //         message.success(res?.response?.message);
  //         setShowWorkoutModal(false);
  //         setSelectedWorkout(null);
  //         setSelectedWokoutDay(null);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     } finally {
  //       setIsFormSubmitted(false);
  //       setErrors({
  //         workoutName: "",
  //         description: "",
  //         exercises: "",
  //       });
  //     }
  //   } else {
  //     setErrors(validationErrors);
  //     return;
  //   }
  // };

  // const getAllExcercises = async () => {
  //   try {
  //     dispatch(setLoader(true));
  //     const res = await ApiCall({
  //       params: "",
  //       route: "exercise/all_exercises",
  //       verb: "get",
  //       token: token,
  //     });

  //     if (res?.status == "200") {
  //       dispatch(setLoader(false));
  //       setAllExcercises(
  //         res.response?.exercise_list?.filter(
  //           (exercise) => exercise.isDeleted === false
  //         ) || []
  //       );
  //     } else {
  //       console.log("error", res.response);
  //     }
  //   } catch (e) {
  //     dispatch(setLoader(false));
  //     console.log("Error getting clients -- ", e.toString());
  //   }
  // };
  // const handleEditWorkout = (workout) => {
  //   setSelectedWorkout(workout);
  //   setFormValues({
  //     workoutName: workout?.workoutName,
  //     description: workout?.description,
  //     exercises: [...workout.exercise.map((el) => el._id)],
  //   });
  //   setIsModalOpen(true);
  // };
  // const handleAddDay = async () => {
  //   try {
  //     dispatch(setLoader(true));
  //     const res = await ApiCall({
  //       params: clientDetails?.plan_id,
  //       route: `assignProgram/add_workout_day_in_assignPlan/${clientDetails?.plan_id}`,
  //       verb: "post",
  //       token: token,
  //     });
  //     if (res?.status == "200") {
  //       dispatch(setLoader(false));
  //       getClientPlan();
  //       console.log(res?.response);
  //       message.success(res.response?.message);
  //     } else {
  //       dispatch(setLoader(false));
  //       message.error(res.response?.message);
  //     }
  //   } catch (e) {
  //     console.log("error", e);
  //     dispatch(setLoader(false));
  //   }
  // };
  // const validateForm = () => {
  //   const errors = {};
  //   if (!formValues.workoutName) {
  //     errors.workoutName = "Workout name is required";
  //   }
  //   if (!formValues.description) {
  //     errors.description = "Description is required";
  //   }
  //   if (formValues.exercises.length === 0) {
  //     errors.exercises = "Please select at least one exercise";
  //   }
  //   return errors;
  // };
  // useEffect(() => {
  //   if (id) {
  //     getClientDetails();
  //     getAllExcercises();
  //   }
  // }, [id]);
  // useEffect(() => {
  //   if (clientDetails?.plan_id) {
  //     getClientPlan();
  //   }
  // }, [clientDetails?.plan_id, currentMonth]);

  // // for add new exercise

  // const [isAddExerciseModalOpen, setIsAddExerciseModalOpen] = useState(false);
  // const showModal = () => {
  //   setIsAddExerciseModalOpen(true);
  //   setIsModalOpen(false);
  // };
  // const handleAddExerciseOk = () => {
  //   setIsAddExerciseModalOpen(false);
  // };
  // const handleAddExerciseCancel = () => {
  //   setIsAddExerciseModalOpen(false);
  // };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tabActive = queryParams.get("tab");
  const currentDate = new Date();
  const options = { month: "long" };
  const { checkSubPermissions } = usePermissionCheck();
  const monthString = currentDate.toLocaleString("en-US", options);
  const token = useSelector((state) => state.auth.userToken);
  const [clientDetails, setClientDetails] = useState([]);
  const [clientPlan, setClientPlan] = useState([]);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [formValues, setFormValues] = useState(inititalState);
  const [errors, setErrors] = useState({ workoutName: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWorkoutDay, setSelectedWokoutDay] = useState(null);
  const [allExcercises, setAllExcercises] = useState([]);
  // const [currentMonth, setcurrentMonth] = useState(monthString);
  const [activeTabs, setActiveTabs] = useState(tabActive || "PersonalInfo");
  const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];

  // const [getExerciseData, setGetExerciseData] = useState();

  const [currentMonth, setcurrentMonth] = useState(moment().format("MMMM"));
  const [currentYear, setcurrentYear] = useState(new Date().getFullYear());
  const [endDate, setEndDate] = useState("");
  // const [lastWorkoutDate, setLastWorkoutDate] = useState("");
  const selectedMonthIndex = months.indexOf(currentMonth);

  const handleMonthChange = (selectedMonth) => {
    setcurrentYear(null);
    const currentDate = moment();
    const selectedMonthStart = moment
      .utc(selectedMonth, "MMMM")
      .startOf("month");
    if (selectedMonthStart.isBefore(currentDate)) {
      selectedMonthStart.add(1, "year");
    }
    // console.log(selectedMonthStart, "selectedMonthStart");
    // setLastWorkoutDate(clientPlan[clientPlan.length - 1]);
    setcurrentMonth(selectedMonth);
    setEndDate(selectedMonthStart.toISOString());
    // console.log(selectedMonthStart, "selectedMonthStart");
  };

  const current = new Date().getMonth();
  const isMonthBeforeCurrent = (month) => {
    if (months.indexOf(month) < current) {
      return true;
    }
    return false;
  };

  const isDateGreaterThanOrEqualToToday = (givenDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const provided = new Date(givenDate);
    provided.setHours(0, 0, 0, 0);
    return provided >= today;
  };

  const isLastDayOfMonth = (providedDate) => {
    const provided = new Date(providedDate);
    const lastDayOfMonth = new Date(
      provided.getFullYear(),
      provided.getMonth() + 1,
      0
    );

    return provided.toDateString() === lastDayOfMonth.toDateString();
  };

  // console.log(isLastDayOfMonth(), "last");
  const getClientDetails = async () => {
    dispatch(setLoader(true));
    try {
      const res = await ApiCall({
        params: "",
        route: `admin/view_client_by_userId/${id}`,
        verb: "get",
        token: token,
      });
      if (res?.status == "200") {
        dispatch(setLoader(false));
        setClientDetails(res.response?.client);
      } else {
        console.log("error", res.response);
        dispatch(setLoader(false));
      }
    } catch (e) {
      console.log("Error getting client detail -- ", e.toString());
    }
  };

  const getClientPlan = async () => {
    dispatch(setLoader(true));
    try {
      const res = await ApiCall({
        params: "",
        route: `assignProgram/given_month_plan/${
          clientDetails?.plan_id
        }&${currentMonth}&${
          currentYear
            ? currentYear
            : isMonthBeforeCurrent(currentMonth)
            ? new Date(currentDate)?.getFullYear() + 1
            : new Date(currentDate)?.getFullYear()
        }`,
        verb: "get",
        token: token,
      });
      if (res?.status == "200") {
        dispatch(setLoader(false));
        setClientPlan(res.response?.AssignedProgram?.workout);
      } else {
        dispatch(setLoader(false));
        console.log("error", res.response);
      }
    } catch (e) {
      dispatch(setLoader(false));
      console.log("Error getting client detail -- ", e.toString());
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
    setSelectedWorkout(null);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setFormValues(inititalState);
    setSelectedWorkout(null);
  };

  const [selectedTagData, setselectedTagData] = useState([]);
  const [incDec, setIncDec] = useState(0);
  const [showData, setShowData] = useState(true);
  const [showSets, setShowSets] = useState(false);
  const [getExerciseData, setGetExerciseData] = useState();
  const [singleTags, setSingleTag] = useState({});

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

  const handleTags = (value) => {
    setSingleTag(value);
    setIncDec(value?.sets?.length);
    setFormValues({ ...formValues, notes: value?.notes, sets: value?.sets });
    setShowSets(!showSets);
  };

  console.log(selectedTagData, "selectedTagData");

  const handleSingleWorkoutSubmit = async () => {
    setIsFormSubmitted(true);
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      try {
        const res = await ApiCall({
          params: {
            ...(selectedWorkout && { workoutId: selectedWorkout?.workoutId }),
            ...(selectedWorkoutDay && { objId: selectedWorkoutDay?._id }),
            ...(selectedWorkoutDay && { inner_objId: selectedWorkout?._id }),
            workoutName: formValues.workoutName,
            description: formValues.description,
            exercise: getExerciseData.filter((e) =>
              formValues.exercises?.includes(e?._id)
            ),
            exercise: selectedTagData,
          },
          route: `assignProgram/${
            selectedWorkout
              ? "edit_workout_in_assignPlan"
              : "add_workout_in_assignPlan"
          }/${clientDetails?.plan_id}`,
          verb: "post",
          token: token,
        });

        if (res?.status == 200) {
          setIsModalOpen(false);
          dispatch(setLoader(false));
          getClientPlan();
          handleOk();
          message.success(res?.response?.message);
          setShowWorkoutModal(false);
          setSelectedWorkout(null);
          setFormValues(inititalState);
          setSelectedWokoutDay(null);
          setselectedTagData([]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsFormSubmitted(false);
        setErrors({
          workoutName: "",
          description: "",
          exercises: "",
        });
      }
    } else {
      setErrors(validationErrors);
      return;
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
          res.response?.exercise_list?.filter(
            (exercise) => exercise.isDeleted === false
          ) || []
        );
      } else {
        console.log("error", res.response);
      }
    } catch (e) {
      dispatch(setLoader(false));
      console.log("Error getting clients -- ", e.toString());
    }
  };
  const handleEditWorkout = (workout) => {
    setselectedTagData(workout.exercise);
    setSelectedWorkout(workout);
    setFormValues({
      workoutName: workout?.workoutName,
      description: workout?.description,
      exercises: [...workout.exercise.map((el) => el._id)],
    });
    setIsModalOpen(true);
  };

  // console.log(clientPlan, "clientPlan");

  const handleAddDay = async () => {
    try {
      dispatch(setLoader(true));
      const res = await ApiCall({
        params: {
          endDate: clientPlan?.length > 0 ? "" : endDate,
        },
        route: `assignProgram/add_workout_day_in_assignPlan_app/${clientDetails?.plan_id}`,
        verb: "post",
        token: token,
      });
      if (res?.status == "200") {
        dispatch(setLoader(false));
        getClientPlan();
        message.success(res.response?.message);
      } else {
        dispatch(setLoader(false));
        message.error(res.response?.message);
      }
    } catch (e) {
      console.log("error", e);
      dispatch(setLoader(false));
    }
  };
  const validateForm = () => {
    const errors = {};
    if (!formValues.workoutName) {
      errors.workoutName = "Workout name is required";
    }
    if (!formValues.description) {
      errors.description = "Description is required";
    }
    if (formValues.exercises.length === 0) {
      errors.exercises = "Please select at least one exercise";
    }
    if (formValues.exercises === "Choose an exercise") {
      errors.exercises = "Please select at least one exercise";
    }
    return errors;
  };
  useEffect(() => {
    if (id) {
      getClientDetails();
      getAllExcercises();
    }
  }, [id]);
  useEffect(() => {
    if (clientDetails?.plan_id) {
      getClientPlan();
      isMonthBeforeCurrent(currentMonth);
    }
  }, [clientDetails?.plan_id, currentMonth]);

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

  const handleChangeSetsData = (index, name, value) => {
    setFormValues((prev) => ({
      ...prev,
      sets: prev.sets?.map((set, i) =>
        i === index ? { ...set, [name]: value } : set
      ),
    }));
  };

  const selectParameter = [
    { name: "weight", label: "Weight (kg)" },
    { name: "seconds", label: "Seconds (s)" },
    { name: "distance", label: "Distance (miles)" },
    { name: "reps", label: "Reps & lbs" },
  ];

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
      sets: prev.sets.slice(0, incDec - 1),
    }));
  };

  const onSearch = (value) => {
    // console.log("search:", value);
  };

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  // console.log(formValues, "formdataaaaaaaaaaaaaaaaaaaaaa");
  // console.log(allExcercises, "allExcercises");

  const [activeTag, setActiveTag] = useState(null);

  const handleActive = (tagId) => {
    setActiveTag(tagId === activeTag ? null : tagId);
  };

  return (
    <>
      <Topbar
        title="Client details"
        arrow={true}
        titleOne="Clients"
        titleTwo="Client details"
        backLink="/client"
      />
      <div className="client-details-tabs">
        <ul>
          <li
            onClick={() => {
              setActiveTabs("PersonalInfo");
              navigate(`/client/client-details/${id}?tab=PersonalInfo`);
            }}
            className={
              activeTabs === "PersonalInfo" ? "client-details-active" : ""
            }
          >
            Personal info
          </li>
          <li
            onClick={() => {
              setActiveTabs("Exercises");
              navigate(`/client/client-details/${id}?tab=Exercises`);
            }}
            className={
              activeTabs === "Exercises" ? "client-details-active" : ""
            }
          >
            Exercises
          </li>
          {checkSubPermissions("messages", "customCoachingClientsMessages")
            ?.status ? (
            <li
              onClick={() => {
                setActiveTabs("Message");
                navigate(`/client/client-details/${id}?tab=Message`);
              }}
              className={
                activeTabs === "Message" ? "client-details-active" : ""
              }
            >
              Message
            </li>
          ) : null}
        </ul>
      </div>

      {activeTabs === "PersonalInfo" && (
        <>
          <div className="client-details">
            <div className="profile-img">
              {/* <img src={clientDetails.profile_image} alt="" /> */}
              {clientDetails.profile_image ? (
                <img src={clientDetails.profile_image} alt="" />
              ) : (
                <img src={Profile} alt="" />
              )}
            </div>
            <div className="client-details-content">
              <div className="client-details-content-left">
                <div className="input-box">
                  <h5> Full name </h5>
                  <p> {clientDetails.full_name} </p>
                </div>
                <div className="input-box">
                  <h5> Email address </h5>
                  <p> {clientDetails.email} </p>
                </div>
                <div className="input-box">
                  <h5> Weight </h5>
                  <p> {clientDetails.weight} </p>
                </div>
                <div className="input-box">
                  <h5> Height </h5>
                  <p> {clientDetails.height} </p>
                </div>
              </div>
              <div className="client-details-content-right">
                <div className="chart-head">
                  <h2> Activity </h2>
                  <img src="" alt="" />
                </div>
                <div className="client-details-content-right-content">
                  <MyChart />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTabs === "Exercises" && (
        <>
          <div className="profile-name">
            <div>
              <img src={clientDetails?.profile_image || Profile} alt="" />
              <p> {clientDetails?.full_name}</p>
            </div>

            <Select
              onChange={(val) => {
                handleMonthChange(val);
              }}
              value={currentMonth}
              options={[
                { label: "January", value: "january" },
                { label: "February", value: "february" },
                { label: "March", value: "march" },
                { label: "April", value: "april" },
                { label: "May", value: "may" },
                { label: "June", value: "june" },
                { label: "July", value: "july" },
                { label: "August", value: "august" },
                { label: "September", value: "september" },
                { label: "October", value: "october" },
                { label: "November", value: "november" },
                { label: "December", value: "december" },
              ]}
            />
          </div>

          <div className="program-workouts-containers">
            {clientPlan?.map((workoutDay) => {
              let workOutDate = new Date(workoutDay?.workoutDate);
              workOutDate = workOutDate?.toLocaleDateString();
              return (
                <>
                  <div className="single-day-container">
                    <div className="day-head">
                      <p> {workoutDay?.workoutDay} </p>
                      <p> {workOutDate} </p>
                    </div>
                    <div className="day-workouts-container">
                      {workoutDay?.innerWorkout?.map((workout) => (
                        <>
                          <div className="day-workouts-content">
                            <h2> {workout?.workoutName} </h2>
                            <p className="desc"> {workout?.description} </p>
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
                                      {exercise?.sets?.map((set) => (
                                        <>
                                          <p>
                                            {set?.rest_time} mins | {set?.lebs}{" "}
                                            lebs |{set?.reps} reps
                                          </p>
                                        </>
                                      ))}
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
                          <button
                            className="edit"
                            onClick={() => {
                              setIsModalOpen(true);
                              setSelectedWokoutDay(workoutDay);
                              handleEditWorkout(workoutDay?.innerWorkout[0]);
                              // handleSingleWorkoutEditSubmit();
                              handleSingleWorkoutSubmit();
                            }}
                          >
                            Edit
                          </button>
                        </div>
                      ) : isDateGreaterThanOrEqualToToday(
                          workoutDay?.workoutDate
                        ) ? (
                        <button
                          onClick={() => {
                            setSelectedWokoutDay(workoutDay);
                            setIsModalOpen(true);
                          }}
                        >
                          Add a session
                        </button>
                      ) : null}
                    </div>
                  </div>
                </>
              );
            })}

            {!isLastDayOfMonth(
              clientPlan?.length
                ? clientPlan[clientPlan?.length - 1]?.workoutDate
                : null
            ) ? (
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
              <h2>{selectedWorkout ? "Edit" : "Add"} Workout </h2>
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
                  {isFormSubmitted &&
                    !selectedWorkout &&
                    errors.workoutName && (
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
                  {isFormSubmitted &&
                    !selectedWorkout &&
                    errors.description && (
                      <span className="error_email">{errors.description}</span>
                    )}
                </div>
                <div className="input-group select-and-add-exercise">
                  <Select
                    style={{
                      width: "80%",
                    }}
                    defaultValue="Choose an exercise"
                    placeholder="Choose exercises"
                    mode="multiple"
                    onChange={(value) => {
                      selectedTag(value);
                      handleInputChange({
                        target: {
                          name: "exercises",
                          value: value,
                        },
                      });
                    }}
                    showSearch={false}
                    value={formValues?.exercises}
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
                    // options={
                    //   allExcercises.map((exercise) => ({
                    //     value: exercise?._id,
                    //     label: exercise?.exercise_name,
                    //   })) || []
                    // }
                  >
                    {allExcercises?.map((item) => (
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
                          setShowSets(false);
                        }}
                        style={{ cursor: "pointer" }}
                        className={
                          activeTag === item?._id ? "tag active" : "tag"
                        }
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

                  {/* -----------------------sets----------------------- */}

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
                        <input
                          disabled
                          placeholder="No. of sets"
                          value={incDec}
                        />
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
                          // onClick={handleShow}
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
                                  value={formValues?.sets[index]?.parameter}
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
                                  el.name ===
                                    formValues?.sets[index]?.parameter &&
                                  (formValues?.sets[index]?.parameter !==
                                  "reps" ? (
                                    <>
                                      <div
                                        className="input-group"
                                        style={{ marginTop: "20px" }}
                                      >
                                        <label style={{ color: "#000" }}>
                                          {" "}
                                          {el.label}{" "}
                                        </label>
                                        <input
                                          type="number"
                                          value={
                                            formValues?.sets[index]?.[
                                              el?.name
                                            ] || ""
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

                                        {!formValues?.sets[index]?.[
                                          el?.name
                                        ] && (
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
                                              formValues?.sets[index]?.reps ||
                                              ""
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
                                              formValues?.sets[index]?.lebs ||
                                              ""
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
                                          formValues?.sets[index]?.rest_time ||
                                          ""
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
          <Modal
            title="Add new exercise"
            open={isAddExerciseModalOpen}
            onOk={handleAddExerciseOk}
            onCancel={handleAddExerciseCancel}
          >
            <AddNewExerciseModal />
          </Modal>
        </>
      )}

      {activeTabs === "Message" && (
        <Message chatId={clientDetails?.chatroomId} />
      )}
      <Modal
        centered
        open={showWorkoutModal}
        onOk={() => {
          setShowWorkoutModal(false);
          setSelectedWorkout(null);
        }}
        onCancel={() => {
          setShowWorkoutModal(false);
          setSelectedWorkout(null);
        }}
      >
        <div className="single-workout-container">
          <div className="workout-header">
            <div className="workout-detail-item">
              <p>Name</p> <h4>{selectedWorkout?.workoutName}</h4>
            </div>
          </div>
          <div className="workout-detail-item">
            <p>Description</p> <h4>{selectedWorkout?.description}</h4>
          </div>
          <div className="workout-detail-item">
            <p>Exercises</p>
            <div className="exercises-container">
              {selectedWorkout?.exercise?.map((excercise) => {
                return (
                  <>
                    <span>
                      {excercise?.exercise_name}
                      <img
                        onClick={() => {
                          navigate(
                            `/library/exercise-details/${excercise?._id}`
                          );
                        }}
                        src={Eye}
                        alt=""
                      />
                    </span>
                  </>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ClientDetails;
