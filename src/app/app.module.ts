import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { File, IWriteOptions } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { HttpClientModule } from '@angular/common/http';
import { Globals } from './globals';
import { AreamodalComponent } from './areamodal/areamodal.component';

import { FormsModule } from '@angular/forms';
import { IonicSelectableModule } from 'ionic-selectable';
import { CodePush } from '@ionic-native/code-push/ngx';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
@NgModule({
  declarations: [AppComponent,AreamodalComponent],
  entryComponents: [AreamodalComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    IonicSelectableModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    QRScanner,
    File,
    FileOpener,
    Globals,
    CodePush,
    GoogleAnalytics,
    Geolocation,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy,deps: [HttpClientModule] }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
