#!/bin/bash

printg() {
  printf "\e[32m$1\e[m\n"
}
WCD="wcd"
echo "Please input your Vault Username" && read vault_username
VAULT_ADDR=https://vault.gapinc.com VAULT_SKIP_VERIFY=true VAULT_NAMESPACE=pipes vault login -method=ldap username=$vault_username
VAULT_SECRETS="$(VAULT_ADDR=https://vault.gapinc.com VAULT_SKIP_VERIFY=true VAULT_NAMESPACE=pipes vault read secret/pt-wcd -format=json)"
export APPLEID="$(VAULT_SECRETS=$VAULT_SECRETS node ./tasks/getSecret.js assetWorkerAppleId)"
export APPLEPASSWORD="$(VAULT_SECRETS=$VAULT_SECRETS node ./tasks/getSecret.js assetWorkerApplePassword)"
APPLELICENSE="$(VAULT_SECRETS=$VAULT_SECRETS node ./tasks/getSecret.js assetWorkerAppleLicense)"

printg "Running build in dev mode. This will not publish release!"
printg "Building React/Express App "
npm run app-build
printg "Building Electron App"
TOKEN=$(node -p "require('./public/env/env.json').token")
export GH_TOKEN=$TOKEN
export CSC_LINK=$APPLELICENSE
export CSC_KEY_PASSWORD=$WCD
./node_modules/.bin/electron-builder build
