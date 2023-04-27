const fs = require('fs');
const path = require('path');
var electron_notarize = require('electron-notarize');
const envJson = require("../public/env/env.json")

module.exports = async function (params) {
    // Only notarize the app on Mac OS only.
    if (process.platform !== 'darwin') {
        return;
    }
    let appId = 'com.wcd.wcd-assetworker'
    let appPath = path.join(params.appOutDir, `${params.packager.appInfo.productFilename}.app`);
    if (!fs.existsSync(appPath)) {
        throw new Error(`Cannot find application at: ${appPath}`);
    }

    console.log(`Notarizing ${appId} found at ${appPath}`);
    console.log(`This process could take up to 10 min. Please wait.`);


    const bufferAppleId = Buffer.from(process.env.APPLEID, "base64");
    const bufferAppleIdPassword = Buffer.from(process.env.APPLEPASSWORD, "base64");
    const appleId = bufferAppleId.toString("utf8");
    const appleIdPassword = bufferAppleIdPassword.toString("utf8");

    try {
        await electron_notarize.notarize({
            appBundleId: appId,
            appPath: appPath,
            appleId: appleId,
            appleIdPassword: appleIdPassword,
        });
    } catch (error) {
        console.error(error);
    }

    console.log(`Done notarizing ${appId}`);
};