import React, { useEffect, useState } from "react";
import Topbar from "../../../components/topbar/Topbar";
import VideoIframe from "../../../common/VideoIframe";
import { useNavigate, useParams } from "react-router-dom";
import { ApiCall } from "../../../Services/Apis";
import { useDispatch, useSelector } from "react-redux";
import { Delete, Edit_Icon, Eye, Search } from "../../../assets";
import ListingOFVideos from "../../../components/skills-video-table/ListingOFVideos";
import ListingOfExerciseVideos from "../../../components/video-gallery-table/ListingOfExerciseVideos";
import usePermissionCheck from "../../../../utils/usePermissionCheck";
import { setLoader } from "../../../Redux/actions/GernalActions";

const SingleCategoryDetail = () => {
  const { id } = useParams();
  // console.log(id, "id");

  const token = useSelector((state) => state.auth.userToken);
  const naviagte = useNavigate();
  const dispatch = useDispatch();

  const [folderDetail, setFolderDetail] = useState([]);
  const [folderDetailSearched, setFolderDetailSearched] = useState([]);

  const [pageTitle, setPageTitle] = useState([]);
  const [search, setSearch] = useState();
  const { checkSubPermissions } = usePermissionCheck();

  const viewFolderVideos = async () => {
    try {
      dispatch(setLoader(true));
      const res = await ApiCall({
        params: "",
        route: `exercisevideo/all_exercise_videos`,
        verb: "get",
        token: token,
      });
      if (res?.status == 200) {
        setFolderDetailSearched(res?.response?.folder_list);
        console.log(res?.response);
        setFolderDetail(res?.response?.folder_list);
        // setPageTitle(res?.response?.video);
        dispatch(setLoader(false));
      } else {
        console.log(res?.response);
        dispatch(setLoader(false));
      }
    } catch (error) {
      console.log(error);
      dispatch(setLoader(false));
    }
  };

  useEffect(() => {
    viewFolderVideos();
  }, []);

  // console.log(folderDetail, "folderDetail category");

  const handleChange = (e) => {
    if (e.target.value) {
      const filterfolder = folderDetail.filter((user) => {
        return (
          user?.title?.includes(e.target.value) ||
          user?.description?.includes(e.target.value)
        );
      });
      console.log(filterfolder);
      setFolderDetailSearched(filterfolder);
    } else {
      setFolderDetailSearched(folderDetail);
    }
  };

  // const filterfolder = folderDetail.filter(
  //   // (user) => console.log(user, "user")
  //   (user) => {
  //     console.log(user, "user");
  //     JSON.stringify(user)?.toString()?.toLowerCase()?.includes(search);
  //   }
  // );
  // const filterfolder = folderDetail.filter(
  //   // (user) => console.log(user, "user")
  //   (user) => JSON.stringify(user)?.toString()?.toLowerCase()?.includes(search)
  // );

  return (
    <>
      <Topbar title="Videos" arrow={true} />

      <div className="video-head">
        <div className="video-head-left">
          {/* for desktop  */}

          <div className="input">
            <img src={Search} alt="" />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={handleChange}
            />
          </div>

          {/* for mobile  */}
        </div>
        {checkSubPermissions("gallery-videos", "addVideos")?.status ? (
          <div className="video-head-right">
            <button
              className="add-client"
              onClick={() => naviagte(`/gallery-videos/add-new-video`)}
            >
              Add video
            </button>
          </div>
        ) : null}
      </div>

      <div className="video-gallery-table">
        <ListingOfExerciseVideos
          // folderDetail={folderDetail}
          folderDetail={folderDetailSearched}
          viewFolderVideos={viewFolderVideos}
        />
      </div>
      {/* listing of videos table  */}
    </>
  );
};

export default SingleCategoryDetail;
