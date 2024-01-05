import {Body, EchoStatement, IfStatement, Program} from "../../parser/nodes";
import Environment from "../Environment";
import interpret from "../interpreter";
import { RuntimeValue, createNull } from "../values";
import { booleanise } from "../utils";

export async function evaluateProgramStatement(expression: Program, environment: Environment): Promise<RuntimeValue> {
  let lastValue: RuntimeValue = createNull();
  for await (const statement of expression.body) {
    lastValue = await interpret(statement, environment);
  }

  return lastValue;
}

export async function evaluateBlockStatement(expression: Body, environment: Environment): Promise<RuntimeValue> {
  let lastValue: RuntimeValue = createNull();
  for await (const statement of expression.body) {
    lastValue = await interpret(statement, environment);
  }

  return lastValue;
}

export async function evaluatePrintStatement(expression: EchoStatement, environment: Environment): Promise<RuntimeValue> {
  const value = await interpret(expression.right, environment);
  environment.getContext().langLogger.log((value as any).value);
  return createNull();
}

export async function evaluateIfStatement(expression: IfStatement, environment: Environment): Promise<RuntimeValue> {
  const value = await interpret(expression.test, environment);
  const truthy = booleanise(value).value;

  if (truthy) {
    interpret(expression.success, new Environment(environment));
  }

  return createNull();
}