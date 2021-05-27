var express = require("express");
var router = express.Router();

var bodyParser = require("body-parser");

var { OAuth2Client } = require("google-auth-library");

var CLIENT_ID =
  "94679084723-s5f0686p2porp9mkakrp1p89a48n24nj.apps.googleusercontent.com";
var client = new OAuth2Client(CLIENT_ID);
var mysql = require("mysql");
const session = require("express-session");
const FileStore = require("session-file-store")(session);

router.use(bodyParser.urlencoded({ extended: false })); //url인코딩 x
router.use(bodyParser.json()); //json방식으로 파싱
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
    const payload = ticket.getPayload();
    const userid = payload["sub"];
  }
  verify()
    .then(() => {
      res.cookie("session-token", token);
      res.send("success");
    })
    .catch(console.error);
});

router.get("/login", checkAuthenticated, (req, res) => {
  req.session.user = req.user;
  req.session.user.email = req.user.email;
  req.session.user.name = req.user.name;
  req.session.user.picture = req.user.picture;
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
  console.log("구글로그인 성공");
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
      connection.query(sql, parameter, function (err) {
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

router.get("/logout", function (req, res) {
  req.session.destroy(); //세션비우기
  res.redirect("/");
});

router.get("/review/:cafeId", function (req, res) {
  const cafeId = req.params.cafeId;
  res.render("review", { cafeId: cafeId });
});

// 카페 후기 등록
router.post("/review", function (req, res) {
  var cafeId = req.body.cafeId;
  var price = req.body.price;
  var kindness = req.body.kindness;
  var noise = req.body.noise;
  var accessibility = req.body.accessibility;

  console.log(price);
  console.log(kindness);
  console.log(noise);
  console.log(accessibility);

  // 입력받지 않은 데이터가 하나라도 존재 (카페아이디는 후기작성시 자동으로 받아옴)
  if (!cafeId || !price || !kindness || !noise || !accessibility) {
    console.log("입력받지 않은 데이터 존재");
    res.redirect("/review/:cafeId"); // 후기작성으로 다시 이동
  }

  var sql =
    "INSERT INTO REVIEW(CAFE_ID, PRICE, KINDNESS, NOISE, ACCESSIBILITY) VALUES(?,?,?,?,?)";

  var parameter = [cafeId, price, kindness, noise, accessibility];

  connection.query(sql, parameter, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("새로운 comment 데이터 입력");
    }
  });
  return res.send(
    '<script>alert("등록 완료"); location.href = "/login";</script>'
  );
});

module.exports = router;
