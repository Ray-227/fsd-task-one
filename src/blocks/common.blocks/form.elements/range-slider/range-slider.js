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
    let max = this.options.max;
    let output = this.output;

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
            range.setAttribute('valueleft', max / 100 * leftThumpBound);
            output.innerHTML = `${range.getAttribute('valueleft')}₽ - ${range.getAttribute('valueright')}₽`;
          } else if (whichThump === 'right') {
            rightThump.style.zIndex = 3;
            leftThump.style.zIndex = 2;
            isThumpBound = currentLeft > leftThumpBound || x < event.clientX;
            range.setAttribute('valueRight', max / 100 * rightThumpBound);
            output.innerHTML = `${range.getAttribute('valueleft')}₽ - ${range.getAttribute('valueright')}₽`;
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
export const range = new Range('.range-slider__input', '.range-slider-output');

