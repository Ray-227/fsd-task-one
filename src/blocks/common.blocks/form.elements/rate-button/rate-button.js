import {createElements, isElement} from '@/@modules/easyelement/easyelement.js';

/*
fieldset.rate__fieldset
  input(type="radio", name="rate", value="1", aria-label="Ужасно").rate__input.rate__star
  input(type="radio", name="rate", value="2", aria-label="Плохо").rate__input.rate__star
  input(type="radio", name="rate", value="3", aria-label="Средне").rate__input.rate__star
  input(type="radio", name="rate", value="4", aria-label="Хорошо").rate__input.rate__star
  input(type="radio", name="rate", value="5", aria-label="Отлично").rate__input.rate__star
*/

class Rate {
  constructor() {
    this.render();
    this.events();
  }

  render() {
    let rates = document.querySelectorAll('.rate');

    rates.forEach( (rate, index) => {
      let countStar = Number(rate.getAttribute('star'));

      createElements(rate, 'fieldset.rate__fieldset');

      for (let i = 0; i < 5; i++) {
        if (countStar === i+1) {
          createElements(`fieldset.rate__fieldset=${index}`, 'input.rate__input.rate__star', 'none', `type="radio", name=rate-${index+1}, value=${i+1}, aria-label=${this.ariaLabel(i+1)}, checked=""`);
        } else {
          createElements(`fieldset.rate__fieldset=${index}`, 'input.rate__input.rate__star', 'none', `type="radio", name=rate-${index+1}, value=${i+1}, aria-label=${this.ariaLabel(i+1)}`);
        }
      }
    })
  }

  events() {
    let rateInputs = document.querySelectorAll('.rate__input');

    rateInputs.forEach( input => {
      input.oninput = input.onclick = input.onfocus = input.onsubmit= (e) => {
        e.preventDefault();
        e.stopImmediatePropagation()
      };
    })
  }

  ariaLabel(num) {
    switch (num) {
      case 1: 
        return "Ужасно";
      break;
      case 2: 
        return "Плохо";
      break;
      case 3: 
        return "Средне";
      break;
      case 4: 
        return "Хорошо";
      break;
      case 5: 
        return "Отлично";
      break;
    }
  }
}

export const rate = isElement('.rate') ? new Rate() : '';