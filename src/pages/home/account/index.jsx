import React, { useRef, useState } from "react";
import "./my_account.scss";
import Topbar from "../../../components/topbar/Topbar";
import { Arrow_Right, Edit, Profile } from "../../../assets";
import { useNavigate } from "react-router-dom";
import { Pagination, message } from "antd";
import { ApiCall } from "../../../Services/Apis";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../../../Redux/actions/GernalActions";
import { setSingleUser } from "../../../Redux/actions/AuthActions";

const Account = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.userToken);
  const user = useSelector((state) => state.auth.userData);

  const [activeTabs, setActiveTabs] = useState("settings");
  const [formData, setFormData] = useState({
    full_name: user?.full_name,
    email: user?.email,
    profile_image: null,
  });
  const [imageState, setImageState] = useState(null);
  const [crop, setCrop] = useState({ aspect: 1 / 1 });
  const [croppedImage, setCroppedImage] = useState(null);
  const imgRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageUpload = (event) => {
    const file = event.target;

    if (file) {
      // setImageState(URL.createObjectURL(file.files[0]));
      const blob = new Blob([file?.files[0]], { type: file?.files[0]?.type });

      // const selectedImage = URL.createObjectURL(blob);
      // setImageState(selectedImage);
      const selectedImage = URL.createObjectURL(blob);
      setImageState(selectedImage);

      setFormData({
        ...formData,
        profile_image: blob,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoader(true));
      const params = new FormData();
      params.append("full_name", formData?.full_name);
      params.append("profile_image", formData?.profile_image);
      const res = await ApiCall({
        params: params,
        route: "admin/update_admin",
        verb: "put",
        token: token,
      });

      if (res?.status == "200") {
        dispatch(setLoader(false));
        navigate("/dashboard");
        dispatch(setSingleUser(res?.response?.user));
        message.success(res?.response?.message);
      } else {
        message.error("error", res.response);
        dispatch(setLoader(false));

        alert(res?.response?.message, [
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ]);
      }
    } catch (e) {
      console.log("login error -- ", e.toString());
    }
  };

  const handleTabClick = (type) => {
    setActiveTabs(type);
  };

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 1;

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
  };

  const myArray = [1];

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const dataToShow = myArray?.slice(startIndex, endIndex);

  console.log(imageState, "imageState");

  return (
    <>
      <Topbar title="My account" />
      <div className="tabs">
        <ul>
          <li
            onClick={() => setActiveTabs("settings")}
            className={activeTabs === "settings" ? "" : ""}
          >
            Account settings
          </li>
        </ul>
      </div>

      {activeTabs === "settings" && (
        <>
          <div className="account__settings">
            <div className="form-left">
              <label className="image-upload-button" htmlFor="image-upload">
                {imageState ? (
                  <img
                    src={imageState}
                    alt="uploaded"
                    className="selected-img"
                  />
                ) : (
                  <img
                    src={
                      formData.profile_image
                        ? formData.profile_image
                        : user?.profile_image || Profile
                    }
                    className="selected-img"
                    alt="default"
                  />
                )}

                <div className="overlay">
                  <img
                    src={Edit}
                    className="icon"
                    style={{ width: "40px", height: "40px" }}
                  />
                </div>
              </label>

              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
            <form className="inputs" onSubmit={handleSubmit}>
              <div className="box">
                <input
                  type="text"
                  placeholder="Full name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="box">
                <input
                  disabled
                  type="text"
                  placeholder="abc.john@email.com"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="buttons">
                <p onClick={() => navigate("/change-password")}>
                  Change password
                </p>
                <button type="submit" className="update">
                  Update
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {activeTabs === "activity" && (
        <>
          {myArray.map((el) => (
            <>
              <div className="activity__log">
                <div className="today">
                  <h1> Today </h1>
                  <div className="today_box">
                    <div className="single_log">
                      <p>
                        Lorem ipsum dolor sit amet consteur amet lilli mayheri
                      </p>
                      <img src={Arrow_Right} alt="" />
                    </div>
                    <div className="single_log">
                      <p>
                        Lorem ipsum dolor sit amet consteur amet lilli mayheri
                      </p>
                      <img src={Arrow_Right} alt="" />
                    </div>
                    <div className="single_log">
                      <p>
                        Lorem ipsum dolor sit amet consteur amet lilli mayheri
                      </p>
                      <img src={Arrow_Right} alt="" />
                    </div>
                  </div>
                </div>
                <div className="today">
                  <h1> 26 Apr, 2023 </h1>
                  <div className="today_box">
                    <div className="single_log">
                      <p>
                        Lorem ipsum dolor sit amet consteur amet lilli mayheri
                      </p>
                      <img src={Arrow_Right} alt="" />
                    </div>
                    <div className="single_log">
                      <p>
                        Lorem ipsum dolor sit amet consteur amet lilli mayheri
                      </p>
                      <img src={Arrow_Right} alt="" />
                    </div>
                    <div className="single_log">
                      <p>
                        Lorem ipsum dolor sit amet consteur amet lilli mayheri
                      </p>
                      <img src={Arrow_Right} alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </>
          ))}

          <Pagination
            total={myArray?.length}
            defaultPageSize={pageSize}
            current={currentPage}
            onChange={handlePageChange}
          />
        </>
      )}
    </>
  );
};

export default Account;
