export function translateBookingStatus(status: string): string {
  switch (status) {
    case 'confirmed':
      return 'Đã xác nhận';
    case 'pending':
      return 'Chờ xác nhận';
    case 'cancelled':
      return 'Đã huỷ';
    case 'checked-in':
      return 'Đã điểm danh';
    case 'completed':
      return 'Hoàn thành';
    default:
      return status;
  }
}
