enum TokenType {
  // Literals
  Identifier,
  String,

  // Operators
  ArithmeticOperator,
  AssignmentOperator,

  // Keywords
  Print,
  If,
  Do,
  End,
  Is,
  Not,

  // Brackets
  OpenParen,
  CloseParen,

  // Basic Syntax
  Dot,
  Comma,

  // Special
  EOF,
  NewLine,
}

export default TokenType;