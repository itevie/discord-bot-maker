import Token from "./Token";
import Logger from "../../Logger";
import TokenType from "./TokenType";
import Location from "./Location";
import LexerError from "./LexerError";
import operators from "./syntax/operators";
import keywords from "./syntax/keywords";
import { inspect } from "util";
import ErrorCode from "../errorCode";
const logger = new Logger("lexer");

export function lex(source: string, origin: string): Token[] {
  logger.log(`Beginning lexing of source (${source.length} characters) from ${origin}`);
  const tokens: Token[] = [];
  const chars = source.split("");

  let lineIndex = 0;
  let currentLine = 0;

  while (chars.length !== 0) {
    // Setup basic values
    let tokenValue: string | undefined;
    let tokenType: TokenType | undefined;
    let location: Location = {
      charStart: lineIndex,
      charEnd: lineIndex,
      line: currentLine,
    }

    /**
     * Removes the first character from the source, removes it
     * and updates the location 
     * @returns 
     */
    const removeFirst: () => string = () => {
      let oldValue: string = chars[0];
      chars.shift();
      lineIndex++;
      location.charEnd++;
      return oldValue;
    }

    const setToken = (value: string, givenTokenType: TokenType) => {
      tokenValue = value;
      tokenType = givenTokenType;
    }

    // Check new line
    if (chars[0] === "\n" || (chars[0] === "\r" && chars[1] === "\n")) {
      if (chars[0] === "\r") {
        removeFirst();
      } 
      removeFirst();
      setToken("\n", TokenType.NewLine);
      lineIndex = 0;
      currentLine++;
    }

    // Remove whitespace
    else if (/\s/.test(chars[0])) {
      removeFirst();
      continue;
    }

    // Parse quotes
    else if (chars[0] === "\"") {
      let start = structuredClone(location);
      removeFirst();
      let string = "";

      while (chars.length !== 0 && chars[0] !== "\"") {
        string += removeFirst();
      }

      if (chars[0] !== "\"")
        throw new LexerError(ErrorCode.stringNotClosed, start);

      removeFirst();
      
      setToken(string, TokenType.String);
    }

    // Parse identifiers
    else if (chars[0] === "$" || isIdentifierCharacter(chars[0])) {
      let identifier: string = removeFirst();

      // Repeat until end of ident
      while (isIdentifierCharacter(chars[0])) {
        identifier += removeFirst();
      }

      // Check if it is a keyword
      if (keywords[identifier.toLowerCase()]) {
        setToken(identifier, keywords[identifier.toLowerCase()]);
      }

      else setToken(identifier, TokenType.Identifier);
    } else {
      // Check if it is an operator
      const joined = chars.join("");
      let isSuccess: boolean = false;
      for (const operator of Object.keys(operators)) {
        // Check if it is not
        if (joined.startsWith(operator) === false)
          continue;
        
        // If it is then remove x amount from source
        for (let i = 0; i != operator.length; i++)
          removeFirst();
        
        // Set token
        setToken(operator, operators[operator]);
        isSuccess = true;
        break;
      }

      // Check if operator was found, if not throw
      if (!isSuccess)
        throw new LexerError(ErrorCode.unknownCharacter, location, { character: chars[0] });
    }

    // Validate
    if (tokenValue === null)
      throw new LexerError(ErrorCode.unknownLexerError, location);
    if (tokenType === null)
      throw new LexerError(ErrorCode.unknownLexerError, location);

    // Finish up
    tokens.push({
      location,
      value: tokenValue,
      type: tokenType
    });
  }

  if (tokens.length !== 0 && tokens[tokens.length - 1].type !== TokenType.NewLine)
    tokens.push({
      type: TokenType.NewLine,
      value: "",
      location: {
        charEnd: lineIndex,
        charStart: lineIndex,
        line: currentLine,
      },
    });

  // Add EOF token
  tokens.push({
    location: {
      charEnd: lineIndex,
      charStart: lineIndex,
      line: currentLine,
    },
    value: "",
    type: TokenType.EOF,
  });

  logger.log(`Finished lexing ${origin}, found ${tokens.length} tokens`);

  // Finished
  return tokens;
}

function isIdentifierCharacter(char: string): boolean {
  return char !== undefined && /[a-zA-Z_]/.test(char);
}