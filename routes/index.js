var express = require("express");
var router = express.Router();
var request = require("request");

var { OAuth2Client } = require("google-auth-library");
var querystring = require("querystring");

var CLIENT_ID =
  "94679084723-s5f0686p2porp9mkakrp1p89a48n24nj.apps.googleusercontent.com";
var client = new OAuth2Client(CLIENT_ID);
var session = require("express-session");
var FileStore = require("session-file-store")(session);
router.use(
  session({
    secret: "209", // 암호화
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
  })
);

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
  let user = req.user;
  req.session.user = user;
  res.render("login", { user: req.session.user });
});

router.post("/login", (req, res) => {
  console.log(req.body.nickname);
  console.log(req.body.age);
  console.log(req.body.gender);
  return res.render("login", { user: req.session.user });
});

router.get("/cafe", (req, res) => {
  let code = "CE7";
  let encodedStr = querystring.escape(code);

  let kakaoOptions = {
    uri: `https://dapi.kakao.com/v2/local/search/category.json?category_group_code=${encodedStr}`,
    method: "GET",
    headers: {
      Authorization: "KakaoAK 2f3999076db5d32db975ab9862a64480",
    },
    encoding: "utf-8",
  };
  request(kakaoOptions, callback);

  function callback(error, res, body) {
    console.log(body);
    let kakaoPlaces = JSON.parse(body);

    for (document of kakaoPlaces.documents) {
      console.log(document.id);
      console.log(document.place_name);
    }
  }
  return;
});

router.get("/map", (req, res) => {
  res.render("map");
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
    user.picture = payload.picture;
    console.log(user.name);
  }
  verify()
    .then(() => {
      req.user = user;
      next();
    })
    .catch((err) => {
      res.redirect("/index");
    });
}
