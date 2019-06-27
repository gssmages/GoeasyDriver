import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

const LoginURL="http://gssnte811.asia.ad.flextronics.com:4042/api/login/CheckLoginDetailEncryption?";


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

  
  getLoginData(username: string, password: string): Observable<any>{
    let params = new HttpParams()
     .set('username', username)
     .set('password', password);
  return this.http.get(LoginURL,{params}).pipe(catchError(this.handleError));
  }
  
}
