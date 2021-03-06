const express = require("express");
const router = express.Router();

const db = require("../models");

// base route is /breweries

// index
router.get("/", function (req, res) {
  db.Brewery.find({}, function (error, foundBreweries) {
    if (error) return res.send(error);

    const context = {
      breweries: foundBreweries,
    };

    res.render("brewery/index", context);
  });
});

// new
router.get("/new", function (req, res) {
  res.render("brewery/new");
});

// create
router.post("/", function (req, res) {
  db.Brewery.create(req.body, function (error, createdBrewery) {
    if (error) {
      console.log(error);
      return res.send(error);
    }

    res.redirect("/breweries");
  });
});

// show
router.get("/:id", function (req, res) {
  db.Brewery.findById(req.params.id)
    .populate("beers")
    .exec(function (error, foundBrewery) {
      if (error) {
        console.log(error);
        return res.send(error);
      }

      const context = { brewery: foundBrewery };
      res.render("brewery/show", context);
    });
});

// edit
router.get("/:id/edit", function (req, res) {
  db.Brewery.findById(req.params.id, function (error, foundBrewery) {
    if (error) {
      console.log(error);
      return res.send(error);
    }
    const context = { brewery: foundBrewery };
    res.render("brewery/edit", context);
  });
});

// update
router.put("/:id", function (req, res) {
  db.Brewery.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    function (error, updatedBrewery) {
      if (error) {
        console.log(error);
        return res.send(error);
      }

      res.redirect(`/breweries/${updatedBrewery._id}`);
    }
  );
});

// delete
router.delete("/:id", function (req, res) {
  db.Brewery.findByIdAndDelete(req.params.id, function (error, deletedBrewery) {
    if (error) {
      console.log(error);
      return res.send(error);
    }

    db.Beer.deleteOne({ brewery: deletedBrewery._id }, function (
      error,
      removedBeers
    ) {
      if (error) {
        console.log(error);
        return res.send(error);
      }
      res.redirect("/breweries");
    });
  });
});

module.exports = router;
