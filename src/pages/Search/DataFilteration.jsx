import { format, parse, parseISO } from "date-fns";

const filterExpenses = (expenses, query) => {
  const trimmedQuery = query.trim().toLowerCase();
  if (!trimmedQuery) return [];

  // Filter expenses
  const filtered = expenses.filter((expense) => {
    // Safely handle timestamp
    let timestamp;
    try {
      // Handle Firestore Timestamp
      if (expense.timestamp?.toDate) {
        timestamp = expense.timestamp.toDate();
      }
      // Handle string timestamps
      else if (typeof expense.timestamp === "string") {
        const parsed =
          parseISO(expense.timestamp) || // ISO 8601 (e.g., "2025-05-12T05:21:15.127Z")
          parse(expense.timestamp, "dd/MM/yyyy", new Date()) || // e.g., "12/05/2025"
          parse(expense.timestamp, "yyyy-MM-dd", new Date()) || // e.g., "2025-05-12"
          parse(expense.timestamp, "dd-MM-yyyy", new Date()); // e.g., "12-05-2025"
        timestamp = isNaN(parsed) ? null : parsed;
      }
      // Handle JavaScript Date or other cases
      else {
        timestamp = expense.timestamp;
      }

      // Validate timestamp
      if (!(timestamp instanceof Date) || isNaN(timestamp)) {
        timestamp = null; // Invalid date, skip date matching
      }
    } catch (error) {
      timestamp = null; // Handle any conversion errors
    }

    // Store parsed timestamp for sorting
    expense._parsedTimestamp = timestamp;

    // Match amount (exact match)
    const amountQuery = parseFloat(trimmedQuery);
    if (!isNaN(amountQuery) && expense.amount === amountQuery) return true;

    // Match date, month, or year (only if timestamp is valid)
    if (timestamp) {
      const dateFormats = [
        format(timestamp, "MMM d"), // e.g., "May 12"
        format(timestamp, "MMMM d"), // e.g., "May 12"
        format(timestamp, "d MMM"), // e.g., "12 May"
        format(timestamp, "d MMMM"), // e.g., "12 May"
        format(timestamp, "MM/dd"), // e.g., "05/12"
        format(timestamp, "yyyy-MM-dd"), // e.g., "2025-05-12"
        format(timestamp, "MMM d, yyyy"), // e.g., "May 12, 2025"
        format(timestamp, "dd/MM/yyyy"), // e.g., "12/05/2025"
        format(timestamp, "MMM"), // e.g., "May"
        format(timestamp, "MMMM"), // e.g., "May"
        format(timestamp, "yyyy"), // e.g., "2025"
      ];
      if (dateFormats.some((date) => date.toLowerCase().includes(trimmedQuery))) return true;
    }

    // Match note or category (partial match)
    return (
      expense.note?.toLowerCase().includes(trimmedQuery) ||
      expense.category?.toLowerCase().includes(trimmedQuery)
    );
  });

  // Sort filtered expenses by timestamp (newest to oldest)
  return filtered.sort((a, b) => {
    const timeA = a._parsedTimestamp;
    const timeB = b._parsedTimestamp;

    // Handle null timestamps (place at the end)
    if (!timeA && !timeB) return 0;
    if (!timeA) return 1;
    if (!timeB) return -1;

    // Sort newest to oldest
    return timeB.getTime() - timeA.getTime();
  });
};

export default filterExpenses;