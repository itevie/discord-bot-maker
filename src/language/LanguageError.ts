import ErrorCode from "./errorCode";
import Location from "./lexer/Location";
type Keys = keyof typeof ErrorCode;

export default class LanguageError extends Error {
  errorCode: typeof ErrorCode[Keys] = ErrorCode.unknownLexerError;
  context: {[key: string]: string} = {};
  location: Location;
  quickFixes: { name: string, actions: string[] }[] = [];

  constructor(errorCode: typeof ErrorCode[Keys], location: Location, context: {[key: string]: string} = {}) {
    super(`${Object.keys(ErrorCode).find(key => ErrorCode[key] === errorCode)}`);
    this.errorCode = errorCode;
    this.location = location;
    this.context = context;
  }

  public extractDetails() {
    return {
      errorCode: this.errorCode,
      errorCodeText: ErrorCode[this.errorCode],
      context: this.context,
      stack: this.stack.toString(),
      location: this.location,
      message: this.message,
      quickFixes: this.quickFixes,
    }
  }
}