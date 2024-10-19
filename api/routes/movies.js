const router = require("express").Router();
const Movie = require("../models/Movie");
const verify = require("../verifyToken");

// CREATE
router.post("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    const newMovie = new Movie(req.body);
    try {
      const savedMovie = await newMovie.save();
      return res.status(201).json(savedMovie);
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You are not allowed!");
  }
});

// UPDATE
router.put("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const { isSeries, episodes, ...movieUpdates } = req.body;
      let updatedMovie;

      if (isSeries && episodes) {
        // Update specific episodes in the series
        updatedMovie = await Movie.findById(req.params.id);

        // Update only the specified episodes
        episodes.forEach((episode, index) => {
          if (episode._id) {
            const episodeIndex = updatedMovie.episodes.findIndex(
              (ep) => ep._id.toString() === episode._id
            );
            if (episodeIndex !== -1) {
              // Update the episode details
              updatedMovie.episodes[episodeIndex] = {
                ...updatedMovie.episodes[episodeIndex],
                ...episode,
              };
            }
          } else {
            // Add new episodes
            updatedMovie.episodes.push(episode);
          }
        });

        // Update other movie fields
        Object.assign(updatedMovie, movieUpdates);
        await updatedMovie.save();
      } else {
        // For non-series movies, update regular movie details
        updatedMovie = await Movie.findByIdAndUpdate(
          req.params.id,
          { $set: movieUpdates },
          { new: true }
        );
      }

      return res.status(200).json(updatedMovie);
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You are not allowed!");
  }
});


// DELETE
router.delete("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await Movie.findByIdAndDelete(req.params.id);
      return res.status(200).json("The movie has been deleted...");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You are not allowed!");
  }
});

// GET
router.get("/find/:id", verify, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    return res.status(200).json(movie);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// GET RANDOM
router.get("/random", verify, async (req, res) => {
  const type = req.query.type;
  let movie;
  try {
    if (type === "series") {
      movie = await Movie.aggregate([
        { $match: { isSeries: true } },
        { $sample: { size: 1 } },
      ]);
    } else {
      movie = await Movie.aggregate([
        { $match: { isSeries: false } },
        { $sample: { size: 1 } },
      ]);
    }
    return res.status(200).json(movie);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// GET ALL
router.get("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const movies = await Movie.find();
      return res.status(200).json(movies.reverse());
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You are not allowed!");
  }
});

module.exports = router;
