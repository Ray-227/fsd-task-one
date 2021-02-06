import {isElement} from '@/@modules/easyelement/easyelement.js';

if ( isElement('.input-date-dropdown') ) {
  let inputDateDropDown = document.querySelectorAll('.input-date-dropdown');

  inputDateDropDown.forEach( (item) => {
    item.onclick = () => {
      console.log('dropdown');
    };
  });
}