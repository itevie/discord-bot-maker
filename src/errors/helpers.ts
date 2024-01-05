import LanguageError from "../language/LanguageError";
import LexerError from "../language/lexer/LexerError";
import RuntimeError from "../language/runtime/RuntimeError";
import ApplicationError from "./ApplicationError";

export function handleError(error: Error): void {
  // Check if it is an error which contains a status code
  if (error instanceof ApplicationError) {
    __app.getWindow().webContents.send(`alerts:uncaught_error`, {
      error_code: error.errorCode,
      stack: error.stack,
      context: error.context,
    });
  }

  // Check if it is a language error
  else if (error instanceof LanguageError || error instanceof RuntimeError || error instanceof LexerError) {
    __app.getWindow().webContents.send("alerts:uncaught_language_error", error.extractDetails());
  }

  // Check if it is an unknown error
  else {
    __app.getWindow().webContents.send(`alerts:unknown_uncaught_error`, {
      message: error.message,
      stack: error.stack,
    });
  }
}