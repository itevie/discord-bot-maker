import LanguageError from "../LanguageError";
import { Values } from "../errorCode";
import Location from "../lexer/Location"

export default class ParserError extends LanguageError {
  constructor(errorCode: Values, location: Location, extraData: {[key: string]: string} = {}) {
    super(errorCode, location, extraData);
  }
}