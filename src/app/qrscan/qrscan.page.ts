import { Component, OnInit } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { Globals } from '../globals';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-qrscan',
  templateUrl: './qrscan.page.html',
  styleUrls: ['./qrscan.page.scss'],
})
export class QrscanPage implements OnInit {

  loading:any;
  isOn = false;
  isgrid = false;
  hidegrid = true;
  statuslight: any;
  scanSub: any;
  startscan = false;
  employeedetail:any;
  employeeid:any="";
  tripsheetid:any="";
  constructor(
    private qrScanner: QRScanner,
    public globals: Globals,
    public alertController: AlertController,
    public loadingController: LoadingController) { }

  ngOnInit() {
    console.log(this.globals.Tripsheetdetail)
    this.employeedetail=this.globals.Tripsheetdetail;
  }

  async getQRScan() {
    this.employeeid="";
    this.tripsheetid="";     
   // this.verifyScannedData("941364")
    //console.log("scanned data verify ---> "+this.startscan)
    this.qrScanner.prepare()
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
      .catch((e: any) => console.log('Error is', e));
  }
  stopQRscanning() {
    this.isOn = false;
    this.isgrid = false;
    this.hidegrid = true;
    this.qrScanner.destroy();
    console.log('Scanned stopped');
  }
  verifyScannedData(scandata:String)
{
  for (let item of this.employeedetail) {
  //  console.log("Display inside forloop ==>" +item.EmployeeID);
    if(scandata==item.EmployeeID)
    {
      if(item.CheckOut==false){
        this.employeeid=item.EmployeeID;
        this.tripsheetid=item.TripSheetID;        
      }
      else
      {
        console.log("Check Out Scan Done Already ")
        alert("Check Out Scan Done Already ")
      }
      break;     
    }
}
  if(this.employeeid!="")
  {
    
    console.log("Succesfully Scanned " + this.employeeid +"--"+ this.tripsheetid)
    alert("Succesfully Scanned" + this.employeeid +"--"+ this.tripsheetid)
    this.getQRScan();
  }
  else
  {
    this.employeeid=scandata;
    this.tripsheetid="0";
    console.log("Item not in the List " + this.employeeid +"--"+ this.tripsheetid)
    alert("Item not in the List " + this.employeeid +"--"+ this.tripsheetid)
  }
  
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

}
