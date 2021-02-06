import {createElements, convertToObject, isElement} from '@/@modules/easyelement/easyelement.js';

/*
.checkbox-list.checkbox-list_show
.checkbox-list__body
  .checkbox-list__text expandable checkbox list
  .checkbox-list__icon.material-icons expand_more
.checkbox-list__items
  label.checkbox__label.checkbox-list__item
    input(type="checkbox", name="pe1t").checkbox__input
    .checkbox__box
    .checkbox__text Завтрак
*/

class CheckboxList {
  constructor() {
    this.checkboxList = document.querySelectorAll('.checkbox-list');
    this.render();
    this.events();
  }
  render() {
    let checkboxListAll = this.checkboxList;

    checkboxListAll.forEach( (currentCheckboxList, index) => {
      // createElements(where, what, content='none', attribute='none', insert='end');
      let text = currentCheckboxList.getAttribute('text');

      createElements(currentCheckboxList, 'div.checkbox-list__body');
      createElements(`.checkbox-list__body=${index}`, 'div.checkbox-list__text', text);
      createElements(`.checkbox-list__body=${index}`, 'div.checkbox-list__icon.material-icons', 'expand_more');
      createElements(currentCheckboxList, 'div.checkbox-list__items');

      if ( currentCheckboxList.hasAttribute('show') ) {
        currentCheckboxList.classList.toggle('checkbox-list_show');
        currentCheckboxList.children[0].children[1].classList.toggle('checkbox-list__icon_rotate-180');
        currentCheckboxList.children[1].classList.toggle('checkbox-list__items_show');
      }

      let items = convertToObject( currentCheckboxList.getAttribute('items') );
      let key = Object.keys(items);

      for (let i = 0; i < key.length; i++) {
        createElements(`.checkbox-list__items=${index}`, 'label.checkbox__label.checkbox-list__item');
        let imdx = document.querySelectorAll('.checkbox-list__item').length - 1;
        createElements(`.checkbox-list__item=${imdx}`, 'input.checkbox__input', 'none', `type="checkbox", name="${key[i]}"`);
        createElements(`.checkbox-list__item=${imdx}`, 'div.checkbox__box');
        createElements(`.checkbox-list__item=${imdx}`, 'div.checkbox__text', `${items[key[i]]}`);
      }

    })
  }
  events() {
    let checkboxListAll = this.checkboxList;

    checkboxListAll.forEach( checkboxList => {
      checkboxList.onclick = (e) => {
        if ( !e.target.classList.contains('checkbox-list__items') ) {
          checkboxList.classList.toggle('checkbox-list_show');
          checkboxList.children[0].children[1].classList.toggle('checkbox-list__icon_rotate-180');
          checkboxList.children[1].classList.toggle('checkbox-list__items_show');
        }
      };
    })
  }
}

export const checkboxList = isElement('.checkbox-list') ? new CheckboxList() : '';