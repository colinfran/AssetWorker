import React from "react"
import uniqid from "uniqid"
import "./index.css"

const renderLogs = (logs) => {
  return logs.map((item) => {
    return (
      <div key={uniqid()} className="individualLog">
        {logs.length > 1 && <div className="logLine" />}
        <div>{item}</div>
      </div>
    )
  })
}

const Logs = ({ logs }) => {
  return (
    <div className="logsContainer">
      {logs.length > 0 ? (
        <div className="logsWrapper">{renderLogs(logs)}</div>
      ) : (
        <div>No Logs</div>
      )}
    </div>
  )
}

export default Logs
