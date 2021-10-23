import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { map } from 'rxjs/operators';
@Injectable({
    providedIn: 'root'
})
export class BuildingService {

    constructor(
        private apiService: ApiService
    ) {
    }
    buildingDetail(data: any): Observable<any> {
        return this.apiService.get('/api/v1/user/projectDetail', data)
            .pipe(map(
                res => {
                    return res;
                }
            ));
    }
    buildingList(): Observable<any> {
        return this.apiService.get('/api/v1/user/projectList')
            .pipe(map(
                res => {
                    return res;
                }
            ));
    }

}
