const ErrorCode = {
  // ----- Lexer -----
  unknownLexerError: "ELL0",
  stringNotClosed: "ELL1",
  unknownCharacter: "ELL2",

  // ----- Parser -----
  unknownParserError: "ELP0",
  unexpectedToken: "ELP1",
  expectedDifferentToken: "ELP2",
  expectedNewLine: "ELP3",

  // ----- Runtime -----
  unknownRuntimeError: "ELR0",
  invalidAssignment: "ELR1",
  invalidRightMemberExpression: "ELR2",
  invalidMemberExpressionAccessee: "ELR3",
  invalidTypeCall: "ELR4",
  undeclaredVariable: "ELR5",
  unknownAst: "ELR6",
} as const;

export default ErrorCode;

type Keys = keyof typeof ErrorCode;
type Values = typeof ErrorCode[Keys];
export {Keys, Values};