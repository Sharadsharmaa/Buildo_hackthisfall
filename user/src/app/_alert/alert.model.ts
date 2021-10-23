export class Alert {
    id: string = '';
    type: AlertType;
    message: string = '';
    autoClose: boolean = true;
    keepAfterRouteChange: boolean = false;
    fade: boolean = true;

    constructor(init?: Partial<Alert>) {
        this.type = AlertType.Success;
        Object.assign(this, init);
    }
}

export enum AlertType {
    Success,
    Error,
    Info,
    Warning
}