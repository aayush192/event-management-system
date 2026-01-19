class apiError extends Error{
    statusCode: number;
    stack?: string | undefined;
    
    constructor(statusCode:number,message:string) {
        super(message)
        this.statusCode = statusCode;
        Error.captureStackTrace(this,this.constructor)
    }
}

export default apiError