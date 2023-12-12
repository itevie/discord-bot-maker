enum Kind {
  Identifier,
  String,

  // Expression
  BinaryExpression,
  AssignmentOperator,
  CallExpression,
  MemberExpression,
  IsExpression,

  // Statements
  EchoStatement,
  IfStatement,
  BodyStatement,

  // Special
  Program,
}

export default Kind;