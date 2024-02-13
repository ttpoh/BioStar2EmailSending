var express = require('express');
var router = express.Router();
const baseController = require('../controllers/baseController');

// router.get("/test", function(req,res) {
//     res.send("/testです")

// })

router.get("/", baseController.getBase);

module.exports = router;
