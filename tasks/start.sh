#!/bin/bash

printg() {
  printf "\e[32m$1\e[m\n"
}

printg "Starting Electron App in development mode"
NODE_ENV=dev concurrently "cross-env BROWSER=none npm run app-start" "wait-on http://localhost:3000 && electron . "