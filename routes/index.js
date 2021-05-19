var express = require("express");
var router = express.Router();

var request = require("request");
var bodyParser = require("body-parser");

var { OAuth2Client } = require("google-auth-library");
var querystring = require("querystring");

var CLIENT_ID =
  "94679084723-s5f0686p2porp9mkakrp1p89a48n24nj.apps.googleusercontent.com";
var client = new OAuth2Client(CLIENT_ID);
var mysql = require("mysql");
var session = require("express-session");
var FileStore = require("session-file-store")(session);
router.use(bodyParser.urlencoded({ extended: false })); //url인코딩 x
router.use(bodyParser.json()); //json방식으로 파
router.use(
  session({
    secret: "209", // 암호화
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
  })
);
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "g79465",
  database: "caferecommend",
});
connection.connect();
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    d: "94679084723-s5f0686p2porp9mkakrp1p89a48n24nj.apps.googleusercontent.com",
  });
});
router.get("/index", function (req, res, next) {
  res.render("index", {
    d: "94679084723-s5f0686p2porp9mkakrp1p89a48n24nj.apps.googleusercontent.com",
  });
});

router.post("/index", (req, res) => {
  let token = req.body.token;
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    });
  }
  verify()
    .then(() => {
      res.cookie("session-token", token);
      res.send("success");
    })
    .catch(console.error);
});

router.get("/login", checkAuthenticated, (req, res) => {
  var sql = "SELECT * FROM USER WHERE EMAIL=?";
  var parameter = [req.session.user.email];
  connection.query(sql, parameter, function (err, row) {
    if (err) {
      console.log(err);
    } else {
      if (row.length > 0) {
        console.log("이미 가입이 되어있는 아이디");
        req.session.user.nickname = row[0].NICKNAME;
        req.session.user.age = row[0].AGE;
        req.session.user.gender = row[0].GENDER;
        return res.render("map", { user: req.session.user });
      } else {
        return res.render("login", { user: req.session.user, message: "none" });
      }
    }
  });
});

router.post("/login", (req, res) => {
  console.log(req.body.nickname);
  console.log(req.body.age);
  console.log(req.body.gender);
  var sql = " SELECT * FROM USER WHERE NICKNAME=?";
  var parameter = [req.body.nickname];
  connection.query(sql, parameter, function (err, row) {
    if (err) {
      console.log(err);
    }
    if (row.length > 0) {
      console.log("동일 닉네임있음");

      return res.render("login", {
        user: req.session.user,
        message: "same nickname",
      });
    } else {
      req.session.user.nickname = req.body.nickname;
      req.session.user.age = req.body.age;
      req.session.user.gender = req.body.gender;
      var sql =
        "INSERT INTO USER(EMAIL, NAME, NICKNAME, AGE, GENDER) VALUES(?,?,?,?,?)";
      var parameter = [
        req.session.user.email,
        req.session.user.name,
        req.session.user.nickname,
        req.session.user.age,
        req.session.user.gender,
      ];
      connection.query(sql, parameter, function (err, row) {
        if (err) {
          console.log(err);
        } else {
          console.log("새로운 user데이터 입력");
        }
      });
      return res.render("map", { user: req.session.user });
    }
  });
});

module.exports = router;

function checkAuthenticated(req, res, next) {
  let token = req.cookies["session-token"];

  let user = {};
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();
    user.name = payload.name;
    user.email = payload.email;
  }
  verify()
    .then(() => {
      req.session.user.name = user.name;
      req.session.user.email = user.email;
      next();
    })
    .catch((err) => {
      res.redirect("/index");
    });
}

router.get("/map", (req, res) => {
  if (req.session.user) {
    res.render("map");
  }
  res.render("map");
});

router.get("/logout", function (req, res) {
  req.session.destroy(); //세션비우기
  res.redirect("/");
});
