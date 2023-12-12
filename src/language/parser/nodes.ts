import Location from "../lexer/Location"
import Kind from "./Kind";

// Base expression
export interface Expression {
  location: Location;
  kind: Kind;
}

//#region Special

export interface Program extends Expression {
  body: Expression[];
  kind: Kind.Program;
}

export interface Body extends Expression {
  kind: Kind.BodyStatement;
  body: Expression[];
}

//#endregion

//#region Statements

export interface EchoStatement extends Expression {
  kind: Kind.EchoStatement,
  right: Expression,
}

export interface IfStatement extends Expression {
  kind: Kind.IfStatement,
  test: Expression;
  success: Body;
  alternate?: Expression;
}

//#endregion

//#region Expressions - Literals

export interface Identifier extends Expression {
  value: string;
  kind: Kind.Identifier;
}

export interface String extends Expression {
  value: string;
  kind: Kind.String;
}

//#endregion

//#region Expressions - Operator logic

export interface BinaryExpression extends Expression {
  left: Expression;
  operator: string;
  right: Expression;
  kind: Kind.BinaryExpression,
}

export interface AssignmentExpression extends Expression {
  left: Expression;
  right: Expression;
  kind: Kind.AssignmentOperator;
}

export interface IsExpression extends Expression {
  left: Expression;
  right: Expression;
  kind: Kind.IsExpression;
  isReverted: boolean;
}

//#endregion

//#region Expressions - Others

export interface CallExpression extends Expression {
  left: Expression;
  arguments: Expression[];
  kind: Kind.CallExpression;
}

export interface MemberExpression extends Expression {
  left: Expression;
  right: Expression;
  kind: Kind.MemberExpression;
}

//#endregion