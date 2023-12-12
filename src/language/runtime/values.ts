//#region Helper Functions

import Environment from "./Environment";

export function createValue(value: any): RuntimeValue {
  if (typeof value === "number") {
    return {
      type: "number",
      value: value as number,
    } as NumberValue;
  } else if (typeof value === "string") {
    return createString(value as string);
  } else if (typeof value === "function") {
    return createNativeFunction(value as FunctionCall, { args: [] });
  } else if (typeof value === "object") {
    return createObject(value);
  }

  return createNull();
}

//#endregion

//#region Value Cration Functions

export function createNull(): NullValue {
  return {
    type: "null",
    value: null
  };
}

export function createString(str: string): StringValue {
  return {
    type: "string",
    value: str,
  };
}

export function createNativeFunction(call: FunctionCall, options: NativeFunctionOptions): NativeFunctionValue {
  return {
    type: "nativeFunction",
    call,
    options,
  };
}

export function createBoolean(bool: boolean): BooleanValue {
  return {
    value: bool,
    type: "boolean"
  };
}

export function createObject(items: {[key: string]: ValidTypeUnion}): ObjectValue {
  const newObject = {};

  for (const value in items) {
    newObject[value] = createValue(items[value]);
  }

  return {
    type: "object",
    items: newObject
  }
}

//#endregion

export type ValueType = "null"
  | "number"
  | "string"
  | "nativeFunction"
  | "object"
  | "boolean"
  | "any";

export type ValidTypeUnion = number
  | string
  | null
  | boolean
  | {[key: string]: ValidTypeUnion}
  | FunctionCall;

export interface NativeFunctionOptions {
  args: NativeFunctionArgument[];
}

export interface NativeFunctionArgument {
  name: string;
  type: ValidTypeUnion;
}

export type FunctionCall = (args: RuntimeValue[], environment: Environment) => RuntimeValue;

export interface RuntimeValue {
  type: ValueType;
}

export interface ObjectValue extends RuntimeValue {
  items: {[key: string]: RuntimeValue};
}

export interface NativeFunctionValue extends RuntimeValue {
  call: FunctionCall;
  options: NativeFunctionOptions;
}

export interface NullValue extends RuntimeValue {
  value: null,
}

export interface NumberValue extends RuntimeValue {
  value: number;
}

export interface StringValue extends RuntimeValue {
  value: string;
}

export interface BooleanValue extends RuntimeValue {
  value: boolean;
}