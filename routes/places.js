const express = require("express");

const placeController = require("../controllers/places");

const wrapAsync = require("../utils/WrapAsync");

const { isAuthorPlace } = require("../middlewares/isAuthor");
const isValidObjectId = require("../middlewares/isValidObjectId");
const isAuth = require("../middlewares/isAuth");
const { validatePlace } = require("../middlewares/validator");
const upload = require("../configs/multer");

const router = express.Router();

// middleware

// implementing chained routes
// routes places CRUD
router
  .route("/")
  .get(wrapAsync(placeController.index))
  .post(
    isAuth,
    upload.array("image", 5),
    validatePlace,
    wrapAsync(placeController.store)
  );

router.get("/create", isAuth, (req, res) => {
  res.render("places/create");
});

// routes with id
router
  .route("/:id")
  .get(isValidObjectId("/places"), wrapAsync(placeController.show))
  .put(
    isAuth,
    isAuthorPlace,
    isValidObjectId("/places"),
    upload.array("image", 5),
    validatePlace,
    wrapAsync(placeController.update)
  )
  .delete(
    isAuth,
    isAuthorPlace,
    isValidObjectId("/places"),
    wrapAsync(placeController.destroy)
  );

// edit place
router.get(
  "/:id/edit",
  isAuth,
  isAuthorPlace,
  isValidObjectId("/places"),
  wrapAsync(placeController.edit)
);

module.exports = router;
