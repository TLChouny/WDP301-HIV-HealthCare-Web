import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Tag, Button, message, Spin } from 'antd';
import { ArrowLeft, DollarSign, Calendar, User, Phone, Mail, CreditCard, Clock } from 'lucide-react';
import { getPaymentByOrderCode, getAllPayments } from '../../api/paymentApi';
import type { Payment } from '../../types/payment';
import type { Booking } from '../../types/booking';

const AdminRevenueDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPaymentDetail();
    }
  }, [id]);

  const fetchPaymentDetail = async () => {
    setLoading(true);
    try {
      // Sử dụng getPaymentByOrderCode thay vì getPaymentById
      const response = await getPaymentByOrderCode(id!);
      // Kiểm tra nếu response có structure { error: 0, data: payment }
      if (response && typeof response === 'object' && 'data' in response) {
        setPayment(response.data as Payment);
      } else {
        setPayment(response as Payment);
      }
    } catch (err: any) {
      // Nếu không có endpoint, thử lấy từ danh sách payments
      try {
        const allPayments = await getAllPayments();
        const foundPayment = allPayments.find((p: Payment) => p.orderCode.toString() === id);
        if (foundPayment) {
          setPayment(foundPayment);
        } else {
          throw new Error('Không tìm thấy thông tin thanh toán');
        }
      } catch (secondErr: any) {
        message.error('Lỗi khi lấy thông tin chi tiết thanh toán');
        navigate('/admin/revenue');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50">
        <div className="text-center">
          <Spin size="large" />
          <p className="text-lg text-gray-600 mt-4">Đang tải thông tin chi tiết...</p>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50">
        <div className="text-center">
          <p className="text-lg text-gray-600">Không tìm thấy thông tin thanh toán</p>
          <Button type="primary" onClick={() => navigate('/admin/revenue')} className="mt-4">
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  const booking = Array.isArray(payment?.bookingIds) && 
                   payment.bookingIds.length > 0 && 
                   typeof payment.bookingIds[0] === 'object' 
                   ? payment.bookingIds[0] as Booking 
                   : null;

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-teal-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                type="text"
                icon={<ArrowLeft className="h-5 w-5" />}
                onClick={() => navigate('/admin/revenue')}
                className="text-gray-600 hover:text-gray-900"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Chi tiết giao dịch thanh toán</h1>
                <p className="text-gray-600">Thông tin chi tiết về giao dịch thanh toán</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Tag color={payment.status === 'success' ? 'green' : 'orange'} className="text-sm font-medium">
                {payment.status === 'success' ? 'Thành công' : 'Chờ thanh toán'}
              </Tag>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <Card title="Thông tin giao dịch" className="mb-6 shadow-lg">
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Mã giao dịch" span={2}>
              <span className="font-mono text-sm">{payment.paymentID}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Mã đơn hàng">
              <span className="font-medium">{payment.orderCode}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Tên đơn hàng">
              <span>{payment.orderName}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Số tiền">
              <span className="text-lg font-bold text-green-600">
                {payment.amount?.toLocaleString('vi-VN')} VNĐ
              </span>
            </Descriptions.Item>
                         <Descriptions.Item label="Ngày tạo">
               <span>{payment.createdAt ? new Date(payment.createdAt).toLocaleString('vi-VN') : '---'}</span>
             </Descriptions.Item>
             <Descriptions.Item label="Ngày thanh toán">
               <span>
                 {payment.status === 'success' && payment.updatedAt 
                   ? new Date(payment.updatedAt).toLocaleString('vi-VN') 
                   : '---'}
               </span>
             </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Customer Information */}
        <Card title="Thông tin khách hàng" className="mb-6 shadow-lg">
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Tên khách hàng">
              <span className="font-medium">{booking?.customerName || '---'}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                {booking?.customerEmail || '---'}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                {booking?.customerPhone || '---'}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Mã đặt lịch">
              <span className="font-mono text-sm">{booking?.bookingCode || '---'}</span>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Appointment Information */}
        <Card title="Thông tin lịch hẹn" className="mb-6 shadow-lg">
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Bác sĩ">
              <span className="font-medium">{booking?.doctorName || '---'}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày khám">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                {booking?.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('vi-VN') : '---'}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian bắt đầu">
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                {booking?.startTime || '---'}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian kết thúc">
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                {booking?.endTime || '---'}
              </span>
            </Descriptions.Item>
                         <Descriptions.Item label="Ghi chú" span={2}>
               <span>{booking?.notes || 'Không có ghi chú'}</span>
             </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            type="primary"
            onClick={() => navigate('/admin/revenue')}
            icon={<ArrowLeft className="h-4 w-4" />}
            size="large"
          >
            Quay lại danh sách
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminRevenueDetail;