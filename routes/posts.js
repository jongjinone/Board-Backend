const { response } = require("express");
var express = require("express");
var router = express.Router();
const Post = require("../schema/post");

//게시물 목록 불러오기
router.get("/", (req, res) => {
  Post.find({})
    .sort({ postNum: -1 })
    .then((response) => {
      res.status(200).json({ success: true, response });
    });
});

//상세 게시물 불러오기
router.get("/:postNum", (req, res) => {
  Post.findOne({ postNum: req.params.postNum }, (err, post) => {
    if (err) throw err;
    res.send(post);
  });
});

//게시물 작성
router.post("/upload", (req, res) => {
  console.log(req.body);
  let temp = req.body;
  const CommunityPost = new Post(temp); //새로운 포스트모델을 생성하여 요청된 정보와 함께 넘겨줌.
  CommunityPost.save();
  res.status(200).json({ success: true });
});

//댓글 작성
router.post("/:postNum/reple/submit", (req, res) => {
  Post.findOneAndUpdate(
    {
      postNum: req.params.postNum,
    },
    {
      $push: {
        reple: [
          {
            content: req.body.content,
            user_id: req.body.user_id,
          },
        ],
      },
    },
    { new: true }
  ).then((result) => {
    res.send({
      status: 1,
      reple: result.reple,
    });
  });
});

//댓글 수정
router.post("/:postNum/reple/modify", (req, res) => {
  Post.findOneAndUpdate(
    {
      postNum: req.params.postNum,
      reple: { $elemMatch: { _id: req.body._id } },
    },
    { $set: { "reple.$.content": req.body.content } }, //찾아낸 post의 요소를 변경하는 방법
    { new: true }
  ).then((result) => {
    console.log(result);
    res.send({
      status: 1,
      reple: result.reple, //해당하는 게시물 한개에 대한 정보
    });
  });
});

//like
router.post("/:postNum/like", (req, res) => {
  console.log(req.body);
  Post.findOneAndUpdate(
    {
      postNum: req.params.postNum,
    },
    {$push: {
        likes: [{ user_id: req.body.user_id }]
      },
    },
    { new: true }
  ).then((result) => {
    console.log(result);
    res.send({
      status: 1,
      result: result,
    });
  });
});

//unlike
router.post("/:postNum/unlike", (req, res) => {
  console.log(req.body)
  Post.findOneAndUpdate(
    {
      postNum: req.params.postNum,
    },
    { $pull: { likes: {user_id : req.body.user_id} } },
    { new: true }
  ).then((result) => {
    res.send({
      status: 1,
      result,
    });
  });
});

//게시물 수정
router.put("/:postNum/modify", (req, res) => {
  Post.findOneAndUpdate(
    { postNum: req.params.postNum },
    { title: req.body.title, image: req.body.image, content: req.body.content },
    (err) => {
      if (err) throw err;
      res.send({ message: "Update Success!" });
    }
  );
});

//게시물 삭제
router.delete("/:postNum/delete", (req, res) => {
  const postNum = req.params.postNum;
  Post.deleteOne({ postNum: postNum }, (err) => {
    if (err) throw err;
    res.send({ message: `Delete Success!` });
  });
});

//댓글삭제
router.post("/:postNum/reple/delete", (req, res) => {
  const postNum = req.params.postNum;
  Post.findOneAndUpdate(
    {
      postNum: postNum,
    },
    { $pull: { reple: { _id: req.body._id } } }, //찾아낸 post의 요소를 변경하는 방법
    { new: true }
  ).then((result) => {
    res.send({
      success: true,
      reples: result.reple,
    });
  });
});

module.exports = router;
