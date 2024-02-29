var express = require('express');
var router = express.Router();
const baseController = require('../controllers/baseController');

router.get("/", baseController.getBase);
router.post('/login', baseController.postLogin);

module.exports = router;
