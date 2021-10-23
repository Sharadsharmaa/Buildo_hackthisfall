import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class JwtService {

    constructor() { }

    getToken(): string {
        return window.localStorage.jwtToken;
    }

    saveToken(token: string): void {
        window.localStorage.jwtToken = token;
    }
    
    saveUserData(user: string): void {
        window.localStorage.user = user;
    }

    getUserData(): any {
        return JSON.parse(window.localStorage.user);
    }

    destroyToken(): void {
        window.localStorage.removeItem('jwtToken');
        window.localStorage.removeItem('user');
    }

    getCurrentUser(): string {
        return window.localStorage.currentUser;
    }

    setCurrentUser(currentUser: string): void{
        window.localStorage.currentUser = currentUser; 
    }
}
