import { Component, OnInit } from "angular2/core";
import { Router, CanActivate } from "angular2/router";
import { User, Convo } from "../types/types";
import { ApiService } from "../api/api.service";
import { tokenNotExpired } from 'angular2-jwt';
@Component({
  selector: "convo-list",
  template: `<h3>Conversations:</h3>
<div class="grid grid-pad">
    <div *ngFor="#convo of convos">
        <div>
            <h4>{{convo.note}}<button (click)="editConvo(convo)">Edit conversation</button></h4>
        </div>
    </div>
    <button (click)="addConvo()">Add new conversation</button>
</div>`
})

@CanActivate(() => tokenNotExpired())

export class ConvosComponent implements OnInit {
  convos: Convo[] = [];
  errorMessage;

  constructor(
      private _router: Router,
      private _convoService: ApiService
  ) {}

  ngOnInit() {
    this._convoService.getUserConvos().subscribe(
      user => this.convos = user.convos,
      error =>  this.errorMessage = <any>error
    );
  }

  editConvo(convo: Convo) {}
  addConvo() {};
}