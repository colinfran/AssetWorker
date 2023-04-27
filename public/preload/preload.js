const { contextBridge, ipcRenderer } = require("electron")

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
  send: async (channel, data) => {
    // whitelist channels
    const validChannels = [
      "toCheckMount",
      "toGetVersion",
      "toOpenFiles",
      "toCopyFiles",
      "toSetMcm",
      "toOpenLogs",
    ]
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  receive: async (channel, callback) => {
    const validChannels = [
      "fromCheckMount",
      "fromGetVersion",
      "fromOpenFiles",
      "fromCopyFiles",
      "fromSetMcm",
    ]
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      const newCallback = (_, data) => callback(data)
      ipcRenderer.on(channel, newCallback)
    }
  },
})
