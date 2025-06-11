import type React from "react"
import { useState } from "react"
import { X } from "lucide-react"
import "../../styles/MeetingModal.css" // Ensure you have the correct path to your CSS file

interface FormData {
  name: string
  phone: string
  email: string
  message: string
}

interface MeetingModalProps {
  isOpen: boolean
  onClose: () => void
}

const MeetingModal: React.FC<MeetingModalProps> = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Reset form
    setFormData({ name: "", phone: "", email: "", message: "" })
    setIsSubmitting(false)

    // Show success message
    alert("Yêu cầu đặt lịch đã được gửi thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.")
    onClose()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">Đặt lịch tư vấn trực tuyến</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Đóng">
            <X size={24} />
          </button>
        </div>

        <p className="modal-description">Vui lòng điền thông tin để chúng tôi có thể hỗ trợ bạn tốt nhất</p>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Họ và tên <span className="required">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Nhập họ và tên của bạn"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              Số điện thoại <span className="required">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Nhập số điện thoại"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email (tùy chọn)
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Nhập địa chỉ email"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message" className="form-label">
              Nội dung cần tư vấn
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Mô tả ngắn gọn về vấn đề bạn cần tư vấn..."
              className="form-textarea"
              rows={4}
            />
          </div>

          <button type="submit" disabled={isSubmitting} className={`submit-btn ${isSubmitting ? "submitting" : ""}`}>
            {isSubmitting ? (
              <div className="loading-content">
                <div className="spinner"></div>
                Đang gửi...
              </div>
            ) : (
              "Gửi yêu cầu đặt lịch"
            )}
          </button>

          <div className="privacy-notice">
            <p>
              Thông tin của bạn sẽ được bảo mật tuyệt đối. <br />
              Chúng tôi sẽ liên hệ trong vòng 24h.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MeetingModal
