import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useArv } from "../../context/ArvContext";
import { useAuth } from "../../context/AuthContext";
import type { ARVRegimen, ARVRegimenCreateInput } from "../../types/arvRegimen";
import { X, Plus, Edit, Trash2, Search, Pill, AlertTriangle, Loader, Info } from "lucide-react";

// Format frequency value (e.g., "2" → "2 lần/ngày")
const formatFrequency = (freq: string | undefined): string => {
  if (!freq || freq.trim() === "") return "Chưa có";
  const num = Number.parseInt(freq, 10);
  return isNaN(num) ? freq : `${num} lần/ngày`;
};

const ArvRegimenManagement: React.FC = () => {
  const { regimens, loading, error, getAll, create, update, remove } = useArv();
  const { getUserById } = useAuth();
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editingRegimen, setEditingRegimen] = useState<ARVRegimen | null>(null);
  const [userNames, setUserNames] = useState<{ [userId: string]: string }>({});
  const [formData, setFormData] = useState<ARVRegimenCreateInput>({
    arvName: "",
    regimenCode: "",
    treatmentLine: "First-line",
    drugs: [],
    dosages: [],
    frequency: "",
    contraindications: [],
    sideEffects: [],
    arvDescription: "",
    recommendedFor: "",
    userId: undefined,
  });
  const [inputTable, setInputTable] = useState<
    { drug: string; dosage: string; frequency: string; contraindication: string; sideEffect: string }[]
  >([{ drug: "", dosage: "", frequency: "", contraindication: "", sideEffect: "" }]);

  const fetchRegimens = async () => {
    setError(null);
    try {
      const data = await getAll();
      // Fetch userNames for regimens with userId
      const userIds = data.filter((p) => p.userId).map((p) => (p.userId as any)._id);
      const uniqueUserIds = [...new Set(userIds)];
      const userNamePromises = uniqueUserIds.map(async (userId) => {
        try {
          const user = await getUserById(userId);
          return { userId, userName: user?.userName || "Unknown" };
        } catch (err) {
          console.error(`Failed to fetch userName for userId ${userId}:`, err);
          return { userId, userName: "Unknown" };
        }
      });
      const userNameResults = await Promise.all(userNamePromises);
      const userNameMap = userNameResults.reduce(
        (acc, { userId, userName }) => {
          acc[userId] = userName;
          return acc;
        },
        {} as { [userId: string]: string },
      );
      setUserNames(userNameMap);
    } catch (err: any) {
      toast.error(`Không thể tải phác đồ ARV: ${err.message || "Lỗi không xác định"}`);
    } finally {
    }
  };

  useEffect(() => {
    fetchRegimens();
  }, [getAll]);

  const filteredRegimens = regimens.filter(
    (p) =>
      p.arvName.toLowerCase().includes(search.toLowerCase()) ||
      (p.arvDescription || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.regimenCode || "").toLowerCase().includes(search.toLowerCase()),
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      arvName: "",
      regimenCode: "",
      treatmentLine: "First-line",
      drugs: [],
      dosages: [],
      frequency: "",
      contraindications: [],
      sideEffects: [],
      arvDescription: "",
      recommendedFor: "",
      userId: undefined,
    });
    setInputTable([{ drug: "", dosage: "", frequency: "", contraindication: "", sideEffect: "" }]);
  };

  // Xử lý thay đổi inputTable
  const handleInputTableChange = (
    i: number,
    field: "drug" | "dosage" | "frequency" | "contraindication" | "sideEffect",
    value: string
  ) => {
    const updated = [...inputTable];
    updated[i][field] = value;
    setInputTable(updated);
  };

  // Xử lý submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.arvName || !formData.arvDescription || !inputTable.some((row) => row.drug.trim() !== "")) {
      toast.error("Vui lòng điền đầy đủ tên phác đồ, mô tả và ít nhất một thuốc!");
      return;
    }

    const payload: ARVRegimenCreateInput = {
      ...formData,
      drugs: inputTable.map((r) => r.drug).filter((v) => v.trim() !== ""),
      dosages: inputTable.map((r) => r.dosage).filter((v) => v.trim() !== ""),
      frequency: inputTable.map((r) => r.frequency).filter((v) => v.trim() !== "").join(";"),
      contraindications: inputTable.map((r) => r.contraindication).filter((v) => v.trim() !== ""),
      sideEffects: inputTable.map((r) => r.sideEffect).filter((v) => v.trim() !== ""),
    };

    try {
      if (editingRegimen) {
        await update(editingRegimen._id!, payload);
        toast.success("Cập nhật phác đồ thành công!");
      } else {
        await create(payload);
        toast.success("Thêm phác đồ mới thành công!");
      }
      setOpenModal(false);
      setEditingRegimen(null);
      resetForm();
      fetchRegimens();
    } catch (err: any) {
      toast.error(`Lỗi: ${err.message || "Không thể lưu phác đồ ARV"}`);
    }
  };

  const handleEdit = (regimen: ARVRegimen) => {
    setEditingRegimen(regimen);
    setFormData({
      arvName: regimen.arvName,
      regimenCode: regimen.regimenCode || "",
      treatmentLine: regimen.treatmentLine || "First-line",
      drugs: regimen.drugs || [],
      dosages: regimen.dosages || [],
      frequency: regimen.frequency || "",
      contraindications: regimen.contraindications || [],
      sideEffects: regimen.sideEffects || [],
      arvDescription: regimen.arvDescription || "",
      recommendedFor: regimen.recommendedFor || "",
      userId: regimen.userId,
    });
    const maxLen = Math.max(
      regimen.drugs?.length || 0,
      regimen.dosages?.length || 0,
      (regimen.frequency?.split(";") || []).length,
      regimen.contraindications?.length || 0,
      regimen.sideEffects?.length || 0,
    );
    const newTable = Array.from({ length: maxLen }).map((_, i) => ({
      drug: regimen.drugs?.[i] || "",
      dosage: regimen.dosages?.[i] || "",
      frequency: regimen.frequency?.split(";")?.[i] || "",
      contraindication: regimen.contraindications?.[i] || "",
      sideEffect: regimen.sideEffects?.[i] || "",
    }));
    setInputTable(newTable.length > 0 ? newTable : [{ drug: "", dosage: "", frequency: "", contraindication: "", sideEffect: "" }]);
    setOpenModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc muốn xóa phác đồ này?")) {
      try {
        await remove(id);
        toast.success("Xóa phác đồ thành công!");
        fetchRegimens();
      } catch (err: any) {
        toast.error(`Xóa thất bại: ${err.message || "Có lỗi xảy ra"}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Pill className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Quản Lý Phác Đồ ARV</h1>
          </div>
          <p className="text-gray-600">Thêm, chỉnh sửa và quản lý các phác đồ điều trị ARV</p>
        </div>

        {/* Search and Add Button */}
        <div className="bg-white rounded-2xl shadow border p-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex-1 relative w-full md:w-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm theo tên, mô tả hoặc mã phác đồ..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <button
            onClick={() => {
              setEditingRegimen(null);
              resetForm();
              setOpenModal(true);
            }}
            className="flex items-center bg-gradient-to-r from-teal-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all shadow-md text-base font-semibold"
          >
            <Plus className="w-5 h-5 mr-2" />
            Thêm phác đồ mới
          </button>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="bg-white rounded-2xl shadow border p-12 text-center">
            <div className="flex flex-col items-center">
              <Loader className="h-10 w-10 animate-spin text-teal-600" />
              <span className="mt-4 text-lg text-gray-600">Đang tải phác đồ ARV...</span>
            </div>
          </div>
        )}
        {error && (
          <div className="bg-white rounded-2xl shadow border p-12 text-center">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <AlertTriangle className="h-10 w-10 text-red-600 mx-auto mb-4" />
              <p className="text-red-700 font-medium text-lg">Lỗi tải dữ liệu</p>
              <p className="text-red-600 text-sm mt-2">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all text-base font-semibold"
              >
                Thử lại
              </button>
            </div>
          </div>
        )}

        {/* Regimens Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRegimens.length === 0 ? (
              <div className="lg:col-span-3 bg-white rounded-2xl shadow border p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Info className="h-10 w-10 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Không tìm thấy phác đồ ARV nào</h3>
                <p className="text-gray-600">Thử thay đổi từ khóa tìm kiếm hoặc thêm phác đồ mới.</p>
              </div>
            ) : (
              filteredRegimens.map((regimen) => {
                const hasDetailedInfo =
                  (regimen.drugs && regimen.drugs.length > 0) ||
                  (regimen.contraindications && regimen.contraindications.length > 0) ||
                  (regimen.sideEffects && regimen.sideEffects.length > 0);
                const actionButtonClasses = hasDetailedInfo
                  ? "flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100"
                  : "flex justify-end space-x-3 mt-4";

                return (
                  <div key={regimen._id} className="bg-white rounded-2xl shadow border p-6 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Pill className="h-5 w-5 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-800">{regimen.arvName}</h2>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 flex-grow">
                      {regimen.arvDescription || "Không có mô tả"}
                    </p>

                    {/* General Information Block */}
                    <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-4 mb-4">
                      <div className="text-sm text-gray-700 space-y-2">
                        <p>
                          <strong className="font-medium text-gray-800">Mã phác đồ:</strong>{" "}
                          {regimen.regimenCode || "-"}
                        </p>
                        <p>
                          <strong className="font-medium text-gray-800">Tuyến điều trị:</strong>{" "}
                          {regimen.treatmentLine || "-"}
                        </p>
                        <p>
                          <strong className="font-medium text-gray-800">Đối tượng:</strong>{" "}
                          {regimen.recommendedFor || "-"}
                        </p>
                        <p>
                          <strong className="font-medium text-gray-800">Người tạo:</strong>{" "}
                          {regimen.userId ? userNames[(regimen.userId as any)._id] || "Unknown" : "-"}
                        </p>
                      </div>
                    </div>

                    {/* Drug Information Table */}
                    {regimen.drugs && regimen.drugs.length > 0 && (
                      <div className="mt-4 border-t border-gray-100 pt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                          <Pill className="h-4 w-4 text-teal-600" />
                          Thông tin thuốc
                        </label>
                        <div className="overflow-x-auto">
                          <table className="min-w-full border border-gray-200 rounded-xl">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Tên thuốc</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Liều dùng</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Tần suất</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white">
                              {regimen.drugs.map((drug, index) => {
                                const frequencies = regimen.frequency ? regimen.frequency.split(";") : [];
                                return (
                                  <tr key={index} className="border-t border-gray-100">
                                    <td className="px-4 py-2 text-sm text-gray-800">{drug}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800">
                                      {regimen.dosages?.[index] || "Chưa có"}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-800">
                                      {formatFrequency(frequencies[index])}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Contraindications */}
                    {regimen.contraindications && regimen.contraindications.length > 0 && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          Chống chỉ định
                        </label>
                        <div className="bg-red-50 rounded-xl border border-red-200 p-3">
                          {regimen.contraindications.map((item: string, index: number) => (
                            <p key={index} className="text-red-700 text-sm">
                              - {item}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Side Effects */}
                    {regimen.sideEffects && regimen.sideEffects.length > 0 && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                          Tác dụng phụ
                        </label>
                        <div className="bg-amber-50 rounded-xl border border-amber-200 p-3">
                          {regimen.sideEffects.map((effect: string, index: number) => (
                            <p key={index} className="text-amber-700 text-sm">
                              - {effect}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className={actionButtonClasses}>
                      <button
                        onClick={() => handleEdit(regimen)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors px-3 py-2 rounded-md bg-blue-50"
                      >
                        <Edit className="w-4 h-4" />
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(regimen._id!)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors px-3 py-2 rounded-md bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        Xoá
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Modal for Adding/Editing Regimen */}
        {openModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-teal-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <Pill className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {editingRegimen ? "Chỉnh sửa phác đồ" : "Thêm phác đồ mới"}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setOpenModal(false);
                    setEditingRegimen(null);
                    resetForm();
                  }}
                  className="p-2 hover:bg-white hover:bg-opacity-50 rounded-xl transition-colors"
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-6">
                  {/* General Information */}
                  <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-6">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Info className="h-5 w-5 text-teal-600" />
                      Thông Tin Chung
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên phác đồ</label>
                        <input
                          name="arvName"
                          value={formData.arvName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          placeholder="Nhập tên phác đồ"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mã phác đồ</label>
                        <input
                          name="regimenCode"
                          value={formData.regimenCode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          placeholder="Nhập mã phác đồ"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                        <textarea
                          name="arvDescription"
                          value={formData.arvDescription}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-y"
                          placeholder="Mô tả chi tiết về phác đồ"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tuyến điều trị</label>
                        <select
                          name="treatmentLine"
                          value={formData.treatmentLine}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        >
                          <option value="First-line">First-line</option>
                          <option value="Second-line">Second-line</option>
                          <option value="Third-line">Third-line</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Đối tượng khuyến cáo</label>
                        <input
                          name="recommendedFor"
                          value={formData.recommendedFor}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          placeholder="Ví dụ: Người lớn, Trẻ em, Phụ nữ mang thai"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Drug Information Table */}
                  <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-6">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Pill className="h-5 w-5 text-teal-600" />
                      Thông Tin Thuốc
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border border-gray-200 rounded-xl">
                        <thead className="bg-white">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Tên thuốc</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Liều dùng</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Tần suất</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Chống chỉ định</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Tác dụng phụ</th>
                            <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Xoá</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white">
                          {inputTable.map((row, i) => (
                            <tr key={i} className="border-t border-gray-100">
                              <td className="px-2 py-1">
                                <input
                                  value={row.drug}
                                  onChange={(e) => handleInputTableChange(i, "drug", e.target.value)}
                                  className="w-full border border-gray-200 px-2 py-1 rounded-md focus:ring-1 focus:ring-teal-500"
                                  placeholder="Tên thuốc"
                                />
                              </td>
                              <td className="px-2 py-1">
                                <input
                                  value={row.dosage}
                                  onChange={(e) => handleInputTableChange(i, "dosage", e.target.value)}
                                  className="w-full border border-gray-200 px-2 py-1 rounded-md focus:ring-1 focus:ring-teal-500"
                                  placeholder="Liều"
                                />
                              </td>
                              <td className="px-2 py-1">
                                <input
                                  value={row.frequency}
                                  onChange={(e) => handleInputTableChange(i, "frequency", e.target.value)}
                                  className="w-full border border-gray-200 px-2 py-1 rounded-md focus:ring-1 focus:ring-teal-500"
                                  placeholder="Tần suất"
                                />
                              </td>
                              <td className="px-2 py-1">
                                <input
                                  value={row.contraindication}
                                  onChange={(e) => handleInputTableChange(i, "contraindication", e.target.value)}
                                  className="w-full border border-gray-200 px-2 py-1 rounded-md focus:ring-1 focus:ring-teal-500"
                                  placeholder="Chống chỉ định"
                                />
                              </td>
                              <td className="px-2 py-1">
                                <input
                                  value={row.sideEffect}
                                  onChange={(e) => handleInputTableChange(i, "sideEffect", e.target.value)}
                                  className="w-full border border-gray-200 px-2 py-1 rounded-md focus:ring-1 focus:ring-teal-500"
                                  placeholder="Tác dụng phụ"
                                />
                              </td>
                              <td className="px-2 py-1 text-center">
                                <button
                                  type="button"
                                  onClick={() => setInputTable(inputTable.filter((_, index) => index !== i))}
                                  className="text-red-600 hover:text-red-800 transition-colors p-1 rounded-md"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setInputTable([
                          ...inputTable,
                          { drug: "", dosage: "", frequency: "", contraindication: "", sideEffect: "" },
                        ])
                      }
                      className="mt-4 px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all text-sm font-semibold flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Thêm thuốc
                    </button>
                  </div>
                </div>
                <div className="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gradient-to-r from-blue-50 to-teal-50">
                  <button
                    type="button"
                    onClick={() => {
                      setOpenModal(false);
                      setEditingRegimen(null);
                      resetForm();
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl text-sm font-semibold hover:from-teal-700 hover:to-blue-700 transition-all shadow-md"
                  >
                    Lưu phác đồ
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      <ToastContainer />
    </div>
    </div>
  );
};

export default ArvRegimenManagement;

function setError(arg0: null) {
    throw new Error("Function not implemented.");
}
