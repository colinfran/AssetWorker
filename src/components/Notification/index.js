import React from "react"
import Toast from "react-bootstrap/Toast"
import ToastContainer from "react-bootstrap/ToastContainer"

const Notification = ({ notification }) => {
  return (
    <div>
      {Object.keys(notification).length > 0 && (
        <ToastContainer className="p-3" position="bottom-start">
          <Toast bg={notification.type}>
            <Toast.Header closeButton={false}>
              <strong className="me-auto">{notification.title}</strong>
            </Toast.Header>
            <Toast.Body>{notification.message}</Toast.Body>
          </Toast>
        </ToastContainer>
      )}
    </div>
  )
}

export default Notification
