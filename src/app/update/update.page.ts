import { Component, OnInit } from '@angular/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
@Component({
  selector: 'app-update',
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss'],
})
export class UpdatePage implements OnInit {

  public updatemsg: any;
  constructor(private ga: GoogleAnalytics) { }

  ngOnInit() {
    this.ga.trackView('Update Page').then(() => {}).catch(e => console.log(e));
    this.updatemsg='Please wait...<br>App is updating';
    setInterval(()=>{ this.updatemsg=localStorage.getItem("updatemsg")},100);
  }

}
