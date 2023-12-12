import ipc from "../ipc.js";
import { translateKey, translateKeyOr } from "../locale_manager.js";

let plugins;

export default function init() {
  plugins = ipc.getPluginList();
  render();

  document.getElementById("plugin-search").addEventListener("keyup", () => {
    render((document.getElementById("plugin-search") as HTMLInputElement).value);
  });

  document.getElementById("plugin-search").addEventListener("keypress", () => {
    render((document.getElementById("plugin-search") as HTMLInputElement).value);
  });

  document.getElementById("plugin-search").addEventListener("keydown", () => {
    render((document.getElementById("plugin-search") as HTMLInputElement).value);
  });
}

function render(query: string | null = null) {
  const queried = structuredClone(plugins);

  if (query) {
    for (const plugin in queried) {
      let keepPlugin = false;

      // Check packages
      if (queried[plugin].languageFeatures) {
        // Check pacakges
        for (const f in queried[plugin].languageFeatures) {
          const feature = queried[plugin].languageFeatures[f];
          let keepFeature = false;

          // Check name
          if (f.toLowerCase() === query.toLowerCase())
            keepFeature = true;

          // Check values
          for (const v in feature.values) {
            //if (keepFeature) continue;
            const value = feature.values[v];
            let keepValue = false;

            // Check items
            if (testQuery([v, value.description], query))
              keepValue = true;

            // Check if should delete
            if (!keepValue)
              delete feature.values[v];
            else keepFeature = true;
          }

          if (!keepFeature)
            delete queried[plugin].languageFeatures[f];
          else keepPlugin = true;
        }
      }

      // Check for plugin name, author
      if (testQuery([plugins[plugin].name, plugins[plugin].author], query))
        keepPlugin = true;

      if (!keepPlugin) delete queried[plugin];
    }
  }

  // Fucking monstor of a whatever the fuck this is
  const container =
    createContainer(
      iterate(queried, (pluginKey, pluginValue) => 
        createBaseContainer([
          createLabel(pluginValue.name),
          createContainer([
            createLabel(translateKey(`plugins.info.author`, { author: pluginValue.author })),
            createLabel(translateKey(`plugins.info.version`, { version: pluginValue.version })),
            !pluginValue.languageFeatures ? null : createBaseContainer([
              createLabel(translateKey("plugins.info.language_features", {})),
              createContainer(
                iterate(pluginValue.languageFeatures, (featureKey, featureValue) =>
                  createBaseContainer([
                    createLabel(featureKey),
                    createContainer(
                      iterate(featureValue.values, (valueKey, valueValue) =>
                        createBaseContainer([
                          createLabel(valueKey),
                          createContainer([
                            createLabel(translateKeyOr(`plugins:${pluginKey}.${valueValue.description}`, {}, valueValue.description)),
                            createCode(`${featureKey !== "__global" ? `${featureKey}.` : ""}${valueKey}`),
                          ])
                        ])
                      )
                    )
                  ])
                )
              )
            ])
          ])
        ])
      )
    );

  // Set to container
  const pluginContainer = document.getElementById("plugin-container");
  pluginContainer.innerHTML = "";
  pluginContainer.appendChild(container);
}

function testQuery(arrays: string[], query: string): boolean {
  for (const item of arrays) {
    if (item.toLowerCase().includes(query.toLowerCase()))
      return true;
  }

  return false;
}

function iterate(object: {[key: string]: any}, cb: (key: string, value: any) => HTMLElement): HTMLElement[] {
  const elements: HTMLElement[] = [];
  for (const i in object) {
    elements.push(cb(i, object[i]));
  }
  return elements;
}

function createLabel(text: string): HTMLElement {
  const label = document.createElement("label");
  label.style.display = "block";
  label.innerHTML = text;
  return label;
}

function createCode(text: string): HTMLElement {
  const label = document.createElement("code");
  label.style.display = "block";
  label.innerHTML = text;
  return label;
}

function createBaseContainer(elements: (HTMLElement | null)[]): HTMLElement {
  const div = document.createElement("div");
  div.classList.add("plugin-base");

  for (const element of elements)
  if (element !== null) div.appendChild(element);

  return div;
}

function createContainer(elements: (HTMLElement | null)[]): HTMLElement {
  const div = document.createElement("div");

  for (const element of elements)
    if (element !== null) div.appendChild(element);

  return div;
}