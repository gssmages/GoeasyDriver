import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { RestApiService } from '../rest-api.service';
import { Router } from '@angular/router';
import { Globals } from '../globals';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  loading: any;
  routeID: any;
  routenumber: any;
  requestfor: any;
  nodalpoint: any;
  loginout: any;
  tripstatus: any;
  tripstart: any;
  tripdate: any;
  today = new Date();
  dbdate = '';
  Tripdetaillist: any;
  GeoLang = "";
  GeoLat="";
  shiftlabel:any;
  constructor(public alertController: AlertController,
    public loadingController: LoadingController,
    private tripdetailservice: RestApiService,
    private router: Router,
    public globals: Globals, private ga: GoogleAnalytics,private geolocation: Geolocation) { }

  ngOnInit() {
    this.ga.trackView('TripSheet Page').then(() => {}).catch(e => console.log(e));  

  }
  ionViewWillEnter() {
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp.coords.latitude)
      console.log(resp.coords.longitude)
      this.GeoLat=(resp.coords.latitude).toString();
      this.GeoLang=(resp.coords.longitude).toString();
      localStorage.setItem("GeoLat",this.GeoLat);
      localStorage.setItem("GeoLang",this.GeoLang);
      //alert(this.GeoLat+" "+this.GeoLang)
     }).catch((error) => {
       console.log('Error getting location', error);
     });
    this.dbdate = localStorage.getItem("TripDate");
    this.routeID = localStorage.getItem("RouteID");
    this.routenumber = localStorage.getItem("RouteNumber");
    this.requestfor = localStorage.getItem("RequestFor");
    this.nodalpoint = localStorage.getItem("NodalPoint");
    this.loginout = localStorage.getItem("LogInOut");
    this.tripstatus = localStorage.getItem("TripStatus");
    this.tripstart=localStorage.getItem("TripStart");
    if(this.requestfor=="Pickup")
    {
        this.shiftlabel="Login";
    }
    else if(this.requestfor=="Drop"){
      this.shiftlabel="Logout";
    }
    else{ this.shiftlabel="Login/Logout"; }
   
    this.presentLoading();
    this.tripdetailservice.getTripDetail(localStorage.getItem('RouteID')).subscribe(res => {
      setTimeout(() => {
        this.loading.dismiss();
      }, 1000);
      if (res.results != "") {        
       // console.log("results are : " + JSON.stringify(res.results))
        this.Tripdetaillist = res.results;
        this.globals.Tripsheetdetail = res.results;       
      }
      else {
        this.presentAlert("No Record Found!!!");        
      }     
    }, err => {
      console.log(err);
      setTimeout(() => {
        this.loading.dismiss();
    }, 2000);
      this.presentAlert(err);
    });
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
  async Confirmtripclose() {
    const confirm =  await this.alertController.create({
      header: 'GoEasy Confirm Trip close',
      message: 'Are you sure want to close this trip',
      buttons: [
        {
          text: 'NO',
          handler: () => {
            console.log('No clicked');
          }
        },
        {
          text: 'YES',
          handler: () => {
            this.Tripclose();
            this.router.navigate(['/home']);
            console.log('yes clicked');
          }
        }
      ]
    });
    await confirm.present();
  }
  TripStart()
  {
    this.presentLoading();
    this.tripdetailservice.setTripStart(localStorage.getItem('RouteID'),localStorage.getItem('DriverInternalID')
    ,localStorage.getItem('GeoLat'),localStorage.getItem('GeoLang')).subscribe(res => {     
      console.log(res)
        this.loading.dismiss();    
      if (res.results!= "") {
       this.presentAlert(res.results.ErrorDesc );   
       if(res.results.ErrorCode=="0") {
        localStorage.setItem("TripStart", "1");
        this.router.navigate(['/home']);
       }    
      }         
    }, err => {
      console.log(err);
      setTimeout(() => {
        this.loading.dismiss();
    }, 2000);
      this.presentAlert(err);
    });

  }
  Tripclose()
  {
    this.presentLoading();
    this.tripdetailservice.setTripClose(localStorage.getItem('RouteID'),localStorage.getItem('DriverInternalID')
    ,localStorage.getItem('GeoLat'),localStorage.getItem('GeoLang')).subscribe(res => {     
      console.log(res)
        this.loading.dismiss();    
      if (res.results!= "") {
       this.presentAlert(res.results.ErrorDesc );        
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
