import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Account from "../../pages/home/account";
import Change_Password from "../../pages/home/change-password";
import Dashboard from "../../pages/home/dashboard";
import Library from "../../pages/home/library";
import Client from "../../pages/home/client";
import AddNewClient from "../../pages/home/client/AddNewClient";
import ClientDetails from "../../pages/home/client/ClientDetails";
import Community from "../../pages/home/community";
import WorkoutProgram from "../../pages/home/workout-program";
import AddNewExercise from "../../pages/home/library/AddNewExercise";
import EditExercise from "../../pages/home/library/EditExercise";
import ExerciseDetails from "../../pages/home/library/ExerciseDetails";
import CommunityParticipants from "../../pages/home/community/CommunityParticipants";
import Create_workout_program from "../../pages/home/workout-program/create_workout_program";
import Gallery_Videos from "../../pages/home/gallery-videos";
import Add_new_video from "../../pages/home/gallery-videos/Add_new_video";
import Edit_Video from "../../pages/home/gallery-videos/Edit_Video";
import Add_new_workout from "../../pages/home/library/Add_new_workout";
import Edit_workout from "../../pages/home/library/Edit_workout";
import Workout_details from "../../pages/home/library/Workout_details";
import ProgramDetails from "../../pages/home/workout-program/ProgramDetails";
import Gallery_videos_details from "../../pages/home/gallery-videos/gallery_videos_details";
import Contact_request from "../../pages/home/contact-request";
import Contact_request_details from "../../pages/home/contact-request/Contact_request_details";
import AppMembers from "../../pages/home/app-members";
import Skills_Training from "../../pages/home/skills-training";
import Add_new_Coach from "../../pages/home/add-new-coach";
import AddTeamMember from "../../pages/home/add-new-coach/AddTeamMember";
import MemberDetails from "../../pages/home/add-new-coach/MemberDetails";
import Role_Permissions from "../../pages/home/role-permission";
import AddRole from "../../pages/home/role-permission/AddRole";
import RoleDetails from "../../pages/home/role-permission/RoleDetails";
import Edit_team_member from "../../pages/home/add-new-coach/Edit_team_member";
import Add_skill_video from "../../pages/home/skills-training/Add_skill_video";
import EditRole from "../../pages/home/role-permission/EditRole";
import Skill_video_detail from "../../pages/home/skills-training/Skill_video_detail";
import Edit_skill_video from "../../pages/home/skills-training/Edit_skill_video";
import App_Member_details from "../../pages/home/app-members/App_Member_details";
import usePermissionCheck from "../../../utils/usePermissionCheck";
import { useSelector } from "react-redux";
import AllCategoryVideos from "../../pages/home/gallery-videos/AllCategoryVideos";
import AllCategorySkillVideo from "../../pages/home/skills-training/AllCategorySkillVideo";
import SingleCategoryDetail from "../../pages/home/skills-training/SingleCategoryDetail";
import Single_Folder_detail from "../../pages/home/gallery-videos/Single_Folder_detail";
import ParentFolder from "../../pages/home/skills-training/ParentFolder";
import SubParentFolder from "../../pages/home/skills-training/SubParentFolder";

const HomeRoutes = () => {
  const { checkPermission, checkSubPermissions } = usePermissionCheck();
  const user = useSelector((state) => state?.auth?.userData);
  const role = user?.adminType;
  let permissions = [];
  let firstGrantedPermission;
  if (role === "admin" && user?.adminType === "admin") {
    permissions = user?.permissionRole || [];
  } else {
    permissions = user?.permissionRole[0]?.permissions;
    // permissions = user?.permissionRole || [];
    // console.log(permissions);
    firstGrantedPermission = permissions?.find((permission) => {
      // console.log(permission, permission?.isGranted, "permission");
      return permission?.isGranted === true;
    });
  }
  // console.log(firstGrantedPermission, "firstGrantedPermission");
  const routePath = firstGrantedPermission
    ? `/${firstGrantedPermission?.identifier}`
    : "/dashboard";

  // console.log(routePath, "routePath");
  return (
    <>
      <Layout>
        <Routes>
          <Route path={"*"} element={<Navigate to={routePath} replace />} />
          <Route path="/my-account" element={<Account />} />
          <Route path="/change-password" element={<Change_Password />} />
          {checkPermission("dashboard").status ? (
            <Route path="/dashboard" element={<Dashboard />} />
          ) : null}
          {checkPermission("client").status ? (
            <>
              <Route path="/client" element={<Client />} />
              {/* {role === "admin" ? (
                <Route
                  path="/client/add-new-client"
                  element={<AddNewClient />}
                />
              ) : null} */}
              {checkSubPermissions("client", "addClients")?.status ? (
                <Route
                  path="/client/add-new-client"
                  element={<AddNewClient />}
                />
              ) : null}
              <Route
                path="/client/client-details/:id"
                element={<ClientDetails />}
              />
            </>
          ) : null}
          {checkPermission("library").status ? (
            <>
              <Route path="/library" element={<Library />} />
              {checkSubPermissions("library", "addExercises")?.status ? (
                <Route
                  path="/library/add-new-exercise"
                  element={<AddNewExercise />}
                />
              ) : null}
              {checkSubPermissions("library", "editExercises")?.status ? (
                <Route
                  path="/library/edit-exercise/:id"
                  element={<EditExercise />}
                />
              ) : null}{" "}
              {checkSubPermissions("library", "viewExercises")?.status ? (
                <Route
                  path="/library/exercise-details/:id"
                  element={<ExerciseDetails />}
                />
              ) : null}
            </>
          ) : null}
          {/* {checkPermission("gallery-videos").status ? (
            <>
              <Route
                path="/all-category-videos"
                element={<AllCategoryVideos />} //for folder
              />
              <Route
                path="/all-category-videos/gallery-videos"
                element={<Gallery_Videos />}  //for video
              />
              <Route
                path="/all-category-videos/gallery-videos/single-folder-page/:id"
                element={<Single_Folder_detail />} //for video
              />
              {checkSubPermissions("gallery-videos", "addVideos")?.status ? (
                <Route
                  path="/all-category-videos/gallery-videos/add-new-video/:id"
                  element={<Add_new_video />}
                />
              ) : null}
              {checkSubPermissions("gallery-videos", "editVideos")?.status ? (
                <Route
                  path="/all-category-videos/gallery-videos/single-folder-page/:id/edit-video/:ObjId"
                  element={<Edit_Video />}
                />
              ) : null}
              {checkSubPermissions("gallery-videos", "viewVideos")?.status ? (
                <Route
                  path="/all-category-videos/gallery-videos/single-folder-page/:id/video-detail/:ObjId"
                  element={<Gallery_videos_details />}
                />
              ) : null}
            </>
          ) : null} */}
          {checkPermission("gallery-videos").status ? (
            <>
              {/* <Route path="/gallery-videos" element={<AllCategoryVideos />} /> */}
              {/* <Route
                path="/gallery-videos/single-folder-page/:id"
                element={<Single_Folder_detail />}
              /> */}
              <Route
                path="/gallery-videos"
                element={<Single_Folder_detail />}
              />
              {checkSubPermissions("gallery-videos", "addVideos")?.status ? (
                <Route
                  path="/gallery-videos/add-new-video"
                  element={<Add_new_video />}
                />
              ) : null}
              {checkSubPermissions("gallery-videos", "editVideos")?.status ? (
                <Route
                  path="/gallery-videos/edit-video/:id"
                  element={<Edit_Video />}
                />
              ) : null}
              {checkSubPermissions("gallery-videos", "viewVideos")?.status ? (
                <Route
                  path="/gallery-videos/detail-video/:id"
                  element={<Gallery_videos_details />}
                />
              ) : null}
            </>
          ) : null}
          {checkPermission("workout-program").status ? (
            <>
              <Route path="/workout-program" element={<WorkoutProgram />} />
              {checkSubPermissions("workout-program", "viewWorkoutPrograms")
                ?.status ? (
                <Route
                  path="/workout-program/:id"
                  element={<ProgramDetails />}
                />
              ) : null}
            </>
          ) : null}
          {checkPermission("contact-request").status ? (
            <>
              <Route path="/contact-request" element={<Contact_request />} />
              {checkSubPermissions("contact-request", "viewRequest")?.status ? (
                <Route
                  path="/contact-request/contact-request-details/:id"
                  element={<Contact_request_details />}
                />
              ) : null}
            </>
          ) : null}
          {checkPermission("role-permission").status ? (
            <>
              <Route path="/role-permission" element={<Role_Permissions />} />
              {checkSubPermissions("role-permission", "viewRoleAndPermissions")
                ?.status ? (
                <Route
                  path="/role-permission/role-details/:id"
                  element={<RoleDetails />}
                />
              ) : null}{" "}
              {checkSubPermissions("role-permission", "addRoleAndPermissions")
                ?.status ? (
                <Route path="/role-permission/add-role" element={<AddRole />} />
              ) : null}{" "}
              {checkSubPermissions("role-permission", "editRoleAndPermissions")
                ?.status ? (
                <Route
                  path="/role-permission/edit-role/:id"
                  element={<EditRole />}
                />
              ) : null}
            </>
          ) : null}
          {checkPermission("coaches-team-member").status ? (
            <>
              <Route path="/coaches-team-member" element={<Add_new_Coach />} />
              {checkSubPermissions(
                "coaches-team-member",
                "addCoachesAndTeamMembers"
              )?.status ? (
                <Route
                  path="/coaches-team-member/add-team-member"
                  element={<AddTeamMember />}
                />
              ) : null}{" "}
              {checkSubPermissions(
                "coaches-team-member",
                "viewCoachesAndTeamMembers"
              )?.status ? (
                <Route
                  path="/coaches-team-member/member-details/:id"
                  element={<MemberDetails />}
                />
              ) : null}{" "}
              {checkSubPermissions(
                "coaches-team-member",
                "editCoachesAndTeamMembers"
              )?.status ? (
                <Route
                  path="/coaches-team-member/member-edit/:id"
                  element={<Edit_team_member />}
                />
              ) : null}
            </>
          ) : null}
          {checkPermission("messages").status ? (
            <>
              <Route path="/messages" element={<Community />} />
              <Route
                path="/messages/participants"
                element={<CommunityParticipants />}
              />
            </>
          ) : null}
          {checkPermission("app-members").status ? (
            <>
              <Route path="/app-members" element={<AppMembers />} />
              <Route
                path="/app-members/member-details/:id"
                element={<App_Member_details />}
              />
            </>
          ) : null}{" "}
          {/* {checkPermission("skills-training").status ? (
            <>
              <Route
                path="/skills-training"
                element={<AllCategorySkillVideo />}
              />
              <Route
                path="/skills-training/single-category-page/:id/skill-video-detail/:ObjId"
                element={<Skill_video_detail />}
              />
              <Route
                path="/skills-training/single-category-page/:id/edit-my-video/:ObjId"
                element={<Edit_skill_video />}
              />
              <Route
                path="/skills-training/single-category-page/:id"
                element={<SingleCategoryDetail />} //video
              />
              <Route
                path="/skills-training/add-skill-video/:id"
                element={<Add_skill_video />}
              />
            </>
          ) : null} */}
          <Route path="/skills-training" element={<ParentFolder />} />
          {/* parent folder */}
          {/* <Route
            path="/skills-training/sub-folders/:id"
            element={<AllCategorySkillVideo />}
          /> */}
          <Route
            path="/skills-training/sub-folders/:id"
            element={<SubParentFolder />}
          />
          {/* child folder */}
          <Route
            path="/skills-training/sub-folders/all-videos/:id/videos/:objId"
            element={<SingleCategoryDetail />} //all videos
          />
          <Route
            path="/skills-training/sub-folders/all-videos/:id/videos/:objIds/child/:objId"
            element={<Skill_video_detail />}
          />
          <Route
            path="/skills-training/sub-folders/all-videos/:id/videos/:objIds/edit-video/:objId"
            element={<Edit_skill_video />}
          />
          <Route
            path="/skills-training/sub-folders/all-videos/add-video/:id/videos/:childId"
            element={<Add_skill_video />}
          />
          <Route path="/add-new-workout" element={<Add_new_workout />} />
          <Route path="/edit-workout" element={<Edit_workout />} />
          <Route path="/workout-details" element={<Workout_details />} />
        </Routes>
      </Layout>
    </>
  );
};

export default HomeRoutes;
