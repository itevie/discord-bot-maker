import Context from "../context"; 
import RuntimeError from "./RuntimeError";
import * as values from "./values";
import Location from "../lexer/Location";

export default class Environment {
  private parent: Environment | undefined;
  private variables: Map<string, values.RuntimeValue> = new Map();
  private context: Context | undefined;

  constructor(contextOrParent: Context | Environment) {
    if (contextOrParent instanceof Environment) {
      this.parent = contextOrParent;
    } else {
      this.context = contextOrParent;

      // Setup context
      for (const i of Object.keys(contextOrParent.variables)) {
        this.declareVariable(i, values.createValue(contextOrParent.variables[i]));
      }

      this.setupGlobals();
    }
  }

  private setupGlobals() {
    this.declareVariable("true", values.createBoolean(true));
    this.declareVariable("false", values.createBoolean(false));
    this.declareVariable("yes", values.createBoolean(true));
    this.declareVariable("no", values.createBoolean(false));
  }

  public lookupVariable(name: string, location: Location): values.RuntimeValue {
    // Check if this env has it
    if (this.variables.has(name))
      return this.variables.get(name);
    else if (this.parent && this.parent.variables.has(name))
      return this.parent.variables.get(name);

    // No env has this identifier
    throw new RuntimeError(`Cannot find the variable: ${name}`, location);
  }

  public declareVariable(name: string, value: values.RuntimeValue) {
    this.getContext().langLogger.log(`lang env: declared ${name} with type ${value.type}`);
    this.variables.set(name, value);
  }

  public getContext(): Context {
    if (!this.context)
      return this.parent.getContext();
    return this.context;
  }
}