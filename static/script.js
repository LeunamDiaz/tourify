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
