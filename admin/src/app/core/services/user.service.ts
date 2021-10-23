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
    return this.apiService.post('/api/v1/admin/login', data)
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
  addRole(data: any): Observable<any> {
    return this.apiService.post('/api/v1/admin/addRole', data)
      .pipe(map(
        res => {
          return res;
        }
      ));
  }
  updateRole(data: any): Observable<any> {
    return this.apiService.post('/api/v1/admin/updateRole', data)
      .pipe(map(
        res => {
          return res;
        }
      ));
  }
  editRole(data: any): Observable<any> {
    return this.apiService.get('/api/v1/admin/editRole', data)
      .pipe(map(
        res => {
          return res;
        }
      ));
  }
  deleteRole(data: any): Observable<any> {
    return this.apiService.delete('/api/v1/admin/deleteRole', data)
      .pipe(map(
        res => {
          return res;
        }
      ));
  }

  resetPassword(data: any): Observable<any> {
    return this.apiService.post('/api/v1/admin/resetPassword', data)
      .pipe(map(
        res => {
          return res;
        }
      ));
  }
  getRoles(data: any): Observable<any> {
    return this.apiService.post('/api/v1/admin/getRoles', data)
      .pipe(map(
        res => {
          return res;
        }
      ));
  }


  createAdmin(data: any): Observable<any> {
    return this.apiService.post('/api/v1/admin/createAdmin', data)
      .pipe(map(
        res => {
          return res;
        }
      ));
  }
  editAdmin(data: any): Observable<any> {
    return this.apiService.get('/api/v1/admin/editAdmin', data)
      .pipe(map(
        res => {
          return res;
        }
      ));
  }

  deleteAdmin(data: any): Observable<any> {
    return this.apiService.delete('/api/v1/admin/deleteAdmin', data)
      .pipe(map(
        res => {
          return res;
        }
      ));
  }
  updateAdmin(data: any): Observable<any> {
    return this.apiService.post('/api/v1/admin/updateAdmin', data)
      .pipe(map(
        res => {
          return res;
        }
      ));
  }
  getAdmins(data: any): Observable<any> {
    return this.apiService.post('/api/v1/admin/admins', data)
      .pipe(map(
        res => {
          return res;
        }
      ));
  }
  roles(): Observable<any> {
    return this.apiService.get('/api/v1/admin/roles')
      .pipe(map(
        data => {
          return data;
        }
      ));
  }
  getUsers(data: any): Observable<any> {
    return this.apiService.post('/api/v1/admin/getUsers', data)
      .pipe(map(
        res => {
          return res;
        }
      ));
  }
  addUser(data: any): Observable<any> {
    return this.apiService.post('/api/v1/admin/addUser', data)
      .pipe(map(
        res => {
          return res;
        }
      ));
  }
  editUser(data: any): Observable<any> {
    return this.apiService.get('/api/v1/admin/editUser', data)
      .pipe(map(
        res => {
          return res;
        }
      ));
  }
  updateUser(data: any): Observable<any> {
    return this.apiService.post('/api/v1/admin/updateUser', data)
      .pipe(map(
        res => {
          return res;
        }
      ));
  }
  deleteUser(data: any): Observable<any> {
    return this.apiService.delete('/api/v1/admin/deleteUser', data)
      .pipe(map(
        res => {
          return res;
        }
      ));
  }

  getProjects(data: any): Observable<any> {
    return this.apiService.post('/api/v1/admin/getProjects', data)
      .pipe(map(
        res => {
          return res;
        }
      ));
  }
  addProject(data: any): Observable<any> {
    return this.apiService.post('/api/v1/admin/addProject', data)
      .pipe(map(
        res => {
          return res;
        }
      ));
  }

  deleteProject(data: any): Observable<any> {
    return this.apiService.delete('/api/v1/admin/deleteProject', data)
      .pipe(map(
        res => {
          return res;
        }
      ));
  }

}
