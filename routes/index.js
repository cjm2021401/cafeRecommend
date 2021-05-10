var express = require('express');
var router = express.Router();
var {OAuth2Client} = require('google-auth-library');
var CLIENT_ID = "94679084723-s5f0686p2porp9mkakrp1p89a48n24nj.apps.googleusercontent.com"
var client= new OAuth2Client(CLIENT_ID);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { d: "94679084723-s5f0686p2porp9mkakrp1p89a48n24nj.apps.googleusercontent.com" });
});
router.get('/index', function(req, res, next) {
  res.render('index', { d: "94679084723-s5f0686p2porp9mkakrp1p89a48n24nj.apps.googleusercontent.com" });
});

router.post('/index', (req, res) => {
  let token=req.body.token;
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
    });
  }
  verify()
      .then(()=>{
        res.cookie('session-token', token);
        res.send('success')
      })
      .catch(console.error);
});

router.get('/login', checkAuthenticated, (req,res )=>{
  let user=req.user;
  res.render('login', {user})
});
module.exports = router;



function checkAuthenticated(req, res, next){

  let token = req.cookies['session-token'];

  let user = {};
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();
    user.name = payload.name;
    user.email = payload.email;
    user.picture = payload.picture;
    console.log(user.name);
  }
  verify()
      .then(()=>{
        req.user = user;
        next();
      })
      .catch(err=>{
        res.redirect('/login')
      })

}