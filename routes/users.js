var express = require('express');
var router = express.Router();
const User = require("../schema/user");

//로그인
router.post('/login', async(req, res) => { //로그인에 대한 api
  const user = await User.findOne({id: req.body.id, password: req.body.password}) //User 모델에서 입력받은 id와 password를 비교하여 유저를 찾아서 user변수에 저장함.
  if(!user) res.status(400).json({success : false}) // user가 없다면 실패
  else {
    res.status(200).json({success : true, user: user}); //입력이 성공하면 user를 전송함.
  }
})

//회원가입 
router.post('/register', async(req, res) => {
  const { name, id, password } = req.body; // 회원가입할 유저의 이름, id 비밀번호를 입력받음
  const user = new User({ name, id, password }); // 입력정보를 모델에 저장
  user.save(function (err) {
    if (err) throw err;
    res.send(user); //만들어진 모델을 전달
  });
})

//회원가입 아이디 중복체크
router.post('/register/idcheck', (req, res) => { 
  User.findOne({ id: req.body.id }).then((isUser)=>{ //요청된 id를 통해 유저를 찾음
    let check = true;   //ID가 중복되지 않은 상태
    if(isUser) check = false;  //유저가 존재하면 check는 false
    res.status(200).json({success: true, check}) //check를 전송  
  }).catch(err=>{
    res.status(400).json({success : false})
})
 
})

module.exports = router;
