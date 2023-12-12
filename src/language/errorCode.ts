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
} as const;

export default ErrorCode;

type Keys = keyof typeof ErrorCode;
type Values = typeof ErrorCode[Keys];
export {Keys, Values};