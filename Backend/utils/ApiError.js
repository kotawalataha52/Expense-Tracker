class ApiError extends Error {
    constructor(
        message = "Something went wrong",
        statusCode,
        errors = [],
        stack=""
    ){
        super(message);
        this.message=message;
        this.statusCode=statusCode;
        this.success=false;
        this.data=null;
        this.errors=errors;
    }
}
export {ApiError};