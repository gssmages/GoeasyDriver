import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController,Platform} from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

import { RestApiService } from '../rest-api.service';
import { Globals } from '../globals';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { CodePush, InstallMode, SyncStatus } from '@ionic-native/code-push/ngx';
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
  backButtonSubscription:any;

  constructor(
    private router: Router,
    public menu: MenuController,
    public alertController: AlertController,
    public loadingController: LoadingController,
    private loginservice: RestApiService,
    public globals: Globals,
    private ga: GoogleAnalytics,
    private platform: Platform
  ) { }

  ngOnInit() {
    this.ga.trackView('Login Page').then(() => {}).catch(e => console.log(e));    
    console.log(localStorage.getItem('mobilenumber'))   
   
    if(localStorage.getItem('mobilenumber')!=null && localStorage.getItem('DriverInternalID')!=null)
    {
      this.ga.setUserId(localStorage.getItem("DriverName") +"-"+ localStorage.getItem("mobilenumber"))
      this.globals.displayname=localStorage.getItem('DriverName');
      this.globals.mobilenumber=localStorage.getItem('mobilenumber')
      this.router.navigate(['/home']);
    }
  }
   ngOnDestroy() {
    this.backButtonSubscription.unsubscribe();
  }
  ionViewWillEnter() { this.menu.enable(false);
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(9999,async () => {
      this.router.navigate(['/login']);
      // Catches the active view
      const activeView = this.router.url;  
      const urlParts = activeView.split('/');              
      // Checks if can go back before show up the alert
      if(urlParts.includes('login')) {        
              const alert = await  this.alertController.create({
                  header: 'Goeasy Alert',
                  message: 'Are you sure want to close this app?',
                  buttons: [{
                      text: 'No',
                      role: 'cancel',
                      handler: () => {                       
                      }
                  },{
                      text: 'Yes',
                      handler: () => {                        
                        navigator['app'].exitApp();
                      }
                  }]
              });
              return await alert.present();
          }
    });
   }
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
    if (this.optnumber.toString()) {
      let value = this.optnumber.toString();
      console.log("value before checking -- > "+ value)
      if (value.length > 4) {
        event.preventDefault()
        this.optnumber = value.substring(0, 4);
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
          setTimeout(() => {
            this.loading.dismiss();
        }, 2000);
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
      setTimeout(() => {
        this.loading.dismiss();
    }, 2000);
      this.presentAlert(err);
    });
  }
  login() {
    if (this.optnumber) {
      console.log(this.optnumber.toString())
      let value = this.optnumber.toString();    
      console.log(value)
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
            this.ga.setUserId(localStorage.getItem("DriverName") +"-"+ localStorage.getItem("mobilenumber"))
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
          this.presentAlert(err);
          setTimeout(() => {
            this.loading.dismiss();
        }, 2000);
          
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
