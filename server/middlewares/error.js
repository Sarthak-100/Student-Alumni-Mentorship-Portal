export class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}
const errorMiddleware = (err, req, res, next) => {
  console.log("h1");
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;
  return res.status(500).json({
    success: false,
    message: err.message,
  });
};

export default errorMiddleware;
