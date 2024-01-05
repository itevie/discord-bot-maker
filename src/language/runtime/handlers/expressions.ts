import ErrorCode from "../../errorCode";
import Kind from "../../parser/Kind";
import {AssignmentExpression, EchoStatement, Identifier, CallExpression, MemberExpression, IsExpression} from "../../parser/nodes";
import Environment from "../Environment";
import RuntimeError from "../RuntimeError";
import interpret from "../interpreter";
import { NativeFunctionValue, ObjectValue, RuntimeValue, createBoolean, createNull } from "../values";

export async function evaluateAssignmentExpression(expression: AssignmentExpression, environment: Environment): Promise<RuntimeValue> {
  if (expression.left.kind !== Kind.Identifier)
    throw new RuntimeError(ErrorCode.invalidAssignment, expression.left.location);
  environment.declareVariable((expression.left as Identifier).value, await interpret(expression.right, environment));
  return createNull();
}

export async function evaluateMemberExpression(expression: MemberExpression, environment: Environment): Promise<RuntimeValue> {
  // Check right
  if (expression.right.kind !== Kind.Identifier)
    throw new RuntimeError(ErrorCode.invalidRightMemberExpression, expression.right.location);

  // Get the left
  let left = await interpret(expression.left, environment) as ObjectValue;

  // Check it is an object
  if (left.type != "object")
    throw new RuntimeError(ErrorCode.invalidMemberExpressionAccessee, expression.left.location, { left: left.type });

  // Check if the object contains it
  if (!left.items[(expression.right as Identifier).value])
    return createNull();
  return left.items[(expression.right as Identifier).value];
}

export async function evaluateIsExpression(expression: IsExpression, environment: Environment): Promise<RuntimeValue> {
  let left = await interpret(expression.left, environment);
  let right = await interpret(expression.right, environment);

  // Check types
  if (left.type != right.type)
    return createBoolean(expression.isReverted ? true : false);

  let result = false;

  // Check if the values are the same
  if ((left as any)?.value == (right as any)?.value) {
    result = true;
  }

  return createBoolean(expression.isReverted ? !result : result);
}

export async function evaluateCallExpression(expression: CallExpression, environment: Environment): Promise<RuntimeValue> {
  // Try get the function
  let func = await interpret(expression.left, environment);

  // Check type
  if (func.type !== "nativeFunction") {
    throw new RuntimeError(ErrorCode.invalidTypeCall, expression.left.location, { type: func.type });
  }

  let args: RuntimeValue[] = [];

  for (const arg of expression.arguments) {
    args.push(await interpret(arg, environment));
  }

  // Run it
  return (func as NativeFunctionValue).call(args, environment);
}