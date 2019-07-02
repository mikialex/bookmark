async function tryAll(bookmarks) {
  const group = {};
  function getBookMark(bk) {
    bk.bookmarks.forEach(item => {
      if (group[item.href] !== undefined) {
        console.log(`duplicate bookmark found: ${item.href}`)
        return
      }
      group[item.href] = item;
    });
    if (bk.children) {
      bk.children.forEach(child => getBookMark(child))
    }
  }

  getBookMark(bookmarks)

  const count = Object.keys(group).length;
  let successCount = 0;

  // const allrequests = Object.keys(group).map(url => {
  //   return tryURL(url)
  //     .then(rt => {
  //       console.log(`check link success: ${url}`)
  //       successCount++;
  //     })
  //     .catch(err => {
  //       console.log(`!! check link failed, ${err.code}: ${url}`)
  //   })
  // })

  // await Promise.all(allrequests)


  console.log(`you have ${count} bookmarks!`)
  console.log(`${Math.ceil(successCount / count * 100)} % checked ok`)
}


var request = require("request");
async function tryURL(url) {
  return new Promise((resolve, reject) => {
    request(
      {
        url,
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36"
        }
        // timeout: 30000
      },
      function (error, response, body) {
        if (error) {
          reject(error)
          return
        }
        resolve();
        }
    );
  })
}


module.exports = { tryAll }