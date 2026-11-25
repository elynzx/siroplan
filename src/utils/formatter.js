export function formatDate(dateString) {
  if (!dateString) {
    return "No Date";
  }
  const dateSegments = dateString.split("-");

  if (dateSegments.length !== 3) {
    return dateString;
  }

  const monthIndex = parseInt(dateSegments[1]) - 1;
  const day = parseInt(dateSegments[2]);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthDisplayName = months[monthIndex];

  return `${monthDisplayName} ${day}`;
}
