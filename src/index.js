var htmlparser = require("htmlparser");
var fs = require('fs')
const path = require('path')

let bookmarkHtmlStr = fs.readFileSync(path.join(__dirname, "../test-file/test.html"), { encoding: "utf-8" })
bookmarkHtmlStr = bookmarkHtmlStr.replace(/<p>/g, "")
bookmarkHtmlStr = bookmarkHtmlStr.replace(/<DT>/g, "")


var handler = new htmlparser.DefaultHandler(function (error, dom) {
  if (error) {
    console.error("bookmark file parse error")
  }
});
var parser = new htmlparser.Parser(handler);
parser.parseComplete(bookmarkHtmlStr);

function extractData(parsedArray, resultArray) {
  parsedArray.forEach(item => {
    if (item.type === "tag") {
      const ret = {};
      ret.tagName = item.name;
      if (item.attribs && item.attribs.ICON) {
        delete item.attribs.ICON;
      }
      ret.attribs = item.attribs;
      if (item.children) {
        const children = []
        extractData(item.children, children)
        ret.children = children;
      }
      resultArray.push(ret)
    }
    if (item.type === 'text' && item.data.trim().length > 0) {
      resultArray.push({
        text: item.data.trim()
      })
    }

  });
}

const tree = [];
extractData(handler.dom, tree);

function findRoots(parsedArray) {
  const results = [];
  parsedArray.forEach(item => {
    if (item.tagName === "DL") {
      results.push(item)
    }
  })
  return results;
}

const rootsTree = findRoots(tree);


let target = {
  parent: null,
  children: [],
  bookmarks: [],
};
const root = target;

function extractBookmark(parsedArray) {
  parsedArray.forEach(item => {

    if (item.tagName === "DL" &&  item.children.length >= 2) {
      categoryParsedInfos = item.children[0];
      categoryName = categoryParsedInfos.children[0].text;
      categoryAddTime = categoryParsedInfos.attribs.ADD_DATE;
      categoryUpdateTime = categoryParsedInfos.attribs.LAST_MODIFIED;
      const newCategory = {
        categoryName, categoryAddTime, categoryUpdateTime,
        parent: target,
        children: [],
        bookmarks: [],
      }
      target.children.push(newCategory);
      target = newCategory;

      const subItems = item.children.slice(1);
      if (subItems) {
        extractBookmark(subItems)
      }
      target = target.parent
    } 

    if (item.tagName === "A") {
      target.bookmarks.push({
        title: item.children?item.children[0].text: "",
        href: item.attribs.HREF,
        addTime:  item.attribs.ADD_DATE
      })
    } 

    
  });
}


extractBookmark(rootsTree);


function cleanParent(node) {
  delete node.parent;
  if (node.children) {
    node.children.forEach(
      n => cleanParent(n)
    )
  }
}

cleanParent(root);

const exportData = JSON.stringify(root, null, 2);
fs.writeFileSync(path.join(__dirname, "output.json"),exportData, { encoding: "utf-8" })