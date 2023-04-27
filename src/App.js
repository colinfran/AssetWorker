import React, { useEffect, useState, useContext } from "react"
import "./App.css"
import AssetArchive from "./components/AssetArchive"
import Mcm from "./components/Mcm"
import Logs from "./components/Logs"
import Header from "./components/Header"
import Preload from "./components/Preload"
import Footer from "./components/Footer"
import LoadingOverlay from "./components/LoadingOverlay"
import Notification from "./components/Notification"
import { ThemeContext } from "./theme"

const App = () => {
  // Notification state
  const [notification, setNotification] = useState({})

  // AssetArchive mounted state
  const [isMounted, setIsMounted] = useState(false)

  // mcm login states
  const [usernameMCM, setUsernameMCM] = useState("")
  const [passwordMCM, setPasswordMCM] = useState("")

  // Logs state
  const [logs, setLogs] = useState([])

  // Loading state that shows when app is completing tasks
  const [loading, setLoading] = useState(false)

  // 'Is app ready?' state
  const [pageStartup, setPageStartup] = useState(true)

  // context provider to hold theme value based on user selection
  const { mode, setMode } = useContext(ThemeContext)

  const runNotification = (obj) => {
    setNotification(obj)
    setTimeout(() => {
      setNotification({})
    }, 5000)
  }

  const startup = async () => {
    const checkMount = async () => {
      const checkMountRequest = async () => {
        window.api.send("toCheckMount", {})
      }
      checkMountRequest()
      setInterval(async () => {
        checkMountRequest()
      }, 10000)
    }
    checkMount()
    window.api.receive("fromCheckMount", (data) => {
      if (data.mounted) {
        setIsMounted(true)
      } else {
        setIsMounted(false)
      }
    })
    const userMCM = localStorage.getItem("usernameMCM")
    if (userMCM) setUsernameMCM(userMCM)
    const pwMCM = localStorage.getItem("passwordMCM")
    if (pwMCM) setPasswordMCM(pwMCM)
    setTimeout(() => {
      setPageStartup(false)
    }, 5000)
  }

  useEffect(() => {
    startup()
  }, [])

  if (pageStartup) {
    return (
      <div>
        <Preload />
      </div>
    )
  }

  return (
    <div className="App">
      <div>
        <Header
          usernameMCM={usernameMCM}
          setUsernameMCM={setUsernameMCM}
          passwordMCM={passwordMCM}
          setPasswordMCM={setPasswordMCM}
          isMounted={isMounted}
          mode={mode}
          setMode={setMode}
        />
      </div>
      <div>
        <AssetArchive
          isMounted={isMounted}
          notification={notification}
          runNotification={runNotification}
          logs={logs}
          setLogs={setLogs}
          setLoading={setLoading}
        />
      </div>
      <div>
        <Mcm
          runNotification={runNotification}
          logs={logs}
          setLogs={setLogs}
          setLoading={setLoading}
          usernameMCM={usernameMCM}
          passwordMCM={passwordMCM}
        />
      </div>
      <div>
        <Logs logs={logs} />
      </div>
      <Footer />
      <LoadingOverlay loading={loading} />
      <Notification notification={notification} />
    </div>
  )
}

export default App
