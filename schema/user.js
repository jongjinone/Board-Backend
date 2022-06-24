const mongoose = require('mongoose'); 

const userSchema = new mongoose.Schema({ //유저 스키마를 형성
    name: String,
    id: String,      //로그인에 필요한 유저 정보를 설정
    password: String
}, {versionKey: false, timestamps: true} ); //DB에 _v가 뜨지 않고 생성 및 수정 시간이 뜨게 됨.
module.exports = mongoose.model('User', userSchema, 'users');
//유저에 대한 스키마를 User라는 모델로 감싸고 collection의 이름은 users임.