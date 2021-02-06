// TODO Сделать, чтобы при удаления названия директорий из переменной NAMES_DIR_AND_FILE, она удалялась с ПК.
/*
Алгоритм:
  Помещаем названия всех директорий PATH_DIR в массив BEM_DIR
    Сравниваем по length NAMES_DIR_AND_FILE с BEM_DIR, если они не равны, тогда
    проходим массив BEM_DIR и ищем сооствествия в NAMES_DIR_AND_FILE, как только соотвесвтие найдено
    делаем continue, если сооствесвие не найдено вызываем функцию удаления директорий.

  Не знаю как себя поведет в плане скорости данный алгорим, если к примеру будет 10 000 директорий.
  Нужно посмотреть алгоритмы поиска.

Алгоримт второй более простой по нагрузке:
  То что нужно удалить, помещаем в переменную DELETE_DIR, 
    Перебираем массив NAMES_DIR_AND_FILE, если есть совпадения с DELETE_DIR удаляем элемент,
      иначе ничего не делаем.
*/

const path = require('path');
const fs = require('fs');

//? __dirname - содержит корневой путь до директории в котором испольняется код.
//? __filename- содержит корневой путь до файла который исполняет код.
const NAMES_DIR_AND_FILE = ['test', 'test2', 'test3'];
const EXTNAMES_FILE = ['pug', 'scss', 'js'];
const PATH_DIR = path.resolve('src/blocks/common.blocks/form.elements');

function createBEM() {
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
}

createBEM();


function deleteBEM() {
  return
}



