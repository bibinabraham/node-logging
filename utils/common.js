function extractJoiErrorMessages(joiError, separator = ",") {
  let errorString = "";
  if (joiError && joiError.isJoi && joiError.details) {
    const errMsgs = [];
    for (const error of joiError.details) {
      errMsgs.push(error.message);
    }
    errorString = errMsgs.join(separator);
  }
  return errorString;
}

module.exports = {
  extractJoiErrorMessages: extractJoiErrorMessages
};
