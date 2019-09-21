import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { RestApiService } from '../rest-api.service';
import { Router } from '@angular/router';
import { Globals } from '../globals';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
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
  tripcompleted: any;
  tripdate: any;
  today = new Date();
  dbdate = '';
  Tripdetaillist: any;


  constructor(public alertController: AlertController,
    public loadingController: LoadingController,
    private tripdetailservice: RestApiService,
    private router: Router,
    public globals: Globals, private ga: GoogleAnalytics) { }

  ngOnInit() {
    this.ga.trackView('TripSheet Page').then(() => {}).catch(e => console.log(e));
    this.dbdate = localStorage.getItem("TripDate");
    this.routeID = localStorage.getItem("RouteID");
    this.routenumber = localStorage.getItem("RouteNumber");
    this.requestfor = localStorage.getItem("RequestFor");
    this.nodalpoint = localStorage.getItem("NodalPoint");
    this.loginout = localStorage.getItem("LogInOut");
    this.tripcompleted = localStorage.getItem("TripCompleted");
  }
  ionViewWillEnter() {
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
  getTripDetail() {
    console.log("Trip Details are  -- > " + this.Tripdetaillist)
    this.router.navigate(['/qrscan']);
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

}
