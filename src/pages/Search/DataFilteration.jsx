import { format } from "date-fns";

const filterExpenses = (expenses, query) => {
  const trimmedQuery = query.trim().toLowerCase();
  if (!trimmedQuery) return [];

  return expenses.filter((expense) => {
    const timestamp = expense.timestamp?.toDate?.() || expense.timestamp;

    // Match amount
    const amountQuery = parseFloat(trimmedQuery);
    if (!isNaN(amountQuery) && expense.amount === amountQuery) return true;

    // Match date
    const dateFormats = [
      format(timestamp, 'MMM d'),
      format(timestamp, 'MMMM d'),
      format(timestamp, 'd MMM'),
      format(timestamp, 'd MMMM'),
      format(timestamp, 'MM/dd'),
      format(timestamp, 'yyyy-MM-dd')
    ];
    if (dateFormats.some(date => date.toLowerCase().includes(trimmedQuery))) return true;

    // Match note or category
    return expense.note?.toLowerCase().includes(trimmedQuery) ||
           expense.category?.toLowerCase().includes(trimmedQuery);
  });
};

export default filterExpenses;
