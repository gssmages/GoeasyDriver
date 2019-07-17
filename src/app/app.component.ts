import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Globals } from './globals';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
      {
      title: 'My Trips Sheet',
      url: '/mytripsheet',
      icon: 'pin'
    },
    {
      title: 'My Trip Summary',
      url: '/mytripsummary',
      icon: 'calendar'
    } 
    /* {
      title: 'List',
      url: '/list',
      icon: 'list'
    } */
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public globals: Globals
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
    //  this.statusBar.styleDefault();
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
    });
  }
  reset()
  {
   /*  localStorage.removeItem('empusername'); */
  }
}