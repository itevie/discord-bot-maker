import Kind from "../parser/Kind";
import * as nodes from "../parser/nodes";
import Environment from "./Environment";
import RuntimeError from "./RuntimeError";
import * as statements from "./handlers/statements";
import * as literals from "./handlers/literals";
import * as expressions from "./handlers/expressions";
import { RuntimeValue } from "./values";
import ErrorCode from "../errorCode";

export default async function interpret(expression: nodes.Expression, environment: Environment): Promise<RuntimeValue> {
  switch (expression.kind) {
    // ----- Statements -----
    case Kind.Program:
      return await statements.evaluateProgramStatement(expression as nodes.Program, environment);
    case Kind.EchoStatement:
      return await statements.evaluatePrintStatement(expression as nodes.EchoStatement, environment);
    case Kind.BodyStatement:
      return await statements.evaluateBlockStatement(expression as nodes.Body, environment);
    case Kind.IfStatement:
      return await statements.evaluateIfStatement(expression as nodes.IfStatement, environment);

    // ----- Literals -----
    case Kind.Identifier:
      return await literals.evaluateIdentifier(expression as nodes.Identifier, environment);
    case Kind.String:
      return await literals.evaluateString(expression as nodes.String, environment);

    // ----- Expressions -----
    case Kind.AssignmentOperator:
      return await expressions.evaluateAssignmentExpression(expression as nodes.AssignmentExpression, environment);
    case Kind.CallExpression:
      return await expressions.evaluateCallExpression(expression as nodes.CallExpression, environment);
    case Kind.MemberExpression:
      return await expressions.evaluateMemberExpression(expression as nodes.MemberExpression, environment);
    case Kind.IsExpression:
      return await expressions.evaluateIsExpression(expression as nodes.IsExpression, environment);

    // ----- Unknown -----
    default:
      throw new RuntimeError(ErrorCode.unknownAst, expression.location, { node: Kind[expression.kind] });
  }
}