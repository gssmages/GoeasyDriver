import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { LoadingController,ToastController } from '@ionic/angular';
import { RestApiService } from '../rest-api.service';
import { formatDate } from '@angular/common';
import { Globals } from '../globals';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { CodePush, InstallMode, SyncStatus } from '@ionic-native/code-push/ngx';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  loading: any;
  listoftrips: any;
  tripdate: any = formatDate(new Date(), 'dd-MMM-yyyy', 'en-US', '+0530');;
  shownotrip = false;
  showtrips = true;
  backButtonSubscription:any;
  constructor(
    private router: Router,
    private platform: Platform,
    public alertController: AlertController,
    public loadingController: LoadingController,
    private homeservice: RestApiService,
    public globals: Globals,
    private ga: GoogleAnalytics,
    private geolocation: Geolocation,
    public toastController: ToastController,    
    private codePush: CodePush,
  ) { }
  ngOnInit() {
    
    this.ga.trackView('Home Page').then(() => { }).catch(e => console.log(e));
    if (localStorage.getItem('mobilenumber') != "" && localStorage.getItem('DriverInternalID') != "") {
      this.globals.displayname = localStorage.getItem('DriverName');
      this.globals.mobilenumber = localStorage.getItem('mobilenumber')
    }
   
   /*  this.platform.backButton.subscribeWithPriority(9999, () => {
      this.platform.exitApp();
     /*  document.addEventListener('backbutton', function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.dismiss()
        console.log('back button disabled');
      }, false); 
    }); */
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {     
      localStorage.setItem("GeoLat",(data.coords.latitude).toString());
      localStorage.setItem("GeoLang",(data.coords.longitude).toString());
     // data.coords.latitude
     // data.coords.longitude
    });
    this.geolocation.getCurrentPosition().then((resp) => {
     // console.log(resp.coords.latitude)
    //  console.log(resp.coords.longitude)
     // alert(resp.coords.latitude+"__"+resp.coords.longitude)
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }
  ngOnDestroy() {
    this.backButtonSubscription.unsubscribe();
  }
  doRefresh(event) {
    this.homeservice.getTripList(localStorage.getItem('mobilenumber'), localStorage.getItem('DriverInternalID'), localStorage.getItem('RegularDriver')).subscribe(res => {
      setTimeout(() => {
        event.target.complete();
      }, 2000);
      if (res.results != "") {
        this.tripdate = res.results[0].TripDate;
        this.listoftrips = res.results;
        this.shownotrip = false;
        this.showtrips = true;
      }
      else {
        this.shownotrip = true;
        this.showtrips = false;
        //this.presentAlert("No Record Found!!!");
      }
    }, err => {
      setTimeout(() => {
        event.target.complete();
      }, 2000);
      console.log(err);
      this.presentAlert(err);
    });


  }
  ionViewWillEnter() {
    this.codePush.sync().subscribe((status)=>{     
      if(status==SyncStatus.DOWNLOADING_PACKAGE)
      {
        this.router.navigate(['/update']);
        localStorage.setItem("updatemsg","Downloading Package");
      }    
      if(status==SyncStatus.IN_PROGRESS)
      {       
        localStorage.setItem("updatemsg","Please wait..<br>App is updating");
      }     
      if(status==SyncStatus.INSTALLING_UPDATE)
      {  
        localStorage.setItem("updatemsg","Installing update");
      }    
      if(status==SyncStatus.UPDATE_INSTALLED)
      localStorage.setItem("updatemsg","Update Installed");
     
      if(status==SyncStatus.ERROR)
      localStorage.setItem("updatemsg","Error While Updating");
     
    });
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(9999,async () => {
      // Catches the active view
      const activeView = this.router.url;  
      const urlParts = activeView.split('/');              
      // Checks if can go back before show up the alert
      if(urlParts.includes('home')) {        
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
    this.presentLoading();
    this.homeservice.getTripList(localStorage.getItem('mobilenumber'), localStorage.getItem('DriverInternalID'), localStorage.getItem('RegularDriver')).subscribe(res => {
      setTimeout(() => {
        this.loading.dismiss();
      }, 1000);
      if (res.results != "") {
       // console.log("results are : " + JSON.stringify(res.results))
        this.tripdate = res.results[0].TripDate;
        this.listoftrips = res.results;
        this.shownotrip = false;
        this.showtrips = true;
        //this.UpdateGeoLatLang();
     /*    if (localStorage.getItem('CurrentRouteNumber') != "" && localStorage.getItem('CurrentLogInOut') != "") {
        for (let i = 0; i < this.listoftrips.length; i++) {
          if(this.listoftrips[i].RouteNumber==localStorage.getItem("CurrentRouteNumber") && 
          this.listoftrips[i].LogInOut==localStorage.getItem("CurrentLogInOut"))
          {
            console.log("CurrentRouteNumber-->"+localStorage.getItem("CurrentRouteNumber"))
             if(this.listoftrips[i].TripStatus == 1)
             {
              console.log("TripStatus-->"+this.listoftrips[i].TripStatus)
              clearInterval(this.globals.geowatcher);
              this.globals.geowatcher = setInterval(() => {
                this.UpdateGeoLatLang();
            }, 30000);
             }
             else{
               clearInterval(this.globals.geowatcher);
               localStorage.setItem("CurrentRouteNumber","");
               localStorage.setItem('CurrentLogInOut',"");
             }
          }
        }
      } */
      }
      else {
        this.shownotrip = true;
        this.showtrips = false;
        //this.presentAlert("No Record Found!!!");
      }
    }, err => {
      console.log(err);
      setTimeout(() => {
        this.loading.dismiss();
      }, 2000);
      this.presentAlert(err);
    });

  }
  detailview(item: any) {
   // console.log("Route ID is -- > " + item.TripStatus)
    localStorage.setItem("RouteID", item.RouteID);
    localStorage.setItem("RouteNumber", item.RouteNumber);
    localStorage.setItem("RequestFor", item.RequestFor);
    localStorage.setItem("NodalPoint", item.NodalPoint);
    localStorage.setItem("LogInOut", item.LogInOut);
    localStorage.setItem("TripStatus", item.TripStatus);
    localStorage.setItem("TripDate", item.TripDate);
    localStorage.setItem("TripStart", item.TripStart);
    localStorage.setItem("TripCode", item.TripCode);
    this.router.navigate(['/detail']);
  }
  UpdateGeoLatLang()
  {
    this.homeservice.updateGeoLatLang(localStorage.getItem('LocationName'),localStorage.getItem('CurrentRouteNumber'),localStorage.getItem('TripDate'),
    localStorage.getItem('CurrentLogInOut'),localStorage.getItem('GeoLat'),localStorage.getItem('GeoLang'),localStorage.getItem('CurrentRouteID')).subscribe(res => {     
      console.log(res)
        this.loading.dismiss();    
      if (res.results != "") {
       this.presentToast(res.results);        
      }         
    }, err => {
      console.log(err);
      setTimeout(() => {
        this.loading.dismiss();
    }, 2000);
      this.presentAlert(err);
    });
  }
  getrowColor(code: any) {
   // console.log(code + "status for color assign")
    switch (code) {
      case 1:
        return '#bfd7ad'; //for Trip in progress 
      case 2:
      case 4:
        return '#ffa3a3'; //for 2 - Trip time elapsed , 4 - Trip Closed
      case 3:
        return '#f3f3f3';  //for Trip Assigned or allocated
    }
  }
  geticonColor(code: any) {
  //  console.log(code + "status for color assign")
    switch (code) {
      case 1:
        return '#849776'; //for Trip in progress 
      case 2:
      case 4:
        return '#9d5b5b'; //for 2 - Trip time elapsed , 4 - Trip Closed
      case 3:
        return '#63a5d2'; //for Trip Assigned or allocated
    }
  }
  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Loading....',
    });
    return await this.loading.present();
  }

  async presentAlert(alertmessage: string) {
    const alert = await this.alertController.create({
      header: 'GoEasy Alert',
      message: alertmessage,
      buttons: ['OK']
    });

    await alert.present();
  }
  async presentToast(toastmessage: string) {
    const toast = await this.toastController.create({
      message: toastmessage,
      duration:5000,
      position:"middle",
      cssClass:"messagealert"
    });
    toast.present();
  }
}
