import i18n from "i18next";
import { useCallback } from "react";
import { initReactI18next, useTranslation } from "react-i18next";
import Backend from "i18next-http-backend";

const options = {
  ns: ["index"],
  defaultNS: "index", // all old locales are placed here until they moved to separate files

  backend: {
    allowMultiLoading: false, // we don't need this
    loadPath: (lng: string[], rawNS: string[]) => {
      /**
       * replace dots in the namespace in order to get files inside folders
       *
       * const { t } = useTranslation('folder1.folder2.folder3.fileName');
       * will find a file in path
       * folder1
       *   folder2
       *      folder3
       *        fileName.json
       * */
      const ns = rawNS[0].replaceAll(".", "/");

      return `/locales/${lng}/${ns}.json`;
    },
  },
};

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    lng: "en",

    ...(process.env.NODE_ENV === "test" ? {} : options),

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: process.env.NODE_ENV !== "test",
    },
  });

export default i18n;

export type THelperType = (
  add: string,
  params?: Record<string, string | number>,
) => string;

/**
 * helper to use in long translation strings
 * accepts base and dynamic parts
 */
export const useTHelper = (baseString: string): THelperType => {
  const { t } = useTranslation();

  return useCallback(
    (add, params) => t(`${baseString}.${add}`, params),
    [t, baseString],
  );
};

export const useNsTHelper = (ns: string, keyPrefix?: string): THelperType =>
  useTranslation(ns, { keyPrefix }).t;
