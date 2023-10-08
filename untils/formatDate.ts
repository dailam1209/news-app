export const formatDate = inputDate => {
    const givenTimestamp: any = new Date(inputDate);

    // Current timestamp
    const currentTimestamp: any = new Date();
    
    // Calculate the time difference in milliseconds
    const timeDifference = (currentTimestamp - givenTimestamp)
    
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


// Hàm chuyển đổi định dạng thời gian
export function formatTime(timeDate) {
  // Chuỗi thời gian từ dữ liệu
  const createAt = timeDate;
  
  // Chuyển chuỗi thời gian thành đối tượng Date
  const createTime: any = new Date(createAt);
  
  // Thời gian hiện tại
  const currentTime: any = new Date();
  
  // Tính khoảng thời gian giữa thời gian hiện tại và thời gian tạo
  const timeDifference = currentTime - createTime;
  if (timeDifference < 86400000) { // 86400000 milliseconds = 1 ngày
    // Nếu thời gian cách đây ít hơn 1 ngày, format thành giờ và phút
    const hours = createTime.getHours();
    const minutes = createTime.getMinutes();
    return `${hours}:${minutes}`;
  } else {
    // Nếu thời gian cách đây hơn 1 ngày, format thành tháng và ngày
    const month = createTime.getMonth() + 1; // Tháng trong JavaScript là từ 0-11
    const day = createTime.getDate();
    return `${month}/${day}`;
  }
}



