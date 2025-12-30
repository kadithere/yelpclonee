const express = require("express");
const Review = require("../models/review");
const Place = require("../models/place");
const { reviewShema } = require("../schemas/review");
const wrapAsync = require("../utils/WrapAsync");
const ErrorHandler = require("../utils/ErrorHandler");

const isValidObjectId = require("../middlewares/isValidObjectId");
const isAuth = require("../middlewares/isAuth");
const router = express.Router({ mergeParams: true });

// middleware
const validateReview = (req, res, next) => {
  const { error } = reviewShema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    return next(new ErrorHandler(msg, 400));
  } else {
    next();
  }
};

// add post review.
router.post(
  "/",
  isAuth,
  isValidObjectId("/places"),
  validateReview,
  wrapAsync(async (req, res) => {
    const review = new Review(req.body.review);
    const place = await Place.findById(req.params.place_id);
    place.reviews.push(review);
    await review.save();
    await place.save();
    req.flash("success_msg", "Review added seccessfully");
    res.redirect(`/places/${req.params.place_id}`);
  })
);
// delete review
router.delete(
  "/:review_id",
  isAuth,
  isValidObjectId("/places"),
  wrapAsync(async (req, res) => {
    const { place_id, review_id } = req.params;
    await Place.findByIdAndUpdate(place_id, {
      $pull: { reviews: review_id },
    });
    await Place.findByIdAndDelete(review_id);
    req.flash("success_msg", "Review deleted seccessfully");
    res.redirect(`/places/${req.params.place_id}`);
  })
);

module.exports = router;
