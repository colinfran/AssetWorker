import React, { useEffect, useState } from "react"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import InputGroup from "react-bootstrap/InputGroup"
import { ChevronLeft, ChevronRight, Clipboard, FolderOpen } from "./SvgIcons"
import { copyFilesPreCheck, openFilePreCheck } from "./functions"
import "./index.css"

const AssetArchive = ({
  isMounted,
  runNotification,
  logs,
  setLogs,
  setLoading,
}) => {
  // AssetArchive states
  const [copyAssetsDirectory, setCopyAssetsDirectory] = useState(true)
  const [updatePaths, setUpdatePaths] = useState(true)
  const [openInDefaultEditor, setOpenInDefaultEditor] = useState(["json"])
  const [openOrCopyFromCIID, setOpenOrCopyFromCIID] = useState("")
  const [copyToCIID, setCopyToCIID] = useState("")
  const [openOrCopyFromBrand, setOpenOrCopyFromBrand] = useState("")
  const [copyToBrand, setCopyToBrand] = useState("")

  const runOpenFiles = async () => {
    setLoading(true)
    const passing = await openFilePreCheck(
      runNotification,
      openOrCopyFromCIID,
      openOrCopyFromBrand,
      openInDefaultEditor,
      isMounted
    )
    if (!passing) return setLoading(false)
    return window.api.send("toOpenFiles", {
      openOrCopyFromCIID,
      openOrCopyFromBrand,
      openInDefaultEditor,
      logs,
    })
  }

  const runCopyFiles = async () => {
    setLoading(true)
    const passing = await copyFilesPreCheck(
      runNotification,
      openOrCopyFromCIID,
      openOrCopyFromBrand,
      openInDefaultEditor,
      copyToCIID,
      copyToBrand,
      copyAssetsDirectory,
      isMounted
    )
    if (!passing) return setLoading(false)
    return window.api.send("toCopyFiles", {
      openOrCopyFromCIID,
      openOrCopyFromBrand,
      openInDefaultEditor,
      copyToCIID,
      copyToBrand,
      copyAssetsDirectory,
      updatePaths,
      logs,
    })
  }

  useEffect(() => {
    window.api.receive("fromOpenFiles", (data) => {
      setLoading(false)
      const newLogs = Array.from(data.logs)
      if (!data.success) {
        runNotification({
          type: "warning",
          title: "Error!!!",
          message: data.message,
        })
        const logMessage = data.message
        setLogs(
          [
            `${new Date().toLocaleString()} | ${data.title}: ${logMessage}`,
          ].concat(newLogs)
        )
      } else {
        setLogs(
          [
            `${new Date().toLocaleString()} | ${data.title}: ${data.message}`,
          ].concat(newLogs)
        )
      }
    })
    window.api.receive("fromCopyFiles", (data) => {
      setLoading(false)
      const newLogs = Array.from(data.logs)
      if (!data.success) {
        runNotification({
          type: "warning",
          title: "Error!!!",
          message: data.message,
        })
        const logMessage = data.message
        setLogs(
          [
            `${new Date().toLocaleString()} | ${data.title}: ${logMessage}`,
          ].concat(newLogs)
        )
      }
      setLogs(
        [
          `${new Date().toLocaleString()} | ${data.title}: ${data.message}`,
        ].concat(newLogs)
      )
    })
  }, [])

  useEffect(() => {
    const cpAssets = localStorage.getItem("copyAssetsDirectory")
    if (cpAssets) setCopyAssetsDirectory(cpAssets === "true")
    const upPaths = localStorage.getItem("updatePaths")
    if (upPaths) setUpdatePaths(upPaths === "true")
    const openDef = localStorage.getItem("openInDefaultEditor")
    if (openDef) setOpenInDefaultEditor(openDef.split(","))
  }, [])

  return (
    <div>
      <div className="aaContainer">
        <div className="headerText">Asset Archive</div>
        <div>
          <Form.Check
            type="checkbox"
            id="checkbox-CopyAssets"
            label="Copy assets directory?"
            checked={copyAssetsDirectory}
            onChange={(e) => {
              setCopyAssetsDirectory(e.target.checked)
              localStorage.setItem("copyAssetsDirectory", e.target.checked)
            }}
          />
        </div>
        <div>
          <Form.Check
            type="checkbox"
            id="checkbox-Update-AA-paths"
            label="Update Asset_Archive paths in the new file?"
            checked={updatePaths}
            onChange={(e) => {
              setUpdatePaths(e.target.checked)
              localStorage.setItem("updatePaths", e.target.checked)
            }}
          />
        </div>
        <div>
          <div>
            <div className="openInDefaultText">Open in default editor?</div>
            <div className="openInDefaultEditorRow">
              <Form.Check
                type="checkbox"
                id="checkbox-Update-AA-paths-json"
                label="JSON"
                checked={openInDefaultEditor?.includes("json")}
                onChange={(e) => {
                  if (e.target.checked) {
                    const data = [...openInDefaultEditor, "json"]
                    setOpenInDefaultEditor(data)
                    localStorage.setItem("openInDefaultEditor", data)
                  } else {
                    const data = openInDefaultEditor.filter(
                      (el1) => el1 !== "json"
                    )
                    setOpenInDefaultEditor(data)
                    localStorage.setItem("openInDefaultEditor", data)
                  }
                }}
              />
              <Form.Check
                type="checkbox"
                id="checkbox-Update-AA-paths-html"
                label="HTML"
                checked={openInDefaultEditor?.includes("html")}
                onChange={(e) => {
                  if (e.target.checked) {
                    const data = [...openInDefaultEditor, "html"]
                    setOpenInDefaultEditor(data)
                    localStorage.setItem("openInDefaultEditor", data)
                  } else {
                    const data = openInDefaultEditor.filter(
                      (el2) => el2 !== "html"
                    )
                    setOpenInDefaultEditor(data)
                    localStorage.setItem("openInDefaultEditor", data)
                  }
                }}
              />
              <Form.Check
                type="checkbox"
                id="checkbox-Update-AA-paths-css"
                label="CSS"
                checked={openInDefaultEditor?.includes("css")}
                onChange={(e) => {
                  if (e.target.checked) {
                    const data = [...openInDefaultEditor, "css"]
                    setOpenInDefaultEditor(data)
                    localStorage.setItem("openInDefaultEditor", data)
                  } else {
                    const data = openInDefaultEditor.filter(
                      (el3) => el3 !== "css"
                    )
                    setOpenInDefaultEditor(data)
                    localStorage.setItem("openInDefaultEditor", data)
                  }
                }}
              />
              <Form.Check
                type="checkbox"
                id="checkbox-Update-AA-paths-js"
                label="JS"
                checked={openInDefaultEditor?.includes("js")}
                onChange={(e) => {
                  if (e.target.checked) {
                    const data = [...openInDefaultEditor, "js"]
                    setOpenInDefaultEditor(data)
                    localStorage.setItem("openInDefaultEditor", data)
                  } else {
                    const data = openInDefaultEditor.filter(
                      (el4) => el4 !== "js"
                    )
                    setOpenInDefaultEditor(data)
                    localStorage.setItem("openInDefaultEditor", data)
                  }
                }}
              />
            </div>
          </div>
        </div>
        <div>
          <div className="formsContainer">
            <div className="openOrCopyContainer">
              <InputGroup className="openOrCopyInput">
                <InputGroup.Text id="basic-addon1">
                  <ChevronLeft />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Open or copy from CIID..."
                  aria-label="Open or copy from CIID"
                  aria-describedby="Open or copy from CIID"
                  value={openOrCopyFromCIID}
                  onChange={(e) => setOpenOrCopyFromCIID(e.target.value)}
                />
              </InputGroup>
              <div className="brandSelectFrom">
                <Form.Select
                  className="formHeight"
                  aria-label="Select brand for copy from"
                  onChange={(e) => setOpenOrCopyFromBrand(e.target.value)}
                >
                  <option>Select brand...</option>
                  <option value="ATWeb">Athleta</option>
                  <option value="BRWeb">Banana Republic</option>
                  <option value="BFWeb">Banana Republic Factory</option>
                  <option value="GPWeb">Gap</option>
                  <option value="GFWeb">Gap Factory</option>
                  <option value="ONWeb">Old Navy</option>
                </Form.Select>
              </div>
            </div>
            <div className="copyToContainer">
              <InputGroup className="openOrCopyInput">
                <InputGroup.Text id="basic-addon1">
                  <ChevronRight />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Copy to CIID..."
                  aria-label="Copy to CIID"
                  aria-describedby="Copy to CIID"
                  value={copyToCIID}
                  onChange={(e) => setCopyToCIID(e.target.value)}
                />
              </InputGroup>
              <div className="brandSelectFrom">
                <Form.Select
                  className="formHeight"
                  aria-label="Select brand for copy to"
                  onChange={(e) => setCopyToBrand(e.target.value)}
                >
                  <option>Select brand...</option>
                  <option value="ATWeb">Athleta</option>
                  <option value="BRWeb">Banana Republic</option>
                  <option value="BFWeb">Banana Republic Factory</option>
                  <option value="GPWeb">Gap</option>
                  <option value="GFWeb">Gap Factory</option>
                  <option value="ONWeb">Old Navy</option>
                </Form.Select>
              </div>
            </div>
          </div>
          <div className="openCopyContainer">
            <Button
              className="openBtn"
              variant="primary"
              onClick={() =>
                runOpenFiles(
                  runNotification,
                  openOrCopyFromCIID,
                  openOrCopyFromBrand,
                  openInDefaultEditor,
                  isMounted
                )
              }
            >
              <div className="openBtnIconRow">
                <div className="openBtnIcon">
                  <FolderOpen />
                </div>
                <div>Open</div>
              </div>
            </Button>
            <Button
              className="copyBtn"
              variant="primary"
              onClick={() => runCopyFiles()}
            >
              <div className="copyBtnIconRow">
                <div className="copyBtnIcon">
                  <Clipboard />
                </div>
                <div>Copy</div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssetArchive
