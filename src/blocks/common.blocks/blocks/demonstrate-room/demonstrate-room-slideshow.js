let demonstrateRoom = document.querySelectorAll('.demonstrate-room');

/*
.demonstrate-room__slider
    .demonstrate-room__icons.demonstrate-room__prev.material-icons expand_more
    .demonstrate-room__images
      img(src="/src/images/demonstrate-room__images/demonstrate-room-default.png", alt="default")
      img(src="/src/images/demonstrate-room__images/demonstrate-room-default.png", alt="default")
      img(src="/src/images/demonstrate-room__images/demonstrate-room-default.png", alt="default")
      img(src="/src/images/demonstrate-room__images/demonstrate-room-default.png", alt="default")
    .demonstrate-room__icons.demonstrate-room__next.material-icons expand_more
*/

demonstrateRoom.forEach( (room) => {
  const prev = room.querySelector('.demonstrate-room__prev');
  const next = room.querySelector('.demonstrate-room__next');
  const images = room.querySelector('.demonstrate-room__images');
  const imagesWidth = Number( getComputedStyle(images).width.replace('px', '') );
  
  const elipses = room.querySelectorAll('.demonstrate-room__elipse');
  let show = 0;
  elipses[show].classList.add('demonstrate-room__elipse_active');

  prev.onclick = next.onclick = (e) => {
    const isPrev = e.target.classList.value.includes('prev');
    const isNext = e.target.classList.value.includes('next');

    if (isPrev) {
      if (show > 0) {
        elipses[show].classList.remove('demonstrate-room__elipse_active');
        show -= 1;
        images.style.left = -(imagesWidth*show) +'px';
        elipses[show].classList.add('demonstrate-room__elipse_active');
      }
    } else if (isNext) {
      if (show < 3) {
        elipses[show].classList.remove('demonstrate-room__elipse_active');
        show += 1;
        images.style.left = -(imagesWidth*show) +'px';
        elipses[show].classList.add('demonstrate-room__elipse_active');
      }
    }

  };

})