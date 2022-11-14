var jwt = require('jsonwebtoken');

function generateToken(user) {
 
  var u = {
    name: user.name,
    username: user.username,
    admin: user.admin,
    _id: user._id.toString(),
    image: user.image,
    isEmailVerified: user.isEmailVerified 
  };

  return token = jwt.sign(u, process.env.JWT_SECRET, {
    expiresIn: 60 * 60 * 24 
  });
}

function validateSignUpForm(values, callback) {
  var errors = {};
  var hasErrors = false;

  if (!values.name || values.name.trim() === '') {
    errors.name = 'Enter a name';
    hasErrors = true;
  }
  if (!values.username || values.username.trim() === '') {
    errors.username = 'Enter username';
    hasErrors = true;
  }
  if (!values.email || values.email.trim() === '') {
    errors.email = 'Enter email';
    hasErrors = true;
  }
  if (!values.password || values.password.trim() === '') {
    errors.password = 'Enter password';
    hasErrors = true;
  }
  if (!values.confirmPassword || values.confirmPassword.trim() === '') {
    errors.confirmPassword = 'Enter Confirm Password';
    hasErrors = true;
  }

  if (values.confirmPassword && values.confirmPassword.trim() !== '' && values.password && values.password.trim() !== '' && values.password !== values.confirmPassword) {
    errors.password = 'Password And Confirm Password don\'t match';
    errors.password = 'Password And Confirm Password don\'t match';
    hasErrors = true;
  }

  if (callback) {
    callback(hasErrors && errors);
  } else {
    return hasErrors && errors;
  }
}

function getCleanUser(user) {
  if(!user) return {};

  var u = user.toJSON();
  return {
    _id: u._id,
    name: u.name,
    username: u.username,
    email: u.email,
    admin: u.admin,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
    image: u.image,
    isEmailVerified: u.isEmailVerified
  }
}

module.exports = {
  validateSignUpForm: validateSignUpForm,
  getCleanUser: getCleanUser,
  generateToken: generateToken
}