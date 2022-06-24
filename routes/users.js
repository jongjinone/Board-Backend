var express = require('express');
var router = express.Router();
const User = require("../schema/user");

router.post('/login', async(req, res) => {
  const user = await User.findOne({id: req.body.id, password: req.body.password})
  if(!user) res.status(400).json({success : false})
  else {
    console.log(user)
    res.status(200).json({success : true, user: user});
  }
})

router.post('/register', async(req, res) => {
  const { name, id, password } = req.body;
  const user = new User({ name, id, password });
  user.save(function (err) {
    if (err) throw err;
    res.send(user);
  });
})

router.post('/register/idcheck', (req, res) => { 
  User.findOne({ id: req.body.id }).then((isUser)=>{
    let check = true;   //ID가 중복되지 않은 상태
    if(isUser) check = false;  //유저가 존재하면 check는 false
    res.status(200).json({success: true, check})   
  }).catch(err=>{
    res.status(400).json({success : false})
})
 
})

module.exports = router;
