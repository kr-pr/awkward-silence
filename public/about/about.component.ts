import {Component, View} from 'angular2/core';
@Component({
  selector: 'about-component'
})
@View({
  template: `
  <div id="about-header">
    <i>This service provides an concise description of conversation flow in visual form.</i>
  </div>
  <br>
  <div id="about-content">
    A typical workflow:
    <ul>
      <li>Create a conversation, add a note for future reference</li>
      <li>Add records to conversation for each device recording</li>
      <li>Start recording on each device</li>
      <li>Feel free to add short notes as conversation happens</li>
      <li>Stop recording on all devices</li>
      <li>View conversation timeline: 
      <ul>
        <li>Left track shows recorded volume for first two devices</li>
        <li>Center track holds your comments from all devices</li>
        <li>Right track shows % of speaker involvement averaged over a time window</li>
        <li>Click on colored area to label it according to who was speaking</li>
      </ul>
      <li>Observe how well was the conversation handled and save images for later reference.</li>
      <li>Improve your negotiating skills and profit!</li>
    </ul>  
  </div>`
})
export class AboutComponent {}
