
export interface IResponse<T> {
    result: T;
    statusCode: number;
    message: string;
}