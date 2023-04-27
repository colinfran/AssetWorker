const mcmSet = async (
  username,
  password,
  ciid,
  brand,
  log,
  browser,
  puppeteerWindow,
  pie
) => {
  let page

  log.info(`Going to MCM site.`)

  try {
    await puppeteerWindow.loadURL("http://mcm.gidapps.com/mcm/secure/home.do")
    puppeteerWindow.on("will-navigate", (event) => {
      log.info("will-navigate triggered. cancelling redirects")
      event.preventDefault()
    })
  } catch (error) {
    const message = `User not connected to vpn.`
    log.info(message)
    log.error(error)

    return {
      success: false,
      message,
      title: "Error",
    }
  }
  page = await pie.getPage(browser, puppeteerWindow)
  log.info("Adding login data.")
  try {
    await page.type("input[name=j_username]", username, { delay: 20 })
    await page.type("input[name=j_password]", password, { delay: 20 })
    await page.select('select[name="brand"]', brand)
    await Promise.all([
      page.click('input[type="submit"]'),
      page.waitForNavigation({
        waitUntil: "networkidle0",
      }),
    ])
  } catch (error) {
    const message = `An error occured trying to login.`
    log.info(message)
    log.error(error)

    return {
      success: false,
      message,
      title: "Error",
    }
  }
  await new Promise((r) => setTimeout(r, 1000))
  const loginError = await page.$eval(".redBold", () => true).catch(() => false)
  if (loginError) {
    const errorMessage = `Login Failed: Bad username or password`
    log.error(errorMessage)
    return {
      success: false,
      message: errorMessage,
      title: "Error",
    }
  }
  log.info(
    `Successful login, going to CIID search page and searching for CIID.`
  )
  // successfully logged in
  await puppeteerWindow.loadURL(
    `http://mcm.gidapps.com/mcm/secure/processContentGroupSearchForm.do?method=search&contentItemId=${ciid}`
  )
  page = await pie.getPage(browser, puppeteerWindow)

  const ciidExists = await page
    .$eval(".pagebanner", () => true)
    .catch(() => false)
  if (!ciidExists) {
    const errorMessage = `Ready for Review Failed: CIID does not exist`
    log.error(errorMessage)
    await puppeteerWindow.loadURL("http://mcm.gidapps.com/mcm/logout.do")

    return {
      success: false,
      message: errorMessage,
      title: "Error",
    }
  }
  log.info(`CIID exists, setting as RfR`)
  let val
  try {
    await page.$eval(
      `input[value='${ciid}']`,
      // eslint-disable-next-line no-return-assign, no-param-reassign
      (el) => (el.checked = "true")
    )
    await Promise.all([
      page.select('select[name="statusCode"]', "108"),
      page.click("input[name='save']"),
    ])
    await new Promise((r) => setTimeout(r, 1000))
    page = await pie.getPage(browser, puppeteerWindow)
    val = await page.$eval(`input[name='${ciid}']`, (input) =>
      input.getAttribute("value")
    )
  } catch (error) {
    const errorMessage = `Ready for Review Failed: An error occured when trying to mark as ready for review.`
    log.error(errorMessage)
    log.error(error)
    await puppeteerWindow.loadURL("https://mcm.gidapps.com/mcm/logout.do")

    return {
      success: false,
      message: errorMessage,
      title: "Error",
    }
  }

  if (val === "Approved") {
    const errorMessage = `Ready for Review Failed: CIID ${ciid} has already been set as approved.`
    log.info(errorMessage)
    await puppeteerWindow.loadURL("https://mcm.gidapps.com/mcm/logout.do")

    return {
      success: false,
      message: errorMessage,
      title: "Error",
    }
  }
  if (val !== "Ready for Review") {
    const errorMessage = `Ready for Review Failed: an error occured.`
    log.error(errorMessage)
    await puppeteerWindow.loadURL("https://mcm.gidapps.com/mcm/logout.do")

    return {
      success: false,
      message: errorMessage,
      title: "Error",
    }
  }

  if (val === "Ready for Review") {
    log.info(`MCM updated successfully for ciid: ${ciid}`)
    await puppeteerWindow.loadURL("https://mcm.gidapps.com/mcm/logout.do")

    return {
      success: true,
      message: `MCM CIID (${ciid}) Successfully set as 'Ready For Review'`,
      title: "Success",
    }
  }
  const errorMessage = `Ready for Review Failed: an error occured.`
  log.error(errorMessage)
  await puppeteerWindow.loadURL("https://mcm.gidapps.com/mcm/logout.do")

  return {
    success: false,
    message: errorMessage,
    title: "Error",
  }
}

module.exports = mcmSet
