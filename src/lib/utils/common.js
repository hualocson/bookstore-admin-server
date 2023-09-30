import { camelCase, isArray, isPlainObject, transform } from "lodash";

/**
 *
 * camelize
 */
export const camelize = (obj) =>
  transform(obj, (acc, value, key, target) => {
    const camelKey = isArray(target) ? key : camelCase(key);
    if (isPlainObject(value) || isArray(value)) {
      acc[camelKey] = camelize(value);
    } else {
      acc[camelKey] = value;
    }
  });

/**
 * Generate slug with given string
 * @param {string} str
 * @returns {string}
 */
export const slugify = (str) => {
  return str
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
};
