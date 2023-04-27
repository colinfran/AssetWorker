const os = require("os")
const { exec } = require("child_process")

const openLogs = async () => {
  const homeDir = os.userInfo().homedir
  exec(`open "${homeDir}/Library/Logs/WCD AssetWorker/"`)
}

module.exports = openLogs
