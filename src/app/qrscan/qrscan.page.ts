import { Component, OnInit } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { Globals } from '../globals';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { RestApiService } from '../rest-api.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AreamodalComponent } from '../areamodal/areamodal.component';
@Component({
  selector: 'app-qrscan',
  templateUrl: './qrscan.page.html',
  styleUrls: ['./qrscan.page.scss'],
})
export class QrscanPage implements OnInit {

  loading: any;
  isOn = false;
  isgrid = false;
  hidegrid = true;
  statuslight: any;
  scanSub: any;
  startscan = false;
  employeedetail: any;
  employeeid: any = "";
  tripsheetid: any = "";
  nodalpointid: any = "";
  routechange: any = "";
  checkoutscanned = false;
  constructor(
    private qrScanner: QRScanner,
    public globals: Globals,
    public alertController: AlertController,
    public loadingController: LoadingController,
    private qrscanservice: RestApiService,
    private router: Router,
    public modalController: ModalController) { }

  ngOnInit() {
    console.log(this.globals.Tripsheetdetail)
    this.employeedetail = this.globals.Tripsheetdetail;
    console.log(this.employeedetail)
  }

  async getQRScan() {
    this.employeeid = "";
    this.tripsheetid = "";
    this.verifyScannedData("885761")
    //console.log("scanned data verify ---> "+this.startscan)
    /*     this.qrScanner.prepare()
          .then((status: QRScannerStatus) => {
            if (status.authorized) {
              this.isOn = true;
              this.isgrid = true;
              this.hidegrid = false;
              // start scanning
              this.qrScanner.show();
              this.scanSub = this.qrScanner.scan().subscribe((text: string) => {
                console.log('Scanned something', text);
    
                this.isOn = false;
                this.isgrid = false;
                this.hidegrid = true;
                this.verifyScannedData(text)
                //this.getQRScan();
                // this.qrScanner.hide();
                //this.scanSub.unsubscribe();
              });
              //this.qrScanner.show();
            } else if (status.denied) {
              // camera permission was permanently denied
              // you must use QRScanner.openSettings() method to guide the user to the settings page
              // then they can grant the permission from there
              this.qrScanner.openSettings();
            } else {
              // permission was denied, but not permanently. You can ask for permission again at a later time.
            }
          })
          .catch((e: any) => console.log('Error is', e)); */
  }
  stopQRscanning() {
    this.isOn = false;
    this.isgrid = false;
    this.hidegrid = true;
    this.qrScanner.destroy();
    console.log('Scanned stopped');
  }
  verifyScannedData(scandata: String) {
   this.reset();
    if(this.employeedetail!=undefined)
    {    
    if (scandata.length < 10) {
      for (let item of this.employeedetail) {
        //  console.log("Display inside forloop ==>" +item.EmployeeID);
        if (scandata == item.EmployeeID) {
          if (item.CheckOut == false) {
            this.employeeid = item.EmployeeID;
            this.tripsheetid = item.TripSheetID;

          }
          else {
            this.checkoutscanned = true;
            console.log("Check Out Scan Done Already ")
            this.presentAlert("Check Out Scan Done Already ");
          }
          break;
        }
      }
      if (!this.checkoutscanned) {
        if (this.employeeid == "") {
          this.employeeid = scandata;
          this.tripsheetid = "0";
         // console.log("Item not in the List " + this.employeeid + "--" + this.tripsheetid)
        //  alert("Item not in the List " + this.employeeid + "--" + this.tripsheetid)
        }
        this.callverifyservice();
      
      }
    }
    else {
      console.log("Invalid QR code " + scandata)
      this.presentAlert("Invalid QR code " + scandata)
    }
  }
  else
  {
    console.log("Employee List Not Available ")
    this.router.navigate(['/home']);
    
  }
  }
  callverifyservice()
  {
    this.presentLoading();
    this.qrscanservice.verifyQRScan(
      localStorage.getItem('LocationName'), localStorage.getItem('RouteID'), this.tripsheetid, this.employeeid,
      this.nodalpointid, this.routechange).subscribe(res => {
        console.log("results are : " + JSON.stringify(res.results))
        this.loading.dismiss();

        if (res.results.ErrorCode == "0") {
          console.log("Succesfully Scanned " + this.employeeid + "--" + this.tripsheetid)
          this.presentAlert(res.results.ErrorDesc)
          //this.getQRScan();
        }
        else if(res.results.ErrorCode == "1"){
          console.log(res.results.ErrorDesc)
          this.Confirmroutechange(res.results.ErrorDesc)
        }
        else if(res.results.ErrorCode == "3"){
          this.presentModal()
          console.log("Employee ID not in this Roaster " + this.employeeid + "--" + this.tripsheetid)
          this.presentAlert("Employee ID not in this Roaster")
        }
        else
        {
          console.log("Invalid Data. Please contact Transport Admin " + this.employeeid + "--" + this.tripsheetid)
          this.presentAlert("Invalid Data. Please contact Transport Admin")
        }
      }, err => {
        console.log(err);
        this.loading.dismiss();
        this.presentAlert(err);
      });

  }
  Enablelight() {
    //this.qrScanner.getStatus().then((status: QRScannerStatus)=>{console.log(status.lightEnabled); 
    //alert("this is starting on -- > "+status.lightEnabled) })

    if (this.isOn == true) {
      //   this.statuslight=this.qrScanner.getStatus()
      //  alert("this is inside if-->"+this.statuslight.lightEnabled)
      this.qrScanner.getStatus().then((status: QRScannerStatus) => {
        console.log(status.lightEnabled);
        //alert("this is starting on -- > "+status.lightEnabled)
        if (status.lightEnabled == true) {
          this.qrScanner.disableLight();
        }
        else {
          this.qrScanner.enableLight();
        }

      })


    }
    //this.qrScanner.enableLight();
    else {
      this.qrScanner.disableLight();
      alert("Qr Scanner is not opened")
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
  async Confirmroutechange(message: string) {
  const confirm =  await this.alertController.create({
    header: 'GoEasy Confirm Route Change',
    message: message,
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
          this.routechange="true";
          console.log('yes clicked');
          this.callverifyservice();
        }
      }
    ]
  });
  await confirm.present();
}
async presentModal() {
  const modal = await this.modalController.create({
    component: AreamodalComponent
  });
  return await modal.present();
}
reset()
{
  this.employeeid = "";
  this.tripsheetid= "";
  this.nodalpointid= "";
  this.routechange = "";
  this.checkoutscanned = false;
}
}
