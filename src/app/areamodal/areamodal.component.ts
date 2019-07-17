import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { RestApiService } from '../rest-api.service';

@Component({
  selector: 'app-areamodal',
  templateUrl: './areamodal.component.html',
  styleUrls: ['./areamodal.component.scss'],
})
export class AreamodalComponent implements OnInit {
  loading: any;
  area_relarea:any;
  areaid:any;
  areaname:any;
  boardingpoint:any;
  boardingpointID:any;
  boardingpointname:any;
  boardinglisttemp:any = [];
  boardingpointlist:any;
  areadetailslist:any;
  constructor(private modalController: ModalController,public alertController: AlertController,
    public loadingController: LoadingController,
    private areaservice: RestApiService) { }

  ngOnInit() {
    this.presentLoading();
    this.areaservice.getArea(localStorage.getItem('LocationName')).subscribe(res => {
        //console.log("results are : " + JSON.stringify(res.results))
        this.boardingpointlist=res.results[0].RelBoardingPointDetails;
        this.areadetailslist=res.results[0].AreaDetails;
        this.loading.dismiss();

        
      }, err => {
        console.log(err);
        this.loading.dismiss();
        this.presentAlert(err);
      });


  }

  async closeModal()
  {
    await this.modalController.dismiss();
  }
  getboardingname(selectedval:any)
  {
    this.boardingpointname=this.boardingpoint.BoardingPointName;
    console.log(this.boardingpointname)
    this.boardingpointID=this.boardingpoint.BoardingPoint;
  }
  changeArea(selectedval:any)
  {
    this.boardinglisttemp=[];
    this.boardingpoint='';
    console.log(selectedval)
    console.log(this.area_relarea)
    this.areaname=this.area_relarea.AreaName;
    this.areaid=this.area_relarea.AreaID;
    var relareaid=this.area_relarea.RelAreaID;
    for (let i = 0; i < this.boardingpointlist.length; i++) {
      if(this.boardingpointlist[i].Area == relareaid)
      {
        console.log(this.boardingpointlist[i])
        this.boardinglisttemp.push(this.boardingpointlist[i]);
      }
    }
    console.log(this.boardinglisttemp)
  }
  validatearea()
  {
    console.log(this.areaname)
    if(this.areaname=="")
    {
      console.log(this.areaname)
      this.boardinglisttemp=[];
    }
  }
  submit()
  {
    console.log("Area Name --> " + this.areaname + "----------"+"Boardingpoint Name --> " + this.boardingpointname)
    console.log(localStorage.getItem('LocationName')+ localStorage.getItem('RouteID'))
    this.modalController.dismiss(this.areaname);
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
