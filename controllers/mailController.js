const { exec } = require('child_process');
const fs = require('fs');
require("dotenv").config();

function getMail(req, res) {   
    res.render("mail");
}


module.exports = {
    getMail
};