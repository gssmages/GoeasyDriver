import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { RestApiService } from '../rest-api.service';
import { formatDate } from '@angular/common';
import { Globals } from '../globals';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  loading: any;
  listoftrips: any;
  tripdate: any=formatDate(new Date(), 'dd-MMM-yyyy', 'en-US', '+0530');  ;
  shownotrip=false;
  showtrips=true;
  constructor(
    private router: Router,
    private platform: Platform,
    public alertController: AlertController,
    public loadingController: LoadingController,
    private homeservice: RestApiService,
    public globals: Globals,
    private ga: GoogleAnalytics
  ) { }
  ngOnInit() {
    this.ga.trackView('Home Page').then(() => {}).catch(e => console.log(e));
    if(localStorage.getItem('mobilenumber')!="" && localStorage.getItem('DriverInternalID')!="")
    {
      this.globals.displayname=localStorage.getItem('DriverName');
      this.globals.mobilenumber=localStorage.getItem('mobilenumber')
    }
    this.platform.backButton.subscribeWithPriority(9999, () => {
      document.addEventListener('backbutton', function (event) {
        event.preventDefault();
        event.stopPropagation();
        console.log('back button disabled');
      }, false);
    });

  }
  doRefresh(event) {
    this.homeservice.getTripList(localStorage.getItem('mobilenumber'), localStorage.getItem('DriverInternalID'), localStorage.getItem('RegularDriver')).subscribe(res => {
      setTimeout(() => {     
        event.target.complete();
      }, 2000);
      if (res.results != "") {       
          console.log("results are : " + JSON.stringify(res.results))
          this.tripdate = res.results[0].TripDate;
          this.listoftrips = res.results;
          this.shownotrip=false;
          this.showtrips=true;     
      }
      else {
        this.shownotrip=true;
        this.showtrips=false;   
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
    this.presentLoading();
    this.homeservice.getTripList(localStorage.getItem('mobilenumber'), localStorage.getItem('DriverInternalID'), localStorage.getItem('RegularDriver')).subscribe(res => {
      setTimeout(() => {
        this.loading.dismiss();
    }, 1000);
      if (res.results != "") {       
          console.log("results are : " + JSON.stringify(res.results))
          this.tripdate = res.results[0].TripDate;
          this.listoftrips = res.results;
          this.shownotrip=false;
          this.showtrips=true;     
      }
      else {
        this.shownotrip=true;
        this.showtrips=false;   
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
    console.log("Route ID is -- > " + item)
    localStorage.setItem("RouteID", item.RouteID);
    localStorage.setItem("RouteNumber", item.RouteNumber);
    localStorage.setItem("RequestFor", item.RequestFor);
    localStorage.setItem("NodalPoint", item.NodalPoint);
    localStorage.setItem("LogInOut", item.LogInOut);
    localStorage.setItem("TripCompleted", item.TripCompleted);
    localStorage.setItem("TripDate", item.TripDate);
    this.router.navigate(['/detail']);
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
