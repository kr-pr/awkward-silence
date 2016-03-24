import { Component, OnInit } from "angular2/core";
import { Router, CanActivate } from "angular2/router";
import { User, Convo } from "../types/types";
import { ApiService } from "../api/api.service";
import { tokenNotExpired } from 'angular2-jwt';
import { SessionService } from "../session/session.service";

@Component({
  selector: "convo-list",
  template: `<h3>Conversations:</h3>
<div class="grid grid-pad">
    <div *ngFor="#convo of user?.convos">
        <div>
            <h4>
              {{convo.note}}
              <button (click)="editConvo(convo._id)">Edit conversation</button>
              <button (click)="viewConvo(convo._id)">View conversation</button>
            </h4>
        </div>
    </div>
    <button (click)="addConvo(newNote); showConvoForm=!showConvoForm">Add new conversation</button>
    <section *ngIf="showConvoForm">
      <input type="text" size=40 placeholder="Enter conversation note (required):" #note (keyup)="newNote=note.value" (blur)="note.value=''"/>
    </section>
</div>`,
  providers: [SessionService]
})

@CanActivate(() => tokenNotExpired())

export class ConvosComponent implements OnInit {
  showConvoForm: boolean = false;
  newNote: string = '';
  user: User;
  errorMessage;

  constructor(
      private _router: Router,
      private _convoService: ApiService,
      private _sessionService: SessionService
  ) {}

  ngOnInit() {
    this._convoService.getUserConvos().subscribe(
      user => {
        this._sessionService.updateUser(user);
      },
      error =>  this.errorMessage = <any>error
    );
    this._sessionService.user$.subscribe(
      user => this.user = user,
      error =>  this.errorMessage = <any>error
    );
  }

  editConvo(id: string) {
    this._router.navigate(['Records', { id: id }]);
  }

  viewConvo(id: string) {
    this._router.navigate(['Views', { id: id }]);
  }

  addConvo(note: string) {
    if (note) {
      this._convoService.addConvo(JSON.stringify({user: this.user._id, note: note})).subscribe(
      convo => {
        this.user.convos.push(convo);
        this._sessionService.updateUser(this.user);
      },
      error =>  this.errorMessage = <any>error
      );
    }
  };
}