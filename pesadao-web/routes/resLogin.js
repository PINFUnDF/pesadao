var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
  res.render("resLogin", {
    title: "Welcome - Pesadão",
    nomeCliente: req.session.nomeCliente,
  });
});

module.exports = router;
