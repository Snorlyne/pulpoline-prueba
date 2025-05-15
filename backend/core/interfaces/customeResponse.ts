export default class CustomeResponse<T> {
  result: T | null;
  statusCode: number | null;
  message: string | null;

  constructor(data: T | null, statusCode: number | null, message: string) {
    this.message = message;
    this.result = data;
    this.statusCode = statusCode;
  }
}
