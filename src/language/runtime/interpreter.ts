import Kind from "../parser/Kind";
import * as nodes from "../parser/nodes";
import Environment from "./Environment";
import RuntimeError from "./RuntimeError";
import * as statements from "./handlers/statements";
import * as literals from "./handlers/literals";
import * as expressions from "./handlers/expressions";
import { RuntimeValue } from "./values";

export default function interpret(expression: nodes.Expression, environment: Environment): RuntimeValue {
  switch (expression.kind) {
    // ----- Statements -----
    case Kind.Program:
      return statements.evaluateProgramStatement(expression as nodes.Program, environment);
    case Kind.EchoStatement:
      return statements.evaluatePrintStatement(expression as nodes.EchoStatement, environment);
    case Kind.BodyStatement:
      return statements.evaluateBlockStatement(expression as nodes.Body, environment);
    case Kind.IfStatement:
      return statements.evaluateIfStatement(expression as nodes.IfStatement, environment);

    // ----- Literals -----
    case Kind.Identifier:
      return literals.evaluateIdentifier(expression as nodes.Identifier, environment);
    case Kind.String:
      return literals.evaluateString(expression as nodes.String, environment);

    // ----- Expressions -----
    case Kind.AssignmentOperator:
      return expressions.evaluateAssignmentExpression(expression as nodes.AssignmentExpression, environment);
    case Kind.CallExpression:
      return expressions.evaluateCallExpression(expression as nodes.CallExpression, environment);
    case Kind.MemberExpression:
      return expressions.evaluateMemberExpression(expression as nodes.MemberExpression, environment);
    case Kind.IsExpression:
      return expressions.evaluateIsExpression(expression as nodes.IsExpression, environment);

    // ----- Unknown -----
    default:
      throw new RuntimeError(`Cannot handle a ${Kind[expression.kind]}`, expression.location);
  }
}