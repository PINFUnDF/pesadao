var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");
const handlebars = require("handlebars");

var indexRouter = require("./routes/index");
var loginRouter = require("./routes/login");
var resLoginRouter = require("./routes/resLogin");
var cadastroRouter = require("./routes/cadastro");
var resultadoPesquisaRouter = require("./routes/resultadoPesquisa");
var produtoRouter = require("./routes/produto");
var carrinhoRouter = require("./routes/carrinho");
var finalRouter = require("./routes/final");

var app = express();

app.use(
  session({
    secret: "admin90",
    resave: false,
    saveUninitialized: true,
  }),
);

const conexao = require("./db.js");

conexao.connect(function (erro) {
  if (erro) throw erro;
});

handlebars.registerHelper("carrinho", function (index, options) {
  // Verifica se o índice está dentro dos limites do carrinho
  if (index < this.length) {
    // Retorna o ID do produto no índice especificado
    return this[index];
  } else {
    // Se o índice estiver fora dos limites, retorna vazio
    return "";
  }
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/resLogin", resLoginRouter);
app.use("/cadastro", cadastroRouter);
app.use("/resultadoPesquisa", resultadoPesquisaRouter);
app.use("/produto", produtoRouter);
app.use("/carrinho", carrinhoRouter);
app.use("/final", finalRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
