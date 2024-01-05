export const subAdminPermissions = [
  // Dashboard
  {
    name: "Dashboard",
    identifier: "dashboard",
    isGranted: false,
    showSub: false,
    sub_permissions: [
      {
        name: "Dashboard Overview",
        identifier: "dashboardOverview",
        isGranted: false,
      },
      { name: "User Activity", identifier: "userActivity", isGranted: false },
      {
        name: "Dashboard Clients",
        identifier: "dashboardClients",
        isGranted: false,
      },
    ],
  },
  // Custom Coaching Clients
  {
    name: "Custom Coaching Clients",
    identifier: "client",
    isGranted: false,
    showSub: false,

    sub_permissions: [
      { name: "Add Clients", identifier: "addClients", isGranted: false },
      { name: "Edit Clients", identifier: "editClients", isGranted: false },
      { name: "View Clients", identifier: "viewClients", isGranted: false },
      {
        name: "Block/Unblock Clients",
        identifier: "blockUnblockClients",
        isGranted: false,
      },
      {
        name: "Message Clients",
        identifier: "messageClients",
        isGranted: false,
      },
    ],
  },

  // Library
  {
    name: "Library",
    identifier: "library",
    isGranted: false,
    showSub: false,

    sub_permissions: [
      {
        name: "Exercises List",
        identifier: "exercisesList",
        isGranted: false,
      },
      {
        name: "Add Exercises",
        identifier: "addExercises",
        isGranted: false,
      },
      {
        name: "Edit Exercises",
        identifier: "editExercises",
        isGranted: false,
      },
      {
        name: "View Exercises",
        identifier: "viewExercises",
        isGranted: false,
      },
      {
        name: "Delete Exercises",
        identifier: "deleteExercises",
        isGranted: false,
      },
    ],
  },

  // Gallery Videos
  {
    name: "Videos",
    identifier: "gallery-videos",
    // identifier: "all-category-videos",
    isGranted: false,
    showSub: false,

    sub_permissions: [
      // for folder
      // { name: "Add Folder", identifier: "addFolder", isGranted: false },
      // {
      //   name: "View Folder",
      //   identifier: "viewFolder",
      //   isGranted: false,
      // },
      // { name: "Edit Folder", identifier: "editFolder", isGranted: false },
      // {
      //   name: "Delete Folder",
      //   identifier: "deleteFolder",
      //   isGranted: false,
      // },

      // for videos
      { name: "Add Videos", identifier: "addVideos", isGranted: false },
      { name: "Edit Videos", identifier: "editVideos", isGranted: false },
      { name: "View Videos", identifier: "viewVideos", isGranted: false },
      {
        name: "Delete Videos",
        identifier: "deleteVideos",
        isGranted: false,
      },
    ],
  },

  // Workout Programs
  {
    name: "Workout Programs",
    identifier: "workout-program",
    isGranted: false,
    showSub: false,

    sub_permissions: [
      {
        name: "Add Workout Programs",
        identifier: "addWorkoutPrograms",
        isGranted: false,
      },
      {
        name: "View Workout Programs",
        identifier: "viewWorkoutPrograms",
        isGranted: false,
      },
      {
        name: "Delete Workout Programs",
        identifier: "deleteWorkoutPrograms",
        isGranted: false,
      },
      {
        name: "Add Workout Program Days",
        identifier: "addWorkoutProgramDays",
        isGranted: false,
      },
      {
        name: "Edit Workout Program Days",
        identifier: "editWorkoutProgramDays",
        isGranted: false,
      },
    ],
  },

  // Messages
  {
    name: "Messages",
    identifier: "messages",
    isGranted: false,
    showSub: false,

    sub_permissions: [
      {
        name: "Community Messages",
        identifier: "communityMessages",
        isGranted: false,
      },
      {
        name: "Custom Coaching Clients Messages",
        identifier: "customCoachingClientsMessages",
        isGranted: false,
      },
      {
        name: "Send Coaching Clients Messages",
        identifier: "SendCustomCoachingClientsMessages",
        isGranted: false,
      },
    ],
  },

  // Contact Requests
  {
    name: "Contact Requests",
    identifier: "contact-request",
    isGranted: false,
    showSub: false,

    sub_permissions: [
      {
        name: "View Request",
        identifier: "viewRequest",
        isGranted: false,
      },
    ],
  },

  // Roles and Permissions
  {
    name: "Roles and Permissions",
    identifier: "role-permission",
    isGranted: false,
    showSub: false,

    sub_permissions: [
      {
        name: "Add Role and Permissions",
        identifier: "addRoleAndPermissions",
        isGranted: false,
      },
      {
        name: "Edit Role and Permissions",
        identifier: "editRoleAndPermissions",
        isGranted: false,
      },
      {
        name: "View Role and Permissions",
        identifier: "viewRoleAndPermissions",
        isGranted: false,
      },
      {
        name: "Delete Role and Permissions",
        identifier: "deleteRoleAndPermissions",
        isGranted: false,
      },
    ],
  },

  // Coaches and Team Members
  {
    name: "Coaches and Team Members",
    identifier: "coaches-team-member",
    isGranted: false,
    showSub: false,

    sub_permissions: [
      { name: "Add", identifier: "addCoachesAndTeamMembers", isGranted: false },
      {
        name: "Edit",
        identifier: "editCoachesAndTeamMembers",
        isGranted: false,
      },
      {
        name: "View",
        identifier: "viewCoachesAndTeamMembers",
        isGranted: false,
      },
      {
        name: "Delete",
        identifier: "deleteCoachesAndTeamMembers",
        isGranted: false,
      },
    ],
  },

  // App Members
  {
    name: "App Members",
    identifier: "app-members",
    isGranted: false,
    showSub: false,

    sub_permissions: [],
  },

  // Skills Training
  {
    name: "Skill Training",
    identifier: "skills-training",
    isGranted: false,
    showSub: false,
    sub_permissions: [
      { name: "Add Videos", identifier: "addVideos", isGranted: false },
      { name: "Edit Videos", identifier: "editVideos", isGranted: false },
      { name: "View Videos", identifier: "viewVideos", isGranted: false },
      {
        name: "Delete Videos",
        identifier: "deleteVideos",
        isGranted: false,
      },

      // for folder

      { name: "Add Folder", identifier: "addFolder", isGranted: false },
      {
        name: "View Folder",
        identifier: "viewFolder",
        isGranted: false,
      },
      { name: "Edit Folder", identifier: "editFolder", isGranted: false },
      {
        name: "Delete Folder",
        identifier: "deleteFolder",
        isGranted: false,
      },

      // for sub-folder

      { name: "Add sub-Folder", identifier: "addSubFolder", isGranted: false },
      {
        name: "View sub-Folder",
        identifier: "viewSubFolder",
        isGranted: false,
      },
      {
        name: "Edit sub-Folder",
        identifier: "editSubFolder",
        isGranted: false,
      },
      {
        name: "Delete sub-Folder",
        identifier: "deleteSubFolder",
        isGranted: false,
      },
    ],
  },
];
