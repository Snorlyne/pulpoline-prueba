import CustomeResponse from "../interfaces/customeResponse";


export default class ErrorHandler {
  static handle(error: any): CustomeResponse<null> {
    let statusCode = 500;
    let message = 'An unexpected error occurred.';

    if (error.response) {
      // Error de respuesta del servidor
      statusCode = error.response.status;
      message =
        error.response.data?.error?.message ||
        error.response.data?.message ||
        error.response.statusText ||
        message;
    } else if (error.request) {
      // Error en la solicitud (sin respuesta del servidor)
      message = 'No response received from the server.';
    } else if (error.message) {
      // Error en la configuración de la solicitud
      message = error.message;
    }

    return new CustomeResponse<null>(null, statusCode, message);
  }
}
