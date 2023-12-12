import api, { NumberValue, StringValue } from "../../plugin_api/interface";

const pkg: api = {
  name: "base",
  author: "built-in",
  version: "0.0.1",
  languageFeatures: {
    packages: {
      __global: {
        values: {
          string: {
            description: "features.global.string.description",
            value: (args, environment) => {
              return {
                type: "string",
                value: (args[0] as any).value.toString(),
              }
            },
            options: {
              args: [{ type: "any", name: "to_convert" }]
            }
          }
        }
      },
      numbers: {
        values: {
          from: {
            description: "features.numbers.from.description",
            value: (args, environment) => {
              return {
                type: "number",
                value: parseFloat((args[0] as StringValue).value)
              }
            },
            options: {
              args: [{ name: "str", type: "string" }]
            }
          }
        }
      },
      strings: {
        prototypeFor: "string",
        values: {
          lower: {
            description: "features.strings.lower.description",
            value: (args, environment) => {
              return {
                type: "string",
                value: ((args[0] as StringValue).value ?? "").toLowerCase(),
              }
            },
            options: {
              args: [{ name: "str", type: "string" }]
            }
          },
          upper: {
            description: "features.strings.upper.description",
            value: (args, environment) => {
              return {
                type: "string",
                value: ((args[0] as StringValue).value ?? "").toUpperCase(),
              }
            },
            options: {
              args: [{ name: "str", type: "string" }]
            }
          },
          length: {
            description: "features.strings.length.description",
            value: (args, environment) => {
              return {
                type: "number",
                value: ((args[0] as StringValue).value ?? "").length
              }
            },
            options: {
              args: [{ name: "str", type: "string" }]
            }
          },
          join: {
            description: "features.strings.join.description",
            value: (args, environment) => {
              let done = args.map(x => (x as any)?.value || "").join("");
              return {
                type: "string",
                value: done,
              }
            },
            options: {
              argsAllOfType: "string",
            }
          },
          ends_with: {
            description: "features.strings.ends_with.description",
            value: (args, environment) => {
              return {
                type: "boolean",
                value: ((args[0] as StringValue).value).endsWith((args[1] as StringValue).value),
              }
            },
            options: {
              args: [{ name: "str_to_test", type: "string" }, { name: "str_test", type: "string" }]
            }
          },
          starts_with: {
            description: "features.strings.starts_with.description",
            value: (args, environment) => {
              return {
                type: "boolean",
                value: ((args[0] as StringValue).value).startsWith((args[1] as StringValue).value),
              }
            },
            options: {
              args: [{ name: "str_to_test", type: "string" }, { name: "str_test", type: "string" }]
            }
          },
        },
      },
    }
  },
  locale: {
    en: {
      features: {
        global: {
          string: {
            description: "Converts a value into a string"
          }
        },
        strings: {
          lower: {
            description: "Converts a string to lowercase"
          },
          upper: {
            description: "Converts a string to uppercase"
          },
          join: {
            description: "Joins multiple strings into one string"
          },
          length: {
            description: "Gives the length of a string as a number"
          },
        },
        numbers: {
          from: {
            description: "Creates a number from a given string"
          }
        }
      }
    }
  }
};

export default pkg;