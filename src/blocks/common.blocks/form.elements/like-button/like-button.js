import {isElement} from '@/@modules/easyelement/easyelement.js';

class LikeButton {
  constructor() {
    this.event();
  }

  event() {
    let likeButtons = document.querySelectorAll('.like-button');

    likeButtons.forEach( likeButton => {
      let click = false;

      likeButton.onclick = (e) => {
          let inputHeart = e.currentTarget.children[0].children[0];
          let heartCountBlock = e.currentTarget.children[0].children[1].children[0];
          let heartCountNumber = Number(heartCountBlock.getAttribute('heartCount'));

          if ( inputHeart.checked && !click) {
            click = true;
            heartCountBlock.innerHTML = heartCountNumber + 1;
            heartCountBlock.setAttribute('heartCount', `${heartCountNumber + 1}`);
          } else if (!inputHeart.checked && click) {
            click = false;
            heartCountBlock.innerHTML = heartCountNumber - 1;
            heartCountBlock.setAttribute('heartCount', `${heartCountNumber - 1}`);
          }
      };
    })
  }
}

export let likeButton = isElement('.like-button') ? new LikeButton() : '';







