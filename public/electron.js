const { app, BrowserWindow, ipcMain, dialog } = require("electron")
const isDev = require("electron-is-dev")
const log = require("electron-log")
const path = require("path")
const url = require("url")
const puppeteer = require("puppeteer-core")
const pie = require("puppeteer-in-electron")
const { performance } = require("perf_hooks")
const { autoUpdater } = require("electron-updater")
const mcmSet = require("./functions/set-mcm")
const checkMount = require("./functions/check-mount")
const openFiles = require("./functions/open-files")
const copyFiles = require("./functions/copy-files")
const openLogs = require("./functions/open-logs")
const env = require("./env/env.json")

log.transports.console.format = "[{m}/{d}/{y} {h}:{i}:{s}.{ms}] | {text}"

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true"
let browser
let defaultWindow
let puppeteerWindow

autoUpdater.setFeedURL({
  provider: "github",
  owner: "wcd",
  repo: "AssetWorker",
  host: "github.gapinc.com",
  token: env.token,
})

const main = async () => {
  log.info("AssetWorker app is starting up.")
  await pie.initialize(app)
  browser = await pie.connect(app, puppeteer)
  puppeteerWindow = new BrowserWindow({
    show: false,
    webPreferences: { nodeIntegration: false, contextIsolation: false },
  })
  puppeteerWindow.loadURL("https://example.com")
  log.info("Puppeteer is connected")

  // actual window
  defaultWindow = new BrowserWindow({
    width: 500,
    height: 800,
    show: true,
    resizable: false,
    webPreferences: {
      preload: `${__dirname}/preload/preload.js`,
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  // use localhost:3000 for hot reload in development
  const startUrl = isDev
    ? "http://localhost:3000"
    : url.format({
        pathname: path.join(__dirname, "./index.html"),
        protocol: "file:",
        slashes: true,
      })

  defaultWindow.loadURL(startUrl)

  const checkForUpdates = () => {
    autoUpdater.checkForUpdatesAndNotify()
  }

  if (!isDev) {
    checkForUpdates()
    setInterval(checkForUpdates, 3600000)
  } else {
    // Open the DevTools if in development.
    defaultWindow.webContents.openDevTools()
  }

  defaultWindow.on("close", () => {
    defaultWindow = null
    puppeteerWindow = null
    app.quit()
  })

  puppeteerWindow.webContents.on(
    "did-fail-load",
    (errorCode, errorDescription) => {
      log.error("An error occured. (did-fail-load). Could not load page.")
      log.error(`Error code: ${errorCode}`)
      log.error(`Error description: ${errorDescription}`)
    }
  )

  ipcMain.on("toCheckMount", async () => {
    const obj = checkMount()
    defaultWindow.webContents.send("fromCheckMount", obj)
  })

  ipcMain.on("toGetVersion", async () => {
    log.info("Request to api for 'getVersion' occured. Returning version.")
    const obj = { versionNumber: app.getVersion() }
    defaultWindow.webContents.send("fromGetVersion", obj)
  })

  ipcMain.on("toSetMcm", async (event, args) => {
    log.info("Request to api for 'mcmSet' occured. Running.")
    const {
      usernameMCM: username,
      passwordMCM: password,
      mcmCiid: ciid,
      mcmBrand: brand,
      logs,
    } = args
    const start = performance.now()
    const obj = await mcmSet(
      username,
      password,
      ciid,
      brand,
      log,
      browser,
      puppeteerWindow,
      pie
    )
    const end = performance.now()
    const time = (end - start).toFixed(2)
    log.info(
      `The action 'mcmSet' has finished running. Execution time: ${time} ms`
    )
    obj.logs = logs
    defaultWindow.webContents.send("fromSetMcm", obj)
  })

  ipcMain.on("toOpenFiles", async (event, args) => {
    const start = performance.now()
    log.info("Request to api for 'openFiles' occured. Running.")
    const {
      openOrCopyFromCIID,
      openOrCopyFromBrand,
      openInDefaultEditor,
      logs,
    } = args
    const obj = await openFiles(
      openOrCopyFromCIID,
      openOrCopyFromBrand,
      openInDefaultEditor,
      log
    )
    let returnObj = obj
    // eslint-disable-next-line prefer-destructuring
    if (Array.isArray(obj)) returnObj = obj[0]
    const end = performance.now()
    const time = (end - start).toFixed(2)
    returnObj.logs = logs
    defaultWindow.webContents.send("fromOpenFiles", returnObj)
    log.info(
      `The action 'openFiles' has finished running. Execution time: ${time} ms`
    )
  })

  ipcMain.on("toCopyFiles", async (event, args) => {
    log.info("Request to api for 'copyAction' occured. Running.")
    const {
      openOrCopyFromCIID,
      openOrCopyFromBrand,
      openInDefaultEditor,
      copyToCIID,
      copyToBrand,
      copyAssetsDirectory,
      updatePaths,
      logs,
    } = args
    const start = performance.now()
    const obj = await copyFiles(
      openOrCopyFromCIID,
      openOrCopyFromBrand,
      openInDefaultEditor,
      copyToCIID,
      copyToBrand,
      copyAssetsDirectory,
      updatePaths,
      log
    )
    const end = performance.now()
    const time = (end - start).toFixed(2)
    log.info(
      `The action 'copyAction' has finished running. Execution time: ${time} ms`
    )
    obj.logs = logs
    defaultWindow.webContents.send("fromCopyFiles", obj)
  })

  ipcMain.on("toOpenLogs", async () => {
    log.info(
      "Request to api for 'openLogs' occured. Opening error logs folder."
    )
    openLogs()
  })

  app.on("before-quit", async () => {
    defaultWindow = null
    puppeteerWindow = null
    app.quit()
  })

  // Quit when all windows are closed.
  app.on("window-all-closed", async () => {
    defaultWindow = null
    puppeteerWindow = null
    app.quit()
  })

  autoUpdater.on("checking-for-update", () => {
    log.info("Checking for update...")
  })
  autoUpdater.on("update-available", () => {
    log.info("Update available.")
    const dialogieOpts = {
      type: "info",
      buttons: ["Ok"],
      title: "Update Available",
      message: "Update Available. Click ok to download.",
      detail:
        "A new version download started. The app will be restarted to install the update.",
    }
    dialog.showMessageBox(dialogieOpts)
  })
  autoUpdater.on("update-downloaded", () => {
    autoUpdater.quitAndInstall()
  })
  autoUpdater.on("update-not-available", () => {
    log.info("Update not available.")
  })
  autoUpdater.on("error", (err) => {
    log.error(`Error in auto-updater.`)
    log.error(err)
  })
}
main()
