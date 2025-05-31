import React from 'react';
import { Link } from 'react-router-dom';
import { User, Stethoscope, ArrowRight } from 'lucide-react';

const doctorCategories = [
  {
    id: 1,
    title: "Bác sĩ Chuyên khoa HIV",
    description: "Đội ngũ bác sĩ chuyên gia hàng đầu trong lĩnh vực điều trị và chăm sóc bệnh nhân HIV/AIDS",
    icon: <Stethoscope className="w-8 h-8" />,
    path: "/doctors/hiv-specialist",
    color: "from-teal-600 to-teal-700"
  },
  {
    id: 2,
    title: "Bác sĩ Tư vấn",
    description: "Các chuyên gia tư vấn tâm lý và sức khỏe cho người sống chung với HIV",
    icon: <User className="w-8 h-8" />,
    path: "/doctors/counselors",
    color: "from-blue-600 to-blue-700"
  }
];

const Doctors: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-700 to-teal-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
            Đội ngũ Y Bác sĩ
          </h1>
          <p className="text-xl text-center max-w-3xl mx-auto text-teal-100">
            Đội ngũ y bác sĩ của chúng tôi là những chuyên gia hàng đầu trong lĩnh vực chăm sóc sức khỏe cho người sống chung với HIV. 
            Với kinh nghiệm và chuyên môn sâu rộng, chúng tôi cam kết mang đến dịch vụ y tế chất lượng cao nhất.
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctorCategories.map((category) => (
            <Link
              key={category.id}
              to={category.path}
              className="group"
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl h-full">
                <div className={`bg-gradient-to-r ${category.color} p-6 text-white`}>
                  <div className="flex items-center justify-between">
                    <div className="bg-white/20 p-3 rounded-lg">
                      {category.icon}
                    </div>
                    <ArrowRight className="w-6 h-6 transform group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    {category.title}
                  </h3>
                  <p className="text-gray-600">
                    {category.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Tại sao chọn đội ngũ y bác sĩ của chúng tôi?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mr-4">
                <User className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Chuyên môn cao</h3>
                <p className="text-gray-600">Đội ngũ bác sĩ được đào tạo chuyên sâu về HIV/AIDS và có nhiều năm kinh nghiệm.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mr-4">
                <User className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Tận tâm với bệnh nhân</h3>
                <p className="text-gray-600">Luôn lắng nghe và thấu hiểu nhu cầu của bệnh nhân để đưa ra phương án điều trị tốt nhất.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mr-4">
                <User className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Cập nhật kiến thức</h3>
                <p className="text-gray-600">Thường xuyên cập nhật các phương pháp điều trị mới nhất trong lĩnh vực HIV/AIDS.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctors; 