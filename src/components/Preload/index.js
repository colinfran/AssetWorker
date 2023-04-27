import React from "react"
import wcdLogo from "../../assets/wcdlogo.png"
import "./index.css"

const Preload = () => {
  return (
    <div className="preLoadingContainer">
      <div>
        <img className="logoWCD" src={wcdLogo} alt="WCD Logo" />
      </div>
      <div className="loading-text">Asset Worker is loading...</div>
      <div className="lds-ellipsis">
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  )
}

export default Preload
