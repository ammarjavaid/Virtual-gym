import React, { useEffect, useState } from "react";
import "./gallery-videos.scss";
import Topbar from "../../../components/topbar/Topbar";
import { ApiCall } from "../../../Services/Apis";
import {
  Delete,
  Edit_Icon,
  Exercise_Details,
  Eye,
  Filter,
  Search,
} from "../../../assets";
import { Empty, Pagination, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import VideoIframe from "../../../common/VideoIframe";
import { setLoader } from "../../../Redux/actions/GernalActions";
import Video_gallery_table from "../../../components/video-gallery-table/Video_gallery_table";
import Deleted_video_gallery_table from "../../../components/video-gallery-table/Deleted_video_gallery_table";
import usePermissionCheck from "../../../../utils/usePermissionCheck";

const Gallery_Videos = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { checkSubPermissions } = usePermissionCheck();

  const { id } = useParams();

  console.log(id);

  const token = useSelector((state) => state.auth.userToken);

  const [showBtn, setShowBtn] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [allGalleryVideos, setAllGalleryVideos] = useState([]);
  const [search, setSearch] = useState("");

  const filterbtnClick = () => {
    setShowBtn(!showBtn);
  };

  const handleActive = (type) => {
    setActiveTab(type);
  };

  const showModalEdit = (el) => {
    setIsModalOpenEdit(true);
  };
  //   try {
  //     dispatch(setLoader(true));
  //     const res = await ApiCall({
  //       params: "",
  //       route: `video/change_video_status/${id}&${status} `,
  //       verb: "put",
  //       token: token,
  //     });

  //     if (res?.status == "200") {
  //       dispatch(setLoader(false));
  //       console.log(res.response);
  //       getAllGalleryVideos();
  //       console.log("working", getAllGalleryVideos());
  //     } else {
  //       console.log("error", res.response);
  //       dispatch(setLoader(false));
  //     }
  //   } catch (e) {
  //     dispatch(setLoader(false));
  //     console.log("Error getting categories -- ", e.toString());
  //   }
  // };

  const deletePermanently = async (id) => {
    try {
      dispatch(setLoader(true));

      const res = await ApiCall({
        params: "",
        route: `exercisevideo/delete_exercise_video/${id} `,
        verb: "delete",
        token: token,
      });

      if (res?.status == "200") {
        console.log(res?.response);
        message.success(res?.response?.message);
        getAllGalleryVideos();
        dispatch(setLoader(false));
      } else {
        console.log("error", res.response);
        dispatch(setLoader(false));
      }
    } catch (e) {
      console.log("Error editing category -- ", e.toString());
    }
  };

  const getAllGalleryVideos = async () => {
    try {
      dispatch(setLoader(true));
      const res = await ApiCall({
        params: "",
        route: "exercisevideo/all_exercise_videos",
        verb: "get",
        token: token,
      });

      if (res?.status == "200") {
        dispatch(setLoader(false));
        setAllGalleryVideos(res?.response?.video_list);
        // console.log(res?.response, "108");
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
    getAllGalleryVideos();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const filterData = allGalleryVideos.filter((user) =>
    JSON.stringify(user)?.toString()?.toLowerCase()?.includes(search)
  );

  const viewFolderVideos = async () => {
    try {
      const res = await ApiCall({
        params: "",
        route: `exercisevideo/detail_exercise_video/${id}`,
        verb: "get",
        token: token,
      });
      console.log(res, "res");
      if (res?.status == 200) {
        // setFolderDetail(res?.response?.video?.videos);
        // setPageTitle(res?.response?.video);
      } else {
        console.log(res?.response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    viewFolderVideos();
  }, []);

  return (
    <>
      <Topbar title="Exercise Videos" arrow={true} />
      <div className="video-head">
        <div className="video-head-left">
          {/* for desktop  */}

          <div className="input">
            <img src={Search} alt="" />
            <input type="text" placeholder="Search" onChange={handleChange} />
          </div>

          {/* for mobile  */}
        </div>
        {checkSubPermissions("gallery-videos", "addVideos")?.status ? (
          <div className="video-head-right">
            <button
              className="add-client"
              onClick={() =>
                navigate(
                  `/all-category-videos/gallery-videos/add-new-video/${id}`
                )
              }
            >
              Add video
            </button>
          </div>
        ) : null}
      </div>

      <div className="video-gallery-table">
        <Video_gallery_table
          allGalleryVideos={filterData}
          deletePermanently={deletePermanently}
        />
      </div>
    </>
  );
};

export default Gallery_Videos;
