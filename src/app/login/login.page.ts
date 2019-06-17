import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  mobilenumber:any;
  optnumber:any;
  private loading: any;
  showmobilenumber:boolean=true;
  showotpblock:boolean=false;


  constructor(
    private router: Router,
    public menu: MenuController,
    public alertController: AlertController,
    public loadingController: LoadingController,
  ) { }

  ngOnInit() {
  }
  ionViewWillEnter(){this.menu.enable(false);}
   ionViewDidLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }
  getvalidmobileno()
  {
    //console.log(this.moiblenumber)
    if(this.mobilenumber)
    {
      let value=this.mobilenumber; 
      value=value.toString();
      if(value.length>10)
      {
        event.preventDefault()
        this.mobilenumber = parseInt(value.substring(0,10));
      }
  }
    
  }
  getvalidOTP()
  {
   // console.log(this.optnumber)
   if(this.optnumber)
   {
    let value=this.optnumber;
    value=value.toString();
    if(value.length>4)
    {
      event.preventDefault()
      this.optnumber = parseInt(value.substring(0,4));
    }
  }
   
  }
  sendotp()
  {
    if(this.mobilenumber)
    {
      let value=this.mobilenumber.toString();     
      value=value.length
      if(value!=10)
      {
        this.presentAlert("please enter 10 digit Mobile Number")
      }
      else
      {
        this.mobilenumber="";
      this.showmobilenumber=false;
      this.showotpblock=true;
      this.presentAlert("You will get OTP on your registered mobile number !!");

      }
      
    }
    else
    {
      this.presentAlert("Please enter Mobile Number");
    }
  }
  login()
  {
    if(this.optnumber)
    {
      let value=this.optnumber.toString();     
      value=value.length
      if(value!=4)
      {
        this.presentAlert("Please enter 4-digit OTP")
      }
      else
      {
      this.optnumber="";
      this.showmobilenumber=true;
      this.showotpblock=false;
      this.router.navigate(['/home']);
      }
    }
    else
    {
      this.presentAlert("Please enter OTP");
    }
   
  }
  async presentAlert(alertmessage:string) {
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
