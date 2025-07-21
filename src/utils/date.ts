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
