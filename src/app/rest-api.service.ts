import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
const SITserver="http://gssnte811.asia.ad.flextronics.com:4042/";
//const SITserver="http://hkdnte250.asia.ad.flextronics.com:1227/";
const testserver="https://testmobile.flextronics.com/goeasyapi";
const prodserver="https://mobileservice.flex.com/goeasydriver";
//const SITserver="http://localhost:57855";
/****   Goeasy SIT Server ***********/
const LoginURL=SITserver+"/api/DriverMobileApi/RequestOTP?";
const LoginValidURL=SITserver+"/api/DriverMobileApi/ValidateOTP?";
const HomeURL=SITserver+"/api/DriverMobileApi/GetHomepage?";
const DetailpageURL=SITserver+"/api/DriverMobileApi/GetTripSheet?";
const ScanURL=SITserver+"/api/DriverMobileApi/EmployeeCheckInCheckOut?";
const AreaURL=SITserver+"/api/DriverMobileApi/AreaNodalPoint?";
const TripcloseURL=SITserver+"/api/DriverMobileApi/Tripclose?"; 
const TripstartURL=SITserver+"/api/DriverMobileApi/DriverTripStart?";
const GeoLocationUpdateURL=SITserver+"/api/DriverMobileApi/UpdateLatLong?";
/******For Development tesing ******/
//const AreaURL="http://gssnte811.asia.ad.flextronics.com:4042/api/AdhocCabRequestApi/ReadAdhocCabRequestValues/?locationID=1&employeeID=941364";
//const DetailpageURL="./assets/API/TripDetails.json";
//const LoginValidURL="./assets/API/LoginValidation.json";
//const HomeURL="http://www.mocky.io/v2/5d173f3e2f0000672d25faaa";

/****   Goeasy Prod Server ***********/
/* const LoginURL=prodserver+"/api/DriverMobileApi/RequestOTP?";
const LoginValidURL=prodserver+"/api/DriverMobileApi/ValidateOTP?";
const HomeURL=prodserver+"/api/DriverMobileApi/GetHomepage?";
const DetailpageURL=prodserver+"/api/DriverMobileApi/GetTripSheet?";
const ScanURL=prodserver+"/api/DriverMobileApi/EmployeeCheckInCheckOut?";
const AreaURL=prodserver+"/api/DriverMobileApi/AreaNodalPoint?";
const TripcloseURL=prodserver+"/api/DriverMobileApi/Tripclose?";
const TripstartURL=prodserver+"/api/DriverMobileApi/DriverTripStart?"; 
const GeoLocationUpdateURL=prodserver+"/api/DriverMobileApi/UpdateLatLong?"; */
@Injectable({
  providedIn: 'root',
})

export class RestApiService {
  dbdate='';
  today= new Date();
  errormsg ='';
  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
  
    if (!navigator.onLine) {
      console.error('No Internet Connection')
      this.errormsg = 'No Internet Connection';
  }
    else if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code. 'Network failed. Please try again.'
      // The response body may contain clues as to what went wrong,
      this.errormsg = `Server Error Status: ${error.status} Text: ${error.statusText}`
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(this.errormsg);
  }

  
  getLoginOTPData(mobilenumber: string, resend: string): Observable<any>{
    let params = new HttpParams()
     .set('MobileNumber', mobilenumber)
     .set('Resend', resend);
  return this.http.get(LoginURL,{params}).pipe(catchError(this.handleError));
  }
  getLoginVerfiyData(mobilenumber: string, otp: string): Observable<any>{
    let params = new HttpParams()
     .set('MobileNumber', mobilenumber)
     .set('OTP', otp);
  return this.http.get(LoginValidURL,{params}).pipe(catchError(this.handleError));
  }
  getTripList(mobilenumber: string, driverinternalID: string,regulardriver: string): Observable<any>{
    let params = new HttpParams()
     .set('MobileNumber', mobilenumber)
     .set('DriverInternalID', driverinternalID)
     .set('RegularDriver', regulardriver);
  return this.http.get(HomeURL,{params}).pipe(catchError(this.handleError));
  }

  getTripDetail(routeid: string): Observable<any>{
    let params = new HttpParams()
      .set('RouteID', routeid);
  return this.http.get(DetailpageURL,{params}).pipe(catchError(this.handleError));
  }
  verifyQRScan(locationname: string, routeid: string,tripsheetid: string,employeeid: string,geolat: string,geolang: string,nodalpointid: string,routechange: string): Observable<any>{
    let params = new HttpParams()
     .set('LocationName', locationname)
     .set('TripID', routeid)
     .set('TripSheetID', tripsheetid)
     .set('EmployeeID', employeeid)
     .set('GeoLat', geolat)
     .set('GeoLang', geolang)
     .set('NodalPointID', nodalpointid)
     .set('RouteChangeYesNo', routechange);
  return this.http.get(ScanURL,{params}).pipe(catchError(this.handleError));
  }
  getArea(locationname: string): Observable<any>{
    let params = new HttpParams()
    .set('LocationName', locationname)
  return this.http.get(AreaURL,{params}).pipe(catchError(this.handleError));
  }
  setTripClose(routeid: string, driverinternalID: string,geolat: string,geolang: string): Observable<any>{
    let params = new HttpParams()
    .set('RouteID', routeid)
    .set('DriverInternalID', driverinternalID)
    .set('GeoLat', geolat)
    .set('GeoLang', geolang);
  return this.http.get(TripcloseURL,{params}).pipe(catchError(this.handleError));
  }
  setTripStart(routeid: string, driverinternalID: string,geolat: string,geolang: string): Observable<any>{
    let params = new HttpParams()
    .set('Route', routeid)
    .set('DriverID', driverinternalID)
    .set('GeoLat', geolat)
    .set('GeoLang', geolang);
  return this.http.get(TripstartURL,{params}).pipe(catchError(this.handleError));
  }
  updateGeoLatLang(locationname: string,routenumber: string, traveldate: string,shiftTime: string,geolat: string,geolang: string,routeid: string): Observable<any>{
    let params = new HttpParams()
    .set('location', locationname)
    .set('routeNo', routenumber)
    .set('travelDate', traveldate)
    .set('shiftTime', shiftTime)
    .set('GeoLat', geolat)
    .set('GeoLang', geolang)
    .set('RouteID', routeid);
  return this.http.get(GeoLocationUpdateURL,{params}).pipe(catchError(this.handleError));
  }
  
}
