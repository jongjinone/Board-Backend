const express = require("express");
const router = express.Router();
const Test = require("../schema/test");

/* GET Tests listing. */
router.get("/", function (req, res, next) {
  Test.find({}, function (err, test) {
    if (err) throw err;
    res.send(test);
  });
});

router.post("/", function (req, res, next) {
  console.log(req.body)
  const { Name, Phone } = req.body;
  const insertTest = new Test({ Name, Phone });
  insertTest.save(function (err) {
    if (err) throw err;
    res.send("성공했습니다.");
  });
});

router.get("/:testId", function (req, res, next) {
  Test.findById(req.params.testId, function (err, test) {
    if (err) throw err;
    res.header("content-Type", "application/json");
    res.send(JSON.stringify(test, null, 4));
  });
});

router.put("/", function (req, res, next) {
  const { testId, Name, Phone } = req.body;
  Test.findOneAndUpdate(
    { _id: testId },
    { Name: Name, Phone: Phone},
    function (err) {
      if (err) throw err;
      res.send({ message: "Update Success!" });
    }
  );
});

router.delete('/', function(req, res, next){
  const { testId } = req.body;
  Test.deleteOne({ _id: testId }, function(err){
    if (err) throw err;
    res.send({message: `Delete Success!`})
  });
});

module.exports = router;
