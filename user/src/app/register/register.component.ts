import { Component, OnInit } from '@angular/core';
import Sawo from "sawo";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  Sawo: any;
  isLoggedIn:any= false;
  userPayload:any = {};

  constructor() { }

  ngOnInit(): void {
  	const sawoConfig = {
      // should be same as the id of the container
      containerID: "sawo-container",
      // can be one of 'email' or 'phone_number_sms'
      identifierType: "email",
      // Add the API key
      apiKey: "2e519a6e-7712-4543-a54c-4294373848bc",
      // Add a callback here to handle the payload sent by sdk
      onSuccess: (payload: any) => {
        this.userPayload = payload;
        this.isLoggedIn = true;
      }
    };
    // creating instance
    this.Sawo = new Sawo(sawoConfig)
  }
  ngAfterViewInit() {
    this.Sawo.showForm()
  }
}
