import { bind, Component, OnInit, ViewChild } from "angular2/core";
import { Router, CanActivate , RouteParams} from "angular2/router";
import { User, Convo, Status } from "../types/types";
import { ApiService } from "../api/api.service";
import { tokenNotExpired } from 'angular2-jwt';
import { AudioService } from "../audio/audio.service";
import { StatusService } from "../status/status.service";
import { RecordStatusView } from "./record.status.view";

@Component({
  directives: [RecordStatusView],
  selector: "record-list",
  template: `<h3>Records:</h3>
<div class="grid grid-pad">
    <div *ngFor="#record of _convo?.records">
        <div>
            <h4>
              <button class="pure-button" (click)="showNote=!showNote; recordId=record._id">{{record.note}} recording panel</button>
              <button class="pure-button" (click)="removeRecord(record._id)">Remove</button>
            </h4>
            <hr>       
        </div>
    </div>
    <div *ngIf="showNote">
      <div>
      <input type="text" size=15 placeholder="Enter comment:" #comment (keyup)="0"/>
      <button class="pure-button button-small" (click)="sendComment(recordId, comment.value); comment.value=''">Send comment</button>
      </div>
      <div id="record-control-button">
      <br>
        <button class="pure-button button-large" *ngIf="!onAir" (click)="startRecording(recordId); onAir=!onAir">Start recording</button>
        <button class="pure-button button-large" *ngIf="onAir" (click)="stopRecording(); onAir=!onAir" >Stop recording</button>
      <br>
      </div>
      <div *ngIf="onAir">
        <status-view [status]="status"></status-view>
      </div> 
    </div>
    <button class="pure-button button-large" *ngIf="!showNote" (click)="addRecord(newNote); newNote=''; showRecordForm=!showRecordForm">Add new recording</button>
    <section id="record-note-input" *ngIf="showRecordForm && !showNote">
      <input type="text" size=15 placeholder="Enter record note (required):" #note (keyup)="newNote=note.value"/>
    </section>
</div>`,
  providers: [StatusService, AudioService]
})

@CanActivate(() => tokenNotExpired())

export class RecordsComponent implements OnInit {
  @ViewChild(RecordStatusView) childView: RecordStatusView;
  private id: string;
  private recordId: string;
  private showRecordForm: boolean;
  private showNote: boolean;
  private onAir: boolean;
  private newNote: string;
  private _convo: Convo;
  private status: Status;
  private errorMessage;
  private dataSub;
  private statObs;
  constructor(
      private _router: Router,
      private _routeParams: RouteParams,
      private _recordService: ApiService,
      private _statusService: StatusService,
      private _audioService: AudioService
    ) {
    this.showRecordForm = this.showNote = this.onAir = false;
    this.id = this.newNote = "";
    this.statObs = this._statusService.status$;
  }

  ngOnInit() {
    this.id = this._routeParams.get("id");
    this._recordService.getRecords(this.id).subscribe(
      convo => this._convo = convo,
      error =>  this.errorMessage = <any>error
    );
    this.statObs.subscribe(
      status => this.status = status,
      error =>  this.errorMessage = <any>error
    );
    this.statObs.connect();
  }

  addRecord(note: string) {
    if (note) {
      this._recordService.addRecord(JSON.stringify({convo: this.id, note: note})).subscribe(
      record => {
        this._convo.records.push(record);
      },
      error =>  this.errorMessage = <any>error
      );
    }
  };

  removeRecord(id: string) {
    this._recordService.removeRecord(id).subscribe(
      status => {
        this._convo.records.forEach((item, index) => {if (item._id === id) this._convo.records.splice(index, 1); });
      },
      error =>  this.errorMessage = <any>error
    );
  };

  startRecording(id) {
    this._audioService.startAcq()
    .then(val => {
      this.dataSub = val.subscribe(
        value => {
          this._statusService.updateStatus('volume', Math.round(value * 10) / 10);
          let obj = {
            points: { value: value }
          };
          this._recordService.updateRecord(id, JSON.stringify(obj)).subscribe(
            result => {
              this._statusService.updateStatus('points', result.points);
            },
            error =>  this.errorMessage = <any>error
          );
        }
      );
    })
    .catch((err) => console.log('The following gUM error occured: ' + err));
  }

  stopRecording() {
    this.dataSub.unsubscribe();
    this.childView.disable();
  }

  sendComment(id, comment) {
    let obj = {
      comments: { value: comment }
    }
    this._recordService.updateRecord(id, JSON.stringify(obj)).subscribe(
      result => {
        this._statusService.updateStatus('comments', result.comments);
      },
      error =>  this.errorMessage = <any>error
    );
  }
}