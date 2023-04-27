const fs = require("fs-jetpack")

const checkMount = () => {
  const exists = fs.exists("/Volumes/Asset_Archive/")
  if (exists) {
    return {
      mounted: true,
      message: "Success: Asset Archive is mounted.",
    }
  }
  return {
    mounted: false,
    message:
      "Warning: The Asset Archive volume is not connected. Please connect.",
  }
}

module.exports = checkMount
