const express = require("express");
const router = express.Router();

const myDB = require("../db/myDB.js");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.redirect("/songs");
});

router.get("/songs", async (req, res) => {
  const page = req.query.page || 1;
  console.log("/songs", page);

  try {
    const songs = await myDB.getSongs(page);
    // console.log("got songs", songs);
    res.render("songs", {
      songs: songs,
      err: req.session.err,
      msg: req.session.msg,
    });
  } catch (err) {
    console.log("got error", err);
    res.render("songs", { err: err.message, songs: [] });
  }
});

router.post("/songs/delete", async (req, res) => {
  try {
    const song = req.body;
    const { lastID, changes } = await myDB.deleteSong(song);

    console.log(lastID, changes);
    if (changes === 0) {
      req.session.err = `Couldn't delete the object ${song.Name}`;
      res.redirect("/songs");
      return;
    }

    req.session.msg = "Song deleted";
    res.redirect("/songs");
    return;
  } catch (err) {
    console.log("got error delete");
    req.session.err = err.message;
    res.redirect("/songs");
    return;
  }
});

router.post("/songs/update", async (req, res) => {
  try {
    const song = req.body;
    const result = await myDB.updateSong(song);

    if (result.result.ok) {
      req.session.msg = "Song Updated";
      res.redirect("/songs");
      return;
    } else {
      req.session.err = "Error updating";
      res.redirect("/songs");
    }
  } catch (err) {
    console.log("got error update", err);
    req.session.err = err.message;
    res.redirect("/songs");
  }
});

router.post("/songs/create", async (req, res) => {
  const song = req.body;

  try {
    console.log("Create song", song);
    await myDB.createSong(song, res);
    req.session.msg = "Song created";
    res.redirect("/songs");
  } catch (err) {
    req.session.err = err.message;
    res.redirect("/songs");
  }
});

module.exports = router;
