import { translateKey, translator } from "../locale_manager.js";

let units = {
  day: 8.64e+7,
  hour: 3.6e+6,
  minute: 60000,
  second: 1000,
}

interface IUnits {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function formatMilliseconds(units: IUnits) {
  return translateKey("time.pretty", {
    days: translator("time.units.day", { count: units.days }),
    hours: translator("time.units.hour", { count: units.hours }),
    minutes: translator("time.units.minute", { count: units.minutes }),
    seconds: translator("time.units.second", { count: units.seconds }),
  });
}

export function gatherUnits(time: number): IUnits {
  let days = 0;
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  // Do days
  days = Math.round(time / units.day);
  time = time % units.day;

  // Do Hours
  hours = Math.round(time / units.hour);
  time = time % units.hour;

  // Do Hours
  minutes = Math.round(time / units.minute);
  time = time % units.minute;

  // Do Hours
  seconds = Math.round(time / units.second);
  time = time % units.second;

  return {
    days,
    hours,
    minutes,
    seconds,
  }
}