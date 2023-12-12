import TokenType from "./TokenType"
import Location from "./Location"

export default interface Token {
  type: TokenType,
  value: string,
  location: Location,
} 