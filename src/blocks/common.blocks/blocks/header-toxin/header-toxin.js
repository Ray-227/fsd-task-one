function headerToxinMenuLink() {
  const links = document.querySelectorAll('.header-toxin__menu-link');
  let pastClickLinks;

  links.forEach( link => {
    link.onclick = () => {
      if (pastClickLinks) {
        pastClickLinks.classList.remove('header-toxin__menu-link_active');
      }
      link.classList.add('header-toxin__menu-link_active');
      pastClickLinks = link;
    };
  })
}

function headerToxinMenuDropdown() {
  
  const menuDropdowns = document.querySelectorAll('.header-toxin__menu-dropdown');
  let pastClickMenuDropdown;

  menuDropdowns.forEach ( dropdown => {
    dropdown.onclick = () => {

      if (pastClickMenuDropdown) {
        pastClickMenuDropdown.classList.remove('header-toxin__menu-dropdown_active');
      }
      dropdown.classList.add('header-toxin__menu-dropdown_active');
      pastClickMenuDropdown = dropdown;

      document.onclick = (e) => {
        if ( !e.target.classList.contains('header-toxin__menu-dropdown') ) {
          if (pastClickMenuDropdown) {
            pastClickMenuDropdown.classList.remove('header-toxin__menu-dropdown_active');
          }
          document.onclick = null;
        }
      };

    };

  })

}

headerToxinMenuLink();
headerToxinMenuDropdown();
