function createElements(where, what, content='none', attribute='none', insert='end') {
  /* 
  создать элементы: 
    where - где-куда? (DOM Element)
    what - какой и с каким классом?
    content - с каким содержимым?
    attribute - с каким атрибутом или атрибутами?
    insert - вставить в начало или конец?
  */

  /* 
  Пример принемаемых значений: 
    where - object (DOM Element) or 'querySelector=index' => '.class=1' or 'input.class=1'
    what - 'tag.className' => 'div.class1' or 'input.class1.class2'
    content - 'your content'
    attribute - `key=${value}` or 'key=value' or "key='value'" => `name="rate", value=${i}`
    insert - 'end' or 'start'
  */

  if (typeof where !== 'object') {
    let element = where.split('=')[0];
    let index = where.split('=')[1];
    where = document.querySelectorAll(element)[index];

    // console.log(where, element, index);
  }

  let whatSplit = what.split('.');

  let tag = whatSplit.shift();
  tag = document.createElement(tag);
  if (attribute !== 'none') {
    if (attribute.includes(',')) {
      let attr = convertToObject(attribute);
      let keys = Object.keys(attr);

      for (let i = 0; i < keys.length; i++) {
        tag.setAttribute(keys[i], attr[keys[i]]);
      }
    } else {
      let attr = attribute.split('=');
      tag.setAttribute(attr[0], attr[1]);
    }
  }

  let className = whatSplit.join(' ');
  tag.className = className;


  if (content !== 'none') {
    tag.innerHTML = content;
  }

  if (insert === 'start') {
    where.prepend(tag);
  } else if (insert === 'end') {
    where.append(tag);
  }
}

function convertToObject(options) {
  let optionsSplit = options.split(',');
  let obj = {};
  let temp;

  optionsSplit.forEach(item => {
    if (item.includes(':')) {
      temp = item.split(':');
    } else if (item.includes('=')) {
      temp = item.split('=');
    }
      if ( temp[1].includes(`"`) ) {
        temp[1] = temp[1].replace(/"/g, '');
      } else if ( temp[1].includes(`'`) ) {
        temp[1] = temp[1].replace(/'/g, '');
      }

      obj[temp[0].trim()] = temp[1].trim();
  })

  return obj;
}

function isElement(elementName, log='on') {
  let element = document.querySelector( String(elementName) );

  if (element) {
    return true;
  } else {
    if (log === 'on') {
      console.log(`%c Ошибка: ${elementName} не найден.`, 'color: #ae0000; background: #ffebeb; font-size: 14px;')
    }
    return false;
  }
}

export {createElements, convertToObject, isElement};