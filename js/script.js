'use strict';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

let map, mapEvent;

if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
        // func happens when geo location is accepted
        function(position){
            const {latitude, longitude} = position.coords;
            const coords = [latitude, longitude];
            map = L.map('map').setView(coords, 13);
            L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',{
                attribution: '<a style="color:red;text-decoration:none" href="https://www.github.com/firasmlt" target="_blank">My GitHub</a>'
            }).addTo(map);
            map.on('click', function(mapE){
                mapEvent = mapE;
                form.classList.remove('hidden');
                inputDistance.focus();
            })
        },
        // func happens when geo location is declined
        function(){
            alert(`We couldn't get your location`)
        }
            
    )
}


form.addEventListener('submit', function(e){
    e.preventDefault();


    inputDistance.value = inputDuration.value = inputElevation.value = inputCadence.value = '';
    const {lat, lng} = mapEvent.latlng;
        L.marker([lat, lng]).addTo(map).bindPopup(L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: 'cycling-popup'
    })).setPopupContent('workout').openPopup();})


inputType.addEventListener('change', function(){
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
})