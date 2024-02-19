const { exec } = require('child_process');
const fs = require('fs');
require("dotenv").config();
const filename = "config/base/basedata.json";

function getBase(req, res) {
    // biostar2ログイン情報, APIのアクセストークン、それぞれの値を取得する
    console.log('getBase', filename)
    let baseInfo = {};
    try {
        baseInfo = JSON.parse(fs.readFileSync(filename, 'utf8'));
    } catch(e) {
        console.log("base情報がありません");
    };
    
    // fs.readFile(filename, 'utf8', (err, saveAfterData) => {
    //     if (err) {
    //         console.error('파일을 읽는 도중 오류가 발생했습니다:', err);
    //         return;
    //     }
    // console.log('setSMTP save after data', saveAfterData);
    // let SAjsondata = JSON.parse(saveAfterData);
    // console.log('save after', SAjsondata);

    // const afteruserData = SAjsondata.user;
    // console.log('setSMTP afteruserData', afteruserData);
    // const smtpData = SAjsondata.smtp;
    // console.log('setSMTP aftersmtpData', smtpData);
    // })

    console.log('getB baseInfo', baseInfo)
    res.render("base", { baseInfo: baseInfo });
}
function postLogin(req, res){    
    const requestB = req;
    console.log('PostLoginReq', requestB)
    const requestBody = req.body;
    console.log('PostLoginReqBody', requestBody)
    const jsonData = { user: { url: requestBody.url, user_id: requestBody.user_id, password: requestBody.password } };


    // Write data to JSON file
    fs.writeFile(filename, JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
            console.error('Error writing file:', err);
            res.status(500).send('Error saving data');
            return;
        }
        console.log('Data saved successfully');
        res.json({ message: 'Data saved successfully' });
    });
    
    res.redirect('/mail');

}


module.exports = {
    getBase,
    postLogin
};