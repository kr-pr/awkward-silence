import { Component, OnInit } from "angular2/core";
import { Router, CanActivate , RouteParams} from "angular2/router";
import { User, Convo, Status } from "../types/types";
import { ApiService } from "../api/api.service";
import { tokenNotExpired } from 'angular2-jwt';
import { AudioService } from "../audio/audio.service";

@Component({
  selector: "record-list",
  template: `<h3>Records:</h3>
<div class="grid grid-pad">
    <div *ngFor="#record of convo?.records">
        <div>
            <h4>{{record.note}}<button (click)="showNote=!showNote; recordId=record._id">Show recording panel</button></h4>       
        </div>
    </div>
    <div *ngIf="showNote">
      <input type="text" size=20 placeholder="Enter comment:" #comment (keyup)="0"/>
      <button (click)="sendComment(recordId, comment.value); comment.value=''">Send comment</button>
      <button *ngIf="!onAir" (click)="startRecording(recordId); onAir=!onAir">Start recording</button>
      <button *ngIf="onAir" (click)="stopRecording(); onAir=!onAir" >Stop recording</button>
      <div *ngIf="status.points>0 || status.comments>0">{{status.comments}} comments sent/{{status.points}} seconds recorded</div> 
    </div>
    <button *ngIf="!showNote" (click)="addRecord(newNote); showRecordForm=!showRecordForm">Add new recording</button>
    <section *ngIf="showRecordForm">
      <input type="text" size=40 placeholder="Enter record note (required):" #note (keyup)="newNote=note.value"/>
    </section>
</div>`,
  providers: [AudioService]
})

@CanActivate(() => tokenNotExpired())

export class RecordsComponent implements OnInit {
  id: string = '';
  recordId: string;
  showRecordForm: boolean = false;
  showNote: boolean = false;
  onAir: boolean = false;
  status: Status = {comments: 0, points: 0};
  newNote: string = '';
  convo: Convo;
  errorMessage;
  subscription;
  constructor(
      private _router: Router,
      private _routeParams: RouteParams,
      private _recordService: ApiService,
      private _audioService: AudioService
  ) {}

  ngOnInit() {
    this.id = this._routeParams.get('id');
    this._recordService.getRecords(this.id).subscribe(
      convo => this.convo = convo,
      error =>  this.errorMessage = <any>error
    );
  }

  addRecord(note: string) {
    if (note) {
      this._recordService.addRecord(JSON.stringify({convo: this.id, note: note})).subscribe(
      record => {
        this.convo.records.push(record);
      },
      error =>  this.errorMessage = <any>error
      );
    }
  };

  startRecording(id) {
    this.subscription = this._audioService.audio$.subscribe(
      value => {
        let obj = {
          points: {
            time: Date.now(),
            value: value
          }
        }
        this._recordService.updateRecord(id, JSON.stringify(obj)).subscribe(
          result => this.status.points = result.points,
          error =>  this.errorMessage = <any>error
        );
      }
    );
  }

  stopRecording() {
    this.subscription.unsubscribe();
  }

  sendComment(id, comment) {
    let obj = {
      comments: {
        time: Date.now(),
        value: comment
      }
    }
    this._recordService.updateRecord(id, JSON.stringify(obj)).subscribe(
      result => this.status.comments = result.comments,
      error =>  this.errorMessage = <any>error
    );
  }
}