/**
 * Used to initialise all the components on the current page
 */
export function init() {
  const material = (window as any).mdc as any;

  // Initialise MDC components
  const buttons = document.querySelectorAll('.mdc-button, .mdc-list-item, .mdc-deprecated-list-item') as any;
  for (const button of buttons) {
    material.ripple.MDCRipple.attachTo(button);
  }

  const textFields = document.querySelectorAll('.mdc-text-field') as any;
  for (const textField of textFields) {
    material.textField.MDCTextField.attachTo(textField);
  }

  const lists = document.querySelectorAll(".mdc-list") as any;
  for (const list of lists) {
    material.list.MDCList.attachTo(list);
  }

  const drawers = document.querySelectorAll(".mdc-drawer") as any;
  for (const drawer of drawers) {
    material.drawer.MDCDrawer.attachTo(drawer);
  }
}