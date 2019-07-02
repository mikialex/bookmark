const fs = require('fs')
const path = require('path')
const chromeParser = require('./chrome-parse')
const tryAll = require('./try-all')

let bookmarkHtmlStr = fs.readFileSync(path.join(__dirname, "../test-file/test.html"), { encoding: "utf-8" })
let bookmarks = chromeParser.parseChromeBookmark(bookmarkHtmlStr)

const exportData = JSON.stringify(bookmarks, null, 2);
fs.writeFileSync(path.join(__dirname, "../test-file/output.json"), exportData, { encoding: "utf-8" })

tryAll.tryAll(bookmarks)