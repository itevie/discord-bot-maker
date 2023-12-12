import Location from "../lexer/Location";

export default class RuntimeError extends Error {
  location: Location;

  constructor(message: string, location: Location) {
    super(message);
    this.location = location;
  }
}