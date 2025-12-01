export const formatDateToReadable = (dateString: string) => {
  try {
    // Handle ISO 8601 timestamps (e.g., "2025-07-21T21:42:55.487087+00:00")
    if (dateString.includes("T")) {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
      }
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }

    // Handle simple date strings (e.g., "2025-07-21")
    const [year, month, day] = dateString.split("-").map(Number);

    // Validate the date components
    if (
      !year ||
      !month ||
      !day ||
      year < 1000 ||
      year > 9999 ||
      month < 1 ||
      month > 12 ||
      day < 1 ||
      day > 31
    ) {
      throw new Error("Invalid date components");
    }

    const date = new Date(year, month - 1, day); // month is 0-indexed in Date constructor

    // Check if the date is valid (handles edge cases like Feb 30)
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      throw new Error("Invalid date");
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return "Invalid Date";
  }
};

// Helper function to get first day of current month in YYYY-MM-DD format
export const getFirstDayOfMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}-01`;
};

// Helper function to get last day of current month in YYYY-MM-DD format
export const getLastDayOfMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const lastDay = new Date(year, month, 0).getDate();
  return `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(
    2,
    "0"
  )}`;
};

// Helper function to get first day of a specific month/year as Date
// month is 0-indexed (0-11)
export const getFirstDayOfMonthDate = (year: number, month: number): Date => {
  return new Date(year, month, 1);
};

// Helper function to get last day of a specific month/year as Date
// month is 0-indexed (0-11)
export const getLastDayOfMonthDate = (year: number, month: number): Date => {
  return new Date(year, month + 1, 0);
};

export const getCurrentDateInYYYYMMDD = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Update to handle timestamps
export const getYYYYMMDDFromDate = (date: Date | string) => {
  // If it's a string, try to parse it directly to avoid timezone issues
  if (typeof date === "string") {
    // Handle YYYY-MM-DD format (and similar variations)
    const dateMatch = date.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (dateMatch) {
      const [, year, month, day] = dateMatch;
      return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
        2,
        "0"
      )}`;
    }

    // Handle other formats by parsing and using local date components
    // This handles timestamps and other date string formats
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      throw new Error("Invalid date string");
    }
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // If it's a Date object, use local date components
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
