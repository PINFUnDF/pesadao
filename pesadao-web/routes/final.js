var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
  res.render("final", { title: "Compra Feita" });
});

module.exports = router;
