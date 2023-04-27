const constructPath = (ciid, brand) => {
  if (ciid.length === 7) {
    const d1 = ciid.substring(0, 1)
    const d2 = ciid.substring(1, 4)
    const d3 = ciid.substring(4, 7)
    const path = `/Volumes/Asset_Archive/${brand}/content/000${d1}/${d2}/${d3}/`
    return path
  }
  if (ciid.length === 8) {
    const d1 = ciid.substring(0, 2)
    const d2 = ciid.substring(2, 5)
    const d3 = ciid.substring(5, 8)
    const path = `/Volumes/Asset_Archive/${brand}/content/00${d1}/${d2}/${d3}/`
    return path
  }
  return ""
}

module.exports = constructPath
