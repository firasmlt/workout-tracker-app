'use strict';


const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
const sideBar = document.querySelector('.sidebar')
class Workout{
    date = new Date();
    id = (Date.now() + '').slice(-10);
    constructor(coords, distance, duration){
        this.coords = coords;
        this.distance = distance;
        this.duration = duration;
    }
}
class Running extends Workout{
    type = 'running'
    constructor(coords, distance, duration, cadence){
        super(coords, distance, duration)
        this.cadence = cadence;
        this.calcPace()
    }
    calcPace(){
        // min/km
        this.pace = this.duration / this.distance;
        return this.pace;
    }

}

class Cycling extends Workout{
    type = 'cycling'
    constructor(coords, distance, duration, elevationGain){
        super(coords, distance, duration)
        this.elevationGain = elevationGain;
        this.calcSpeed();
    }
    calcSpeed(){
        this.speed = this.distance / (this.duration / 60);
        return this.speed;
    }
}

class App{
    #map;
    #mapEvent;
    #workouts = [];
    constructor(){
        this._getPosition();
        form.addEventListener('submit', this._newWorkout.bind(this))
        inputType.addEventListener('change', this._toggleElevationField)
    }

    _getPosition(){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), ()=>alert(`We couldn't get your location`));
        }
    }

    _loadMap(position){
        const {latitude, longitude} = position.coords;
        const coords = [latitude, longitude];
        this.#map = L.map('map').setView(coords, 13);
        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',{
            attribution: '<a style="color:red;text-decoration:none" href="https://www.github.com/firasmlt" target="_blank">My GitHub</a>'
            }).addTo(this.#map);
        this.#map.on('click', this._showForm.bind(this))
    }

    _showForm(mapE){
        this.#mapEvent = mapE;
        form.classList.remove('hidden');
        inputDistance.focus();
    }
    _toggleElevationField(){
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden')
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden')
    }
    _newWorkout(e){
        e.preventDefault();

        const validInputs = (...inputs) => inputs.every(inp => Number.isFinite(inp) && inp>0);
        // get data from the form
        const type = inputType.value;
        const distance = +inputDistance.value;
        const duration = +inputDuration.value;
        const {lat, lng} = this.#mapEvent.latlng;
        let workout;

        if(type === 'running'){
            const cadence = +inputCadence.value;
            // check the data is valid or not
            if(!validInputs(distance, duration, cadence)){
                alert('inputs have to be positive numbers')
                return
            }
            // if it's running then running object
            workout = new Running([lat, lng], distance, duration, cadence);
        }
        
        if(type === 'cycling'){
            const elevation = +inputElevation.value;
            if(!validInputs(distance, duration, elevation)){
                alert('inputs have to be positive numbers')
                return
            }
            // if the workout is cycling create cycling object
            workout = new Cycling([lat, lng], distance, duration, elevation);
        }
        // add the object the the workout array
        this.#workouts.push(workout);   
        // render the workout on map as marker
        this.renderWorkoutMarker(workout);
        // render workout on list
        
        // hide the form + clear input fields
        form.classList.add('hidden');
        inputDistance.value = inputDuration.value = inputElevation.value = inputCadence.value = '';
        console.log(this.#workouts)
    }
    renderWorkoutMarker(workout){
        L.marker(workout.coords).addTo(this.#map).bindPopup(L.popup({
            maxWidth: 250,
            minWidth: 100,
            autoClose: false,
            closeOnClick: false,
            className: `${workout.type}-popup`
        })).setPopupContent(workout.type).openPopup();
    }
}

const app = new App();