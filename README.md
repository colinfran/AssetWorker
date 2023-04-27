# Asset Worker

This is the WCD AssetWorker Tool

---
## `Download`

[Download latest version v2.0.3 ](https://github.gapinc.com/wcd/AssetWorker/releases/download/v2.0.3/WCD-AssetWorker-2.0.3.dmg)

---

## Development

### Installing and running the electron app for development

First, adjust the env.example.json file to env.json within the public/env/ folder. 
Next, go to the gap enterprise github, go to your user settings, developer settings, and create a personal access token. make sure to select the 'repo' scope. Copy that access token into the env.json file.

now install all modules by running 
```
npm install
```
Then to start the app, run
```
npm run start
```


## Building For Local Testing

run `npm run build-dev`

This runs build command without publishing release dmg to github.

It will prompt you to enter credentials. Enter your gap inc login credentails. That will get the necessary environment variables to for the app. After logging in, it will create a build that is code signed. 

Use this just for testing purposes. To build and deploy new release, follow the below steps.


## Building and Deploying Releases

run `npm run build`

It will prompt you to enter credentials. Enter your gap inc login credentails. That will get the necessary environment variables to publish the app. After logging in, it will create a build that is code signed and ready to be released. The app must be codesigned and notarized for the auto update feature to work. The app will automatically be uploaded as a github release (as long as you provided the github token in the env.json file).

The app will show a dialog asking the user if they want to update to the newest version when a new version becomes available.


## Debugging in production
When running production build of app, you can find the logs at 
```
/Users/<user>/Library/Logs/WCD AssetWorker/main.log
```
You can also find this file by going to the "Settings" button in the top left corner of the AssetWorker app and clicking "Open App Logs"



