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
@NgModule({
  declarations: [AppComponent,AreamodalComponent],
  entryComponents: [AreamodalComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    QRScanner,
    File,
    FileOpener,
    Globals,    
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy,deps: [HttpClientModule] }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
