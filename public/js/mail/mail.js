window.onload = function () {
    // biostar2設定
    if (smtpInfo.smtp) {
        console.log("mail.js", smtpInfo)
        document.getElementById("SMTPサバーバー名称").value = smtpInfo.smtp.ServerName;
        document.getElementById("SMTPサバーバーアドレス").value = smtpInfo.smtp.ServerAddress;
        document.getElementById("ポート").value = smtpInfo.smtp.port;
        document.getElementById("SMTPパスワード").value = smtpInfo.smtp.password;
        document.getElementById("送信者名メール").value = smtpInfo.smtp.company;
        document.getElementById("受信者メール").value = smtpInfo.smtp.port;

    }
}