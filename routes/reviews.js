const express = require("express");

const reviewController = require("../controllers/reviews");
const Place = require("../models/place");

const wrapAsync = require("../utils/WrapAsync");
const { isAuthorReview } = require("../middlewares/isAuthor");
const { validateReview } = require("../middlewares/validator");
const isValidObjectId = require("../middlewares/isValidObjectId");
const isAuth = require("../middlewares/isAuth");
const router = express.Router({ mergeParams: true });

// add post review.
router.post(
  "/",
  isAuth,
  isValidObjectId("/places"),
  validateReview,
  wrapAsync(reviewController.store)
);
// delete review
router.delete(
  "/:review_id",
  isAuth,
  isAuthorReview,
  isValidObjectId("/places"),
  wrapAsync(reviewController.destroy)
);

module.exports = router;
