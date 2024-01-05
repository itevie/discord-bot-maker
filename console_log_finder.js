const fs = require("fs");

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(file => {
    if (file.includes("lib") || file.includes("node_modules")) return;
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(dirPath + (dirPath.endsWith('/') ? '' : '/') + file);
    }
  });

  return arrayOfFiles;
}

const files = getAllFiles("./src");

for (const i in files) {
  const contents = fs.readFileSync(files[i], "utf-8").split("\n");
  for (const ln in contents) {
    if (contents[ln].includes("console.log") && contents[ln].length < 100)
      console.log(`console.log in ${files[i]} line ${ln}\n     ${contents[ln]}`);
  }
}