import { format, getTime } from 'date-fns';

/**
 *
 * @param {string} str
 * @param {string} type
 */

export function formatDate(str, type) {
    const date = new Date(str);
    return format(date, type);
}
/**
 *
 * @param {string} str
 */
export function getMillisecondsFromDate(str) {
    const date = new Date(str)
    return getTime(date);
}
