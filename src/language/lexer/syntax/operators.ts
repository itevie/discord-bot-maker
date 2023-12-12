import TokenType from "../TokenType"

// TODO: Make it so its like "plus": { value: "+", type: ...} etc.

export default {
  // ----- Arithmetic Operators -----
  "+": TokenType.ArithmeticOperator,
  "-": TokenType.ArithmeticOperator,
  "*": TokenType.ArithmeticOperator,
  "/": TokenType.ArithmeticOperator,

  // ----- Assignment Operators -----
  "=": TokenType.AssignmentOperator,

  // ----- Grouping Characters -----
  "(": TokenType.OpenParen,
  ")": TokenType.CloseParen,

  // ----- Basic Syntax -----
  ".": TokenType.Dot,
  ",": TokenType.Comma,
}