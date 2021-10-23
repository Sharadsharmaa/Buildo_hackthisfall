import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../core/services/user.service';
import { JwtService } from '../core/services/jwt.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { environment } from "../../environments/environment";
import { AlertService } from '../_alert';
import Sawo from "sawo";
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  Sawo: any;
  userPayload: any = {};
  constructor(
    private fb: FormBuilder,
    private jwtservice: JwtService,
    private router: Router,
    private spinner: NgxUiLoaderService,
    private dataService: UserService,
    public alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  ngAfterViewInit(): void {
    this.sawoLogin();
  }

  login(): void {
    this.spinner.start();
    this.dataService.loginUser(this.loginForm.value).subscribe(res => {
      this.spinner.stop();

      if (res.statusCode === 200) {
        this.jwtservice.saveToken(res.data.token);
        this.alertService.success('Success!!', { autoClose: true, keepAfterRouteChange: true });
        this.router.navigate(['/']);
      } else {
        this.spinner.stop();
        this.alertService.error(res.message, { autoClose: true, keepAfterRouteChange: true });
      }
    }, (err) => {
      this.spinner.stop();
    });
  }


  sawoLogin(): void {
    const sawoConfig = {
      containerID: "sawo-container",
      // can be one of 'email' or 'phone_number_sms'
      identifierType: "email",
      apiKey: environment.sawoApiKey,
      onSuccess: (payload: any) => {
        this.spinner.start();
        this.userPayload = payload;
        $("#sawoModal").modal('hide');
        const userData = {
          provider_id: this.userPayload.user_id,
          provider_type: "SAWO",
          email: this.userPayload.identifier,
          name: this.userPayload.customFieldInputValues["Full name"]
        }
        this.spinner.start();
        this.dataService.sawoLogin(userData).subscribe(res => {
          this.spinner.stop();
          if (res.statusCode === 200) {
            this.jwtservice.saveToken(res.data.token);
            this.alertService.success('Success!!', { autoClose: true, keepAfterRouteChange: false })
            setTimeout(() => this.router.navigate(['/']), 2000);

          } else {
            this.spinner.stop();
          }
        }, (err) => {
          this.spinner.stop();
          this.alertService.error('Something went wrong!!', { autoClose: true, keepAfterRouteChange: false });
        });
      }
    };
    this.Sawo = new Sawo(sawoConfig);
    this.Sawo.showForm();

  }
}
