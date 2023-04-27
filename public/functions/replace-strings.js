const replaceStrings = (
  data,
  copyFromValue,
  copyToValue,
  pathSource,
  pathDestination,
  brandSource,
  brandDestination,
  replaceCIID
) => {
  let result
  // source substrings for 7 and 8 digit CIIDs
  const d1s7 = copyFromValue.substring(0, 1)
  const d2s7 = copyFromValue.substring(1, 4)
  const d3s7 = copyFromValue.substring(4, 7)
  const d1s8 = copyFromValue.substring(0, 2)
  const d2s8 = copyFromValue.substring(2, 5)
  const d3s8 = copyFromValue.substring(5, 8)
  // destination substrings for 7 and 8 digit CIIDs
  const d1d7 = copyToValue.substring(0, 1)
  const d2d7 = copyToValue.substring(1, 4)
  const d3d7 = copyToValue.substring(4, 7)
  const d1d8 = copyToValue.substring(0, 2)
  const d2d8 = copyToValue.substring(2, 5)
  const d3d8 = copyToValue.substring(5, 8)
  if (copyFromValue.length === 7) {
    const re = new RegExp(
      `${brandSource}/content/000${d1s7}/${d2s7}/${d3s7}`,
      "g"
    )
    if (copyToValue.length === 7) {
      result = data.replace(
        re,
        `${brandDestination}/content/000${d1d7}/${d2d7}/${d3d7}`
      )
    } else if (copyToValue.length === 8) {
      result = data.replace(
        re,
        `${brandDestination}/content/00${d1d8}/${d2d8}/${d3d8}`
      )
    }
  } else if (copyFromValue.length === 8) {
    const re = new RegExp(
      `${brandSource}/content/00${d1s8}/${d2s8}/${d3s8}`,
      "g"
    )
    if (copyToValue.length === 7) {
      result = data.replace(
        re,
        `${brandDestination}/content/000${d1d7}/${d2d7}/${d3d7}`
      )
    } else if (copyToValue.length === 8) {
      result = data.replace(
        re,
        `${brandDestination}/content/00${d1d8}/${d2d8}/${d3d8}`
      )
    }
  }
  if (replaceCIID) {
    result = result.replace(copyFromValue, copyToValue)
  }
  return result
}

module.exports = replaceStrings
