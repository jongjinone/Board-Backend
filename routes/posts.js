const { response } = require("express");
var express = require("express");
var router = express.Router();
const Post = require("../schema/post");

//게시물 목록 불러오기
router.get("/", (req, res) => {
  Post.find({}) //모든 게시물을 불러옴
    .sort({ postNum: -1 }) // postNum을 통해 내림차순 정렬(postNum과 게시글 생성시간은 동일한 것으로 볼 수 있음.)
    .then((response) => {
      res.status(200).json({ success: true, response }); //게시글을 전송
    });
});

//상세 게시물 불러오기
router.get("/:postNum", (req, res) => { //게시물 번호를 통해 해당 게시물을 돌려줌.
  Post.findOne({ postNum: req.params.postNum }, (err, post) => {
    if (err) throw err;
    res.send(post);
  });
});

//게시물 작성
router.post("/upload", (req, res) => {
  const CommunityPost = new Post(req.body); //새로운 포스트모델을 생성하여 요청된 정보와 함께 넘겨줌.
  CommunityPost.save(); //모델을 저장
  res.status(200).json({ success: true });
});

//댓글 작성
router.post("/:postNum/reple/submit", (req, res) => {
  Post.findOneAndUpdate(
    { //번호를 통해 게시물을 찾고
      postNum: req.params.postNum,
    },
    {
      $push: { // 댓글안에 정보를 추가함
        reple: [
          {
            content: req.body.content,
            user_id: req.body.user_id,
          },
        ],
      },
    },
    { new: true }// DB에 바로 저장
  ).then((result) => {
    res.send({
      status: 1,
      reple: result.reple, // 댓글정보를 전송함.
    });
  });
});

//댓글 수정
router.post("/:postNum/reple/modify", (req, res) => {
  Post.findOneAndUpdate(
    { //게시물 번호와 댓글id를 통해 댓글을 찾아냄.
      postNum: req.params.postNum,
      reple: { $elemMatch: { _id: req.body._id } },
    },
    { $set: { "reple.$.content": req.body.content } }, //찾아낸 post 댓글 요소를 변경하는 방법
    { new: true }
  ).then((result) => {
    res.send({
      status: 1,
      reple: result.reple, //해당하는 게시물에 대한 정보
    });
  });
});

//like
router.post("/:postNum/like", (req, res) => {
  Post.findOneAndUpdate(
    { //게시물 번호를 통해 게시글을 찾고,
      postNum: req.params.postNum,
    },
    {$push: { // 요청된 유저 id를 해당 게시글의 likes 배열에 입력해 줌.
        likes: [{ user_id: req.body.user_id }]
      },
    },
    { new: true } // DB에 입력되자마자 저장되어 전달해줌.
  ).then((result) => {
    res.send({
      status: 1,
      result: result, //DB결과를 전송해 줌
    });
  });
});

//unlike
router.post("/:postNum/unlike", (req, res) => {
  Post.findOneAndUpdate( //게시물 번호를 통해 게시글을 찾고,
    {
      postNum: req.params.postNum,
    },        //요청된 유저 id를 해당 게시글의 likes 배열에서 빼줌.
    { $pull: { likes: {user_id : req.body.user_id} } },
    { new: true } // DB에 입력되자마자 저장되어 전달해줌.
  ).then((result) => {
    res.send({
      status: 1,
      result, //DB결과를 전송해 줌
    });
  });
});

//게시물 수정
router.put("/:postNum/modify", (req, res) => {
  Post.findOneAndUpdate( //번호를 통해 게시물을 찾고, 각각 요청정보로 수정
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
  const postNum = req.params.postNum; //게시물 번호를 통해 해당 게시물 삭제
  Post.deleteOne({ postNum: postNum }, (err) => {
    if (err) throw err;
    res.send({ message: `Delete Success!` });
  });
});

//댓글삭제
router.post("/:postNum/reple/delete", (req, res) => {
  const postNum = req.params.postNum;
  Post.findOneAndUpdate( 
    { //게시물 번호를 통해 게시물을 찾고
      postNum: postNum,
    },
    { $pull: { reple: { _id: req.body._id } } }, //찾아낸 post의 댓글 요소를 삭제함.
    { new: true } //db에 바로 저장
  ).then((result) => {
    res.send({
      success: true,
      reples: result.reple,
    });
  });
});

module.exports = router;
