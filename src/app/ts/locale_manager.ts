import * as _i18next from '../node_modules/i18next/dist/esm/i18next.js';
import type i18nextType from "../node_modules/i18next/index.d.ts";
import { TFunction } from '../node_modules/i18next/index.v4.js';
import ipc from './ipc.js';
const i18next = _i18next as typeof i18nextType;

export let translator: TFunction;
export let languages = [];

export default function init(defaultNamespace: string, onReady: (() => void) | null = null) {
  console.log("Init locale...");

  const namespaces = ipc.loadi18nNamespaces();
  const data = {};

  for (const namespace of namespaces) {
    if (!data[namespace.lng]) {
      data[namespace.lng] = {};
      languages.push(namespace.lng);
    }
    if (!data[namespace.lng][namespace.ns]) data[namespace.lng][namespace.ns] = namespace.data;
  }

  i18next.init({
    debug: true,
    lng: ipc.getCurrentLanguage(),
    fallbackLng: "en",
    resources: data,
    defaultNS: defaultNamespace,
    fallbackNS: "global",
    interpolation: {
      skipOnVariables: false
    }
  }).then(function(t) {
    translator = t as any;
    updateTranslations();
    if (onReady)
      onReady();
  });
}

export function translateElement(element: HTMLElement, data: {[key: string]: string} = {}): void {
  if (!translator) {
    console.log("Deferring translation for element as translator not ready", element);
    setTimeout(() => {
      translateElement(element, data);
    }, 100);
    return;
  }

  // Update text content
  if (element.hasAttribute('data-i18n-text')) {
    (element).innerHTML = translator(element.getAttribute("data-i18n-text"), data);
  }

  // Update attributes
  element.getAttributeNames().forEach(function (attribute) {
    if (attribute.startsWith('data-i18n-')) {
      var attrName = attribute.replace('data-i18n-', '');
      element.setAttribute(attrName, translator(element.getAttribute(attribute), data));
    }
  });
}

export function translateKey(key: string, data: {[key: string]: string}) {
  return translator(key, data);
}

export function translateKeyOr(key: string, data: {[key: string]: string}, or: string) {
  if (i18next.exists(key)) return translator(key, data);
  return or;
}

export function translateElements(elements: HTMLElement[], data: {[key: string]: string} = {}) {
  for (const element of elements)
    translateElement(element, data);
} 

export function updateTranslations(forElement: HTMLElement | null = null) {
  let element = forElement || document;
  // Find all elements with data-i18n attribute
  var elements = [...element.querySelectorAll('*')]
    .filter(el => [...el.attributes]
      .filter(
        ({name}) => name.startsWith("data-i18n")
      ).length > 0
    );

  // Update content and attributes for each element
  elements.forEach(function (element) {
    translateElement(element as HTMLElement);
  });
}

