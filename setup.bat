@echo off

REM Check if node is install
WHERE npm >nul 2>&1 && (
  REM Install stuff
  npm install
  cd src/app/
  npm install

  REM Check if electron is install
  WHERE electron >nul 2>&1 || (
    npm install -g electron
  )

  REM Check if typescript is install
  WHERE electron >nul 2>&1 || (
    npm install -g typescript
  )

  REM Compile src/app
  tsc --build

  echo Finished setup!

  cd ..
  cd ..
  npm run start

  pause
) || (
  REM Tell user it is not installed
  echo Cannot setup: node.js is not installed, please install it to run this application
)