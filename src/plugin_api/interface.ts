// ----- What is this? -----
// This file contains all the interfaces
// for use within a TypeScript environment
// for creating plugins for this project.
//
// Simply create the project, and import
// this interface.ts file, follow tutorials
// for more information.
//
// This file should not import ANYTHING,
// every single declaration should be
// declared in here.
// -------------------------

export default interface Plugin {
  name: string;
  author: string;

  /**
   * Version strings should be in the format
   * major.minor.build, example: 1.0.0
   * 
   * This should not contain any other characters,
   * except numbers and a dot.
   */
  version: string;

  /**
   * All of this relates to the programming language (DSL)
   * built-in to this project.
   */
  languageFeatures?: {
    /**
     * This is a key-value pair of packages,
     * if you do not want to declare a object package,
     * you can instead use __global so that all values
     * within are placed in the global scope.
     */
    packages?: {[key: string]: Package}
  },

  /**
   * The locale repository for this plugin. This defines an object in
   * the i18n namespace plugins:plugin_name, however, keys in here
   * can be accessed by simply using there name, as plugins:plugin_name
   * will automatically be prefixed.
   * 
   * This object contains a list of langauges which those will contain
   * the language resources.
   * 
   * Example: { "en": { "my_key": "hello!" } }
   * Accessing it anywhere in your plugin would be done by example:
   * description: "my_key"
   * 
   * Note: Languages not used within the application will be ignored.
   */
  locale?: {[key: string]: langObject};
}

type langObject = {[key: string]: langObject | string};

export interface Package {
  /**
   * Define this if this package's values
   * should be callable from a value.
   * 
   * For example, if this value was "string", and
   * we defined "to_upper" in the values,
   * we could call it with:
   * "my_string".to_upper()
   * 
   * Note: the type that is being used will always
   * be the first paremeter of the function, so,
   * the following are the same:
   * 
   * strings.to_upper("my_string") 
   * "my_string".to_upper() 
   */
  prototypeFor?: ValueType;

  /**
   * Key-value pair of all the 
   * features of this package.
   * 
   * Note: all keys must be in
   * lowercase snake_case format.
   */
  values: {
    [key: string]: PackageValue,

    /**
     * This is used to declare values globally
     * instead of in the package name object.
     */
    __global?: PackageValue,
  };
}

export type PackageValue = PackageFunctionValue | PkgValue;
type NotFunction<T> = T extends FunctionCall ? never : T;

export interface PkgValue {
  value: NotFunction<LangaugeType>,
  description?: string;
}

export interface PackageFunctionValue {
  value: FunctionCall;
  description?: string;
  options: NativeFunctionOptions;

  /**
   * This will contain only the parameters, for example,
   * you have a function: strings.join, this field
   * should only be `"hello", " world"` and this will
   * be shown as `strings.join("hello", " world")
   */
  example?: string;
}

//#region Language related stuff

/**
 * This is the internal language types
 */
export type ValueType = "null"
  | "number"
  | "string"
  | "nativeFunction"
  | "object"
  | "boolean";

/**
 * This is for defining JavaScript types
 * to the langauge types
 */
export type LangaugeType = number
  | string
  | null
  | boolean
  | {[key: string]: LangaugeType}
  | FunctionCall;

export type NativeFunctionOptions = NativeFunctionOpt | NativeFunctionOptAll;

export interface NativeFunctionOpt {
  /**
   * A list of arguments that this function will take
   */
  args: NativeFunctionArgument[];
}

export interface NativeFunctionOptAll {
  /**
   * All arguments provided to this function must be
   * of this type
   */
  argsAllOfType: LangaugeType;
}

export interface NativeFunctionArgument {
  /**
   * The name of the function, this has no use but
   * to provide basic details to the user.
   */
  name: string;

  /**
   * The type that this argument must be of.
   */
  type: LangaugeType;
}

export type FunctionCall = (args: RuntimeValue[], environment: Environment) => Promise<RuntimeValue>;

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

//#endregion

export interface Environment {
  declareVariable: (name: string, value: RuntimeValue) => RuntimeValue;
}