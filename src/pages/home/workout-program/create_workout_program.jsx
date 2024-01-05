import React, { useCallback, useEffect, useState } from "react";
import "./program-details.scss";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { Delete, Profile } from "../../../assets";
import Topbar from "../../../components/topbar/Topbar";
import { ApiCall } from "../../../Services/Apis";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../../../Redux/actions/GernalActions";
import { Modal, Select } from "antd";

// const pre_events = [
//   {
//     id: "1",
//     title: "All Day Event very long title",
//     start: new Date(),
//     end: new Date(new Date().setDate(new Date().getDate())),
//   },
// ];

const localizer = momentLocalizer(moment);

const inititalState = {
  workoutName: "",
  description: "",
  exercises: [],
  start: "",
  end: "",
};

const Create_workout_program = () => {
  const DnDCalendar = withDragAndDrop(Calendar);
  const { id } = useParams();
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.userToken);
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState(inititalState);

  const handleInputChange = (e) => {
    const { value, name } = e.target;
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

  const handleSingleWorkoutSubmit = () => {};

  const handleSelectSlot = useCallback(
    ({ start, end }) => {
      // console.log("hello");
      const title = window.prompt("New Event name");
      if (title) {
        setEvents((prev) => [
          ...prev,
          { start, end, title, id: events.length + 1 },
        ]);
      }
    },
    [setEvents]
  );

  const getWorkoutProgram = async () => {
    try {
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

  useEffect(() => {
    if (id) {
      getWorkoutProgram();
    } else {
      navigate(-1);
    }
  }, [id]);

  // console.log(data, "data");

  const CustomMonthEvent = ({ event }) => {
    return (
      <div className="single-workout-tile-in-calendar">
        <p>{event.title}</p>
        <img src={Delete} alt="del" />
      </div>
    );
  };

  const onSelectEvent = (e) => {
    console.log(e);
  };

  const onEventDrop = useCallback(
    ({ event, start, end }) => {
      setEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {};
        const filtered = prev.filter((ev) => ev.id !== event.id);
        return [...filtered, { ...existing, start, end }];
      });
    },
    [setEvents]
  );

  const onEventResize = useCallback(
    ({ event, start, end }) => {
      setEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {};
        const filtered = prev.filter((ev) => ev.id !== event.id);
        return [...filtered, { ...existing, start, end }];
      });
    },
    [setEvents]
  );

  return (
    <>
      <Topbar
        title="Workout program"
        titleOne="Workout programs"
        titleTwo="Workout program"
        arrow={true}
      />
      <div className="profile-name">
        <img src={data?.program_Image || Profile} alt="" />
        <p>{data?.title}</p>
      </div>
      <div className="calender">
        <DnDCalendar
          localizer={localizer}
          events={events}
          style={{ height: 500 }}
          views={["month"]}
          allDayAccessor={(event) => true}
          resizableAccessor={(event) => true}
          draggableAccessor={(event) => true}
          resizable
          popup
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={onSelectEvent}
          onEventDrop={onEventDrop}
          onEventResize={onEventResize}
          components={{
            month: {
              event: CustomMonthEvent,
            },
          }}
        />
      </div>
      <Modal
        centered
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="modal">
          <h2> Edit category </h2>
          <form className="create-workout-form">
            <label> Program title </label>
            <input
              type="text"
              name="title"
              placeholder="Program title"
              onChange={handleInputChange}
              value={formValues?.title}
            />
            <label> No. of days </label>
            <input
              type="number"
              name="no_of_days"
              placeholder="No. of days"
              onChange={handleInputChange}
              value={formValues?.no_of_days}
            />
            <label> Program description </label>
            <textarea
              type="text"
              name="description"
              placeholder="Program description"
              onChange={handleInputChange}
              value={formValues?.description}
            />
            <Select
              defaultValue="Choose an exercise"
              style={{
                width: 120,
              }}
              multiple={true}
              options={[
                {
                  value: "skill",
                  label: "Skill",
                },
                {
                  value: "exercise",
                  label: "Exercise",
                },
              ]}
              name="exercises"
              value={formValues.exercises}
              onChange={(value) =>
                handleInputChange({
                  target: {
                    name: "exercises",
                    value: value,
                  },
                })
              }
            />

            <div className="buttons">
              <p className="cancel" onClick={handleCancel}>
                Cancel
              </p>
              <p
                className="add-category"
                type="submit"
                onClick={handleSingleWorkoutSubmit}
              >
                Add new program
              </p>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default Create_workout_program;
