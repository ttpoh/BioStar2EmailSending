const { exec } = require('child_process');
const request = require('request');
let database = require('../server.js')

const fs = require('fs');
require("dotenv").config();
const filename = "config/base/basedata.json";
let sessionID;
let ipAddress = "https://192.168.0.126:443/";


function asyncTask() {
    return new Promise(resolve => {
      // 비동기 작업 시뮬레이션 (예: setTimeout)
      setTimeout(() => {
        console.log('Async task completed.');
        resolve(); // 작업 완료 후 Promise를 해결(resolve)
      }, 5000); // 2초 후에 작업 완료
    });
  }

function getBase(req, res) {
    // biostar2ログイン情報, APIのアクセストークン、それぞれの値を取得する    
    let baseInfo = { User: { url: '', login_id: '', password: '', sessionID: ''} };

    if (fs.existsSync(filename)) {
        try {
            baseInfo = JSON.parse(fs.readFileSync(filename, 'utf8'));
        } catch(e) {
            console.log("base情報がありません");
        }; 
        console.log('디렉토리가 존재합니다.');
    } else {
        console.log('디렉토리가 존재하지 않습니다.');        
    }
    res.render("base", { baseInfo: baseInfo });
}

async function postLogin(req, res){    
    const requestBody = req.body;
    const jsonData = { user: { url: requestBody.url, user_id: requestBody.user_id, password: requestBody.password, sessionID: ''} };
    
    console.log('PostLogin jsonDataddddd', jsonData)
    console.log(ipAddress)
    // ipAddress = requestBody.url
    const postData = {
        User: {
        url: requestBody.url,
        login_id: requestBody.user_id,
        //   login_id: 'admin',
        //   password: 'admin1234'
        password: requestBody.password,
        sessionID: ''
        }};  
    request.post({
        url: ipAddress+'api/login',
        method: 'POST',
        rejectUnauthorized: false,
        json: true,   
        body: postData
            }, function(error, response, body){
            console.log("postData error", error);
            console.log("login api body", body);

            const jsonStRes = JSON.stringify(response);
            const parsedResData = JSON.parse(jsonStRes);
            sessionID = parsedResData.headers['bs-session-id']
            postData.User.sessionID = sessionID
            fs.writeFile(filename, JSON.stringify(postData, null, 2), (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    res.status(500).send('Error saving data');
                    return;
                }
                console.log('Data saved successfully');            
            });        
        res.redirect('/mail');
        })
}


module.exports = {
    getBase,
    postLogin
};