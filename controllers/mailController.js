const { exec } = require('child_process');
const request = require('request');
var database = require('../sql_test.js')
const fs = require('fs');
require("dotenv").config();
const nodemailer = require('nodemailer')
const WebSocketClient = require('ws');

const filename = "config/base/basedata.json";

function asyncTask() {
    return new Promise(resolve => {
      // 비동기 작업 시뮬레이션 (예: setTimeout)
      setTimeout(() => {
        console.log('Async task completed.');
        resolve(); // 작업 완료 후 Promise를 해결(resolve)
      }, 1000); // 1초 후에 작업 완료
    });
  }

async function getMail(req, res) {   
    console.log('getMail start')
    let mailInfo = {};
    console.log('database', database)
    database.run('CREATE TABLE Foo (id INTEGER PRIMARY KEY, name TEXT)');

      console.log('테이블 생성 완료');    
      const insertQuery = 'INSERT INTO Foo (name) VALUES (?)';
      database.run(insertQuery, ['John Doe'], function(err) {
        if (err) {
            return console.error('데이터 추가 중 오류:', err.message);
        }
        console.log(`새로운 레코드 추가: ${this.lastID}`);
      })

    if (fs.existsSync(filename)) {
        mailInfo = JSON.parse(fs.readFileSync(filename, 'utf8'));
        console.log('getMail mailInfo', mailInfo)
    
        if((!mailInfo.hasOwnProperty('smtp'))){            
            mailInfo = {
                User: mailInfo.User,
                smtp: { alarm: "", ServerName: '', ServerAddress: '', port: '', password: '',  company: '', parents: ''}
            }
            console.log('getMail smtpInfo', mailInfo)
        }
        res.render("mail", { mailInfo: mailInfo });        
    }
}

async function setSMTP(req, res) {
    console.log('getMail setSMTP start')

    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error('파일을 읽는 도중 오류가 발생했습니다:', err);
            return;
    }        
    let jsondata = JSON.parse(data);    
    const userData = jsondata.User;    
    const requestSBody = req.body  
    const updatedJson = {
        User: userData,
        smtp: { alarm: "", ServerName: requestSBody.SMTPサバーバー名称, ServerAddress: requestSBody.SMTPサバーバーアドレス, port: requestSBody.ポート, password: requestSBody.SMTPパスワード,  company: requestSBody.送信者名メール, parents: requestSBody.受信者メール }
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
    res.redirect('/mail');
})};

async function testMail(){
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error('파일을 읽는 도중 오류가 발생했습니다:', err);
            return;
    }
    let jsondata = JSON.parse(data);    
    let sessionID = jsondata.User.sessionID
    let ServerName = jsondata.smtp.ServerName
    let ServerAddress = jsondata.smtp.ServerAddress
    let company = jsondata.smtp.company
    let password = jsondata.smtp.password
    let parents = jsondata.smtp.parents
    let subject = '"認証 通知"' //인증 통지
    let html = 'test mail'
    // let html = visitTime+"に "+userName+"様が "+visitPlace+"装 に認証しました。"
    //visitTime+"에 "+userName+"님이 "+visitPlace+" 장으로 인증했습니다.
    try{
        const transporter = nodemailer.createTransport({
            service: ServerName,  // 使用しようとするサービス, 사용하고자 하는 서비스
            host: ServerAddress, // hostをgmailに設定, host를 gmail로 설정
            port: 587,
            secure: false,
            auth: {
            user: company, // Gmail 주소 입력
            pass: password // 앱 비밀번호 입력
                }
            })    
        let mailOptions = {
            from: company,
            to: parents,
            subject: subject,
            text: html
        };
        
        // TODO: sendMail의 응답이 안오는경우에 대한 예외처리, sendMailの応答が来ない場合に対する例外処理
        // 서버 주소나 계정 정보가 잘못된 경우에 대한 예외처리, サーバー アドレスまたはアカウント情報が正しくない場合の例外処理
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error occurred:', error);
            } else {
                console.log('Email sent:', info.response);
            } 
        })
    }catch(error){
        if (error instanceof nodemailer.errors.NoTransportError) {
            console.error('Nodemailer transport error:', error);
            // Perform necessary actions to handle the error, such as logging or sending a notification
        } else {
            // Handle other errors
            console.error('Error occurred:', error);
        }
    }
    })

}

async function sendMail(userName, time, place) {
    console.log('getMail sendMail start')
    visitor = userName
    // console.log('sendMail req', req)
    const originalDate = time;
    // 주어진 날짜 문자열을 Date 객체로 변환
    const dateObject = new Date(originalDate);
    // 변경된 날짜 형식으로 포맷팅
    const formattedDate = `${dateObject.getFullYear()}年${dateObject.getMonth() + 1}月${dateObject.getDate()}日` +
                        `${dateObject.getHours()}時${dateObject.getMinutes()}分${dateObject.getSeconds()}秒`;
    visitTime = formattedDate
    visitPlace = place

    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error('파일을 읽는 도중 오류가 발생했습니다:', err);
            return;
    }
    let jsondata = JSON.parse(data);    
    let sessionID = jsondata.User.sessionID
    let ServerName = jsondata.smtp.ServerName
    let ServerAddress = jsondata.smtp.ServerAddress
    let company = jsondata.smtp.company
    let password = jsondata.smtp.password
    let parents = jsondata.smtp.parents
    let subject = '"認証 通知"' //인증 통지
    // let html = visitor+"様が に認証しました。"
    let html = visitTime+"に "+userName+"様が "+visitPlace+"装 に認証しました。"
    //visitTime+"에 "+userName+"님이 "+visitPlace+" 장으로 인증했습니다.
        try{
            const transporter = nodemailer.createTransport({
                service: ServerName,  // 사용하고자 하는 서비스
                host: ServerAddress, // host를 gmail로 설정
                port: 587,
                secure: false,
                auth: {
                user: company, // Gmail 주소 입력
                pass: password // 앱 비밀번호 입력
                    }
                })    
            let mailOptions = {
                from: company,
                to: parents,
                subject: subject,
                text: html
            };
            
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Error occurred:', error);
                } else {
                    console.log('Email sent:', info.response);
                } 
            })
        }catch(error){
            if (error instanceof nodemailer.errors.NoTransportError) {
                console.error('Nodemailer transport error:', error);
                // Perform necessary actions to handle the error, such as logging or sending a notification
            } else {
                // Handle other errors
                console.error('Error occurred:', error);
            }
        }
    })
    // res.redirect('/mail');
}

async function alarmOn(req, res, next) {
    var ipAddress;
    let sessionID;
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error('파일을 읽는 도중 오류가 발생했습니다:', err);
            return;
        }   
        let jsondata = JSON.parse(data);    
        console.log('alarmOn jsondata', jsondata.User.url)
        ipAddress = jsondata.User.url
        sessionID = jsondata.User.sessionID
        console.log('alarmOn');

        console.log('alarmOn ipAddress', ipAddress);
        console.log('alarmOn sessionID', sessionID);
        })        

    // const BIOSTAR_WEBSOCKET_URL =  ;
    await asyncTask(); // 비동기 작업 완료를 기다림

    console.log("sessionID websocket", sessionID);

    var ws = new WebSocketClient("https://"+ipAddress+"/wsapi", {rejectUnauthorized: false});

    ws.on('error', console.error);

    ws.on('open', function open() {
        console.log('WebSocket Client Connected');
        
        ws.send('bs-session-id' + "=" + sessionID);        
        
        setTimeout(function() { 
            eventStart(); 
        }, 1000);      

        function eventStart(){
            console.log('eventRequest start')
            request.post({
                url: "https://"+ipAddress+'/api/events/start',
                method: 'POST',
                rejectUnauthorized: false,
                json: true,
                headers: {
                    accept: "application/json",
                    "content-type": "application/json",
                    "bs-session-id": sessionID
                },function(error, response, body){
                        console.log("error", error);
                        console.log("response", response);
                }})
            };        
    });
    ws.on('message', function message(data) {        
        strData = data.toString('utf-8')
        // console.log('strData', strData)
        const parsedResData = JSON.parse(strData);
        if('Event' in parsedResData)  {
            const eventTypeID = parsedResData.Event.event_type_id.code //読み込んだ値を変数に入れて出力しなければならない。 
            console.log('eventID', eventTypeID);          
            if(eventTypeID == '4867') {
                console.log('顔の承認を呼ぶ。')
                console.log('parsedResData', parsedResData)
                console.log('user_data: %s', parsedResData.Event);
                
                console.log('user_id: %s', parsedResData.Event.user_id.user_id);    
                console.log('server_datetime: %s', parsedResData.Event.server_datetime);    
                console.log('device_id: %s', parsedResData.Event.device_id.name);    
                
                const userName = parsedResData.Event.user_id.name
                // const userMail = parsedResData.Event.user_id.user_mail
                // const customMail = parsedResData.Event.user_id.user_custom_fields
                const visitTime = parsedResData.Event.server_datetime
                const visitPlace = parsedResData.Event.device_id.name
                sendMail(userName, visitTime, visitPlace)
                next()
            }else{
                console.log('카드 승인 외 로그. ')
            }
        }
    });
    res.redirect('/mail');
}

function alarmOff(req, res) {
    console.log('alarmOff');

}


module.exports = {
    getMail,
    setSMTP,
    testMail,
    sendMail,
    alarmOn,
    alarmOff
};