import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

import { RestApiService } from '../rest-api.service';
import { Globals } from '../globals';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  mobilenumber: any;
  optnumber: any;
  private loading: any;
  showmobilenumber: boolean = true;
  showotpblock: boolean = false;


  constructor(
    private router: Router,
    public menu: MenuController,
    public alertController: AlertController,
    public loadingController: LoadingController,
    private loginservice: RestApiService,
    public globals: Globals
  ) { }

  ngOnInit() {
    console.log(localStorage.getItem('mobilenumber'))
    if(localStorage.getItem('mobilenumber')!=null && localStorage.getItem('DriverInternalID')!=null)
    {
      this.globals.displayname=localStorage.getItem('DriverName');
      this.globals.mobilenumber=localStorage.getItem('mobilenumber')
      this.router.navigate(['/home']);
    }

  }
  ionViewWillEnter() { this.menu.enable(false); }
  ionViewDidLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }
  getvalidmobileno() {
    //console.log(this.moiblenumber)
    if (this.mobilenumber) {
      let value = this.mobilenumber;
      value = value.toString();
      if (value.length > 10) {
        event.preventDefault()
        this.mobilenumber = parseInt(value.substring(0, 10));
      }
    }

  }
  getvalidOTP() {
    // console.log(this.optnumber)
    if (this.optnumber) {
      let value = this.optnumber;
      value = value.toString();
      console.log("value before checking -- > "+ value)
      if (value.length > 4) {
        event.preventDefault()
        this.optnumber = parseInt(value.substring(0, 4));
      }
    }

  }
  sendotp() {
    if (this.mobilenumber) {
      let value = this.mobilenumber.toString();
      value = value.length
      if (value != 10) {
        this.presentAlert("Please enter 10 digit Mobile Number")
      }
      else {
        localStorage.setItem("mobilenumber", this.mobilenumber);

        this.presentLoading();
        this.loginservice.getLoginOTPData(localStorage.getItem('mobilenumber'), '0').subscribe(res => {
          //console.log("results are : " + JSON.stringify(res))
          if (res.results.ErrorCode == "0") {

            this.mobilenumber = "";
            this.showmobilenumber = false;
            this.showotpblock = true;
            this.loading.dismiss();
            this.presentAlert("You will get OTP on your registered mobile number !!");
          }
          else {
            this.loading.dismiss();
            this.presentAlert(res.results.ErrorDesc);
          }

        }, err => {
          console.log(err);
          this.loading.dismiss();
          this.presentAlert(err);
        });
      }

    }
    else {
      this.presentAlert("Please enter Mobile Number");
    }
  }
  resendOTP() {
    this.presentLoading();
    this.loginservice.getLoginOTPData(localStorage.getItem('mobilenumber'), '1').subscribe(res => {
      //console.log("results are : " + JSON.stringify(res))
      if (res.results.ErrorCode == "0") {
        this.loading.dismiss();
        this.presentAlert("Your resend request is sent. you will get OTP on your registered mobile number !!");
      }
      else {
        this.loading.dismiss();
        this.presentAlert(res.results.ErrorDesc);
      }

    }, err => {
      console.log(err);
      this.loading.dismiss();
      this.presentAlert(err);
    });
  }
  login() {
    if (this.optnumber) {
      let value = this.optnumber.toString();
      value = value.length
      if (value != 4) {
        this.presentAlert("Please enter 4-digit OTP")
      }
      else {        
        this.presentLoading();
        this.loginservice.getLoginVerfiyData(localStorage.getItem('mobilenumber'), this.optnumber).subscribe(res => {
          //console.log("results are : " + JSON.stringify(res))
          if (res.results.ErrorCode == "0") {
            this.optnumber = "";
            this.showmobilenumber = true;
            this.showotpblock = false;
            localStorage.setItem("LocationName", res.results.LocationName);
            localStorage.setItem("RegularDriver", res.results.RegularDriver);
            localStorage.setItem("DriverInternalID", res.results.DriverInternalID);
            localStorage.setItem("DriverName", res.results.DriverName);
            this.globals.displayname=localStorage.getItem('DriverName');
            this.globals.mobilenumber=localStorage.getItem('mobilenumber')
            this.router.navigate(['/home']);
            this.loading.dismiss();
          }
          else {
            this.optnumber = "";
            this.loading.dismiss();
            this.presentAlert(res.results.ErrorDesc);
          }

        }, err => {
          console.log(err);
          this.loading.dismiss();
          this.presentAlert(err);
        });
      }
    }
    else {
      this.presentAlert("Please enter OTP");
    }

  }
  async presentAlert(alertmessage: string) {
    const alert = await this.alertController.create({
      header: 'GoEasy Alert',
      message: alertmessage,
      buttons: ['OK']
    });

    await alert.present();
  }
  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Loading....',
    });
    return await this.loading.present();
  }
}
