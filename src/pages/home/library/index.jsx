import React, { useEffect, useState } from "react";
import "./library.scss";
import Topbar from "../../../components/topbar/Topbar";
import { useLocation, useNavigate } from "react-router-dom";
import { Delete, Edit_Icon, Filter, Search } from "../../../assets";
import { Empty, Modal, Pagination, message } from "antd";
import ExerciseTable from "../../../components/exercise-table/ExerciseTable";
import { ApiCall } from "../../../Services/Apis";
import { setLoader } from "../../../Redux/actions/GernalActions";
import { useDispatch, useSelector } from "react-redux";
import LibraryWorkoutTable from "../../../components/library-workout-table/LibraryWorkoutTable";
import usePermissionCheck from "../../../../utils/usePermissionCheck";

const Library = () => {
  const token = useSelector((state) => state.auth.userToken);
  const { checkSubPermissions } = usePermissionCheck();

  const dispatch = useDispatch();
  const [activeCategory, setActiveCategory] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [allExcercises, setAllExcercises] = useState([]);
  const [allFilterData, setAllFilterData] = useState([]);
  const exercisesList = checkSubPermissions("library", "exercisesList");
  const addExercises = checkSubPermissions("library", "addExercises");

  const [formData, setFormData] = useState({
    category_name: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoader(true));

      const res = await ApiCall({
        params: formData,
        route: "category/add_category",
        verb: "post",
        token: token,
      });

      if (res?.status == "200") {
        dispatch(setLoader(false));
        console.log("Form data submitted:", formData);
        handleCancel();
        message.success(res.response?.message);
        getAllCategories();
      } else {
        console.log("error", res.response);
        dispatch(setLoader(false));

        alert(res?.response?.message, [
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ]);
      }
    } catch (e) {
      console.log("error -- ", e.toString());
    }
  };

  useEffect(() => {
    getAllCategories();
    getAllExcercises();
  }, []);

  const getAllCategories = async () => {
    try {
      dispatch(setLoader(true));
      const res = await ApiCall({
        params: "",
        route: "category/all_categories",
        verb: "get",
        token: token,
      });

      if (res?.status == "200") {
        setAllCategories(res.response?.category_list);
        dispatch(setLoader(false));
      } else {
        console.log("error", res.response);
      }
    } catch (e) {
      console.log("Error getting clients -- ", e.toString());
      dispatch(setLoader(false));
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
        setAllExcercises(res.response?.exercise_list);
        setAllFilterData(res.response?.exercise_list);
        dispatch(setLoader(false));
      } else {
        console.log("error", res.response);
        dispatch(setLoader(false));
      }
    } catch (e) {
      dispatch(setLoader(false));

      console.log("Error getting clients -- ", e.toString());
    }
  };

  const updateCategoriesStatus = async (id, status) => {
    try {
      dispatch(setLoader(true));

      const res = await ApiCall({
        params: "",
        route: `category/change_category_status/${id}&${status} `,
        verb: "put",
        token: token,
      });

      if (res?.status == "200") {
        dispatch(setLoader(false));
        console.log(res.response);
        getAllCategories();
      } else {
        console.log("error", res.response);
        dispatch(setLoader(false));
      }
    } catch (e) {
      console.log("Error getting categories -- ", e.toString());
    }
  };

  const updateCategory = async () => {
    try {
      dispatch(setLoader(true));
      const res = await ApiCall({
        params: { category_name: activeCategory?.category_name },
        route: `category/edit_category/${activeCategory?._id} `,
        verb: "put",
        token: token,
      });

      if (res?.status == "200") {
        console.log(res.response);
        handleOkEdit();
        dispatch(setLoader(false));
        getAllCategories();
      } else {
        console.log("error", res.response);
        dispatch(setLoader(false));
      }
    } catch (e) {
      dispatch(setLoader(false));

      console.log("Error editing category -- ", e.toString());
    }
  };

  const deletePermanently = async (id) => {
    try {
      dispatch(setLoader(true));

      const res = await ApiCall({
        params: "",
        route: `exercise/delete_exercise/${id} `,
        verb: "put",
        token: token,
      });

      if (res?.status == "200") {
        console.log(res.response);
        getAllExcercises();
        dispatch(setLoader(false));
      } else {
        console.log("error", res.response);
        dispatch(setLoader(false));
      }
    } catch (e) {
      console.log("Error editing category -- ", e.toString());
    }
  };

  const handleTabClick = (type) => {
    setActiveTabs(type);
  };

  const naviagte = useNavigate();

  const [activeTabs, setActiveTabs] = useState("exercises");
  // const [activeTab, setActiveTab] = useState("all");

  const handleTabActive = (type) => {
    setActiveTabs(type);
    naviagte(`?activeTab=${type}`);
  };

  const location = useLocation();
  // const searchParams = new URLSearchParams(location.search);
  // const queryParams = new URLSearchParams(window.location.search);
  // const valueType = searchParams.get('type');
  // console.log(location);

  let array = [];
  for (let i = 0; i < 40; i++) {
    array[i] = i;
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const showModalEdit = (el) => {
    setIsModalOpenEdit(true);
    setActiveCategory(el);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleOkEdit = () => {
    setIsModalOpenEdit(false);
  };
  const handleCancelEdit = () => {
    setIsModalOpenEdit(false);
  };

  const [search, setSearch] = useState("");

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const filterData = allExcercises.filter((user) =>
    // user.exercise_name.toLowerCase().includes(search)
    JSON.stringify(user)?.toString()?.toLowerCase()?.includes(search)
  );

  //category

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToDisplay = allCategories
    ?.filter((category) => category?.isDeleted === (activeTabs === "deleted"))
    ?.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const [showBtn, setShowBtn] = useState(false);

  const filterbtnClick = () => {
    setShowBtn(!showBtn);
  };

  return (
    <>
      <Topbar title="Library" />
      <div className="library">
        <div className="library-tabs">
          <ul>
            {/* <li
              onClick={() => setActiveTabs("categories")}
              className={activeTab === "categories" ? "active" : ""}
            >
              Categories
            </li> */}
            {/* <li
              onClick={() => handleTabActive("workout")}
              className={activeTabs === "workout" ? "active" : ""}
            >
              Workout
            </li> */}
            <li
              onClick={() => handleTabActive("exercises")}
              className={activeTabs === "exercises" ? "" : ""}
            >
              Exercises
            </li>
          </ul>
        </div>

        {/* {activeTabs === 'workout' && (
          <>
            <div className='library-head'>
              <div className='library-head-left'>
                <div className='input'>
                  <img src={Search} alt='' />
                  <input
                    type='text'
                    placeholder='Search'
                    value={search}
                    name='search'
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className='library-head-right'>
                <button
                  className='add-client'
                  onClick={() => naviagte('/add-new-workout')}
                >
                  Add workout
                </button>
              </div>
            </div>

            <div className='exercise-table'>
              <LibraryWorkoutTable data={allFilterData} />
            </div>
          </>
        )} */}

        {activeTabs === "exercises" && (
          <>
            <div className="exercise-head">
              <div className="input-exercise">
                <img src={Search} alt="" />
                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  name="search"
                  onChange={handleChange}
                />
              </div>

              {addExercises?.status ? (
                <div
                  className="exercise-btn"
                  onClick={() => naviagte("/library/add-new-exercise")}
                >
                  <p> Add exercise </p>
                </div>
              ) : null}
            </div>
            {exercisesList?.status ? (
              <div className="exercise-table">
                <ExerciseTable
                  data={filterData}
                  deletePermanently={deletePermanently}
                />
              </div>
            ) : null}
          </>
        )}
      </div>

      <Modal
        centered
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="modal">
          <h2> Add new category </h2>
          <input
            type="text"
            placeholder="Full name"
            name="category_name"
            value={formData.category_name}
            onChange={handleInputChange}
          />
          <div className="buttons">
            <p className="cancel" onClick={() => setIsModalOpen(false)}>
              Cancel
            </p>
            <p className="add-category" onClick={handleSubmit}>
              {" "}
              Add category{" "}
            </p>
          </div>
        </div>
      </Modal>

      <Modal
        centered
        open={isModalOpenEdit}
        onOk={handleOkEdit}
        onCancel={handleCancelEdit}
      >
        <div className="modal">
          <h2> Edit category </h2>
          <input
            type="text"
            placeholder="Category name"
            value={activeCategory?.category_name}
            onChange={(val) => {
              console.log(val);
              setActiveCategory((prev) => ({
                ...activeCategory,
                category_name: val.target.value,
              }));
            }}
          />
          <div className="buttons">
            <p className="cancel" onClick={() => setIsModalOpenEdit(false)}>
              Cancel
            </p>
            <p className="add-category" onClick={updateCategory}>
              {" "}
              Update{" "}
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Library;
