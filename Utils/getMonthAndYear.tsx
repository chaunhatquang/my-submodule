export function extractYearAndMonth(dateString: string) {
    const dateParts = dateString.split(" ")[0].split("/");
    const month = parseInt(dateParts[0]);
    const year = parseInt(dateParts[2]);

    return { year, month };
}