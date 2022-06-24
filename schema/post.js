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
    likes: [{
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

postSchema.plugin(autoIncrement.plugin, {
  model: "Post",
  field: "postNum",
  startAt: 1, //시작
  increment: 1, // 증가
});

module.exports = mongoose.model("Post", postSchema, "posts");
