import {Component, View} from 'angular2/core';
@Component({
  selector: 'landing-component'
})
@View({
  template: `
  <div id="landing-container">
      <div id="front-pic-container">
        <img src="assets/boring-date.jpg">
      </div>
        <h1>Awkward Silence</h1> 
  </div>`
})
export class LandingComponent {}