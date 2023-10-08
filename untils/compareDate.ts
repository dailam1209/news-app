export const compareDate = (date: Date) => {
    const dateToCompare = new Date(date);
    const currentDate = new Date();
    
    // Compare the two dates
    if (dateToCompare > currentDate) {
      return true;
    } else {
      return false;
    }
}