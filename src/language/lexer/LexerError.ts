import LanguageError from "../LanguageError";
import { Values } from "../errorCode";
import Location from "./Location"
import Token from "./Token";

export default class LexerError extends LanguageError {
  constructor(errorCode: Values, location: Location, extraData: {[key: string]: string} = {}) {
    super(errorCode, location, extraData);
  }
}