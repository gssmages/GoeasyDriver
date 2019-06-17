import { Component, OnInit } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
@Component({
  selector: 'app-qrscan',
  templateUrl: './qrscan.page.html',
  styleUrls: ['./qrscan.page.scss'],
})
export class QrscanPage implements OnInit {

  isOn = false;
  isgrid = false;
  hidegrid=true;
  statuslight:any;
  scanSub:any;
  constructor( private qrScanner: QRScanner) { }

  ngOnInit() {
  }
  
  async getQRScan() {
    
  
 this.qrScanner.prepare()
    .then((status: QRScannerStatus) => {
      if (status.authorized) {

        this.isOn = true;
        this.isgrid= true;
        this.hidegrid=false;
        // start scanning
        this.qrScanner.show();
        
         this.scanSub = this.qrScanner.scan().subscribe((text: string) => {
          console.log('Scanned something', text);
          alert(text)
          this.isOn = false;
          this.isgrid= false;
          this.hidegrid=true;
          this.getQRScan();
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
  stopQRscanning()  
  {
    this.isOn = false;
    this.isgrid= false;
    this.hidegrid=true;
    this.qrScanner.destroy();
    console.log('Scanned stopped');
  }
  Enablelight()
  {
    //this.qrScanner.getStatus().then((status: QRScannerStatus)=>{console.log(status.lightEnabled); 
    //alert("this is starting on -- > "+status.lightEnabled) })
   
    if(this.isOn==true)
    {
   //   this.statuslight=this.qrScanner.getStatus()
   //  alert("this is inside if-->"+this.statuslight.lightEnabled)
   this.qrScanner.getStatus().then((status: QRScannerStatus)=>{
     console.log(status.lightEnabled); 
    //alert("this is starting on -- > "+status.lightEnabled)
    if(status.lightEnabled==true)
    {
      this.qrScanner.disableLight();
    }
    else{
      this.qrScanner.enableLight();
    }
    
  })
   
     
    }
    //this.qrScanner.enableLight();
    else
    {
      this.qrScanner.disableLight();
      alert("Qr Scanner is not opened")
    }
    
  }

}
