import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const status = params.get("status");
  const orderCode = params.get("orderCode");

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ padding: "80px", textAlign: "center" }}>
      <h1 style={{ color: "#22c55e" }}>🎉 Thanh toán thành công!</h1>
      <p>Mã đơn hàng: <b>{orderCode}</b></p>
      <p>Trạng thái: <b>{status}</b></p>
      <p>Đang chuyển về trang chủ...</p>
    </div>
  );
};

export default PaymentSuccess;
