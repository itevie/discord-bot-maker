import { DError } from "./ipc";

export function createLocation(data: DError): string {
  return `${data.location.charStart}-${data.location.charEnd} ln ${data.location.line}`;
}