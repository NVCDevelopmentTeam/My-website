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

/**
 * Paginates an array of data.
 *
 * @param {any[]} data - The array of data to paginate.
 * @param {{ page?: number, limit: number }} args - Pagination parameters.
 * @returns {any[]} - The paginated array of data.
 */
export function paginate(data, { page = 1, limit } = {}) {
  // Validate input parameters
  if (!Array.isArray(data)) {
    throw new Error('Data must be an array');
  }
  if (typeof page !== 'number' || page < 1) {
    throw new Error('Page must be a positive number');
  }
  if (typeof limit !== 'number' || limit <= 0) {
    throw new Error('Limit must be a positive number');
  }

  // Calculate start and end indices for slicing
  const start = (page - 1) * limit;
  const end = page * limit;

  // Return the paginated array
  return data.slice(start, end);
}
