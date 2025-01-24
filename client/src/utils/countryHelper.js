// src/utils/countryHelper.js
import countries from "./countries";

export const getCountryData = (countryNameOrCode) => {
  if (!countryNameOrCode) return null;

  return countries.find(
    (country) =>
      country.name === countryNameOrCode || country.code === countryNameOrCode
  );
};

// In countryHelper.js
export const normalizeCountryData = (countryInput) => {
  if (!countryInput) return null;

  const countryData = getCountryData(countryInput);
  if (!countryData) return countryInput; // fallback to original input

  return {
    code: countryData.code,
    name: countryData.name,
    flag: countryData.flag,
  };
};
