const Place = require("../models/place");
const fs = require("fs");
const ExpressError = require("../utils/errorHandler");

module.exports.index = async (req, res) => {
  const places = await Place.find();
  res.render("places/index", { places });
};

module.exports.store = async (req, res, next) => {
  const images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  const place = new Place(req.body.place);
  place.author = req.user._id;
  place.images = images;
  await place.save();
  req.flash("success_msg", "Place added seccessfully");
  res.redirect("/places");
};

module.exports.show = async (req, res) => {
  const place = await Place.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!place) {
    req.flash("error_msg", "Place not found");
    return res.redirect("/places");
  }
  res.render("places/show", { place });
};

module.exports.edit = async (req, res) => {
  const place = await Place.findById(req.params.id);
  if (!place) {
    req.flash("error_msg", "Place not found");
    return res.redirect("/places");
  }
  res.render("places/edit", { place });
};

module.exports.update = async (req, res) => {
  const place = await Place.findByIdAndUpdate(req.params.id, {
    ...req.body.place,
  });
  // added images update logic
  if (req.files && req.files.length > 0) {
    place.images.forEach((image) => {
      fs.unlink(image.url, new ExpressError("Failed to delete old image", 500));
    });

    const images = req.files.map((file) => ({
      url: file.path,
      filename: file.filename,
    }));
    place.images = images;
    await place.save();
  }

  req.flash("success_msg", "Place updated seccessfully");
  res.redirect(`/places/${req.params.id}`);
};

module.exports.destroy = async (req, res) => {
  await Place.findByIdAndDelete(req.params.id);
  req.flash("success_msg", "Place deleted seccessfully");
  res.redirect("/places");
};
