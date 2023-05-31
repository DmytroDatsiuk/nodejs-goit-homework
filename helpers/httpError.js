const errorMessages = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
};

const httpError = (status, message = errorMessages[status]) => {
  const error = new Error(message);
  error.status = status;
  console.log(error.status);
  return error;
};

module.exports = httpError;