if ( document.querySelector('.dropdown') ) {

  /*
  .dropdown(options="adult: Взрослые, child: дети, baby: младенцы", text="Сколько гостей")
    .dropdown__body 
      p.dropdown__text Сколько гостей
      span.material-icons.dropdown__icon expand_more
    .dropdown__options.dropdown_hidden
      .dropdown__option(name="adult")
        h3.dropdown__people Взрослые
        .dropdown__count
          span.material-icons.dropdown__count-circle.dropdown__count-remove remove
          h3.dropdown__output 0
          span.material-icons.dropdown__count-circle.dropdown__count-add add
      .dropdown__option(name="child")
        h3.dropdown__people Дети
        .dropdown__count
          span.material-icons.dropdown__count-circle.dropdown__count-remove remove
          h3.dropdown__output 0
          span.material-icons.dropdown__count-circle.dropdown__count-add add
      .dropdown__option(name="baby")
        h3.dropdown__people Младенцы
        .dropdown__count
          span.material-icons.dropdown__count-circle.dropdown__count-remove remove
          h3.dropdown__output 0
          span.material-icons.dropdown__count-circle.dropdown__count-add add
      .dropdown__buttons
        input(type="submit", value="Очистить" name="reset").dropdown__submit.dropdown__submit_hidden
        input(type="submit", value="Применить" name="apply").dropdown__submit
  
  TODO: Сделать возможность кликать через tab -> setAttribute('tabindex', '0')
  TODO: Сделать возможность открыть/закрыть dropdown через пробел
  TODO: Сделать сохранение значений в localStorage
  TODO: Сделать скрытие dropdown при клике вне dropdown
  TODO: Сделать отображение выбора пользователя в теге с помощью JSON ->
      setJSON() {
      document.querySelector('.dropdown').setAttribute('people', `${JSON.stringify(this.people)}`);
    }

    getJSON() {
      JSON.parse(document.querySelector('.dropdown').getAttribute('people'));
    }


    toggle() {
      document.querySelector('.dropdown').classList.toggle('dropdown_show');
      document.querySelector('.dropdown__icon').classList.toggle('dropdown__icon_rotate-180');
      document.querySelector('.dropdown__options').classList.toggle('.dropdown_hidden');
    }
  */

  function createElements(where, what, content='none', attribute='none', insert='end') {
  /* 
  создать элементы: 
    where - где-куда? (DOM Element)
    what - какой и с каким классом?
    content - с каким содержимым?
    attribute - с каким атрибутом или атрибутами?
    insert - вставить в начало или конец?
  */

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

  class DropDown {

    constructor() {
      this.dropDowns = document.querySelectorAll('.dropdown');
    }

    render() {
      let dropDowns = this.dropDowns;
      
      dropDowns.forEach( (dropdown, index) => {

        dropdown.setAttribute('tabindex', '0');

        let options = convertToObject( dropdown.getAttribute('options') );
        //dropdown.removeAttribute('options');
        let keys = Object.keys(options);

        let text = dropdown.getAttribute('text');
        //dropdown.removeAttribute('text');
        let buttons = dropdown.getAttribute('buttons');
        //dropdown.removeAttribute('buttons');

        createElements(dropdown, 'div.dropdown__body');
        let dropdownBody = document.querySelectorAll('.dropdown__body')[index];
        createElements(dropdownBody, 'p.dropdown__text', text);
        createElements(dropdownBody, 'span.material-icons.dropdown__icon', 'expand_more');

        createElements(dropdown, 'div.dropdown__options.dropdown_hidden');
        let dropdownOptionBlock = document.querySelectorAll('.dropdown__options')[index];

        // Create dropdown__option in dropdown__options
        for (let i = 0; i < keys.length; i++) {
          createElements(dropdownOptionBlock, 'div.dropdown__option', content='none', attribute=`name=${keys[i]}`);

          let dropdownOptionElement = document.querySelectorAll('.dropdown__option')[document.querySelectorAll('.dropdown__option').length - 1];
          let content = options[keys[i]][0].toUpperCase() + options[keys[i]].slice(1);
          createElements(dropdownOptionElement, 'h3.dropdown__info', content);
          createElements(dropdownOptionElement, 'div.dropdown__count');

          let dropdownCount = document.querySelectorAll('.dropdown__count')[document.querySelectorAll('.dropdown__count').length - 1];
          createElements(dropdownCount, 'span.dropdown__count-circle.dropdown__count-remove.material-icons', 'remove');
          createElements(dropdownCount, 'h3.dropdown__output', '0');
          createElements(dropdownCount, 'span.material-icons.dropdown__count-circle.dropdown__count-add', 'add');
        }
        
        if (buttons === 'true') {
          // Create dropdown__buttons in dropdown__options
          createElements(dropdownOptionBlock, 'div.dropdown__buttons');

          let dropdownButtons = document.querySelectorAll('.dropdown__buttons')[index];
          createElements(dropdownButtons, 'input.dropdown__submit.dropdown__submit_hidden', 'none', 'type="submit", value="Очистить", name="reset"');
          createElements(dropdownButtons, 'input.dropdown__submit', 'none', 'type="submit", value="Применить", name="apply"');
        }
      })
    }

    events() {
      let dropDowns = this.dropDowns;
      dropDowns.forEach( dropdown => {
        dropdown.onclick = (e) => {
          if ( e.target.classList.contains('dropdown__body') || e.target.classList.contains('dropdown__icon') || (e.target.classList.contains('dropdown__submit') && e.target.getAttribute('name') === 'apply') ) {
            dropdown.classList.toggle('dropdown_show');

            if ( dropdown.children[0].classList.contains('dropdown__body') ) {
              dropdown.children[0].children[1].classList.toggle('dropdown__icon_rotate-180');
            }
  
            if ( dropdown.children[1].classList.contains('dropdown__options') ) {
              dropdown.children[1].classList.toggle('dropdown_hidden');
            }
          }
        };
      })

      let text = {};
      let blockCounts = document.querySelectorAll('.dropdown__count');
      blockCounts.forEach( blockCount => {
        let remove = blockCount.children[0];
        let output = blockCount.children[1];
        let add = blockCount.children[2];
        let count = 0;
        let key = blockCount.previousElementSibling.innerText;
        key = key[0] + key.slice(1).toLowerCase();


        add.onclick = () => {
          if (count < 20) {
            count++;
            output.innerHTML = count;
            text[key] = count;
            this.output(blockCount, text);
          }
        };

        remove.onclick = () => {
          if (count > 0) {
            count--;
            output.innerHTML = count;
            if (count > 0) {
              text[key] = count;
            } else {
              delete text[key];
            }
            this.output(blockCount, text);
          }
        };
      })
    }

    output(element, text) {
      let info = '';
      let isEmpty = false;
      for (let key in text) {
        info += key + ' ' + text[key] + ' ';
        isEmpty = true;
      }

      let output = element.parentElement.parentElement.previousElementSibling.firstElementChild;

      if ( isEmpty ) {
        output.innerHTML = info;
      } else {
        output.innerHTML = element.parentElement.parentElement.parentElement.getAttribute('text');
      }

    }

  }

  let dropDown = new DropDown();
  dropDown.render();
  dropDown.events();
}

if ( document.querySelector('.input-date-masked') ) {

  class MaskedDate {
    constructor() {
      this.regExpDate = new RegExp('(0[1-9]|[12][0-9]|3[01])[.](0[1-9]|1[0-2])[.](20\\d{2})');
    }

    is(element) {
      return this.regExpDate.test(element.value);
    }

    get(element) {
      return this.regExpDate.exec(element.value);
    }

    setJSON(element, attribute = 'date') {
      element.setAttribute(`${attribute}`, `${JSON.stringify( this.get(element)[0] )}`);
    }

    getJSON(element, attribute = 'date') {
      JSON.parse(element.getAttribute(`${attribute}`));
    }
  }

  let inputDateMasked = document.querySelectorAll('.input-date-masked');
  let maskedDate = new MaskedDate();

  inputDateMasked.forEach( (item) => {

    item.oninput = item.onkeydown = (e) => {

      if (item.value.length > 10) {
        item.value = item.value.substr(0, 10);
        item.classList.add('input_error');
        setTimeout( () => item.classList.remove('input_error'), 300);
      } else if (
        !Number(item.value[item.value.length - 1])
        &&
        Number(item.value[item.value.length - 1]) !== 0
        &&
        item.value.length !== 0
        ) {
        item.value = item.value.substr(0, item.value.length - 1);
        item.classList.add('input_error');
        setTimeout( () => item.classList.remove('input_error'), 300);
      } else {
        item.classList.remove('input_error');
      }
  
      if ( (item.value.length === 2 || item.value.length === 5) && e.code !== 'Backspace' ) {
        item.value += '.';
      }
  
      // Данная проверка показательная, чтобы просто была, данную проверку нужно делать только при отправке на сервер.
      if (!maskedDate.is(item) && item.value.length === 10) {
        item.classList.add('input_error');
      }

      if ( maskedDate.is(item) ) {
        maskedDate.setJSON(item);
      } else if (item.value.length === 10) {
        item.setAttribute('date', 'null');
      }
    };

  });

}

if ( document.querySelector('.input-date-dropdown') ) {
  let inputDateDropDown = document.querySelectorAll('.input-date-dropdown');

  inputDateDropDown.forEach( (item) => {
    item.onclick = () => {
      console.log('dropdown');
    };
  });
}

if ( document.querySelector('.range-slider__input') ) {

  // ?: Событие input генерируется при каждом изменений
  // ?: Событие change генерируется при потере фокуса, самый момент для записи json или localStorage

  class Range {
    /*
    Global variables:
      this.range - html node
      this.output - html node
      this.options - objcet
    */
    constructor(selectorRange, selectorOutput) {
      this.range = document.querySelector(selectorRange);
      this.output = document.querySelector(selectorOutput);

      this.createThump();
    }

    createThump() {
      let rangeThump = ['range-slider__left-thumb', 'range-slider__fill', 'range-slider__right-thumb'];
      let span = '';
      for (let i = 0; i < rangeThump.length; i++) {
        span = document.createElement('span');
        span.classList.add(`${rangeThump[i]}`);
        document.querySelector('.range-slider').append(span);
      }
    }

    create(min = 0, max = 100, valueLeft = 25, valueRight = 75, step = 1) {

      if (typeof min === 'string' || 
          typeof max === 'string' || 
          typeof valueLeft === 'string' || 
          typeof valueRight === 'string' || 
          typeof step === 'string'
          ) {
          console.log('Error: значение не может быть string');
          min = 0;
          max = 100;
          valueLeft = 25;
          valueRight = 75;
          step = 1;
        } else {
          min = Math.round(min);
          max = Math.round(max);
          valueLeft = Math.round(valueLeft);
          valueRight = Math.round(valueRight);
          step = Math.round(step);
        }

      if (valueLeft > valueRight) {
        valueRight = max;
        console.log('Error: valueRight не может быть больше valueLeft')
      }

      this.options = {
        min: min || 0,
        max: max || 100,
        valueLeft: valueLeft || 25,
        valueRight: valueRight || 75,
        step: step || 1
      };

      for (let key in this.options) {
        this.range.setAttribute(`${key}`, this.options[key]);
      }
      
      this.output.innerHTML = `${this.options.valueLeft}₽ - ${this.options.valueRight}₽`;

      let indentLeft = this.options.valueLeft / this.options.max * 100;
      let indentRight = this.options.valueRight / this.options.max * 100;
      let widthForFill = ( (indentRight - indentLeft) / 100) * document.querySelector('.range-slider').offsetWidth;

      document.querySelector('.range-slider__left-thumb').style.left = indentLeft + '%';
      document.querySelector('.range-slider__fill').style.left = indentLeft + '%';
      document.querySelector('.range-slider__fill').style.width = (widthForFill + 3) + 'px';
      document.querySelector('.range-slider__right-thumb').style.left = indentRight + '%';

      this.eventRange();
    }

    eventRange() {
      let range = this.range;

      range.oninput = range.onchange = (e) => {
        e.preventDefault();
      };

      let leftThump = document.querySelector('.range-slider__left-thumb');
      let rightThump = document.querySelector('.range-slider__right-thumb');
      let rangeFill = document.querySelector('.range-slider__fill');

      // (step / max) * 100 - на сколько процентов двигать влево или вправо
      let move = (this.options.step / this.options.max) * 100;
      // Конец движения ползунков
      let rangeEnd = Math.round( ( (range.offsetWidth - leftThump.offsetWidth) / range.offsetWidth) * 100 ) + 0.5;

      eventThump(leftThump, 'left');
      eventThump(rightThump, 'right');
      
      /* 
        ВЕШАЕМ СОБЫТИЯ - первый вариант реализаций.

        У меня есть еще две задумки:
          1)Выставлять valueLeft или valueRight в % от max в зависимости сколько % у style left.
            Формула valueLeft = currentThump.style.left / 100 * max:
              valueLeft = 50 / 100 * 20000
              valueLeft = 0.5 * 20000
              valueLeft = 10000
          2)Изменять значение valueLeft или valueRight кадждый раз, когда ползунок пройдет определенный %.
            Находим сколько нужно пройти ползунку, чтобы изменить значение:
              Формула move = (step / max) * 100:
                move = (this.options.step / this.options.max) * 100;
                move = (100 / 20000) * 100;
                move = 0.5;
            Примерная логика:
              if (event.clientX === move) {
                valueLeft = currentThump.style.left / 100 * max;
              }

        В первом варианте нельзя выставить step, valueLeft или valueRight будут изменяться, каждое движение ползунка.

        Во втором варианте можно указать, когда изменять valueLeft или valueRight, значение будет изменяться, только
        когда ползунок пройдет определенный %, который задан в move. Данный вариант я еще не обдумал полностью.

        TODO: Как реализовать второй вариант?
          Я могу каждый раз, когда event.clientX достигает отметки в move, то есть event.clientX === move,
          делаеть move += move, таким образом следующая отметка увеличиться на шаг move.
          Теперь нужно подумать как уменьшать move. Я могу проверять, если event.clientX равен прошлому шагу,
          то есть move-move, if (event.clientX === move-move), тогда move -= move.
          
          Но не ясно, что если move напримрем 0.5, а то и меньше, что если резко сдвинуть ползунок?
          Мне нужно как-то расчитывать значение move в зависимости от того где сейчас ползунок.
          
          Допустим у нас range шириной 1000px, max=100, step=1.
          Если резко дернуть ползунок, пусть мы попадем на 48% от ширины range.

          Полузнок на 48%, сколько это step?
          Нам нужно узнать сколько процентов от max в step. step = 1 / 100 * 100, step это 1% от max.
          Полузнок = 48%, step = 1%.

          Сколько нужно шагов, чтобы step стал равен 48%?
          48 / 1 = 48 шагов.
          step = 48%. 

          Проведем эти же расчеты, но где max=10000, step=5, thump=34%;
          step = 5 / 10000 * 100, step = 0,05%
          Сколько нужно шагов, чтобы step стал 34% от 10000, то есть 3400?
          step = 34 / 0.05, step = 680

          Запутался отложу расчеты уже 4 утра.
      */
      function eventThump(currentThump, whichThump) {
      /*
        Функция для определение ширины и положения полоски между левым и правым ползунком.

        Если ширина range маленька, а max число большое и step имеет большой шаг,
        тогда зеленая градиентовая полоса между левым и правым ползунком ломается.

        Я пытался сделать, чтобы все корректно работало при step 1000,
        у меня получилось сделать, чтобы с левым ползунком ничего не ломалось,
        но не получилось решить поломку с правым ползунком.

        Думаю стоит просто ограничить step.
      */
        function posRangeFill(leftThumpBound, rightThumpBound, whichThump) {
          if (whichThump === 'left') {
            rangeFill.style.left = (leftThumpBound - move + 2) + '%';
            rangeFill.style.width = (rightThumpBound - leftThumpBound + move) + '%';
          } else if (whichThump === 'right') {
            rangeFill.style.left = (leftThumpBound) + '%';
            rangeFill.style.width = (rightThumpBound - leftThumpBound + move + 2) + '%';
          }
        }

        currentThump.onmousedown = function(event) {
          event.preventDefault();
          
          document.body.style.cursor = 'grabbing';
          currentThump.style.cursor = 'grabbing';
  
          let x = event.clientX;
          let isThumpBound = false;
  
          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
  
          function onMouseMove(event) {
            let rightThumpBound = Number( rightThump.style.left.replace('%', '') );
            let leftThumpBound = Number( leftThump.style.left.replace('%', '') );
  
            if (rightThumpBound < leftThumpBound) {
              currentThump.style.left = leftThumpBound + '%';
            }
  
            let currentLeft = Number( currentThump.style.left.replace('%', '') );
  
            // УСЛОВИЕ ДВИЖЕНИЯ ПОЛЗУНКА
            if (whichThump === 'left') {
              leftThump.style.zIndex = 3;
              rightThump.style.zIndex = 2;
              isThumpBound = currentLeft < rightThumpBound || x > event.clientX;
            } else if (whichThump === 'right') {
              rightThump.style.zIndex = 3;
              leftThump.style.zIndex = 2;
              isThumpBound = currentLeft > leftThumpBound || x < event.clientX;
            }
  
            if (isThumpBound) {
  
              setTimeout(() => {
                x = event.clientX;
              }, 100);
              
              if (currentLeft > rangeEnd) {
                currentThump.style.left = rangeEnd + '%';
              } else if (x < event.clientX && currentLeft < rangeEnd) {
                currentThump.style.left = (currentLeft + move) + '%';
                posRangeFill(leftThumpBound, rightThumpBound, whichThump);
              } else if (x > event.clientX && currentLeft > 0) {
                currentThump.style.left = (currentLeft - move) + '%';
                posRangeFill(leftThumpBound, rightThumpBound, whichThump);
              }
            } else {
              currentThump.style.zIndex = 666; 
            }
          }
    
          function onMouseUp() {
            currentThump.style.cursor = 'grab';
            document.body.style.cursor = 'default';
            document.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('mousemove', onMouseMove);
          }
          
        };
    
        currentThump.ondragstart = function() {
          return false;
        };
      }
    }
  }

  let range = new Range('.range-slider__input', '.range-slider-output');
  /* 
    Number: min
    Number: max
    Number: step
  */
  range.create(0, 20000, 5000, 10000, 100);

}

if ( document.querySelector('.pagination') ) {

  /*
  .pagination
    .pagination__items
      .pagination__back.material-icons.pagination_hidden arrow_back
      .pagination__item.pagination__item_active 1
      .pagination__item 2
      .pagination__item 3
      .pagination__item ...
      .pagination__item 15 - всегда равна end
      .pagination__next.material-icons arrow_forward
    .pagination__text 1 – 12 из 100+ вариантов аренды

  start = 1
  end = 20
  (1) 2 3 . 20
  1 (2) 3 . 20
  1 2 (3) . 20

  */
  let pagination = document.querySelector('.pagination');
  let lastPage = pagination.getAttribute('pages');
  if (lastPage < 5) {
    lastPage = 5;
  }

  createElement('.pagination', 'div.pagination__items');
    createElement('.pagination__items', 'div.pagination__back.material-icons.pagination_hidden', 'arrow_back');
    createElement('.pagination__items', 'div.pagination__item.pagination__item_active', '1', 'page=1');
    createElement('.pagination__items', 'div.pagination__item', '2', 'page=2');
    createElement('.pagination__items', 'div.pagination__item', '3', 'page=3');
    if (lastPage > 5) {
      createElement('.pagination__items', 'div.pagination__item', '...', 'page=all');
    } else {
      createElement('.pagination__items', 'div.pagination__item', '4', 'page=4');
    }
    createElement('.pagination__items', 'div.pagination__item', lastPage, `page=${lastPage}`);
    createElement('.pagination__items', 'div.pagination__next.material-icons', 'arrow_forward');
  createElement('.pagination', 'div.pagination__text', '1 – 12 из 100+ вариантов аренды');

  let paginationItem = document.querySelectorAll('.pagination__item');
  let paginationItemLenght = paginationItem.length;
  let i = 0;

  paginationItem.forEach( (element, indx) => {
    element.onclick = () => {
      if (element.getAttribute('page') !== 'all' && element.getAttribute('page') !== '1') {
        if (i === 0) {
          paginationItem[0].classList.add('pagination_hidden');
          back.classList.remove('pagination_hidden');
        }
        paginationItem.forEach( element => { 
          element.classList.remove('pagination__item_active');
        })
        element.classList.add('pagination__item_active');
        i = indx;
        pagination.setAttribute('current-page', `${element.getAttribute('page')}`);
      };
    }
  })

  let back = document.querySelector('.pagination__back');
  back.onclick = () => {
    if (i < paginationItemLenght && i >= 0) {

      if (i > 1) {
        paginationItem[i].classList.remove('pagination__item_active');
        paginationItem[i - 1].classList.add('pagination__item_active');
        i--;
      }else if (i === 1 && Number( paginationItem[i].getAttribute('page') ) > 2) {
        paginationItem[i-1].setAttribute('page', `${Number( paginationItem[i-1].getAttribute('page') ) - 1}`);
        paginationItem[i-1].innerHTML = paginationItem[i-1].getAttribute('page');

        paginationItem[i].setAttribute('page', `${Number( paginationItem[i].getAttribute('page') ) - 1}`);
        paginationItem[i].innerHTML = paginationItem[i].getAttribute('page');

        paginationItem[i+1].setAttribute('page', `${Number( paginationItem[i+1].getAttribute('page') ) - 1}`);
        paginationItem[i+1].innerHTML = paginationItem[i+1].getAttribute('page');
      } else if (i === 1 && Number( paginationItem[i].getAttribute('page') ) === 2) {
        paginationItem[i].classList.remove('pagination_hidden');
        back.classList.add('pagination_hidden');
        paginationItem[i].classList.remove('pagination__item_active');
        paginationItem[i - 1].classList.add('pagination__item_active');
        i--;
      }

      if (Number( paginationItem[i].getAttribute('page') ) === lastPage - 4 && lastPage > 5) {
        paginationItem[i+2].setAttribute('page', 'all');
        paginationItem[i+2].innerHTML = '...';
      }

    }
    pagination.setAttribute('current-page', `${paginationItem[i].getAttribute('page')}`);
  };
  
  let next = document.querySelector('.pagination__next');
  next.onclick = () => {
    if (i < paginationItemLenght-1) {
      if (paginationItem[3].getAttribute('page') === 'all' && i === 2) {
        i = 2;

        paginationItem[i-2].setAttribute('page', `${Number( paginationItem[i-2].getAttribute('page') ) + 1}`);
        paginationItem[i-2].innerHTML = paginationItem[i-2].getAttribute('page');
    
        paginationItem[i-1].setAttribute('page', `${Number( paginationItem[i-1].getAttribute('page') ) + 1}`);
        paginationItem[i-1].innerHTML = paginationItem[i-1].getAttribute('page');
    
        paginationItem[i].setAttribute('page', `${Number( paginationItem[i].getAttribute('page') ) + 1}`);
        paginationItem[i].innerHTML = paginationItem[i].getAttribute('page');
      } else if (i < 2) {
        paginationItem[i].classList.remove('pagination__item_active');
        paginationItem[i+1].classList.add('pagination__item_active');
      
        if (i === 0) {
          paginationItem[i].classList.add('pagination_hidden');
          back.classList.remove('pagination_hidden');
        }

        i++;
      } else {
        i++;
      }
      
      if (Number( paginationItem[i].getAttribute('page') ) === lastPage - 2) {
        paginationItem[i+1].setAttribute('page', `${lastPage - 1}`);
        paginationItem[i+1].innerHTML = paginationItem[i+1].getAttribute('page');
      }

      if (paginationItem[3].getAttribute('page') !== 'all' && (i === 3 || i === 4)) {
        paginationItem[i-1].classList.remove('pagination__item_active');
        paginationItem[i].classList.add('pagination__item_active');
      }
    }
    pagination.setAttribute('current-page', `${paginationItem[i].getAttribute('page')}`);
  };

}

function createElement(where, what, content='none', attribute='none', insert='end') {
  /* 
  создать элемент: 
    где-куда?
    какой и с каким классом?
    с каким атрибутом?
    с каким содержимым?
    в начало или конец?
  */
  let block = document.querySelector(where);


  let whatSplit = what.split('.');

  let tag = whatSplit.shift();
  tag = document.createElement(tag);
  if (attribute !== 'none') {
    let attr = attribute.split('=');
    tag.setAttribute(attr[0], attr[1]);
  }

  let className = whatSplit.join(' ');
  tag.className = className;


  if (content !== 'none') {
    tag.innerHTML = content;
  }


  if (insert === 'start') {
    block.prepend(tag);
  } else if (insert === 'end') {
    block.append(tag);
  }
}