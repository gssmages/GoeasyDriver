import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { RestApiService } from '../rest-api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  loading: any;
  listoftrips: any;
  tripdate: any;

  constructor(
    private router: Router,
    private platform: Platform,
    public alertController: AlertController,
    public loadingController: LoadingController,
    private homeservice: RestApiService,
  ) { }
  ngOnInit() {
    this.presentLoading();
    this.homeservice.getTripList(localStorage.getItem('mobilenumber'), localStorage.getItem('DriverInternalID'), localStorage.getItem('RegularDriver')).subscribe(res => {

      if (res.results != "") {
        this.loading.dismiss();
       // if (res.results.ErrorCode == "0") {
          console.log("results are : " + JSON.stringify(res.results.list))
          this.tripdate = res.results[0].TripDate;
          this.listoftrips = res.results;
         
       /*  }
        else {
       //   this.loading.dismiss();
          this.presentAlert(res.results.ErrorDesc);
        } */
      }
      else {
        this.loading.dismiss();
        this.presentAlert("No Record Found!!!");
      }


    }, err => {
      console.log(err);
      this.loading.dismiss();
      this.presentAlert(err);
    });


    this.platform.backButton.subscribeWithPriority(9999, () => {
      document.addEventListener('backbutton', function (event) {
        event.preventDefault();
        event.stopPropagation();
        console.log('back button disabled');
      }, false);
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
