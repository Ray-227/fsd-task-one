if ( document.querySelector('.dropdown') ) {

  class DropDown {
    constructor() {
      this.people = { 
        adult: 0, 
        child: 0, 
        baby: 0
      };
    }

    toggle() {
      document.querySelector('.dropdown').classList.toggle('dropdown_show');
      document.querySelector('.dropdown__icon').classList.toggle('dropdown__icon_rotate-180');
      document.querySelector('.dropdown__options').classList.toggle('visually-hidden');
    }

    setJSON() {
      document.querySelector('.dropdown').setAttribute('people', `${JSON.stringify(this.people)}`);
    }

    getJSON() {
      JSON.parse(document.querySelector('.dropdown').getAttribute('people'));
    }

    add(target, output) {
      document.querySelectorAll('.dropdown__submit')[0].classList.remove('dropdown__submit_hidden');

      let count = 0;
      for (let key in this.people) {
        count += Number(this.people[key]);
      }

      if (count < 20) {
        this.people[target] += 1;
        output.innerHTML = this.people[target];
        this.output();
        this.setJSON();
      }
    }

    remove(target, output) {
      if (this.people[target] > 0) {
        this.people[target] -= 1;
        output.innerHTML = this.people[target];
        this.output();
        this.setJSON();
      }
    }

    removeAll() {
      for (let key in this.people) {
        this.people[key] = Number(0);
      }

    document.querySelectorAll('.dropdown__output').forEach( (item) => {
      item.innerHTML = 0;
    });

      document.querySelectorAll('.dropdown__submit')[0].classList.add('dropdown__submit_hidden');
      this.output();
      this.setJSON();
    }

    output() {
      let count = 0;
      for (let key in this.people) {
        count += Number(this.people[key]);
      }
      // Я сделал максимум 20 человек, мне было лень обрабатывать оканчания.
      let output = '';
      if (count === 1) {
        output = `${count} гость`;
      } else if (count < 5) {
        output = `${count} гостя`;
      } else {
        output = `${count} гостей`;
      }

      if (count === 20) {
        document.querySelector('.dropdown__text').innerHTML = `${output} (максимум)`;
      } else {
        document.querySelector('.dropdown__text').innerHTML = output;
      }
    }
  } 

  let dropDown = new DropDown();

  document.querySelector('.dropdown__body').addEventListener('click', function() {
    dropDown.toggle();
  });

  document.querySelector('.dropdown').addEventListener('keydown', function(e) {
    if (e.code === 'Space' && e.target !== document.body) {
      e.preventDefault();
      dropDown.toggle();
    }
  });

  document.querySelectorAll('.dropdown__count-add').forEach( (item, i) => {
    item.addEventListener('click', (e) => {
      dropDown.add( e.target.offsetParent.childNodes[i].getAttribute('name'), document.querySelectorAll('.dropdown__output')[i]);
    });
  });

  document.querySelectorAll('.dropdown__count-remove').forEach( (item, i) => {
    item.addEventListener('click', (e) => {
      dropDown.remove( e.target.offsetParent.childNodes[i].getAttribute('name'), document.querySelectorAll('.dropdown__output')[i]);
    });
  });

document.querySelectorAll('.dropdown__submit').forEach( (item) => {
  item.addEventListener('click', (e) => {
    if (e.target.name === 'reset') {
      dropDown.removeAll();
    }

    if (e.target.name === 'apply') {
      dropDown.toggle();
    }
  });
});

  document.body.addEventListener('click', function(e) {
    let target = e.target || e.srcElement;
    // Согласен, немного не понятно, но зато отлично работает, ~ превращает -1 в 0.
    /* Тут проверка, что при клике у элемента нету класса где фигурирует слово dropdown, 
      при этом у dropdown обёртки присуствует класс dropdown_show. */
    if ( !~String(target.className).indexOf('dropdown'.toLowerCase()) && ~String(document.querySelector('.dropdown').className).indexOf('dropdown_show'.toLowerCase())) {
      dropDown.toggle();
    }
  });
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
      let leftThump = document.querySelector('.range-slider__left-thumb');
      let rightThump = document.querySelector('.range-slider__right-thumb');
      // (step / max) * 100 - на сколько процентов двигать влево или вправо
      let move = (this.options.step / this.options.max) * 100;
      // Конец движения ползунков
      let rangeEnd = Math.round( ( (range.offsetWidth - leftThump.offsetWidth) / range.offsetWidth) * 100 ) + 0.5;

      range.oninput = range.onchange = (e) => {
        e.preventDefault();
      };

      update = (what) => {
        if (what === 'left+') {
          this.options.valueLeft += this.options.step;
          this.output.innerHTML = `${this.options.valueLeft}₽ - ${this.options.valueRight}₽`;
        } else if (what === 'left-') {
          this.options.valueLeft -= this.options.step;
          this.output.innerHTML = `${this.options.valueLeft}₽ - ${this.options.valueRight}₽`;
        }
      };

      leftThump.onmousedown = function(event) {
        event.preventDefault(); // предотвратить запуск выделения (действие браузера)
        document.body.style.cursor = 'grabbing';
        leftThump.style.cursor = 'grabbing';
        
        let currentLeft = 0;
        let x = event.clientX;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
  
        function onMouseMove(event) {
          let rightThumpBound = Number( rightThump.style.left.replace('%', '') );
          currentLeft = Number( leftThump.style.left.replace('%', '') );

          if (currentLeft < rightThumpBound) {
            leftThump.style.zIndex = 2;

            setTimeout(() => {
              x = event.clientX;
            }, 100);
  
            if (currentLeft < 0) {
              leftThump.style.left = 0 + '%';
              document.querySelector('.range-slider__fill').style.left = 0 + '%';
            } else if (currentLeft > rangeEnd) {
              leftThump.style.left = rangeEnd + '%';
              document.querySelector('.range-slider__fill').style.left = rangeEnd + '%';
            } else if (x < event.clientX && currentLeft < rangeEnd) {
              leftThump.style.left = (currentLeft + move) + '%';
              document.querySelector('.range-slider__fill').style.left = (currentLeft + move) + '%';
              update('left+');
            } else if (x > event.clientX && currentLeft > 0) {
              leftThump.style.left = (currentLeft - move) + '%';
              document.querySelector('.range-slider__fill').style.left = (currentLeft - move) + '%';
              update('left-');
            }
          } else if (x > event.clientX) {
            leftThump.style.left = (currentLeft - move) + '%';
            document.querySelector('.range-slider__fill').style.left = (currentLeft - move) + '%';
            update('left-');
          } else {
            leftThump.style.zIndex = 666;
          }
        }
  
        function onMouseUp() {
          leftThump.style.cursor = 'grab';
          document.body.style.cursor = 'default';
          document.removeEventListener('mouseup', onMouseUp);
          document.removeEventListener('mousemove', onMouseMove);
        }
        
      };
  
      leftThump.ondragstart = function() {
        return false;
      };
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