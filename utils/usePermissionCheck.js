import { useSelector } from "react-redux";

const usePermissionCheck = () => {
  const user = useSelector((state) => state?.auth?.userData);
  const role = user?.adminType;
  let permissions = [];

  if (role === "admin" && user?.adminType === "admin") {
    permissions = user?.permissionRole || [];
  } else {
    permissions = user?.permissionRole[0]?.permissions;
  }

  const checkSubPermissions = (permissionParent, identifier) => {
    if (role === "admin" && user?.adminType === "admin") {
      return { status: true };
    }
    if (permissions && permissions?.length > 0) {
      for (const permission of permissions) {
        if (
          permission?.identifier === permissionParent &&
          permission?.isGranted &&
          permission?.sub_permissions &&
          permission?.sub_permissions?.length > 0
        ) {
          for (const sub_permission of permission.sub_permissions) {
            if (
              sub_permission?.identifier === identifier &&
              sub_permission?.isGranted
            ) {
              return { status: true };
            }
          }
        }
      }
    }
    return { status: false };
  };
  const checkPermission = (identifier) => {
    if (role === "admin" && user?.adminType === "admin") {
      return { status: true };
    }
    if (permissions && permissions?.length > 0) {
      for (const permission of permissions) {
        if (
          permission?.identifier.toString() === identifier.toString() &&
          permission?.isGranted
        ) {
          return { status: true };
        }
      }
    }
    return { status: false };
  };
  return { checkPermission, checkSubPermissions };
};

export default usePermissionCheck;
