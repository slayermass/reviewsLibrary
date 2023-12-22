// eslint-disable-next-line max-classes-per-file
import {
  endOfDay,
  format,
  formatDistanceStrict,
  fromUnixTime,
  getUnixTime,
  subMonths,
  toDate,
  parse,
} from "date-fns";
import { ru } from "date-fns/locale";

const currentLocale = ru;

abstract class ICDate {
  /**
   * unixtime текущего момента времени
   */
  static getUnixTime(date?: Date | number) {
    return getUnixTime(
      date instanceof Date || typeof date === "number" ? date : new Date(),
    );
  }

  /**
   * отнять от текущей даты месяцы
   * @param {number} months - кол-во месяцев. по-умолчанию - 1
   */
  static dateMinusMonths(months = 1) {
    return toDate(subMonths(new Date(), months));
  }

  /**
   * дата из unixtime
   * @param {number} unixTime - unixtime
   */
  static fromUnixTime(unixTime: number) {
    return fromUnixTime(unixTime);
  }

  /**
   * конец данного дня
   * по-умолчанию - текущий день
   */
  static endOfDay(date?: Date | number) {
    return endOfDay(
      date instanceof Date || typeof date === "number" ? date : new Date(),
    );
  }

  /**
   * форматирование передаваемой даты
   * @param date          - дата для форматирования
   * @param formatString  - строка форматирования (подробнее)
   */
  static format(date: Date | number, formatString: string): string {
    try {
      return format(date, formatString, {
        locale: currentLocale,
      });
    } catch (e) {
      const errorMsg = "Ошибка форматирования времени. Обратитесь в поддержку";
      // eslint-disable-next-line no-console
      console.error(errorMsg, e);
      return errorMsg;
    }
  }

  /**
   * @param date unixTime (*1000, если для js Date)
   */
  static timeLeft(date: number) {
    let cdate = date; // локальная дата. может изменяться
    const nowDate = new Date();
    const nowTimeStamp = Math.trunc(Date.now() / 1000);
    const oneDay = 24 * 60 * 60;
    const timeLeftInSeconds = date - nowTimeStamp;

    const formatDates = [];

    /** больше суток - добавить дни */
    if (timeLeftInSeconds >= oneDay) {
      formatDates.push(
        formatDistanceStrict(fromUnixTime(cdate), nowDate, {
          unit: "day",
          locale: currentLocale,
          roundingMethod: "floor",
        }),
      );

      const daysTo = Math.floor(timeLeftInSeconds / oneDay);
      cdate -= daysTo * oneDay;
    }

    /** часы добавлять всегда */
    formatDates.push(
      formatDistanceStrict(fromUnixTime(cdate), nowDate, {
        unit: "hour",
        locale: currentLocale,
        roundingMethod: "floor",
      }),
    );

    return formatDates.join(" ");
  }

  /** распарсить дату из любой строки с указанием формата строки */
  static parse(date: string, formatStr: string) {
    return parse(date, formatStr, new Date());
  }
}

/**
 * класс абстракции дат (фасад)
 * обращаться к специфичным для либ функциям дат только через него
 */
export class CDate extends ICDate {}
