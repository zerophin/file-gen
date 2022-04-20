console.clear();
const fs = require('fs')
const path = require('path')
let str = `
  ./management_fees
    note-{date}.txt
    management-changes.xlxs
    /gpi_management_fees
      brett.md
      qryprint.md
      /some-stuff-stuff
        hi_stuff.txt
      ^
    ^
    /errors
      this-month-errors.mdx
    ^
  ./tacos
    areDelicious.md
`
const mkDir = (path) => fs.mkdirSync(path, {recursive: true});
const mkFile = (name, content) => fs.writeFileSync(name, content)

function makeFileName(name, date = "") {
  //let betweenCurly = /[^{]+(?=})/;
  let betweenCurly = /{.+}/
  let newName = name.replace(betweenCurly, date)
  return newName;
}

let months = "Jan Feb Mar".split(" ");

function makeFolder(str, root = "Home") {
  let args = str.split('\n').slice(1, -1).map(item => item.trim());
  let curPath = '';

  months.forEach((month, i) => {
    let monthString = i < 10 ? `0${i + 1}` : i + 1;
    monthString += `-${month}`
    curPath = path.join(root, monthString)
    args.forEach(arg => {
      if (arg.startsWith('.')) {
        curPath = path.join(root, monthString, arg);
        mkDir(curPath)
      } else if (arg.startsWith('/')) {
        curPath = path.join(curPath, arg);
        mkDir(curPath)
      } else if (arg === '^') {
        if (curPath.length) {
          curPath = path.join(curPath, '../')
        }
      } else {
        let fileName = makeFileName(path.join(curPath, arg), `${i + 1}-${month}`)
        fs.copyFileSync('./pretendTemplate.md', fileName)
      }
    })
  })
}

makeFolder(str, "Management Fees")