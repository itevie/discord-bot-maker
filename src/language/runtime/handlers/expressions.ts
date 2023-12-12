import Kind from "../../parser/Kind";
import {AssignmentExpression, EchoStatement, Identifier, CallExpression, MemberExpression, IsExpression} from "../../parser/nodes";
import Environment from "../Environment";
import RuntimeError from "../RuntimeError";
import interpret from "../interpreter";
import { NativeFunctionValue, ObjectValue, RuntimeValue, createBoolean, createNull } from "../values";

export function evaluateAssignmentExpression(expression: AssignmentExpression, environment: Environment): RuntimeValue {
  if (expression.left.kind !== Kind.Identifier)
    throw new RuntimeError(`Cannot assign to ${expression.left.kind}`, expression.left.location);
  environment.declareVariable((expression.left as Identifier).value, interpret(expression.right, environment));
  return createNull();
}

export function evaluateMemberExpression(expression: MemberExpression, environment: Environment): RuntimeValue {
  // Check right
  if (expression.right.kind !== Kind.Identifier)
    throw new RuntimeError(`This must be an identifier`, expression.right.location);

  // Get the left
  let left = interpret(expression.left, environment) as ObjectValue;

  // Check it is an object
  if (left.type != "object")
    throw new RuntimeError(`Can only get sub values from an object type, but got ${left.type}`, expression.left.location);

  // Check if the object contains it
  if (!left.items[(expression.right as Identifier).value])
    return createNull();
  return left.items[(expression.right as Identifier).value];
}

export function evaluateIsExpression(expression: IsExpression, environment: Environment): RuntimeValue {
  let left = interpret(expression.left, environment);
  let right = interpret(expression.right, environment);

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

export function evaluateCallExpression(expression: CallExpression, environment: Environment): RuntimeValue {
  // Try get the function
  let func = interpret(expression.left, environment);

  // Check type
  if (func.type !== "nativeFunction") {
    throw new RuntimeError(`Cannot call a ${func.type}, can only call functions`, expression.left.location);
  }

  let args: RuntimeValue[] = [];

  for (const arg of expression.arguments) {
    args.push(interpret(arg, environment));
  }

  // Run it
  return (func as NativeFunctionValue).call(args, environment);
}