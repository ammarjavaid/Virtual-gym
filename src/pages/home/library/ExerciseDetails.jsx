import React, { useEffect, useState } from "react";
import "./exerciseDetails.scss";
import Topbar from "../../../components/topbar/Topbar";
import { Exercise_Details } from "../../../assets";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ApiCall } from "../../../Services/Apis";
import { setLoader } from "../../../Redux/actions/GernalActions";
import VideoIframe from "../../../common/VideoIframe";
import { message } from "antd";

const ExerciseDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = useSelector((state) => state.auth.userToken);
  const [exercise, setExercise] = useState(null);
  const dispatch = useDispatch();

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
        setExercise(res.response?.exercise);
        console.log(exercise, "exercise");
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
    }
  }, [id]);

  console.log(exercise, "exercise");

  return (
    <>
      <Topbar
        title="Exercise details"
        titleOne="Library"
        titleTwo="Exercise details"
        arrow={true}
      />
      <div className="exercise-details">
        <VideoIframe
          className="exercise-video-iframe"
          height={"300px"}
          url={exercise?.video}
        />
        <div className="exercise-details-content">
          <div className="exercise-name">
            <p className="exercise-name-left"> Exercise name </p>
            <p className="exercise-name-right"> {exercise?.exercise_name} </p>
          </div>
          {/* <div className="exercise-category">
            <p className="exercise-name-left"> Category </p>
            <p className="exercise-name-right">{exercise?.category}</p>
          </div> */}
          <div className="exercise-time">
            <p className="exercise-name-left"> Exercise time </p>
            <p className="exercise-name-right">{exercise?.exercise_time}</p>
          </div>
          <div className="exercise-description">
            <p className="exercise-name-left"> Description / Details </p>
            <p className="exercise-name-right">{exercise?.description}</p>
          </div>
          {exercise?.notes === "" ? null : (
            <div className="exercise-description">
              <p className="exercise-name-left"> Notes </p>
              <p className="exercise-name-right">{exercise?.notes}</p>
            </div>
          )}
          <div className="exercise-sets">
            <p className="exercise-name-left"> No. of sets </p>
            <p className="exercise-name-left">{exercise?.no_of_sets}</p>
          </div>
        </div>

        {/* //--------step-1------------// */}

        {exercise?.sets?.map((set, index) => (
          <>
            <div className="set-one">
              <p> Set {index + 1} </p>
              {/* {set?.reps && set?.lebs > 0 && (
                <div className="set-one-content">
                  <div className="set-one-left">
                    <p className="sub-left">Reps</p>
                    <p className="sub-right">{set?.reps}</p>
                  </div>
                  <div className="set-one-right">
                    <p className="sub-left">Lbs</p>
                    <p className="sub-right">{set?.lebs}</p>
                  </div>
                </div>
              )} */}
              {set?.parameter === "reps" && (
                <div className="set-one-content">
                  <div className="set-one-left">
                    <p className="sub-left">Reps</p>
                    <p className="sub-right">{set?.reps}</p>
                  </div>
                  <div className="set-one-right">
                    <p className="sub-left">Lbs</p>
                    <p className="sub-right">{set?.lebs}</p>
                  </div>
                </div>
              )}

              {set?.parameter === "weight" && (
                <div className="weight-field">
                  <p className="sub-left">Weight</p>
                  <p className="sub-right">{set?.weight}</p>
                </div>
              )}

              {set?.parameter === "seconds" && (
                <div className="seconds-field">
                  <p className="sub-left">Seconds</p>
                  <p className="sub-right">{set?.seconds}</p>
                </div>
              )}

              {set?.parameter === "distance" && (
                <div className="distance-field">
                  <p className="sub-left">Distance</p>
                  <p className="sub-right">{set?.distance}</p>
                </div>
              )}
            </div>
            {exercise?.sets?.length - 1 !== index && (
              <div className="rest-one">
                <p> Rest </p>
                <div className="rest-one-content">
                  <div className="rest-one-content-left">
                    <p> Time </p>
                  </div>
                  <div className="rest-one-content-right">
                    <p>{set?.rest_time}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        ))}

        <div className="exercise-details-btn-back">
          <button className="back-btn" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>
    </>
  );
};

export default ExerciseDetails;
