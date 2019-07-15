import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { RestApiService } from '../rest-api.service';
import { Router } from '@angular/router';
import { Globals } from '../globals';

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
    public globals: Globals) { }

  ngOnInit() {
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
        //   if (res.results.ErrorCode == "0") {
        console.log("results are : " + JSON.stringify(res.results))
        this.Tripdetaillist = res.results;
        this.globals.Tripsheetdetail = res.results;
        //  this.loading.dismiss();   
      }
      else {
        this.presentAlert("No Record Found!!!");
        //  this.loading.dismiss();  
      }
      /*     }
          else {
            this.loading.dismiss();
            this.presentAlert(res.results.ErrorDesc);
          } */

    }, err => {
      console.log(err);
      this.loading.dismiss();
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
