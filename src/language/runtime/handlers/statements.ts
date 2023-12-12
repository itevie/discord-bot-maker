import {Body, EchoStatement, IfStatement, Program} from "../../parser/nodes";
import Environment from "../Environment";
import interpret from "../interpreter";
import { RuntimeValue, createNull } from "../values";
import { booleanise } from "../utils";

export function evaluateProgramStatement(expression: Program, environment: Environment): RuntimeValue {
  let lastValue: RuntimeValue = createNull();
  for (const statement of expression.body) {
    lastValue = interpret(statement, environment);
  }

  return lastValue;
}

export function evaluateBlockStatement(expression: Body, environment: Environment): RuntimeValue {
  let lastValue: RuntimeValue = createNull();
  for (const statement of expression.body) {
    lastValue = interpret(statement, environment);
  }

  return lastValue;
}

export function evaluatePrintStatement(expression: EchoStatement, environment: Environment): RuntimeValue {
  const value = interpret(expression.right, environment);
  environment.getContext().langLogger.log((value as any).value);
  return createNull();
}

export function evaluateIfStatement(expression: IfStatement, environment: Environment): RuntimeValue {
  const value = interpret(expression.test, environment);
  const truthy = booleanise(value).value;

  if (truthy) {
    interpret(expression.success, new Environment(environment));
  }

  return createNull();
}