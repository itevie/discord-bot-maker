export default class ApplicationError extends Error {
  public errorCode: string;
  public context: {[key: string]: string};

  constructor(error: string, context: {[key: string]: string} = {}) {
    super(error);
    this.errorCode = error;
    this.context = context;
  }
}