const { exec } = require('child_process');
const fs = require('fs');
require("dotenv").config();
const filename = "config/base/basedata.json";

function getMail(req, res) {   
    res.render("mail");
}

function setSMTP(req, res) {
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error('파일을 읽는 도중 오류가 발생했습니다:', err);
            return;
        }
    console.log('setSMTP data', data)
    let jsondata = JSON.parse(data);
    console.log('setSMTP jsondata', jsondata)

    const userData = jsondata.user;

    console.log('setSMTP userData', userData)

        // 기존 데이터를 파싱합니다.    
    
    const requestSBody = req.body
    // const jsonData = { smtp: { SMTPサバーバー名称: requestSBody.SMTPサバーバー名称, 説明: requestSBody.説明, サバーバーアドレス: requestSBody.サバーバーアドレス, ポート: requestSBody.ポート, ユーザー名称: requestSBody.ユーザー名称, パスワード: requestSBody.パスワード, セキュリティタイプセキュリティタイプ: requestSBody.セキュリティタイプセキュリティタイプ, 送信者名: requestSBody.送信者名, セキュリティタイプ: requestSBody.セキュリティタイプ, smtpsave: requestSBody.smtpsave, テストメール宛先: requestSBody.テストメール宛先 } };

    const updatedJson = {
        user: userData,
        smtp: { SMTPサバーバー名称: requestSBody.SMTPサバーバー名称, 説明: requestSBody.説明, サバーバーアドレス: requestSBody.サバーバーアドレス, ポート: requestSBody.ポート, ユーザー名称: requestSBody.ユーザー名称, パスワード: requestSBody.パスワード, セキュリティタイプセキュリティタイプ: requestSBody.セキュリティタイプセキュリティタイプ, 送信者名: requestSBody.送信者名, セキュリティタイプ: requestSBody.セキュリティタイプ, smtpsave: requestSBody.smtpsave, テストメール宛先: requestSBody.テストメール宛先 }
    }
    console.log('setSMTP updatedJson', updatedJson)

    fs.writeFile(filename, JSON.stringify(updatedJson, null, 2), (err) => {
        if (err) {
            console.error('Error writing file:', err);
            res.status(500).send('Error saving data');
            return;
        }
        console.log('Data saved successfully');
        res.json({ message: 'Data saved successfully' });
    });
    fs.readFile(filename, 'utf8', (err, saveAfterData) => {
        if (err) {
            console.error('파일을 읽는 도중 오류가 발생했습니다:', err);
            return;
        }
    console.log('setSMTP save after data', saveAfterData);
    let SAjsondata = JSON.parse(saveAfterData);
    console.log('save after', SAjsondata);

    const afteruserData = SAjsondata.user;
    console.log('setSMTP afteruserData', afteruserData);
    const smtpData = SAjsondata.smtp;
    console.log('setSMTP aftersmtpData', smtpData);
    })
    
    res.redirect('/mail');
})};


module.exports = {
    getMail,
    setSMTP
};