import {Identifier, String} from "../../parser/nodes";
import Environment from "../Environment";
import interpret from "../interpreter";
import { RuntimeValue, createNull, createString } from "../values";

export async function evaluateIdentifier(expression: Identifier, environment: Environment): Promise<RuntimeValue> {
  return environment.lookupVariable(expression.value, expression.location);
}

export async function evaluateString(expression: String, environment: Environment): Promise<RuntimeValue> {
  return createString(expression.value);
}