import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { RestApiService } from '../rest-api.service';
import { IonicSelectableComponent } from 'ionic-selectable';
@Component({
  selector: 'app-areamodal',
  templateUrl: './areamodal.component.html',
  styleUrls: ['./areamodal.component.scss'],
})
export class AreamodalComponent implements OnInit {
  loading: any;
  area:any;
  areaid:any;
  areaname:any;
  boardingpoint:any;
  boardingpointID:any="";
  boardingpointname:any;
  boardinglisttemp:any = [];
  boardingpointlist:any;
  arealist:any;
  constructor(private modalController: ModalController,public alertController: AlertController,
    public loadingController: LoadingController,
    private areaservice: RestApiService) { }

  ngOnInit() {
    this.presentLoading();
    this.areaservice.getArea(localStorage.getItem('LocationName')).subscribe(res => {
        //console.log("results are : " + JSON.stringify(res.results))
        this.boardingpointlist=res.results[0].DriverAppNodalPoint;
        this.arealist=res.results[0].DriverAppArea;
        this.loading.dismiss();        
      }, err => {
        console.log(err);
        this.loading.dismiss();
        this.presentAlert(err);
      });
  }

  async closeModal()
  {
    await this.modalController.dismiss("0");
  }
  getboardingname(selectedval:any)
  {
    this.boardingpointname=this.boardingpoint.NodalPointName;
    console.log(this.boardingpointname)
    this.boardingpointID=this.boardingpoint.NodalPointID;
  }
  /* changeArea(selectedval:any)
  {
    this.boardinglisttemp=[];
    this.boardingpoint='';
    console.log(selectedval.detail.value)
    console.log(this.area)
    this.areaid=this.area.AreaID;
    this.areaname=this.area.AreaName;
    for (let i = 0; i < this.boardingpointlist.length; i++) {
      if(this.boardingpointlist[i].AreaID == this.areaid)
      {
        console.log(this.boardingpointlist[i])
        this.boardinglisttemp.push(this.boardingpointlist[i]);
      }
    }
    console.log(this.boardinglisttemp)
  } */
  Change(event: {
    component: IonicSelectableComponent,
    value: any 
  })
  {
    console.log('area id :', event.value);
    this.boardinglisttemp=[];
    this.boardingpoint='';
    this.areaid=event.value.AreaID;
    this.areaname=event.value.AreaName;
    for (let i = 0; i < this.boardingpointlist.length; i++) {
      if(this.boardingpointlist[i].AreaID == this.areaid)
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
    if(this.areaid=="")
    {
      console.log(this.areaid)
      this.boardinglisttemp=[];
    }
  }
  submit()
  {
    console.log("Area Name --> " + this.areaname + "----------"+"Boardingpoint Name --> " + this.boardingpointname)
    if(this.boardingpointID!="")
    this.modalController.dismiss(this.boardingpointID);
    else
    {
      this.presentAlert("Please select Area and Boarding Point")
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
