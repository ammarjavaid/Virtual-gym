import React, { useState } from "react";
import "./workout_details.scss";
import Topbar from "../../../components/topbar/Topbar";
import { Exercise_Details, Toggle } from "../../../assets";
import { useNavigate } from "react-router-dom";

const Workout_details = () => {
  const [toggleShow, setToggleShow] = useState(false);

  const handleToggle = () => {
    setToggleShow(!toggleShow);
  };

  const navigate = useNavigate();

  return (
    <>
      <Topbar
        title="Workout details"
        titleOne="Library"
        titleTwo="Workout details"
        arrow={true}
      />

      <div className="top_boxs">
        <div className="workout-name-box">
          <p className="title-left"> Workout name </p>
          <p className="title-right"> Dolor sit </p>
        </div>
        <div className="workout-desc-box">
          <p className="desc-left"> Description / Details </p>
          <p className="desc-right">
            Lorem ipsum dolor sit amet consectetur. Ut iaculis ut dolor
            volutpat. Viverra leo platea enim nisl mattis est luctus in.
            Dignissim egestas fames urna massa purus aliquet at erat est. Ut dis
            auctor in quam dui. Feugiat.
          </p>
        </div>
      </div>

      <div className="exercise-toggle">
        <img
          src={Toggle}
          alt=""
          onClick={handleToggle}
          className={toggleShow ? "img" : "img-rotate"}
        />
        <h3> Exercise name </h3>
      </div>

      {toggleShow && (
        <>
          <div className="exercise-name-details">
            <img src={Exercise_Details} alt="" />
            <div className="exercise-name-details-boxes">
              <div className="box">
                <p className="detail-text-left">Workout name</p>
                <p className="detail-text-right">Dolor sit</p>
              </div>
              <div className="box">
                <p className="detail-text-left">Category</p>
                <p className="detail-text-right">Lorem ipsum</p>
              </div>
              <div className="box">
                <p className="detail-text-left">Workout time</p>
                <p className="detail-text-right">00:10:30</p>
              </div>
              <div className="box-desc">
                <p className="detail-text-left">Description / Details</p>
                <p className="detail-text-right">
                  Lorem ipsum dolor sit amet consectetur. Ut iaculis ut dolor
                  volutpat. Viverra leo platea enim nisl mattis est luctus in.
                  Dignissim egestas fames urna massa purus aliquet at erat est.
                  Ut dis auctor in quam dui. Feugiat.
                </p>
              </div>
              <div className="box">
                <p className="detail-text-left">No. of sets</p>
                <p className="detail-text-right">3</p>
              </div>

              <div className="set-1">
                <p className="set-1-title"> Set 1 </p>
                <div className="reps-lbs">
                  <div className="reps">
                    <p className="detail-text-left">Reps</p>
                    <p className="detail-text-right">12 rec.</p>
                  </div>
                  <div className="lbs">
                    <p className="detail-text-left">Lbs</p>
                    <p className="detail-text-right">-</p>
                  </div>
                </div>
              </div>
              <div className="rest">
                <p className="set-1-title"> Rest </p>
                <div className="time">
                  <p className="time-text-left">Time</p>
                  <p className="time-text-right">00:00:60</p>
                </div>
              </div>
              <div className="set-1">
                <p className="set-1-title"> Set 2 </p>
                <div className="reps-lbs">
                  <div className="reps">
                    <p className="detail-text-left">Reps</p>
                    <p className="detail-text-right">12 rec.</p>
                  </div>
                  <div className="lbs">
                    <p className="detail-text-left">Lbs</p>
                    <p className="detail-text-right">-</p>
                  </div>
                </div>
              </div>
              <div className="rest">
                <p className="set-1-title"> Rest </p>
                <div className="time">
                  <p className="time-text-left">Time</p>
                  <p className="time-text-right">00:00:60</p>
                </div>
              </div>
              <div className="set-1">
                <p className="set-1-title"> Set 1 </p>
                <div className="reps-lbs">
                  <div className="reps">
                    <p className="detail-text-left">Reps</p>
                    <p className="detail-text-right">12 rec.</p>
                  </div>
                  <div className="lbs">
                    <p className="detail-text-left">Lbs</p>
                    <p className="detail-text-right">-</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="btn-exercise-details">
              <p className="back-btn" onClick={() => navigate(-1)}>
                Back
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Workout_details;
