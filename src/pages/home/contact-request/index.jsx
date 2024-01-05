import React, { useEffect, useState } from "react";
import "./contact_request.scss";
import Topbar from "../../../components/topbar/Topbar";
import { Search } from "../../../assets";
import Contact_Request_table from "../../../components/contact-request-table/Contact_Request_table";
import { ApiCall } from "../../../Services/Apis";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";
import { setLoader } from "../../../Redux/actions/GernalActions";

const Contact_request = () => {
  const [allContactList, setAllContactList] = useState([]);
  const [search, setSearch] = useState();
  const [filteredData, setFilteredData] = useState([]);
  const token = useSelector((state) => state.auth.userToken);
  const dispatch = useDispatch();

  const getAllContactList = async () => {
    try {
      dispatch(setLoader(true));
      const res = await ApiCall({
        params: "",
        route: "contact/listing_contact",
        verb: "get",
        token: token,
      });

      if (res?.status == "200") {
        setAllContactList(res.response.contact_list);
        dispatch(setLoader(false));
      } else {
        console.log("error", res.response);
        dispatch(setLoader(false));
        message.error(res.response?.message);
      }
    } catch (e) {
      console.log("error -- ", e.toString());
      dispatch(setLoader(false));
    }
  };

  // const getSingleContact = async () => {
  //   try {
  //     // dispatch(setLoader(true));
  //     const res = await ApiCall({
  //       params: "",
  //       route: "contact/listing_contact",
  //       verb: "get",
  //       token: token,
  //     });

  //     if (res?.status == "200") {
  //       // dispatch(setLoader(false));
  //       setAllContactList(res.response.contact_list);
  //     } else {
  //       console.log("error", res.response);
  //       // dispatch(setLoader(false));
  //       message.error(res.response?.message);
  //     }
  //   } catch (e) {
  //     // dispatch(setLoader(false));
  //     console.log("error -- ", e.toString());
  //   }
  // };

  useEffect(() => {
    getAllContactList();
  }, []);

  useEffect(() => {
    setFilteredData(allContactList);
  }, [allContactList]);

  // console.log(allContactList);

  const handleChange = (e) => {
    setFilteredData(
      allContactList.filter((el) =>
        JSON.stringify(el)
          ?.toString()
          ?.toLowerCase()
          ?.includes(e.target.value.toLowerCase())
      )
    );
  };

  return (
    <>
      <Topbar title="Contact Requests" />
      <div className="contact-request-form">
        <img src={Search} alt="" />
        <input type="text" placeholder="Search" onChange={handleChange} />
      </div>
      <div className="contact-request">
        <Contact_Request_table allContactListData={filteredData} />
      </div>
    </>
  );
};

export default Contact_request;
