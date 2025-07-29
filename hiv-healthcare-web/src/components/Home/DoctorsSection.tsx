import type React from "react"
import { useEffect, useState } from "react"
import { ArrowRight, Award, GraduationCap, Phone, Mail, ChevronLeft, ChevronRight, Star } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import AnimatedElement from "../Home/AnimatedElement"
import type { User } from "../../types/user"

const DoctorsSection: React.FC = () => {
    const { getAllUsers } = useAuth()
    const [doctors, setDoctors] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const users = await getAllUsers()
                const doctorList = users.filter((user) => user.role === "doctor")
                setDoctors(doctorList)
            } catch (err) {
                setError("Có lỗi khi tải danh sách bác sĩ. Vui lòng thử lại sau.")
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchDoctors()
    }, [getAllUsers])

    // Auto-play functionality
    useEffect(() => {
        if (!isAutoPlaying || doctors.length === 0) return

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % doctors.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [isAutoPlaying, doctors.length])

    // Helper functions
    const calculateYearsOfExperience = (experiences: any[]) => {
        if (!experiences || experiences.length === 0) return 0

        const totalMonths = experiences.reduce((total, exp) => {
            const startDate = new Date(exp.startDate)
            const endDate = exp.endDate ? new Date(exp.endDate) : new Date()
            const months =
                (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth())
            return total + Math.max(0, months)
        }, 0)

        return Math.floor(totalMonths / 12)
    }

    const getPrimarySpecialization = (doctor: User) => {
        if (doctor.certifications && doctor.certifications.length > 0) {
            return doctor.certifications[0].title
        }
        if (doctor.experiences && doctor.experiences.length > 0) {
            return doctor.experiences[0].position
        }
        return "Chuyên gia"
    }

    const goToSlide = (index: number) => {
        setCurrentIndex(index)
        setIsAutoPlaying(false)
        setTimeout(() => setIsAutoPlaying(true), 5000)
    }

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + doctors.length) % doctors.length)
        setIsAutoPlaying(false)
        setTimeout(() => setIsAutoPlaying(true), 5000)
    }

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % doctors.length)
        setIsAutoPlaying(false)
        setTimeout(() => setIsAutoPlaying(true), 5000)
    }

    if (loading) {
        return (
            <section className="py-16 bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-3 text-teal-600">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                            <span className="text-lg font-medium">Đang tải danh sách chuyên gia...</span>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    if (error) {
        return (
            <section className="py-16 bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto shadow-lg">
                            <p className="text-red-600 font-medium">{error}</p>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    if (doctors.length === 0) {
        return (
            <section className="py-16 relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <p className="text-gray-600">Chưa có chuyên gia nào trong hệ thống.</p>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-16 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-teal-500 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <AnimatedElement animationType="fade-up" duration={800} className="mb-12">
                    <h2 className="text-3xl font-bold text-center text-gray-800 relative inline-block mx-auto">
                        <span className="relative z-10">Đội Ngũ Chuyên Gia</span>
                        <span className="absolute bottom-0 left-0 w-full h-2 bg-teal-100 -z-10 transform -rotate-1 rounded-full"></span>
                    </h2>
                    <p className="text-left text-gray-600 mt-4">
                        Gặp gỡ những chuyên gia y tế hàng đầu với kinh nghiệm phong phú và tận tâm
                    </p>
                </AnimatedElement>

                {/* Main Carousel */}
                <div className="relative max-w-6xl mx-auto">
                    {/* Navigation Buttons */}
                    <button
                        onClick={goToPrevious}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-blue-600 w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
                    >
                        <ChevronLeft className="h-6 w-6 transition-transform group-hover:-translate-x-0.5" />
                    </button>

                    <button
                        onClick={goToNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-blue-600 w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
                    >
                        <ChevronRight className="h-6 w-6 transition-transform group-hover:translate-x-0.5" />
                    </button>

                    {/* Cards Container */}
                    <div className="overflow-hidden rounded-2xl">
                        <div
                            className="flex transition-transform duration-700 ease-out"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {doctors.map((doctor, index) => {
                                const yearsOfExperience = calculateYearsOfExperience(doctor.experiences || [])
                                const primarySpecialization = getPrimarySpecialization(doctor)

                                return (
                                    <div key={doctor._id} className="w-full flex-shrink-0 px-4">
                                        <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group max-w-4xl mx-auto">
                                            <div className="md:flex">
                                                {/* Image Section */}
                                                <div className="md:w-2/5 relative overflow-hidden">
                                                    <img
                                                        src={
                                                            doctor.avatar ||
                                                            `/placeholder.svg?height=400&width=300&text=${encodeURIComponent(doctor.userName) || "/placeholder.svg"}`
                                                        }
                                                        alt={doctor.userName}
                                                        className="w-full h-64 md:h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                                                    {/* Verification Badge */}
                                                    {doctor.isVerified && (
                                                        <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full shadow-lg">
                                                            <Award className="h-4 w-4" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Content Section */}
                                                <div className="md:w-3/5 p-8 flex flex-col justify-center">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium text-sm">
                                                            {yearsOfExperience > 0 ? `${yearsOfExperience} năm kinh nghiệm` : "Mới tham gia"}
                                                        </span>
                                                        <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full font-medium text-sm">
                                                            {doctor.certifications?.length || 0} chứng chỉ
                                                        </span>
                                                    </div>

                                                    <h3 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800 leading-tight group-hover:text-blue-700 transition-colors duration-300">
                                                        {doctor.userName}
                                                    </h3>

                                                    <p className="text-teal-600 font-semibold mb-4 text-lg">{primarySpecialization}</p>

                                                    {/* Contact Info */}
                                                    <div className="space-y-2 mb-4">
                                                        {doctor.email && (
                                                            <div className="flex items-center gap-2 text-gray-600">
                                                                <Mail className="h-4 w-4 text-gray-400" />
                                                                <span className="truncate">{doctor.email}</span>
                                                            </div>
                                                        )}
                                                        {doctor.phone_number && (
                                                            <div className="flex items-center gap-2 text-gray-600">
                                                                <Phone className="h-4 w-4 text-gray-400" />
                                                                <span>{doctor.phone_number}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Experience/Certification */}
                                                    {(doctor.experiences?.[0] || doctor.certifications?.[0]) && (
                                                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                                            {doctor.experiences?.[0] && (
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <Award className="h-4 w-4 text-blue-500" />
                                                                    <span className="font-medium text-gray-800">{doctor.experiences[0].position}</span>
                                                                </div>
                                                            )}
                                                            {doctor.experiences?.[0]?.hospital && (
                                                                <p className="text-gray-600 text-sm ml-6 mb-2">{doctor.experiences[0].hospital}</p>
                                                            )}
                                                            {doctor.certifications?.[0] && (
                                                                <div className="flex items-center gap-2">
                                                                    <GraduationCap className="h-4 w-4 text-teal-500" />
                                                                    <span className="text-gray-700">{doctor.certifications[0].title}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Description */}
                                                    {doctor.userDescription && (
                                                        <p className="text-gray-600 mb-6 leading-relaxed">{doctor.userDescription}</p>
                                                    )}

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                        
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Dots Indicator */}
                    <div className="flex justify-center mt-8 gap-2">
                        {doctors.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-blue-600 w-8" : "bg-gray-300 hover:bg-gray-400"
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4 max-w-xs mx-auto">
                        <div className="w-full bg-gray-200 rounded-full h-1">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-1 rounded-full transition-all duration-300"
                                style={{ width: `${((currentIndex + 1) / doctors.length) * 100}%` }}
                            ></div>
                        </div>
                        <p className="text-center text-sm text-gray-500 mt-2">
                            {currentIndex + 1} / {doctors.length}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default DoctorsSection
