import React, { useEffect, useState } from "react";
import "./SingleCategoryDetailPage.scss";
import Topbar from "../../../components/topbar/Topbar";
import VideoIframe from "../../../common/VideoIframe";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ApiCall } from "../../../Services/Apis";
import { useDispatch, useSelector } from "react-redux";
import { Delete, Edit_Icon, Eye, Search } from "../../../assets";
import ListingOFVideos from "../../../components/skills-video-table/ListingOFVideos";
import { setLoader } from "../../../Redux/actions/GernalActions";
import usePermissionCheck from "../../../../utils/usePermissionCheck";

const SingleCategoryDetail = () => {
  const { id, objId } = useParams();
  console.log(id, objId, "id");

  const token = useSelector((state) => state.auth.userToken);
  const naviagte = useNavigate();

  const { checkSubPermissions } = usePermissionCheck();
  const [folderDetail, setFolderDetail] = useState([]);
  const [folderDetailSearched, setFolderDetailSearched] = useState([]);
  const [pageTitle, setPageTitle] = useState([]);
  const [search, setSearch] = useState();

  const dispatch = useDispatch();

  const location = useLocation();
  const receivedData = location.state;

  console.log(receivedData, "receivedData");
  console.log(receivedData?._id, "receivedData");

  const viewFolderVideos = async () => {
    try {
      dispatch(setLoader(true));
      const res = await ApiCall({
        params: { childId: objId },
        route: `skillvideo/detail_child/${id}`,
        verb: "post",
        token: token,
      });
      if (res?.status == 200) {
        console.log(res?.response?.child_folder?.videos);
        setFolderDetailSearched(res?.response?.child_folder?.videos);
        setFolderDetail(res?.response?.child_folder?.videos);
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
    if (objId) {
      viewFolderVideos();
    }
  }, [objId]);

  console.log(folderDetail, "folderDetail");

  const handleChange = (e) => {
    if (e.target.value) {
      const filterfolder = folderDetail.filter((user) => {
        return (
          user?.title?.includes(e.target.value) ||
          user?.description?.includes(e.target.value)
        );
      });
      setFolderDetailSearched(filterfolder);
    } else {
      setFolderDetailSearched(folderDetail);
    }
  };

  // const handleChange = (e) => {
  //   setSearch(e.target.value);
  // };

  // const filterData = folderDetail.filter((user) =>
  //   JSON.stringify(user)?.toString()?.toLowerCase()?.includes(search)
  // );

  return (
    <>
      {/* <Topbar title={pageTitle?.category} arrow={true} /> */}
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
        {checkSubPermissions("skills-training", "addVideos")?.status ? (
          <div className="video-head-right">
            <button
              className="add-client"
              onClick={() =>
                naviagte(
                  `/skills-training/sub-folders/all-videos/add-video/${id}/videos/${objId}`
                )
              }
            >
              Add video
            </button>
          </div>
        ) : null}
      </div>

      <div className="listing-video-table">
        <ListingOFVideos
          folderDetail={folderDetailSearched}
          // folderDetail={filterData}
          // folderDetail={folderDetail}
          viewFolder={viewFolderVideos}
        />
      </div>
      {/* listing of videos table  */}
    </>
  );
};

export default SingleCategoryDetail;
