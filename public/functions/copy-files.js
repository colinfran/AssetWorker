const fs = require("fs-jetpack")
const util = require("util")
const constructPath = require("./construct-path")
const replaceStrings = require("./replace-strings")
const exec = util.promisify(require("child_process").exec)

const copyFiles = async (
  openOrCopyFromCIID,
  openOrCopyFromBrand,
  openInDefaultEditor,
  copyToCIID,
  copyToBrand,
  copyAssetsDirectory,
  updatePaths,
  log
) => {
  const pathSource = constructPath(openOrCopyFromCIID, openOrCopyFromBrand)
  const pathDestination = constructPath(copyToCIID, copyToBrand)
  const existsSource = fs.exists(pathSource)
  const existsDestination = fs.exists(pathDestination)
  log.info(`Checking if the path '${pathSource}' exists.`)
  if (!existsSource) {
    const message = "Source directory does not exist!"
    log.info(message)
    return {
      success: false,
      title: "Error",
      message,
    }
  }
  log.info(`Source path exists.`)
  log.info(`Checking if the path '${pathDestination}' exists.`)
  if (existsDestination) {
    const message = "Destination directory already exists!"
    log.info(message)
    return {
      success: false,
      title: "Error",
      message,
    }
  }
  log.info(
    `Destination path does not exist; New files can be copied to this path.`
  )
  const createNewDirectory = async () => {
    log.info(`Attempting to create new directory.`)
    const cmd = `mkdir -p ${pathDestination}`
    const { stderr } = await exec(cmd)
    if (stderr) {
      const message = "Error creating new directory"
      log.error(message)
      log.error(stderr)
      return {
        success: false,
        title: "Error",
        message,
      }
    }
    if (!fs.exists(pathDestination)) {
      const message = "Error creating new directory"
      log.error(message)
      return {
        success: false,
        title: "Error",
        message,
      }
    }
    log.info(`Successfully created new directory.`)
    return null
  }

  const copyResourcesIntoDirectory = async () => {
    if (copyAssetsDirectory) {
      log.info(`Attempting to copy asset files into destination directory.`)
      const copyAllFilesCommand = `cp -r ${pathSource} ${pathDestination}`
      const { stderr } = await exec(copyAllFilesCommand)
      if (stderr) {
        const message =
          "Error copying files and assets to destination directory"
        log.error(message)
        log.error(stderr)
        return {
          success: false,
          title: "Error",
          message,
        }
      }
      log.info(
        `Successfully copied files and assets into destination directory.`
      )
    } else {
      log.info(`Attempting to copy files into destination directory`)
      const copyFilesWithoutAssets = `rsync -ax --exclude assets ${pathSource} ${pathDestination}`
      const { stderr } = await exec(copyFilesWithoutAssets)
      if (stderr) {
        const message = "Error copying files to destination directory"
        log.error(message)
        log.error(stderr)
        return {
          success: false,
          title: "Error",
          message,
        }
      }
      log.info(`Successfully copied files into destination directory.`)
    }
    return null
  }

  const updateCopyPathFiles = async (fileType) => {
    const newFilePath = `${pathDestination}cn${copyToCIID}.${fileType}`
    if (updatePaths) {
      const oldFilePath = `${pathDestination}cn${openOrCopyFromCIID}.${fileType}`
      if (fs.exists(oldFilePath)) {
        log.info(`Attempting to update paths in new files for ${fileType} file`)
        fs.readAsync(oldFilePath).then((data1) => {
          const result = replaceStrings(
            data1,
            openOrCopyFromCIID,
            copyToCIID,
            pathSource,
            pathDestination,
            openOrCopyFromBrand,
            copyToBrand,
            true
          )
          fs.writeAsync(newFilePath, result).then(async () => {})
        })
      }
    }
  }

  const removeOldFiles = async (fileType) => {
    const oldFilePath = `${pathDestination}cn${openOrCopyFromCIID}.${fileType}`
    if (fs.exists(oldFilePath)) {
      log.info(`Removing old copy file.`)
      const removeOldFileCommand = `rm ${pathDestination}cn${openOrCopyFromCIID}.${fileType}`
      const { stderr } = await exec(removeOldFileCommand)
      if (stderr) {
        const message = `Error updating ${fileType} Copy Path Files`
        log.error(message)
        log.error(stderr)
        return {
          success: false,
          title: "Error",
          message,
        }
      }
      log.info(`Successfully removed old copy file.`)
    }
    return null
  }

  const openDirectoriesAndFiles = async () => {
    log.info(`Attempting to open destination directory.`)
    const openPathCommand = `open ${pathDestination}`
    const { stderr: stderr1 } = await exec(openPathCommand)
    if (stderr1) {
      const message = `Error opening destination directory`
      log.error(message)
      log.error(stderr1)
      return {
        success: false,
        title: "Error",
        message,
      }
    }
    log.info(`Successfully opened destination directory.`)
    if (openInDefaultEditor.length > 0) {
      await Promise.all(
        openInDefaultEditor.map(async (item) => {
          const newFilePath = `${pathDestination}cn${copyToCIID}.${item}`
          log.info(`Attempting to open ${item} file.`)
          const newFileCOmmand = `open ${newFilePath}`
          const { stderr: stderr2 } = await exec(newFileCOmmand)
          if (stderr2) {
            const message = `Error opening ${item} file`
            log.error(message)
            log.error(stderr2)
            return {
              success: false,
              title: "Error",
              message,
            }
          }
          log.info(`Successfully opened ${item} file.`)
          return null
        })
      )
    }
    return null
  }

  await createNewDirectory()
  await copyResourcesIntoDirectory()
  if (updatePaths) {
    const arr = ["json", "html", "js", "css"]
    await Promise.all(
      arr.map(async (item) => {
        await updateCopyPathFiles(item)
        await removeOldFiles(item)
      })
    )
  }
  log.info(`Files copied from ${pathSource} to ${pathDestination} successfully`)
  await openDirectoriesAndFiles()
  return {
    success: true,
    title: "Success",
    message: `Files copied from ${pathSource} to ${pathDestination} successfully`,
  }
}

module.exports = copyFiles
