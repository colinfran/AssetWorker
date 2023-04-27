import React, { useEffect, useState } from "react"
import "./index.css"

const Footer = () => {
  // App version state
  const [appVersion, setAppVersion] = useState("")
  const getAppVersion = async () => {
    window.api.send("toGetVersion", {})
  }
  useEffect(() => {
    getAppVersion()
    window.api.receive("fromGetVersion", (data) => {
      setAppVersion(data.versionNumber)
    })
  }, [])

  return (
    <div className="footerContainer">
      <div>{`v${appVersion}`}</div>
      <div>
        <span>
          Made with ♥ by <span>Colin Franceschini</span>
        </span>
      </div>
    </div>
  )
}

export default Footer
