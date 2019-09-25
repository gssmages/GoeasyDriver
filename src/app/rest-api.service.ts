import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';

const LoginURL="http://hkdnte250.asia.ad.flextronics.com:1227/api/DriverMobileApi/RequestOTP?";
const LoginValidURL="http://hkdnte250.asia.ad.flextronics.com:1227/api/DriverMobileApi/ValidateOTP?";
const HomeURL="http://hkdnte250.asia.ad.flextronics.com:1227/api/DriverMobileApi/GetHomepage?";
const DetailpageURL="http://hkdnte250.asia.ad.flextronics.com:1227/api/DriverMobileApi/GetTripSheet?";
const ScanURL="http://hkdnte250.asia.ad.flextronics.com:1227/api/DriverMobileApi/EmployeeCheckInCheckOut?";
const AreaURL="http://hkdnte250.asia.ad.flextronics.com:1227/api/DriverMobileApi/AreaNodalPoint?";
const TripcloseURL="http://hkdnte250.asia.ad.flextronics.com:1227/api/DriverMobileApi/Tripclose?";
//const AreaURL="http://gssnte811.asia.ad.flextronics.com:4042/api/AdhocCabRequestApi/ReadAdhocCabRequestValues/?locationID=1&employeeID=941364";
//const DetailpageURL="./assets/API/TripDetails.json";
//const LoginValidURL="./assets/API/LoginValidation.json";
//const HomeURL="http://www.mocky.io/v2/5d173f3e2f0000672d25faaa";

@Injectable({
  providedIn: 'root',
})

export class RestApiService {
  dbdate='';
  today= new Date();

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Network failed. Please try again.');
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
  verifyQRScan(locationname: string, routeid: string,tripsheetid: string,employeeid: string,nodalpointid: string,routechange: string): Observable<any>{
    let params = new HttpParams()
     .set('LocationName', locationname)
     .set('TripID', routeid)
     .set('TripSheetID', tripsheetid)
     .set('EmployeeID', employeeid)
     .set('NodalPointID', nodalpointid)
     .set('RouteChangeYesNo', routechange);
  return this.http.get(ScanURL,{params}).pipe(catchError(this.handleError));
  }
  getArea(locationname: string): Observable<any>{
    let params = new HttpParams()
    .set('LocationName', locationname)
  return this.http.get(AreaURL,{params}).pipe(catchError(this.handleError));
  }
  setTripClose(routeid: string, driverinternalID: string): Observable<any>{
    let params = new HttpParams()
    .set('RouteID', routeid)
    .set('DriverInternalID', driverinternalID);
  return this.http.get(TripcloseURL,{params}).pipe(catchError(this.handleError));
  }

  
}
