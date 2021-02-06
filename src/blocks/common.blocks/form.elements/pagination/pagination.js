import {isElement} from '@/@modules/easyelement/easyelement.js';

if ( isElement('.pagination') ) {
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
}