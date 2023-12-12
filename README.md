# Discord Bot Maker
A simple application for quickly and simply creating Discord bots!

## What is this?
This is an application which allows you to create Discord bots with minimal coding (scratch-like coding coming in the future!). It includes it's own coding language which is simple and easy to learn.

Here is an example of the language, an example code for the event `Message Create` will be used:

```
message.reply(strings.upper(message.content))
```

This will reply to every message, with that message's content to uppercase.

## Notes about usage
At the moment, the application is being heavily worked on and not everything will be working, some features may not exist yet, etc. So I would not advise properly using the application yet. However, testing it would be greatly appreciated.

If you have any suggestions, or find any issues, please tell me about them so I can quickly solve them. You can either create an issue on GitHub, or message me on Discord: @iteve

## How to use it
At the moment, there is no exactly easy way to start this application. However, the following may work:

1. Download the project as a ZIP and extract it into a folder
2. Make sure node.js is installed on your computer
3. Open the folder with your terminal (in the folder that contains src)
4. Run `npm install` in this directory, AND run it in `src/app`
5. In the folder containing `src/` run `npm run start`, if all is successful, the application *should* start.