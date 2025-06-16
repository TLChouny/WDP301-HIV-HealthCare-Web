import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Search,
  Clock,
  User,
  Building2,
  Stethoscope,
  FileText,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  specialization: string[];
  availableTimeSlots: TimeSlot[];
  room: string;
}

interface TimeSlot {
  start: string;
  end: string;
  isAvailable: boolean;
}

interface Room {
  id: string;
  name: string;
  type: 'consultation' | 'examination' | 'counseling';
  isAvailable: boolean;
}

interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  medicalHistory?: string;
}

const StaffAppointmentScheduler: React.FC = () => {
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [appointmentReason, setAppointmentReason] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);

  // Mock data - In real application, this would come from an API
  useEffect(() => {
    // Simulate API calls to fetch data
    setDoctors([
      {
        id: '1',
        name: 'BS. Nguyễn Văn A',
        specialization: ['HIV/AIDS', 'Infectious Diseases'],
        availableTimeSlots: [
          { start: '09:00', end: '09:30', isAvailable: true },
          { start: '09:30', end: '10:00', isAvailable: true },
          { start: '10:00', end: '10:30', isAvailable: false },
        ],
        room: '101'
      },
      // Add more doctors...
    ]);

    setRooms([
      {
        id: '1',
        name: 'Phòng 101',
        type: 'consultation',
        isAvailable: true
      },
      // Add more rooms...
    ]);

    setPatients([
      {
        id: '1',
        name: 'Nguyễn Văn B',
        phone: '0123 456 789',
        email: 'nguyenvanb@example.com',
        medicalHistory: 'HIV positive since 2020'
      },
      // Add more patients...
    ]);
  }, []);

  const handlePatientSearch = (query: string) => {
    setSearchQuery(query);
    // Implement patient search logic
  };

  const handleDoctorSearch = (query: string) => {
    // Implement doctor search logic
  };

  const handleTimeSlotSelection = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
    // Check room availability for the selected time slot
  };

  const handleRoomSelection = (room: Room) => {
    setSelectedRoom(room);
  };

  const handleAppointmentCreation = () => {
    if (!selectedPatient || !selectedDoctor || !selectedTimeSlot || !selectedRoom) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Implement appointment creation logic
    console.log({
      patient: selectedPatient,
      doctor: selectedDoctor,
      timeSlot: selectedTimeSlot,
      room: selectedRoom,
      reason: appointmentReason,
      specialRequirements
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Tạo lịch hẹn</h1>
        
        {/* View Mode Selection */}
        <div className="flex gap-2 mb-4">
          <button
            className={`px-4 py-2 rounded ${viewMode === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setViewMode('day')}
          >
            Ngày
          </button>
          <button
            className={`px-4 py-2 rounded ${viewMode === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setViewMode('week')}
          >
            Tuần
          </button>
          <button
            className={`px-4 py-2 rounded ${viewMode === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setViewMode('month')}
          >
            Tháng
          </button>
        </div>

        {/* Patient Search */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Tìm kiếm bệnh nhân</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nhập tên, số điện thoại hoặc email bệnh nhân"
              className="flex-1 p-2 border rounded"
              value={searchQuery}
              onChange={(e) => handlePatientSearch(e.target.value)}
            />
            <button className="px-4 py-2 bg-blue-500 text-white rounded">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Doctor Selection */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Chọn bác sĩ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className={`p-4 border rounded cursor-pointer ${
                  selectedDoctor?.id === doctor.id ? 'border-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => setSelectedDoctor(doctor)}
              >
                <h3 className="font-semibold">{doctor.name}</h3>
                <p className="text-sm text-gray-600">
                  Chuyên môn: {doctor.specialization.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Time Slot Selection */}
        {selectedDoctor && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Chọn khung giờ</h2>
            <div className="grid grid-cols-4 gap-2">
              {selectedDoctor.availableTimeSlots.map((slot) => (
                <button
                  key={`${slot.start}-${slot.end}`}
                  className={`p-2 border rounded ${
                    !slot.isAvailable
                      ? 'bg-gray-100 cursor-not-allowed'
                      : selectedTimeSlot === slot
                      ? 'border-blue-500 bg-blue-50'
                      : ''
                  }`}
                  onClick={() => slot.isAvailable && handleTimeSlotSelection(slot)}
                  disabled={!slot.isAvailable}
                >
                  {slot.start} - {slot.end}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Room Selection */}
        {selectedTimeSlot && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Chọn phòng khám</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className={`p-4 border rounded cursor-pointer ${
                    !room.isAvailable
                      ? 'bg-gray-100 cursor-not-allowed'
                      : selectedRoom?.id === room.id
                      ? 'border-blue-500 bg-blue-50'
                      : ''
                  }`}
                  onClick={() => room.isAvailable && handleRoomSelection(room)}
                >
                  <h3 className="font-semibold">{room.name}</h3>
                  <p className="text-sm text-gray-600">
                    Loại phòng: {room.type}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Appointment Details */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Thông tin lịch hẹn</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Lý do khám
              </label>
              <textarea
                className="w-full p-2 border rounded"
                rows={3}
                value={appointmentReason}
                onChange={(e) => setAppointmentReason(e.target.value)}
                placeholder="Nhập lý do khám..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Yêu cầu đặc biệt
              </label>
              <textarea
                className="w-full p-2 border rounded"
                rows={2}
                value={specialRequirements}
                onChange={(e) => setSpecialRequirements(e.target.value)}
                placeholder="Nhập yêu cầu đặc biệt (nếu có)..."
              />
            </div>
          </div>
        </div>

        {/* Create Appointment Button */}
        <button
          className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600"
          onClick={handleAppointmentCreation}
        >
          Tạo lịch hẹn
        </button>
      </div>
    </div>
  );
};

export default StaffAppointmentScheduler; 