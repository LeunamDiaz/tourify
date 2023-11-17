const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const closeButton = document.querySelector('.icon-close');
const addMark = document.getElementById('add');
const removeMark = document.getElementById('remove');

registerLink.addEventListener('click', () => {
    wrapper.classList.add('active');
});

loginLink.addEventListener('click', () => {
    wrapper.classList.remove('active');
});

closeButton.addEventListener('click', () => {
    wrapper.classList.remove('active');
});

addMark.addEventListener('click', addMarker);
removeMark.addEventListener('click', removeMarker);

function addMarker() {
    // call API to add to DB
    
    // refresh map markers
    initMap(); 
  }
  
  function removeMarker() {
    // call API to remove from DB
  
    // refresh map
    initMap();
  }
  var dismissButtons = document.querySelectorAll(".dismiss-button"); // Seleccionamos los botones dentro de elementos con la clase "dismiss-button"

  function closeError(event) {
      // Obtén el elemento padre del botón de dismiss
      var errorDiv = event.target.closest(".dismiss-button");
  
      // Verifica si se encontró el elemento padre
      if (errorDiv) {
          // Oculta el elemento padre
          errorDiv.style.display = "none";
      }
  }
  
  // Agrega un controlador de eventos a cada botón de dismiss
  dismissButtons.forEach(function(button) {
      button.addEventListener("click", closeError);
  });