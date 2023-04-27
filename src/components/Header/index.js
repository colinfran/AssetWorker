import React, { useState } from "react"
import "./index.css"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import Form from "react-bootstrap/Form"
import InputGroup from "react-bootstrap/InputGroup"
import wcdLogo from "../../assets/wcdlogo.png"
import { EyeFill, EyeSlashFill, Gear } from "./SvgIcons"

const Header = ({
  usernameMCM,
  setUsernameMCM,
  passwordMCM,
  setPasswordMCM,
  isMounted,
  mode,
  setMode,
}) => {
  const [open, setOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const closeModal = () => {
    localStorage.setItem("usernameMCM", usernameMCM)
    localStorage.setItem("passwordMCM", passwordMCM)
    setOpen(!open)
  }

  const openLogs = async () => {
    window.api.send("toOpenLogs", {})
  }

  const adjustDarkMode = (selectedValue) => {
    setMode(selectedValue)
  }

  const modal = (
    <div>
      <Modal show={open} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Asset Worker Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Form>
              <Form.Label>MCM Info</Form.Label>
              <Form.Group className="mb-3">
                <Form.Control
                  type="email"
                  placeholder="MCM Username"
                  value={usernameMCM}
                  onChange={(e) => setUsernameMCM(e.target.value)}
                />
              </Form.Group>
              <InputGroup className="mb-3">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="MCM Password"
                  value={passwordMCM}
                  onChange={(e) => setPasswordMCM(e.target.value)}
                />
                <Button
                  variant="outline-secondary"
                  id="button-addon2"
                  onClick={() => setShowPassword(!showPassword)}
                  onFocus={(e) => e.target.blur()}
                >
                  {!showPassword ? <EyeFill /> : <EyeSlashFill />}
                </Button>
              </InputGroup>
              <div>
                <div>Theme</div>
                <div>
                  <Form.Select
                    aria-label="Default select example"
                    value={mode}
                    onChange={(e) => adjustDarkMode(e.target.value)}
                  >
                    <option value="system">System</option>
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                  </Form.Select>
                </div>
              </div>
              <div>
                <br />
                <br />
                <div className="errorLinkMessage">
                  If you run into any issues with this app, click the below
                  link. It will open up the error log file location. Copy that
                  file into an email or team/slack chat and send it to Colin
                  Franceschini (colin_franceschini@gap.com)
                </div>
                <Button onClick={() => openLogs()} variant="link">
                  Open App Logs
                </Button>
              </div>
            </Form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )

  return (
    <div>
      <div className="headerContainer">
        <div className="settingsButton">
          <Button variant="secondary" onClick={() => setOpen(true)}>
            <div className="settingsContainer">
              <div className="settingsIconContainer">
                <Gear />
              </div>
              <div>Settings</div>
            </div>
          </Button>
        </div>
        <div className="mountedContainer">
          <div className={isMounted ? "connected" : "offline"}>
            {isMounted ? "connected" : "offline"}
          </div>
        </div>
        <div>
          <img src={wcdLogo} className="logo" alt="wcd logo" />
        </div>
      </div>
      {modal}
    </div>
  )
}

export default Header
