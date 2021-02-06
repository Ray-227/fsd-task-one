import {createElements, convertToObject, isElement} from '@/@modules/easyelement/easyelement.js';



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

class DropDown {

  constructor() {
    this.dropDowns = document.querySelectorAll('.dropdown');
    this.render();
    this.events();
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

      if ( dropdown.hasAttribute('show') ) { 
        dropdown.classList.toggle('dropdown_show');
        dropdown.children[0].children[1].classList.toggle('dropdown__icon_rotate-180');
        dropdown.children[1].classList.toggle('dropdown_hidden');
      }
      // Create dropdown__option in dropdown__options
      for (let i = 0; i < keys.length; i++) {
        createElements(dropdownOptionBlock, 'div.dropdown__option', 'none', `name=${keys[i]}`);

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

        let dropdownButtons = document.querySelectorAll('.dropdown__buttons')[document.querySelectorAll('.dropdown__buttons').length - 1];
        createElements(dropdownButtons, 'input.dropdown__submit.dropdown__submit_hidden', 'none', 'type="submit", value="Очистить", name="reset"');
        createElements(dropdownButtons, 'input.dropdown__submit', 'none', 'type="submit", value="Применить", name="apply"');
      }
    })
  }

  events() {
    let dropDowns = this.dropDowns;
    dropDowns.forEach( dropdown => {
      dropdown.onclick = (e) => {
        if ( e.target.classList.contains('dropdown__body') || e.target.classList.contains('dropdown__icon') || e.target.classList.contains('dropdown__text') || (e.target.classList.contains('dropdown__submit') && e.target.getAttribute('name') === 'apply') ) {
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
    let options = document.querySelectorAll('.dropdown__options');

    options.forEach( option => {
      let text = {};
      let names = {};
      let currentOption = Array.from(option.children);
      let buttons = currentOption[currentOption.length - 1].classList.contains('dropdown__buttons') ? currentOption[currentOption.length - 1] : false;
      let buttonReset = currentOption[currentOption.length - 1].classList.contains('dropdown__buttons') ? currentOption[currentOption.length - 1].children[0] : false;
      let isbuttons = buttons ? true : false;
      if ( isbuttons ) {
        buttonReset.onclick = () => {
          console.clear('CLEAR');
        };
      }
      currentOption.forEach( (option, index) => {

        if (option.classList.contains('dropdown__option')) {

          let remove = option.children[1].children[0];
          let output = option.children[1].children[1];
          let add = option.children[1].children[2];

          let count = 0;
          let name = option.getAttribute('name');
          let key = option.children[0].innerText;
          key = key[0] + key.slice(1).toLowerCase();
  
          add.onclick = () => {
            if (count < 20) {
              count++;
              output.innerHTML = count;
              text[key] = count;
              names[name] = count;
              this.output(option, text, names);
            }
            if ( isbuttons ) {
              buttons.style.justifyContent = 'space-between';
              buttonReset.classList.remove('dropdown__submit_hidden');
            }
          };
  
          remove.onclick = () => {
            if (count > 0) {
              count--;
              output.innerHTML = count;
              if (count > 0) {
                text[key] = count;
                names[name] = count;
              } else {
                delete text[key];
                delete names[name];
              }
              this.output(option, text, names);
            } 

            if (count === 0 && isbuttons ) {
              buttons.style.justifyContent = '';
              buttonReset.classList.add('dropdown__submit_hidden');
            }
          };

        }

      })
    })
  }

  output(element, text, names) {
    let attr = '';
    for (let key in names) {
      attr += key + ' ' + names[key] + ' ';
    }
    attr = attr.trim();

    let info = '';
    let isEmpty = false;
    for (let key in text) {
      info += key + ' ' + text[key] + ' ';
      isEmpty = true;
    }

    let output = element.parentElement.previousElementSibling.firstElementChild;

    if ( isEmpty ) {
      output.innerHTML = info;
      element.parentElement.parentElement.setAttribute('info', attr);
    } else {
      output.innerHTML = element.parentElement.parentElement.getAttribute('text');
      element.parentElement.parentElement.removeAttribute('info');
    }
  }
}

export const dropDown = isElement('.dropdown') ? new DropDown() : '';

