import { BooleanValue, NumberValue, RuntimeValue, StringValue, createBoolean } from "./values";

export function booleanise(value: RuntimeValue): BooleanValue {
  switch (value.type) {
    case "boolean":
      return createBoolean((value as BooleanValue).value);
    case "string":
      return createBoolean((value as StringValue).value.length !== 0);
    case "number":
      return createBoolean((value as NumberValue).value > 0);
    case "object":
      return createBoolean(true);
    case "nativeFunction":
      return createBoolean(true);
    default:
      return createBoolean(false);
  }
}