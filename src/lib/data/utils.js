/**
 * Format a date string into a more readable format.
 * 
 * @param {string} dateString - The date string to format.
 * @returns {string} - The formatted date.
 */
export function formatDate(dateString) {
  // Check if the input is a valid date string
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date string: ${dateString}`);
  }

  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}

