import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Reminder: React.FC = () => {
  useEffect(() => {
    // Giả lập nhắc nhở
    const checkReminders = () => {
      const now = new Date();
      if (now.getHours() === 8) {
        toast.info('Đã đến giờ uống thuốc ARV!');
      }
      if (now.getDate() === 15) {
        toast.info('Nhắc nhở: Lịch tái khám vào ngày mai!');
      }
    };

    const interval = setInterval(checkReminders, 60000); // Kiểm tra mỗi phút
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default Reminder;