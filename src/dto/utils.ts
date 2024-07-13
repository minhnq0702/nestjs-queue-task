const EmailValidation = [
  {
    allow_ip_domain: false,
    allow_utf8_local_part: true,
    // require_tld: true,
  },
  {
    message: 'Invalid email', // TODO change to CODE
  },
];

const PasswordValidation = [
  {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
  },
  {
    message: 'Password is too weak', // TODO change to CODE
  },
];

export default {
  EmailValidation,
  PasswordValidation,
};
