import React, { useEffect, useState } from "react";
import "./rolePermission.scss";
import Topbar from "../../../components/topbar/Topbar";
import { Search } from "../../../assets";
import { useNavigate, useParams } from "react-router-dom";
import AddRoleTable from "../../../components/AddRoleTable/AddRoleTable";
import { ApiCall } from "../../../Services/Apis";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../../../Redux/actions/GernalActions";
import { message } from "antd";
import usePermissionCheck from "../../../../utils/usePermissionCheck";
import { logout } from "../../../Redux/actions/AuthActions";

const Role_Permissions = () => {
  const { checkSubPermissions } = usePermissionCheck();
  const [folderDetailSearched, setFolderDetailSearched] = useState([]);
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.userToken);
  const dispatch = useDispatch();

  const [allRoles, setAllRoles] = useState([]);

  const getAllRolesPermission = async () => {
    try {
      dispatch(setLoader(true));
      const res = await ApiCall({
        params: "",
        route: "roles/all_roles",
        verb: "get",
        token: token,
      });
      if (res?.status == 200) {
        dispatch(setLoader(false));
        // console.log(res?.response);
        setFolderDetailSearched(res?.response?.list);
        setAllRoles(res?.response?.list);
      }
    } catch (error) {
      dispatch(setLoader(false));
      console.log(error, "error");
    }
  };

  const deletePermanently = async (id) => {
    try {
      const res = await ApiCall({
        params: "",
        route: `roles/delete_role/${id}`,
        verb: "put",
        token: token,
      });
      if (res?.status == 200) {
        console.log(res?.response);
        message.success(res?.response?.message);
        getAllRolesPermission();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllRolesPermission();
  }, []);

  // console.log(allRoles);

  // const [search, setSearch] = useState("");

  // const handleChange = (e) => {
  //   setSearch(e.target.value);
  // };
  // const filterData = allRoles?.filter((user) =>
  //   JSON.stringify(user)?.toString()?.toLowerCase()?.includes(search)
  // );

  const handleChange = (e) => {
    if (e.target.value) {
      const filterRoles = allRoles.filter((user) => {
        // console.log(user, "user");
        return (
          user?.title?.includes(e.target.value) ||
          user?.description?.includes(e.target.value)
        );
      });
      // console.log(filterfolder);
      setFolderDetailSearched(filterRoles);
    } else {
      setFolderDetailSearched(allRoles);
    }
  };

  return (
    <>
      <Topbar title="Roles & Permissions" />

      <div className="add-role-head">
        <div className="add-role-input">
          <img src={Search} alt="" />
          <input type="text" placeholder="Search" onChange={handleChange} />
        </div>
        {checkSubPermissions("role-permission", "deleteRoleAndPermissions")
          ?.status ? (
          <div
            className="btn"
            onClick={() => navigate("/role-permission/add-role")}
          >
            Add a role
          </div>
        ) : null}
      </div>

      <div className="role-permission-table">
        <AddRoleTable
          allRoles={folderDetailSearched}
          deletePermanently={deletePermanently}
        />
      </div>
    </>
  );
};

export default Role_Permissions;
