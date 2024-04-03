import { BaseCustomError } from "./baseCustomError";

export class ClientError extends BaseCustomError {
    public status: number;

    constructor(message: string, statusCode: number) {
        super(message, statusCode);
        this.status = statusCode;
    }

    public async getStatusCode(): Promise<number> {
        return this.status;
    }
}
