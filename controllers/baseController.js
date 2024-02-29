const { exec } = require('child_process');
const request = require('request');

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
      }, 1000); // 2초 후에 작업 완료
    });
  }

function getBase(req, res) {
    // biostar2ログイン情報, APIのアクセストークン、それぞれの値を取得する
    console.log('getBase', filename)
    let baseInfo = { User: { url: '', login_id: '', password: '', sessionID: ''} };
    if (fs.existsSync(filename)) {
        // baseInfo = {};
        try {
            baseInfo = JSON.parse(fs.readFileSync(filename, 'utf8'));
        } catch(e) {
            console.log("base情報がありません");
        }; 
        console.log('디렉토리가 존재합니다.');
    } else {
        console.log('디렉토리가 존재하지 않습니다.');
        let baseInfo = { User: { url: '', login_id: '', password: '', sessionID: ''} };
            fs.writeFile(filename, JSON.stringify(baseInfo, null, 2), (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    res.status(500).send('Error saving data');
                    return;
                }
                console.log('디렉토리 생성.');
                
            })
        // return baseInfo // baseInfo에 비어 있는 json 데이터 할당한 것 반환해서 페이지 로딩 때 input value에서 호출 가능.
    }
    console.log('getB baseInfo5', baseInfo)
    res.render("base", { baseInfo: baseInfo });
}

async function postLogin(req, res){    
    const requestB = req;
    // console.log('PostLoginReq', requestB)
    const requestBody = req.body;
    console.log('PostLoginReqBody', requestBody)
    const jsonData = { user: { url: requestBody.url, user_id: requestBody.user_id, password: requestBody.password, sessionID: ''} };
    
    console.log('PostLogin jsonData', jsonData)
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
            const jsonStRes = JSON.stringify(response);
            const parsedResData = JSON.parse(jsonStRes);
        
            console.log("error", error);
            // console.log("response header", parsedResData.headers);
            // console.log("responseData session", parsedResData.headers['bs-session-id']);
            sessionID = parsedResData.headers['bs-session-id']
            console.log("sessionID", sessionID);
            console.log("postData", postData);
            postData.User.sessionID = sessionID
            console.log("postData add sessionID", postData);

        })   
        await asyncTask(); // 비동기 작업 완료를 기다림
        // req.session.sessionValue = sessionID;
        fs.writeFile(filename, JSON.stringify(postData, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                res.status(500).send('Error saving data');
                return;
            }
            console.log('Data saved successfully');            
        });
        // });   
    
    
    // res.render('/mail');
    res.redirect('/mail');


}


module.exports = {
    getBase,
    postLogin
};