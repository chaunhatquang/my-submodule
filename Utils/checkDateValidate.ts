import moment from 'moment';

export const formatDate = (date: string) => {
  // Tạo đối tượng Date từ chuỗi đầu vào
  const dateInit = new Date(date);

  // Lấy ngày, tháng và năm từ đối tượng Date
  const day = dateInit.getDate().toString().padStart(2, '0');
  const month = (dateInit.getMonth() + 1).toString().padStart(2, '0');
  const year = dateInit.getFullYear();

  // Ghép ngày, tháng và năm thành chuỗi theo định dạng dd/mm/yyyy
  return `${day}/${month}/${year}`;
}
  