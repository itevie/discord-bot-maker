import ErrorCode from "../errorCode";
import Token from "../lexer/Token"
import TokenType from "../lexer/TokenType";
import { lex } from "../lexer/lexer";
import operators from "../lexer/syntax/operators";
import Kind from "./Kind";
import ParserError from "./ParseError";
import * as nodes from "./nodes";

export default class Parser {
  private tokens: Token[];

  //#region Helper Functions

  private at(): Token {
    return this.tokens[0];
  }

  private eat(): Token {
    return this.tokens.shift();
  }

  private expect(tokenType: TokenType) {
    if (this.at().type != tokenType)
      throw new ParserError(
        ErrorCode.expectedDifferentToken, 
        this.at().location, 
        { 
          expected: TokenType[tokenType],
          got: TokenType[this.at().type]
        }
      );
    return this.eat();
  }

  private expectNewLine() {
    if (this.at().type !== TokenType.NewLine)
      throw new ParserError(
        ErrorCode.expectedDifferentToken, 
        this.at().location, 
        { 
          expected: TokenType[TokenType.NewLine],
          got: TokenType[this.at().type]
        }
      );
  }

  //#endregion

  /**
   * Parses the entire source
   * @param sourceCode
   * @param origin 
   */
  public produceAST(sourceCode: string, origin: string) {
    const tokens = lex(sourceCode, origin);
    this.tokens = tokens;

    // Construct base program
    const program: nodes.Program = {
      body: [],
      kind: Kind.Program,
      location: tokens[0].location
    };

    // Loop until EOF
    while (this.at().type !== TokenType.EOF) {
      // Remove useless newlines
      if (this.at().type == TokenType.NewLine) {
        this.eat();
        continue;
      }

      // Get the expression
      const expression = this.parseStatement();

      // Expect new line
      this.expectNewLine();
      this.eat();

      // Add token
      program.body.push(expression);
    }

    // Done
    return program;
  }

  //#region Syntax Helpers

  private parseBlock(): nodes.Body {
    let token = this.expect(TokenType.Do);

    let expressions: nodes.Expression[] = [];

    while (this.at().type != TokenType.End) {
      // Remove useless newlines
      if (this.at().type == TokenType.NewLine) {
        this.eat();
        continue;
      }
      
      expressions.push(this.parseStatement());

      // Expect new line
      this.expectNewLine();
      this.eat();
    }

    this.expect(TokenType.End);

    return {
      body: expressions,
      location: token.location,
      kind: Kind.BodyStatement,
    };
  }

  //#endregion

  //#region Statements

  private parseStatement() {
    switch (this.at().type) {
      case TokenType.Print:
        return this.parseEchoStatement();
      case TokenType.If:
        return this.parseIfStatement();
      default:
        return this.parseExpression();
    }
  }

  private parseIfStatement(): nodes.IfStatement {
    let token = this.eat();
    let test = this.parseExpression();
    let success = this.parseBlock();

    return {
      location: token.location,
      test,
      success,
      kind: Kind.IfStatement
    };
  }

  private parseEchoStatement(): nodes.EchoStatement {
    let token = this.eat();
    let right = this.parseExpression();

    return {
      kind: Kind.EchoStatement,
      location: token.location,
      right,
    };
  }

  //#endregion

  //#region Expressions
  private parseExpression(): nodes.Expression {
    return this.parseAssignmentExpression();
  }

  private parseAssignmentExpression(): nodes.Expression {
    let left: nodes.Expression = this.parseIsExpression();

    if (this.at().type === TokenType.AssignmentOperator) {
      let token = this.eat();

      let right = this.parseIsExpression();

      return {
        left,
        right,
        location: token.location,
        kind: Kind.AssignmentOperator,
      } as nodes.AssignmentExpression;
    }

    return left;
  }

  private parseIsExpression() {
    let left = this.parseAdditiveExpression();

    if (this.at().type == TokenType.Is) {
      let token = this.eat();
      let isReverted = this.at().type == TokenType.Not;
      if (isReverted) this.eat();

      let expression = {
        left,
        isReverted,
        location: token.location,
        right: this.parseAdditiveExpression(),
        kind: Kind.IsExpression,
      } as nodes.IsExpression;

      return expression;
    }

    return left;
  }

  private parseAdditiveExpression(): nodes.Expression {
    let left: nodes.Expression = this.parseCallExpression();

    while (this.at().type == TokenType.ArithmeticOperator && (["+", "-"].includes(this.at().value))) {
      // Obtain values
      const token = this.eat();
      const right: nodes.Expression = this.parseCallExpression();

      // Update left
      left = {
        left,
        right,
        operator: token.value,
      } as nodes.BinaryExpression;
    }

    return left;
  }

  private parseCallExpression(): nodes.Expression {
    let left = this.parseMemberExpression();

    if (this.at().type == TokenType.OpenParen) {
      let startArgToken = this.eat();
      let args: nodes.Expression[] = [];

      while (this.at().type !== TokenType.CloseParen && this.at().type !== TokenType.EOF) {
        args.push(this.parseExpression());

        if (this.at().type === TokenType.Comma) {
          this.eat();
        } else if (this.at().type === TokenType.CloseParen) {
          break;
        }
      }

      this.expect(TokenType.CloseParen);

      return {
        left,
        arguments: args,
        location: startArgToken.location,
        kind: Kind.CallExpression,
      } as nodes.CallExpression;
    }

    return left;
  }

  private parseMemberExpression(): nodes.Expression {
    let left = this.parsePrimaryExpression();

    while (this.at().type == TokenType.Dot) {
      let dotToken = this.eat();

      let right = this.parsePrimaryExpression();
      
      left = {
        left,
        right,
        location: dotToken.location,
        kind: Kind.MemberExpression
      } as nodes.MemberExpression;
    }

    return left;
  }

  //#endregion

  private parsePrimaryExpression(): nodes.Expression {
    switch (this.at().type) {
      case TokenType.Identifier:
        return {
          value: this.eat().value,
          kind: Kind.Identifier
        } as nodes.Identifier;
      case TokenType.String:
        return {
          value: this.eat().value,
          kind: Kind.String,
        } as nodes.String;
      default:
        throw new ParserError(ErrorCode.unexpectedToken, this.at().location, { token_name: TokenType[this.at().type] });
    }
  }
}