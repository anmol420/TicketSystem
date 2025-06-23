class ApiResponse {
    public statusCode: number;
    public success: boolean;
    public data: any;
    public message: string;

    constructor(statusCode: number, success: boolean, data: any = null, message: string = "Success") {
        this.statusCode = statusCode;
        this.success = success;
        this.data = data;
        this.message = message;
    }
}

export default ApiResponse;