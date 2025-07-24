import React, { useEffect, useState } from 'react';
import { getAllPayments } from '../../api/paymentApi';
import type { Payment } from '../../types/payment';
import { Table, Tag, Select, message, Input, Button, Tooltip } from 'antd';
import { Copy, Eye } from 'lucide-react';

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
    {
      title: 'QR Code',
      dataIndex: 'qrCode',
      key: 'qrCode',
      width: 100,
      render: (qr: string) => qr ? (
        <Tooltip title="Copy mã QR">
          <Button type="link" onClick={() => handleCopy(qr)} size="small">QR</Button>
        </Tooltip>
      ) : '',
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      render: (_: any, record: Payment) => (
        <div className="flex space-x-2">
          <Tooltip title="Copy link thanh toán">
            <Button type="link" icon={<Copy />} onClick={() => record.checkoutUrl && handleCopy(record.checkoutUrl)} disabled={!record.checkoutUrl} />
          </Tooltip>
          <Tooltip title="Xem chi tiết">
            <Button type="link" icon={<Eye />} onClick={() => record.checkoutUrl && window.open(record.checkoutUrl, '_blank')} disabled={!record.checkoutUrl} />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Quản lý doanh thu</h1>
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <div>
            <span className="font-semibold">Tổng doanh thu thành công: </span>
            <span className="text-green-600 font-bold text-lg">{totalRevenue.toLocaleString('vi-VN')} VNĐ</span>
          </div>
          <div className="flex-1 flex gap-2 justify-end">
            <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 160 }}>
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="success">Thành công</Option>
              <Option value="pending">Chờ thanh toán</Option>
            </Select>
            <Input.Search
              placeholder="Tìm kiếm mã đơn, tên đơn..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: 240 }}
              allowClear
            />
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={filteredPayments}
          rowKey="_id"
          loading={loading}
          scroll={{ x: 900 }}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
};

export default AdminRevenue;