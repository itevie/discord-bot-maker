import {Identifier, String} from "../../parser/nodes";
import Environment from "../Environment";
import interpret from "../interpreter";
import { RuntimeValue, createNull, createString } from "../values";

export function evaluateIdentifier(expression: Identifier, environment: Environment): RuntimeValue {
  return environment.lookupVariable(expression.value, expression.location);
}

export function evaluateString(expression: String, environment: Environment): RuntimeValue {
  return createString(expression.value);
}