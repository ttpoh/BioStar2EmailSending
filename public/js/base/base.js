window.onload = function () {
    // biostar2設定
    if (baseInfo.BIOSTAR_URL) {
        console.log("base.js", baseInfo)
        document.getElementById("url").value = baseInfo.BIOSTAR_URL;
        document.getElementById("user_id").value = baseInfo.ADMIN_USER.ID;
        document.getElementById("password").value = baseInfo.ADMIN_USER.PASSWORD;
    }
}