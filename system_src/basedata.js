const fs = require('fs');

async function main() {  
  /**
   * @type {String} biostar2のURL(cmd経由で取得)
   */
  const url = process.argv[2];

  /**
   * @type {String} biostar2のAdminユーザーのid(cmd経由で取得)
   */
  const loginId = process.argv[3];

  /**
   * @type {String} biostar2のAdminユーザーのパスワード(cmd経由で取得)
   */
  const password = process.argv[4];

  const baseData =  {
    "BIOSTAR_URL": url,
    "ADMIN_USER": {
      "ID": loginId,
      "PASSWORD": password
    },
  };

  fs.writeFileSync("config/base/basedata.json", JSON.stringify(baseData, null, "\t"));

}
main()