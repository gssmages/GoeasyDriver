import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Globals } from './globals';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

import { CodePush, InstallMode, SyncStatus } from '@ionic-native/code-push/ngx';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    }/* ,
      {
      title: 'My Trips Sheet',
      url: '/mytripsheet',
      icon: 'pin'
    },
    {
      title: 'My Trip Summary',
      url: '/mytripsummary',
      icon: 'calendar'
    }  */
    /* {
      title: 'List',
      url: '/list',
      icon: 'list'
    } */
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public globals: Globals,
    private router: Router,
    public alertController: AlertController,
    private codePush: CodePush,
    private ga: GoogleAnalytics,
  ) {
    this.initializeApp();
    this.globals.appversion="1.0.1"; //Manual app versioon changes 
  }

  initializeApp() {
    this.platform.ready().then(() => {
    //  this.statusBar.styleDefault();
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
      this.checkCodePush(); //Use the plugin always after platform.ready()
      this.ga.startTrackerWithId('UA-51333248-18') //UA-51333248-18 is bala google id //'UA-147208966-2' is magesh google id for driverapp
      .then(() => {}).catch(e => alert('Error starting GoogleAnalytics == '+ e));
    });
  }
  checkCodePush() {
    localStorage.setItem("updatemsg","");
        this.codePush.sync({
   /*  updateDialog: {
     appendReleaseDescription: true,
      descriptionPrefix: "\n\nChange log:\n"   
     }, */
     installMode: InstallMode.IMMEDIATE
  },(progress)=>{
    this.router.navigate(['/update']);
    localStorage.setItem("updatemsg",`Downloaded ${progress.receivedBytes} of ${progress.totalBytes}`);
    console.log(`Downloaded ${progress.receivedBytes} of ${progress.totalBytes}`)
  }).subscribe((status)=>{
    // if(status==SyncStatus.CHECKING_FOR_UPDATE)
    // alert("Checking for Update");
    if(status==SyncStatus.DOWNLOADING_PACKAGE)
    {
      this.router.navigate(['/update']);
      localStorage.setItem("updatemsg","Downloading Package");
    }
    //alert("Downloading Package");
    if(status==SyncStatus.IN_PROGRESS)
    {
      localStorage.setItem("updatemsg","Please wait..<br>App is updating");
    }
    //alert("In Progress");
    if(status==SyncStatus.INSTALLING_UPDATE)
    localStorage.setItem("updatemsg","Installing update");
    //alert("Installing update");
    // if(status==SyncStatus.UP_TO_DATE)
    // alert("Update Up-to-date");
    if(status==SyncStatus.UPDATE_INSTALLED)
    localStorage.setItem("updatemsg","Update Installed");
    //alert("Update Installed");
    if(status==SyncStatus.ERROR)
    localStorage.setItem("updatemsg","Error While Updating");
    //alert("Error While Updating");
  }
    // (data) => {
    //  console.log('CODE PUSH SUCCESSFUL: ' + data);
     
    // },
    // (err) => {
    //  console.log('CODE PUSH ERROR: ' + err);
     
    // }
  );
 }
  reset()
  {
    this.showLogoutconfirm();
   /*  localStorage.removeItem('empusername'); */
  }
  async showLogoutconfirm() {
    const confirm =  await this.alertController.create({
      header: 'GoEasy Confirmation',
      message: 'Are you sure want to logout?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('No clicked');           
          }
        },
        {
          text: 'Yes',
          cssClass: 'alertconfirmation',
          handler: () => {
            console.log('yes clicked');
            localStorage.removeItem('mobilenumber');
            localStorage.removeItem('LocationName');
            localStorage.removeItem('RegularDriver');
            localStorage.removeItem('DriverInternalID');
            localStorage.removeItem('DriverName');
            this.router.navigate(['/login']);
          }
        }
      ]
    });
    await confirm.present();
  }
}
