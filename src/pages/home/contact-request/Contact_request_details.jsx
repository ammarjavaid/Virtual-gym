import React, { useEffect, useState } from "react";
import "./Contact_request_details.scss";
import Topbar from "../../../components/topbar/Topbar";
import { useNavigate, useParams } from "react-router";
import { ApiCall } from "../../../Services/Apis";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../../../Redux/actions/GernalActions";

const Contact_request_details = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [singleContact, setSingleContact] = useState([]);

  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.userToken);

  const getSingleContactList = async () => {
    try {
      dispatch(setLoader(true));
      const res = await ApiCall({
        params: "",
        route: `contact/detail_contact/${id}`,
        verb: "get",
        token: token,
      });

      if (res?.status == "200") {
        dispatch(setLoader(false));
        const contact = res?.response;
        setSingleContact(contact?.contact);
      } else {
        console.log("error", res?.response);
        dispatch(setLoader(false));
        message.error(res.response?.message);
      }
    } catch (e) {
      dispatch(setLoader(false));
      console.log("error -- ", e.toString());
    }
  };

  useEffect(() => {
    if (id) {
      getSingleContactList();
    }
  }, [id]);
  // console.log(singleContact);

  return (
    <>
      <Topbar
        title="Contact request details"
        titleOne="Contact requests"
        titleTwo="Contact request details"
        arrow={true}
      />

      <div className="Contact-request-details">
        <div className="Contact-request-details-name">
          <p className="Contact-request-details-name-left"> Full name </p>
          <p className="Contact-request-details-name-right">
            {" "}
            {singleContact.full_name}{" "}
          </p>
        </div>
        <div className="Contact-request-details-email">
          <p className="Contact-request-details-name-left"> Email address </p>
          <p className="Contact-request-details-name-right">
            {singleContact.email}
          </p>
        </div>
        <div className="Contact-request-details-description">
          <p className="Contact-request-details-name-left">
            Description / Details
          </p>
          <p className="Contact-request-details-name-right">
            {singleContact.description}
          </p>
        </div>

        <div
          className="contact-request-details-btn"
          onClick={() => navigate(-1)}
        >
          <p className="contact-back-btn"> Back </p>
        </div>
      </div>
    </>
  );
};

export default Contact_request_details;
