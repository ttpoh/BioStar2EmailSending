var express = require('express');
var router = express.Router();
const mailController = require('../controllers/mailController');

// router.get("/test", function(req,res) {
//     res.send("/testです")

// })

router.get("/", mailController.getMail);
router.post('/smtp', mailController.setSMTP);

module.exports = router;
