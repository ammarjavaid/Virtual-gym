export const enValidation = {
  email: {
    presence: {
      message: "^Please enter an email address",
    },
    email: {
      message: "^Please enter a valid email address",
    },
  },

  password: {
    presence: {
      message: "^Please enter a password",
    },

    length: {
      minimum: 6,
      message: "^Your password must be at least 6 characters",
    },
  },

  confirmPassword: {
    presence: {
      message: "^Please enter confirm password",
    },
  },
  fullName: {
    presence: {
      message: "^Please enter full name",
    },
  },
  fullname: {
    presence: {
      message: "^Please enter name",
    },
  },
  name: {
    presence: {
      message: "^Please enter name",
    },
  },
  commitment: {
    presence: {
      message: "^Please enter commitment",
    },
  },
  phonenumber: {
    presence: {
      message: "^Please enter phone number",
    },
  },
  newpassword: {
    presence: {
      message: "^Please enter new password",
    },
  },
  conpassword: {
    presence: {
      message: "^Please enter confirm password",
    },
  },
  code: {
    presence: {
      message: "^OTP is invalid",
    },
  },

  newPassword: {
    presence: {
      message: "^The password should be at least 6 characters long",
    },
    length: {
      minimum: 6,
      message: "^Your password must be at least 6 characters",
    },
  },
  volume: {
    presence: {
      message: "^Input volume of filler",
    },
  },
  quantity: {
    presence: {
      message: "^Input quantity of filler",
    },
  },
  fillername: {
    presence: {
      message: "^Please input filler name",
    },
  },
  price: {
    presence: {
      message: "^Please input price",
    },
  },

  precedure: {
    presence: {
      message: "^Please input pre-procedure date is correct",
    },
  },
  filluse: {
    presence: {
      message: "^Please input filler",
    },
  },
  detail: {
    presence: {
      message: "^Please input filler",
    },
  },
  measurement: {
    presence: {
      message: "^Please input measurement here ",
    },
  },
  Prep: {
    presence: {
      message: "^Please input Prep here",
    },
  },
  Cannula: {
    presence: {
      message: "^Please input Canulla here",
    },
  },
  Anesthetic: {
    presence: {
      message: "^Please input Anesthetic here",
    },
  },
  FillerType: {
    presence: {
      message: "^Please input FillerType here",
    },
  },
  Fillerlot: {
    presence: {
      message: "^Please input Fillerlot here",
    },
  },
  wrap: {
    presence: {
      message: "^Please input wrap here",
    },
  },
  notes: {
    presence: {
      message: "^Please input wrap here",
    },
  },
};
