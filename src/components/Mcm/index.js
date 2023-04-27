import React, { useState, useEffect } from "react"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import InputGroup from "react-bootstrap/InputGroup"
import "./index.css"
import { CheckCircle, Save } from "./SvgIcons"

const Mcm = ({
  runNotification,
  logs,
  setLogs,
  setLoading,
  usernameMCM,
  passwordMCM,
}) => {
  // MCM states
  const [mcmCiid, setMcmCiid] = useState("")
  const [mcmBrand, setMcmBrand] = useState("")

  useEffect(() => {
    window.api.receive("fromSetMcm", (data) => {
      const json = data
      setLoading(false)
      const newLogs = Array.from(data.logs)
      if (!json.success) {
        runNotification({
          type: "warning",
          title: "Error!!!",
          message: json.message,
        })
        const logMessage = json.message
        setLogs(
          [
            `${new Date().toLocaleString()} | ${json.title}: ${logMessage}`,
          ].concat(newLogs)
        )
      }
      return setLogs(
        [
          `${new Date().toLocaleString()} | ${json.title}: ${json.message}`,
        ].concat(newLogs)
      )
    })
  }, [])

  const updateMcm = async () => {
    if (usernameMCM === "") {
      return runNotification({
        type: "warning",
        title: "Error!!!",
        message:
          "MCM Username must be provided.  You can add this in the settings.",
      })
    }
    if (passwordMCM === "") {
      return runNotification({
        type: "warning",
        title: "Error!!!",
        message:
          "MCM Password must be provided. You can add this in the settings.",
      })
    }
    if (mcmCiid === "") {
      return runNotification({
        type: "warning",
        title: "Error!!!",
        message: "MCM CIID must be provided",
      })
    }
    if (mcmBrand === "") {
      return runNotification({
        type: "warning",
        title: "Error!!!",
        message: "MCM Brand must be provided",
      })
    }
    if (mcmCiid.length < 7 || mcmCiid.length > 8) {
      return runNotification({
        type: "warning",
        title: "Error!!!",
        message: "MCM CIID must be 7-8 digits!",
      })
    }
    // use electron puppeteer window
    setLoading(true)
    return window.api.send("toSetMcm", {
      usernameMCM,
      passwordMCM,
      mcmCiid,
      mcmBrand,
      logs,
    })
  }

  return (
    <div className="mcmContainer">
      <div className="formsContainer">
        <div className="headerText">MCM Ready for Review</div>
        <div className="openOrCopyContainer">
          <InputGroup className="openOrCopyInput">
            <InputGroup.Text id="basic-addon1">
              <CheckCircle />
            </InputGroup.Text>
            <Form.Control
              placeholder="CIID..."
              aria-label="MCM CIID"
              aria-describedby="MCM CIID"
              value={mcmCiid}
              onChange={(e) => setMcmCiid(e.target.value)}
            />
          </InputGroup>
          <div className="brandSelectFrom">
            <Form.Select
              className="formHeight"
              aria-label="Select brand for copy from"
              onChange={(e) => setMcmBrand(e.target.value)}
            >
              <option>Select brand...</option>
              <option value="1">Gap</option>
              <option value="2">Banana Republic</option>
              <option value="3">Old Navy</option>
              <option value="7">Gap Canada</option>
              <option value="8">Banana Republic Canada</option>
              <option value="9">Old Navy Canada</option>
              <option value="10">Athleta</option>
              <option value="20">Gap European Union</option>
              <option value="21">Banana Republic European Union</option>
              <option value="24">Gap Japan</option>
              <option value="25">Banana Republic Japan</option>
              <option value="34">Gap Factory Store</option>
              <option value="35">Banana Republic Factory Store</option>
              <option value="39">Athleta Canada</option>
            </Form.Select>
          </div>
        </div>
        <div className="mcmBtnContainer">
          <Button
            className="openBtn"
            variant="primary"
            onClick={() => updateMcm()}
          >
            <div className="openBtnIconRow">
              <div className="openBtnIcon">
                <Save />
              </div>
              <div>Update MCM</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Mcm
