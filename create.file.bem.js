const path = require('path');
const fs = require('fs');

//? __dirname - содержит корневой путь до директории в котором испольняется код.
//? __filename- содержит корневой путь до файла который исполняет код.
const NAMES_DIR_AND_FILE = ['test', 'test2'];
const EXTNAMES_FILE = ['pug', 'scss', 'js'];
const PATH_DIR = path.resolve('src/blocks/common.blocks/form.elements');

NAMES_DIR_AND_FILE.map( nameDirAndFile => {
  let pathToDir = path.normalize(`${PATH_DIR}/${nameDirAndFile}`);
  mkdir(pathToDir);

  EXTNAMES_FILE.map( (ext) => {
    let pathToFile = path.normalize(`${pathToDir}/${nameDirAndFile}.${ext}`);
    createWriteStream(pathToFile, extImport(ext, pathToFile));
  })
})

function mkdir(pathToDir) {
  // Создаем директорию NAMES_DIR
  fs.mkdir(pathToDir, err => {
    if(err)
      return;
  });
}

function createWriteStream(pathToFile, content) {
  // Запись в файл
  let writeStream = fs.createWriteStream(pathToFile, err => {
    if(err)
      return;
  })

  writeStream.write(String(content));
}

function extImport(ext, pathToFile) {
  let path = pathToFile.replace(/\\/g, '/');

  if (ext === 'pug') {
    return `include ${path}` 
  } else if (ext === 'scss') {
    return `@import "${path}";`
  } else if (ext === 'js') {
    return `const {youVar} = require('${path}');`
  }
}
