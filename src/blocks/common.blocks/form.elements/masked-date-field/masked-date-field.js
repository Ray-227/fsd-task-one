import {isElement} from '@/@modules/easyelement/easyelement.js';

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

if ( isElement('.input-date-masked') ) {
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


export const maskedDate = isElement('.input-date-masked') ? new MaskedDate() : '';