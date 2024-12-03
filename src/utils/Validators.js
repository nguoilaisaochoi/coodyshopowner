export const validateEmail = email => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePass = password => {
  return password.length > 5;
};

export const validatePhone = phone => {
  const phoneRegex = /^0\d{9,9}$/;
  return phoneRegex.test(phone);
};

//chuyển số sang dạng tiền
export const formatCurrency = amount => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

export const handleChangeText = text => {
  // Loại bỏ các ký tự không phải là số
  const numericText = text.replace(/[^0-9]/g, '');
  return numericText; // Trả về giá trị đã xử lý
};
/*

/: Đây là ký hiệu bắt đầu và kết thúc của một biểu thức chính quy trong JavaScript.
Dấu ^ ở đầu bên trong dấu ngoặc vuông [] có nghĩa là "không phải". 
0-9 đại diện cho tất cả các ký tự số từ 0 đến 9.
Do đó, [^0-9] có nghĩa là "tất cả các ký tự không phải là số".
g: Đây là một cờ (flag) cho biết rằng tìm kiếm sẽ được thực hiện toàn bộ chuỗi (global).
 Nếu không có cờ này, chỉ có lần xuất hiện đầu tiên của ký tự không phải số sẽ được thay thế.

*/