import {formatDistance, subDays} from 'date-fns';

export const formatDate = inputDate => {
    const givenTimestamp = new Date(inputDate);

    // Current timestamp
    const currentTimestamp = new Date();
    
    // Calculate the time difference in milliseconds
    const timeDifference = currentTimestamp - givenTimestamp;
    
    // Calculate the difference in days
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    
    // Check if the difference is less than 2 days
    if (daysDifference < 2) {
      return '1 days ago'
    } else {
      // Otherwise, return the number of days
      return `${daysDifference} days ago`
    }
}
