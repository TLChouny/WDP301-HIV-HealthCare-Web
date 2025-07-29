import type React from "react"
import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Search, Pill, AlertTriangle, Loader, Info, X } from "lucide-react"
import { useArv } from "../../context/ArvContext"
import { useAuth } from "../../context/AuthContext"
import type { ARVRegimen } from "../../types/arvRegimen"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Format frequency value (e.g., "2" → "2 lần/ngày")
const formatFrequency = (freq: string | undefined): string => {
  if (!freq || freq.trim() === "") return "Chưa có"
  const num = Number.parseInt(freq, 10)
  return isNaN(num) ? freq : `${num} lần/ngày`
}

const ARVProtocolManagement: React.FC = () => {
  const { getAll, create, update, remove } = useArv()
  const { getUserById } = useAuth()
  const [search, setSearch] = useState("")
  const [protocols, setProtocols] = useState<ARVRegimen[]>([])
  const [userNames, setUserNames] = useState<{ [userId: string]: string }>({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProtocol, setEditingProtocol] = useState<ARVRegimen | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<ARVRegimen>({
    arvName: "",
    arvDescription: "",
    regimenCode: "",
    treatmentLine: "First-line",
    recommendedFor: "",
    drugs: [],
    dosages: [],
    frequency: "",
    contraindications: [],
    sideEffects: [],
  })
  const [inputTable, setInputTable] = useState<
    { drug: string; dosage: string; frequency: string; contraindication: string; sideEffect: string }[]
  >([{ drug: "", dosage: "", frequency: "", contraindication: "", sideEffect: "" }])

  const fetchProtocols = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAll()
      setProtocols(data)
      // Fetch userNames for regimens with userId
      const userIds = data.filter((p) => p.userId).map((p) => (p.userId as any)._id) // Assuming userId is an object with _id
      const uniqueUserIds = [...new Set(userIds)]
      const userNamePromises = uniqueUserIds.map(async (userId) => {
        try {
          const user = await getUserById(userId)
          return { userId, userName: user?.userName || "Unknown" }
        } catch (err) {
          console.error(`Failed to fetch userName for userId ${userId}:`, err)
          return { userId, userName: "Unknown" }
        }
      })
      const userNameResults = await Promise.all(userNamePromises)
      const userNameMap = userNameResults.reduce(
        (acc, { userId, userName }) => {
          acc[userId] = userName
          return acc
        },
        {} as { [userId: string]: string },
      )
      setUserNames(userNameMap)
    } catch (err: any) {
      setError(`Không thể tải phác đồ ARV: ${err.message || "Lỗi không xác định"}`)
      console.error("Failed to fetch protocols:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProtocols()
  }, [])

  const filtered = protocols.filter(
    (p) =>
      p.arvName.toLowerCase().includes(search.toLowerCase()) ||
      (p.arvDescription || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.regimenCode || "").toLowerCase().includes(search.toLowerCase()),
  )

  const handleSave = async () => {
    if (!formData.arvName || !formData.arvDescription) {
      toast.error("Vui lòng nhập đầy đủ tên và mô tả phác đồ.")
      return
    }

    const payload = {
      ...formData,
      drugs: inputTable.map((r) => r.drug).filter((v) => v.trim() !== ""),
      dosages: inputTable.map((r) => r.dosage).filter((v) => v.trim() !== ""),
      frequency: inputTable
        .map((r) => r.frequency)
        .filter((v) => v.trim() !== "")
        .join(";"),
      contraindications: inputTable.map((r) => r.contraindication).filter((v) => v.trim() !== ""),
      sideEffects: inputTable.map((r) => r.sideEffect).filter((v) => v.trim() !== ""),
    }

    try {
      if (editingProtocol && editingProtocol._id) {
        await update(editingProtocol._id, payload)
        toast.success("Cập nhật phác đồ thành công!")
      } else {
        await create(payload)
        toast.success("Thêm phác đồ mới thành công!")
      }
      setIsModalOpen(false)
      setEditingProtocol(null)
      resetForm()
      fetchProtocols()
    } catch (err: any) {
      toast.error(`Lỗi: ${err.message || "Có lỗi xảy ra khi lưu phác đồ"}`)
    }
  }

  const resetForm = () => {
    setFormData({
      arvName: "",
      arvDescription: "",
      regimenCode: "",
      treatmentLine: "First-line",
      recommendedFor: "",
      drugs: [],
      dosages: [],
      frequency: "",
      contraindications: [],
      sideEffects: [],
    })
    setInputTable([{ drug: "", dosage: "", frequency: "", contraindication: "", sideEffect: "" }])
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xoá phác đồ này?")) return
    try {
      await remove(id)
      toast.success("Xoá phác đồ thành công!")
      fetchProtocols()
    } catch (err: any) {
      toast.error(`Xoá thất bại: ${err.message || "Có lỗi xảy ra"}`)
    }
  }

  const openEditModal = (protocol: ARVRegimen) => {
    setEditingProtocol(protocol)
    setFormData(protocol)
    const maxLen = Math.max(
      protocol.drugs?.length || 0,
      protocol.dosages?.length || 0,
      protocol.frequency?.split(";").length || 0,
      protocol.contraindications?.length || 0,
      protocol.sideEffects?.length || 0,
    )
    const newTable = Array.from({ length: maxLen }).map((_, i) => ({
      drug: protocol.drugs?.[i] || "",
      dosage: protocol.dosages?.[i] || "",
      frequency: protocol.frequency?.split(";")?.[i] || "",
      contraindication: protocol.contraindications?.[i] || "",
      sideEffect: protocol.sideEffects?.[i] || "",
    }))
    setInputTable(
      newTable.length > 0 ? newTable : [{ drug: "", dosage: "", frequency: "", contraindication: "", sideEffect: "" }],
    )
    setIsModalOpen(true)
  }

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
              setEditingProtocol(null)
              resetForm()
              setIsModalOpen(true)
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

        {/* Protocols Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.length === 0 ? (
              <div className="lg:col-span-3 bg-white rounded-2xl shadow border p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Info className="h-10 w-10 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Không tìm thấy phác đồ ARV nào</h3>
                <p className="text-gray-600">Thử thay đổi từ khóa tìm kiếm hoặc thêm phác đồ mới.</p>
              </div>
            ) : (
              filtered.map((protocol) => {
                const hasDetailedInfo =
                  (protocol.drugs && protocol.drugs.length > 0) ||
                  (protocol.contraindications && protocol.contraindications.length > 0) ||
                  (protocol.sideEffects && protocol.sideEffects.length > 0)

                const actionButtonClasses = hasDetailedInfo
                  ? "flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100"
                  : "flex justify-end space-x-3 mt-4"

                return (
                  <div key={protocol._id} className="bg-white rounded-2xl shadow border p-6 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Pill className="h-5 w-5 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-800">{protocol.arvName}</h2>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 flex-grow">
                      {protocol.arvDescription || "Không có mô tả"}
                    </p>

                    {/* Styled General Information Block - Always visible */}
                    <div className="bg-gradient-to-r from-blue-20 to-teal-20 rounded-xl p-4 mb-4">
                      <div className="text-sm text-gray-700 space-y-2">
                        <p>
                          <strong className="font-medium text-gray-800">Mã phác đồ:</strong>{" "}
                          {protocol.regimenCode || "-"}
                        </p>
                        <p>
                          <strong className="font-medium text-gray-800">Tuyến điều trị:</strong>{" "}
                          {protocol.treatmentLine || "-"}
                        </p>
                        <p>
                          <strong className="font-medium text-gray-800">Đối tượng:</strong>{" "}
                          {protocol.recommendedFor || "-"}
                        </p>
                      </div>
                    </div>

                    {/* Conditional blocks for detailed info */}
                    {protocol.drugs && protocol.drugs.length > 0 && (
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
                              {protocol.drugs.map((drug, index) => {
                                const frequencies = protocol.frequency ? protocol.frequency.split(";") : []
                                return (
                                  <tr key={index} className="border-t border-gray-100">
                                    <td className="px-4 py-2 text-sm text-gray-800">{drug}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800">
                                      {protocol.dosages?.[index] || "Chưa có"}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-800">
                                      {formatFrequency(frequencies[index])}
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {protocol.contraindications && protocol.contraindications.length > 0 && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          Chống chỉ định
                        </label>
                        <div className="bg-red-50 rounded-xl border border-red-200 p-3">
                          {protocol.contraindications.map((item: string, index: number) => (
                            <p key={index} className="text-red-700 text-sm">
                              - {item}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {protocol.sideEffects && protocol.sideEffects.length > 0 && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                          Tác dụng phụ
                        </label>
                        <div className="bg-amber-50 rounded-xl border border-amber-200 p-3">
                          {protocol.sideEffects.map((effect: string, index: number) => (
                            <p key={index} className="text-amber-700 text-sm">
                              - {effect}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action buttons - conditional styling */}
                    <div className={actionButtonClasses}>
                      <button
                        onClick={() => openEditModal(protocol)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors px-3 py-2 rounded-md bg-blue-50"
                      >
                        <Edit className="w-4 h-4" />
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(protocol._id!)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors px-3 py-2 rounded-md bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        Xoá
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* Modal Thêm/Sửa Phác đồ */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-teal-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <Pill className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {editingProtocol ? "Chỉnh sửa phác đồ" : "Thêm phác đồ mới"}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setIsModalOpen(false)
                    setEditingProtocol(null)
                    resetForm()
                  }}
                  className="p-2 hover:bg-white hover:bg-opacity-50 rounded-xl transition-colors"
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>

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
                        value={formData.arvName}
                        onChange={(e) => setFormData({ ...formData, arvName: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="Nhập tên phác đồ"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mã phác đồ</label>
                      <input
                        value={formData.regimenCode || ""}
                        onChange={(e) => setFormData({ ...formData, regimenCode: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="Nhập mã phác đồ"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                      <textarea
                        value={formData.arvDescription || ""}
                        onChange={(e) => setFormData({ ...formData, arvDescription: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-y"
                        placeholder="Mô tả chi tiết về phác đồ"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tuyến điều trị</label>
                      <select
                        value={formData.treatmentLine}
                        onChange={(e) => setFormData({ ...formData, treatmentLine: e.target.value as any })}
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
                        value={formData.recommendedFor || ""}
                        onChange={(e) => setFormData({ ...formData, recommendedFor: e.target.value })}
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
                                onChange={(e) => {
                                  const updated = [...inputTable]
                                  updated[i].drug = e.target.value
                                  setInputTable(updated)
                                }}
                                className="w-full border border-gray-200 px-2 py-1 rounded-md focus:ring-1 focus:ring-teal-500"
                                placeholder="Tên thuốc"
                              />
                            </td>
                            <td className="px-2 py-1">
                              <input
                                value={row.dosage}
                                onChange={(e) => {
                                  const updated = [...inputTable]
                                  updated[i].dosage = e.target.value
                                  setInputTable(updated)
                                }}
                                className="w-full border border-gray-200 px-2 py-1 rounded-md focus:ring-1 focus:ring-teal-500"
                                placeholder="Liều"
                              />
                            </td>
                            <td className="px-2 py-1">
                              <input
                                value={row.frequency}
                                onChange={(e) => {
                                  const updated = [...inputTable]
                                  updated[i].frequency = e.target.value
                                  setInputTable(updated)
                                }}
                                className="w-full border border-gray-200 px-2 py-1 rounded-md focus:ring-1 focus:ring-teal-500"
                                placeholder="Tần suất"
                              />
                            </td>
                            <td className="px-2 py-1">
                              <input
                                value={row.contraindication}
                                onChange={(e) => {
                                  const updated = [...inputTable]
                                  updated[i].contraindication = e.target.value
                                  setInputTable(updated)
                                }}
                                className="w-full border border-gray-200 px-2 py-1 rounded-md focus:ring-1 focus:ring-teal-500"
                                placeholder="Chống chỉ định"
                              />
                            </td>
                            <td className="px-2 py-1">
                              <input
                                value={row.sideEffect}
                                onChange={(e) => {
                                  const updated = [...inputTable]
                                  updated[i].sideEffect = e.target.value
                                  setInputTable(updated)
                                }}
                                className="w-full border border-gray-200 px-2 py-1 rounded-md focus:ring-1 focus:ring-teal-500"
                                placeholder="Tác dụng phụ"
                              />
                            </td>
                            <td className="px-2 py-1 text-center">
                              <button
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
                    onClick={() =>
                      setInputTable([
                        ...inputTable,
                        { drug: "", dosage: "", frequency: "", contraindication: "", sideEffect: "" },
                      ])
                    }
                    className="mt-4 px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all text-sm font-semibold flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Thêm thuốc
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gradient-to-r from-blue-50 to-teal-50">
                <button
                  className="px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    setIsModalOpen(false)
                    setEditingProtocol(null)
                    resetForm()
                  }}
                >
                  Hủy
                </button>
                <button
                  className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl text-sm font-semibold hover:from-teal-700 hover:to-blue-700 transition-all shadow-md"
                  onClick={handleSave}
                >
                  Lưu phác đồ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  )
}

export default ARVProtocolManagement
