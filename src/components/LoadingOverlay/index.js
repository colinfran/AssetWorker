import React from "react"
import "./index.css"

const LoadingOverlay = ({ loading }) => {
  if (!loading) return null
  return (
    <div className="loadingOverlay">
      <div className="loadingWrapper">
        <div className="lds-ellipsis">
          <div />
          <div />
          <div />
          <div />
        </div>
      </div>
    </div>
  )
}

export default LoadingOverlay
