import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { map } from 'rxjs/operators';
@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(
        private apiService: ApiService
    ) {
    }
    loginUser(data: any): Observable<any> {
        return this.apiService.post('/api/v1/user/login', data)
            .pipe(map(
                res => {
                    return res;
                }
            ));
    }
    signupUser(data: any): Observable<any> {
        return this.apiService.post('/api/v1/user/signup', data)
            .pipe(map(
                res => {
                    return res;
                }
            ));
    }
    logout(data: any): Observable<any> {
        return this.apiService.get('/api/v1/admin/logout', data)
            .pipe(map(
                res => {
                    return res;
                }
            ));
    }

    forgotPassword(data: any): Observable<any> {
        return this.apiService.post('/api/v1/admin/forgotPassword', data)
            .pipe(map(
                res => {
                    return res;
                }
            ));
    }
   
    resetPassword(data: any): Observable<any> {
        return this.apiService.post('/api/v1/user/resetPassword', data)
            .pipe(map(
                res => {
                    return res;
                }
            ));
    }
    sawoLogin(data: any): Observable<any> {
        return this.apiService.post('/api/v1/user/sawoLogin', data)
            .pipe(map(
                res => {
                    return res;
                }
            ));
    }

}
