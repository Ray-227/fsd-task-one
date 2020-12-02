if( document.querySelector('.dropdown') ) {

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
      if(this.people[target] > 0) {
        this.people[target] -= 1;
        output.innerHTML = this.people[target];
        this.output();
        this.setJSON();
      }
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