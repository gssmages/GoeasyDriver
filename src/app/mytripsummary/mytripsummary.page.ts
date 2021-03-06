import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import * as jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';
import { File, IWriteOptions } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
@Component({
  selector: 'app-mytripsummary',
  templateUrl: './mytripsummary.page.html',
  styleUrls: ['./mytripsummary.page.scss'],
})
export class MytripsummaryPage implements OnInit {

  today = new Date();
  maxdate = new Date();
  dbdate = '';
  maxDate = this.maxdate.setMonth(this.maxdate.getMonth() - 2);
  loading: any;
  fromdate: any;
  todate: any;
  Dayscount:Number;
 
  constructor(public loadingController: LoadingController,public alertController: AlertController,
    private file: File,
    private fileOpener: FileOpener) { }

  ngOnInit() {
    this.dbdate = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '+0530');
    this.fromdate = this.dbdate;
    this.todate = this.dbdate;
  }
  Search()
  {
      console.log( formatDate(this.fromdate, 'yyyy-MM-dd', 'en-US', '+0530') + "---" + formatDate(this.todate, 'yyyy-MM-dd', 'en-US', '+0530'))

      var fromdt=formatDate(this.fromdate, 'yyyy-MM-dd', 'en-US', '+0530');
      var todt=formatDate(this.todate, 'yyyy-MM-dd', 'en-US', '+0530')
      var fromdatearray=(fromdt).split('-');
      var todatearray=(todt).split('-');
      var date1=new Date(Number(fromdatearray[0]),Number(fromdatearray[1])-1,Number(fromdatearray[2]));
      var date2=new Date(Number(todatearray[0]),Number(todatearray[1])-1,Number(todatearray[2]));
      if (date1 <= date2) {
        this.Dayscount = this.Numberofdays(date1, date2);
        console.log("Days Count -- > " + this.Dayscount)
  
        if (this.Dayscount > 31) {
          this.presentAlert("Please select maximum of 31 days")
        }
        else {
          this.presentAlert("Your Search Result..")
        }
      }
      else {
        this.presentAlert("Please select fromdate less than todate")
      }
  }
  Numberofdays(fromdate:Date,todate:Date)
  {
    var diff = Math.abs(fromdate.getTime() - todate.getTime());
    return diff / (1000 * 60 * 60 * 24) + 1;
  }
  exportPdf() {
    this.presentLoading('Creating PDF file...');
    const div = document.getElementById("printable-area");
    const options = { height: 1000, width: 700, bgcolor: '#ffffff' };
    domtoimage.toJpeg(div, options).then((dataUrl) => {
      //Initialize JSPDF
      var doc = new jsPDF("p", "mm", "a4");
      //Add image Url to PDF
      doc.addImage(dataUrl, 'JPEG', 10, 10);

      let pdfOutput = doc.output();
      // using ArrayBuffer will allow you to put image inside PDF
      let buffer = new ArrayBuffer(pdfOutput.length);
      let array = new Uint8Array(buffer);
      for (var i = 0; i < pdfOutput.length; i++) {
        array[i] = pdfOutput.charCodeAt(i);
      }


      //This is where the PDF file will stored , you can change it as you like
      // for more information please visit https://ionicframework.com/docs/native/file/
      const directory = this.file.dataDirectory;
      const fileName = "Goeasy-Tripsheet-Summary.pdf";
      let options: IWriteOptions = { replace: true };

      this.file.checkFile(directory, fileName).then((success) => {
        //Writing File to Device
        this.file.writeFile(directory, fileName, buffer, options)
          .then((success) => {
            this.loading.dismiss();
            console.log("File created Succesfully" + JSON.stringify(success));
            this.fileOpener.open(this.file.dataDirectory + fileName, 'application/pdf')
              .then(() => console.log('File is opened'))
              .catch(e => console.log('Error opening file', e));
          })
          .catch((error) => {
            this.loading.dismiss();
            console.log("Cannot Create File " + JSON.stringify(error));
          });
      })
        .catch((error) => {
          //Writing File to Device
          this.file.writeFile(directory, fileName, buffer)
            .then((success) => {
              this.loading.dismiss();
              console.log("File created Succesfully" + JSON.stringify(success));
              this.fileOpener.open(this.file.dataDirectory + fileName, 'application/pdf')
                .then(() => console.log('File is opened'))
                .catch(e => console.log('Error opening file', e));
            })
            .catch((error) => {
              this.loading.dismiss();
              console.log("Cannot Create File " + JSON.stringify(error));
            });
        });
    })
      .catch((error) => {
        this.loading.dismiss();
        console.error('oops, something went wrong!', error);
      });

  }
  async presentAlert(alertmessage: string) {
    const alert = await this.alertController.create({
      header: 'GoEasy Alert',
      message: alertmessage,
      buttons: ['OK']
    });

    await alert.present();
  }
  async presentLoading(msg: string) {
    this.loading = await this.loadingController.create({
      message: msg
    });
    return await this.loading.present();
  }

}
