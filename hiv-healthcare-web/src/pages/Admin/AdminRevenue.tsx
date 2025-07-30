import React, { useEffect, useState } from 'react';
import { getAllPayments } from '../../api/paymentApi';
import type { Payment } from '../../types/payment';
import { Table, Tag, Select, message, Input } from 'antd';
import {  DollarSign, CheckCircle, Clock } from 'lucide-react';

const { Option } = Select;

const AdminRevenue: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const data = await getAllPayments();
      setPayments(Array.isArray(data) ? data : []);
    } catch (err: any) {
      message.error(err.message || 'Lỗi khi lấy danh sách thanh toán');
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('Đã copy link thanh toán!');
  };

  const filteredPayments = (Array.isArray(payments) ? payments : []).filter((p) => {
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchSearch =
      p.orderCode.toString().includes(search) ||
      (p.orderName && p.orderName.toLowerCase().includes(search.toLowerCase()));
    return matchStatus && matchSearch;
  });

  const totalRevenue = (Array.isArray(payments) ? payments : [])
    .filter((p) => p.status === 'success')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Đang tải danh sách giao dịch...</p>
        </div>
      </div>
    );
  }

  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'orderCode',
      key: 'orderCode',
      width: 120,
    },
    {
      title: 'Tên đơn hàng',
      dataIndex: 'orderName',
      key: 'orderName',
      width: 200,
      render: (text: string) => <span title={text}>{text}</span>,
    },
    {
      title: 'Số tiền (VNĐ)',
      dataIndex: 'amount',
      key: 'amount',
      width: 140,
      render: (amount: number) => amount ? amount.toLocaleString('vi-VN') : '',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status: string) => (
        <Tag color={status === 'success' ? 'green' : 'orange'}>
          {status === 'success' ? 'Thành công' : 'Chờ thanh toán'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 170,
      render: (date: string) => new Date(date).toLocaleString('vi-VN'),
    },
    // ĐÃ XÓA CỘT 'QR Code' và 'Hành động'
  ];

  return (
    // THAY ĐỔI Ở ĐÂY: Thêm background gradient
    <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-teal-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow flex flex-col md:flex-row md:items-center md:justify-between p-8 mb-8 gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Quản lý doanh thu</h1>
              <p className="text-base text-gray-600">Theo dõi và quản lý các giao dịch thanh toán trong hệ thống</p>
            </div>
          </div>
        </div>
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Tổng doanh thu thành công</p>
                <p className="text-3xl font-bold text-green-600">{totalRevenue.toLocaleString('vi-VN')} VNĐ</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Đã thanh toán</p>
                <p className="text-3xl font-bold text-blue-600">
                  {payments.filter(p => p.status === 'success').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Chờ thanh toán</p>
                <p className="text-3xl font-bold text-amber-600">
                  {payments.filter(p => p.status === 'pending').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input.Search
                  placeholder="Tìm kiếm theo mã đơn, tên đơn hàng..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full"
                  size="large"
                  allowClear
                />
              </div>
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                className="w-full md:w-[200px]"
                size="large"
                placeholder="Trạng thái"
              >
                <Option value="all">Tất cả trạng thái</Option>
                <Option value="success">Thành công</Option>
                <Option value="pending">Chờ thanh toán</Option>
              </Select>
            </div>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={filteredPayments}
          rowKey="_id"
          loading={loading}
          // Xóa scroll X nếu các cột bị xóa làm giảm tổng chiều rộng
          // Nếu bạn có nhiều cột hơn trong tương lai, hãy cân nhắc lại thuộc tính này
          // scroll={{ x: 900 }} 
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
};

export default AdminRevenue;