const express = require("express");
const Place = require("../models/place");
const { placeShema } = require("../schemas/places");
const wrapAsync = require("../utils/WrapAsync");
const ErrorHandler = require("../utils/ErrorHandler");

const router = express.Router();

// middleware
const validatePlace = (req, res, next) => {
  const { error } = placeShema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    return next(new ErrorHandler(msg, 400));
  } else {
    next();
  }
};

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const places = await Place.find();
    res.render("places/index", { places });
  })
);

// create places
router.get("/create", (req, res) => {
  res.render("places/create");
});

router.post(
  "/",
  validatePlace,
  wrapAsync(async (req, res, next) => {
    const place = new Place(req.body.place);
    await place.save();
    req.flash("success_msg", "Place added seccessfully");
    res.redirect("/places");
  })
);
// route edit and update place
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    const place = await Place.findById(req.params.id);
    res.render("places/edit", { place });
  })
);
// route find places by id
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const place = await Place.findById(req.params.id).populate("reviews");
    res.render("places/show", { place });
  })
);

router.put(
  "/:id",
  validatePlace,
  wrapAsync(async (req, res) => {
    await Place.findByIdAndUpdate(req.params.id, {
      ...req.body.place,
    });
    req.flash("success_msg", "Place updated seccessfully");
    res.redirect(`/places/${req.params.id}`);
  })
);

// route delete place
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    await Place.findByIdAndDelete(req.params.id);
    req.flash("success_msg", "Place deleted seccessfully");
    res.redirect("/places");
  })
);

module.exports = router;
