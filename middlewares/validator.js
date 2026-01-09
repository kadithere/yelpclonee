const { placeShema } = require("../schemas/places");
const { reviewShema } = require("../schemas/review");
const ErrorHandler = require("../utils/ErrorHandler");

// validate place data
module.exports.validatePlace = (req, res, next) => {
  const { error } = placeShema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    return next(new ErrorHandler(msg, 400));
  } else {
    next();
  }
};
// validate review data
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewShema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    return next(new ErrorHandler(msg, 400));
  } else {
    next();
  }
};
