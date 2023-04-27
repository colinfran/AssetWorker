export const openFilePreCheck = async (
  runNotification,
  openOrCopyFromCIID,
  openOrCopyFromBrand,
  openInDefaultEditor,
  isMounted
) => {
  if (!isMounted) {
    runNotification({
      type: "warning",
      title: "Error!!!",
      message: "Asset Archive is not mounted.",
    })
    return false
  }
  if (openOrCopyFromCIID === "") {
    runNotification({
      type: "warning",
      title: "Error!!!",
      message: "Source CIID cannot be empty!",
    })
    return false
  }
  if (openOrCopyFromCIID.length < 7 || openOrCopyFromCIID.length > 8) {
    runNotification({
      type: "warning",
      title: "Error!!!",
      message: "Source CIID must be 7-8 digits!",
    })
    return false
  }
  if (
    openOrCopyFromBrand === "" ||
    openOrCopyFromBrand.length === 0 ||
    openOrCopyFromBrand === "Select brand..." ||
    openOrCopyFromBrand === undefined
  ) {
    runNotification({
      type: "warning",
      title: "Error!!!",
      message: "Brand must be selected!",
    })
    return false
  }
  return true
}

export const copyFilesPreCheck = async (
  runNotification,
  openOrCopyFromCIID,
  openOrCopyFromBrand,
  openInDefaultEditor,
  copyToCIID,
  copyToBrand,
  copyAssetsDirectory,
  isMounted
) => {
  if (!isMounted) {
    runNotification({
      type: "warning",
      title: "Error!!!",
      message: "Asset Archive is not mounted.",
    })
    return false
  }
  if (openOrCopyFromCIID === "") {
    runNotification({
      type: "warning",
      title: "Error!!!",
      message: "Source CIID cannot be empty!",
    })
    return false
  }
  if (openOrCopyFromCIID.length < 7 || openOrCopyFromCIID.length > 8) {
    runNotification({
      type: "warning",
      title: "Error!!!",
      message: "Source CIID must be 7-8 digits!",
    })
    return false
  }
  if (
    openOrCopyFromBrand === "" ||
    openOrCopyFromBrand.length === 0 ||
    openOrCopyFromBrand === "Select brand..." ||
    openOrCopyFromBrand === undefined
  ) {
    runNotification({
      type: "warning",
      title: "Error!!!",
      message: "Source brand must be selected!",
    })
    return false
  }
  if (copyToCIID === "") {
    runNotification({
      type: "warning",
      title: "Error!!!",
      message: "Destination CIID cannot be empty!",
    })
    return false
  }
  if (copyToCIID.length < 7 || copyToCIID.length > 8) {
    runNotification({
      type: "warning",
      title: "Error!!!",
      message: "Destination CIID must be 7-8 digits!",
    })
    return false
  }
  if (
    copyToBrand === "" ||
    copyToBrand.length === 0 ||
    copyToBrand === "Select brand..." ||
    copyToBrand === undefined
  ) {
    runNotification({
      type: "warning",
      title: "Error!!!",
      message: "Destination brand must be selected!",
    })
    return false
  }
  return true
}
