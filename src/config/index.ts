export const defaultSizeByPageTable = [3, 10, 25, 50, 100]; // выбор кол-ва записей на странице в таблицы
export const defaultSizePageTable = defaultSizeByPageTable[1]; // значение количества по-умолчанию для вывода в таблицы
export const ratingList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // возможные оценки обзоров

export const EMAIL_PATTERN =
  // eslint-disable-next-line max-len
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/;
