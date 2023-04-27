const fs = require("fs-jetpack")
const util = require("util")
const exec = util.promisify(require("child_process").exec)
const constructPath = require("./construct-path")

const openFiles = async (
  openOrCopyFromCIID,
  openOrCopyFromBrand,
  openInDefaultEditor,
  log
) => {
  const path = constructPath(openOrCopyFromCIID, openOrCopyFromBrand)
  log.info(`Checking if the path '${path}' exists.`)
  const exists = fs.exists(path)
  if (!exists) {
    const message = "Source directory does not exist!"
    log.info(message)
    return {
      success: false,
      title: "Error",
      message,
    }
  }
  log.info(`Path exists. Attempting to open directory.`)
  const openPathCommand = `open ${path}`
  const { stderr } = await exec(openPathCommand)
  if (stderr) {
    log.error("Something went wrong while trying to open directory")
    log.error(stderr)
    return {
      success: false,
      title: "Error",
      message: "Something went wrong while trying to open directory.",
    }
  }
  const message = `Directory at ${path} opened successfully`
  if (openInDefaultEditor.length === 0) {
    log.info(message)
    return {
      success: true,
      title: "Success",
      message,
    }
  }
  log.info(message)
  const obj = await Promise.all(
    openInDefaultEditor.map(async (item) => {
      log.info(`Opening ${item} file`)
      const filePath = `${path}cn${openOrCopyFromCIID}.${item}`
      if (fs.exists(filePath)) {
        const openFileCommand = `open ${filePath}`
        const { stderr: stderr1 } = await exec(openFileCommand)
        if (stderr1) {
          const message1 = `Something went wrong with open editor for ${item} file.`
          log.error(message1)
          log.error(stderr1)
          return {
            success: false,
            title: "Error",
            message: message1,
          }
        }
        const message2 = `File at ${filePath} opened successfully`
        log.info(message2)
        return {
          success: true,
          title: "Success",
          message: message2,
        }
      }
      const message1 = `Something went wrong with open editor for ${item} file.`
      log.error(message1)
      return {
        success: false,
        title: "Error",
        message: message1,
      }
    })
  )
  return obj
}
module.exports = openFiles
