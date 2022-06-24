const mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const postSchema = new mongoose.Schema(
  {
    name: String,
    title: String,
    content: String,
    postNum: { type: Number, default: 0 },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    likes: [{ //User 모델을 참조하여 objectId를 가져옴
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    }],    
    reple: [
      {
        content: String,
        user_id: String        
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

postSchema.plugin(autoIncrement.plugin, { //autoincrement를 위해 설정
  model: "Post",
  field: "postNum", //collection 중 postNum 필드를 기준 
  startAt: 1, //1부터 시작
  increment: 1, // 1씩 증가
});

module.exports = mongoose.model("Post", postSchema, "posts");
