const { exec } = require('child_process');
const fs = require('fs');
require("dotenv").config();

function getBase(req, res) {
    // biostar2ログイン情報, APIのアクセストークン、それぞれの値を取得する
    let baseInfo = {};
    try {
        baseInfo = JSON.parse(fs.readFileSync(`./config/base/basedata.json`, 'utf8'));
    } catch(e) {
        console.log("base情報がありません");
    };  
    res.render("base", {baseInfo: baseInfo});
}



module.exports = {
    getBase
};