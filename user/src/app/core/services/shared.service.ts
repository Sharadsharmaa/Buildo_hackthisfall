import { Injectable, Output, EventEmitter } from '@angular/core'

@Injectable()
export class SharedService {
    @Output() fire: EventEmitter<any> = new EventEmitter();

    constructor() {
    }

    updateProfile(userProfiles: any) {
        this.fire.emit(userProfiles);
    }

    getEmittedValue() {
        return this.fire;
    }

} 