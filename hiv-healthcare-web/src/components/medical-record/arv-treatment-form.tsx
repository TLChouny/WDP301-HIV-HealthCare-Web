"use client"

import type React from "react"
import { Pill, AlertTriangle, XCircle } from "lucide-react"
import type { ARVRegimen } from "../../types/arvRegimen" // Assuming this path is correct

interface ArvTreatmentFormProps {
  arvRegimenId: string
  setArvRegimenId: (id: string) => void
  arvName: string
  setArvName: (name: string) => void
  regimenCode: string
  setRegimenCode: (code: string) => void
  treatmentLine: string
  setTreatmentLine: (line: string) => void
  recommendedFor: string
  setRecommendedFor: (forWho: string) => void
  arvDescription: string
  setArvDescription: (desc: string) => void
  medicationSlot: string
  setMedicationSlot: (slot: string) => void
  medicationTimes: string[]
  setMedicationTimes: (times: string[]) => void
  reExaminationDate: string
  setReExaminationDate: (date: string) => void
  drugs: string[]
  setDrugs: (drugs: string[]) => void
  dosages: string[]
  setDosages: (dosages: string[]) => void
  frequencies: string[]
  setFrequencies: (frequencies: string[]) => void
  contraindications: string[]
  setContraindications: (contra: string[]) => void
  sideEffects: string[]
  setSideEffects: (effects: string[]) => void
  hivLoad: string
  setHivLoad: (load: string) => void
  regimens: ARVRegimen[]
  hasResult: boolean
  arvError: string | null
  slotToTimeCount: { [key: string]: string[] }
  addDrugRow: () => void
  removeDrugRow: (index: number) => void
  addContraindication: () => void
  removeContraindication: (index: number) => void
  addSideEffect: () => void
  removeSideEffect: (index: number) => void
}

const ArvTreatmentForm: React.FC<ArvTreatmentFormProps> = ({
  arvRegimenId,
  setArvRegimenId,
  arvName,
  setArvName,
  regimenCode,
  setRegimenCode,
  treatmentLine,
  setTreatmentLine,
  recommendedFor,
  setRecommendedFor,
  arvDescription,
  setArvDescription,
  medicationSlot,
  setMedicationSlot,
  medicationTimes,
  setMedicationTimes,
  reExaminationDate,
  setReExaminationDate,
  drugs,
  setDrugs,
  dosages,
  setDosages,
  frequencies,
  setFrequencies,
  contraindications,
  setContraindications,
  sideEffects,
  setSideEffects,
  hivLoad,
  setHivLoad,
  regimens,
  hasResult,
  arvError,
  slotToTimeCount,
  addDrugRow,
  removeDrugRow,
  addContraindication,
  removeContraindication,
  addSideEffect,
  removeSideEffect,
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl flex items-center justify-center">
          <Pill className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Phác đồ ARV</h3>
      </div>
      {arvError ? (
        <div className="bg-red-50 rounded-xl border border-red-200 p-4 text-center">
          <AlertTriangle className="h-6 w-6 text-red-600 mx-auto mb-2" />
          <p className="text-red-700 text-sm">Lỗi: {arvError}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chọn hoặc nhập phác đồ ARV <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={arvRegimenId}
              onChange={(e) => setArvRegimenId(e.target.value)}
              disabled={!!hasResult}
            >
              <option value="">-- Chọn phác đồ ARV --</option>
              {regimens.map((regimen) => (
                <option key={regimen._id} value={regimen._id}>
                  {regimen.arvName} {regimen.regimenCode && `(${regimen.regimenCode})`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên phác đồ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={arvName}
              onChange={(e) => setArvName(e.target.value)}
              placeholder="Nhập tên phác đồ"
              required
              disabled={!!hasResult}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mã phác đồ</label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={regimenCode}
              onChange={(e) => setRegimenCode(e.target.value)}
              placeholder="Nhập mã phác đồ (nếu có)"
              disabled={!!hasResult}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tuyến điều trị</label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={treatmentLine}
              onChange={(e) => setTreatmentLine(e.target.value)}
              placeholder="Nhập tuyến điều trị (nếu có)"
              disabled={!!hasResult}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Đối tượng</label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={recommendedFor}
              onChange={(e) => setRecommendedFor(e.target.value)}
              placeholder="Nhập đối tượng (nếu có)"
              disabled={!!hasResult}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <textarea
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={arvDescription}
              onChange={(e) => setArvDescription(e.target.value)}
              placeholder="Nhập mô tả phác đồ (nếu có)"
              rows={4}
              disabled={!!hasResult}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Khe thời gian uống thuốc <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={medicationSlot}
              onChange={(e) => setMedicationSlot(e.target.value)}
              required
              disabled={!!hasResult}
            >
              <option value="">-- Chọn khe thời gian --</option>
              <option value="Sáng">Sáng</option>
              <option value="Trưa">Trưa</option>
              <option value="Tối">Tối</option>
              <option value="Sáng và Trưa">Sáng và Trưa</option>
              <option value="Trưa và Tối">Trưa và Tối</option>
              <option value="Sáng và Tối">Sáng và Tối</option>
              <option value="Sáng, Trưa và Tối">Sáng, Trưa và Tối</option>
            </select>
          </div>
          {medicationSlot && slotToTimeCount[medicationSlot]?.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thời gian uống thuốc <span className="text-red-500">*</span>
              </label>
              {slotToTimeCount[medicationSlot].map((slot, index) => (
                <div key={index} className="mb-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Thời gian {slot}</label>
                  <input
                    type="time"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    value={medicationTimes[index] || ""}
                    onChange={(e) => {
                      const updatedTimes = [...medicationTimes]
                      while (updatedTimes.length <= index) updatedTimes.push("")
                      updatedTimes[index] = e.target.value
                      setMedicationTimes(updatedTimes)
                    }}
                    required
                    disabled={!!hasResult}
                  />
                </div>
              ))}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày tái khám <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={reExaminationDate}
              onChange={(e) => setReExaminationDate(e.target.value)}
              required
              min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10)}
              disabled={!!hasResult}
            />
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Pill className="h-5 w-5 text-teal-600" />
              Chi tiết phác đồ
            </h4>
            <div className="space-y-4">
              {/* Drug Information Table */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <Pill className="h-4 w-4 text-teal-600" />
                  Thông tin thuốc <span className="text-red-500">*</span>
                </label>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 rounded-xl">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Tên thuốc</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Liều dùng</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Tần suất</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {drugs.map((drug, index) => (
                        <tr key={index} className="border-t border-gray-100">
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                              value={drug}
                              onChange={(e) => {
                                const newDrugs = [...drugs]
                                newDrugs[index] = e.target.value
                                setDrugs(newDrugs)
                              }}
                              placeholder="Nhập tên thuốc"
                              required
                              disabled={!!hasResult}
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                              value={dosages[index] || ""}
                              onChange={(e) => {
                                const newDosages = [...dosages]
                                newDosages[index] = e.target.value
                                setDosages(newDosages)
                              }}
                              placeholder="Nhập liều dùng"
                              required
                              disabled={!!hasResult}
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                              value={frequencies[index] || ""}
                              onChange={(e) => {
                                const newFrequencies = [...frequencies]
                                newFrequencies[index] = e.target.value
                                setFrequencies(newFrequencies)
                              }}
                              placeholder="Nhập tần suất (e.g., 2)"
                              required
                              disabled={!!hasResult}
                            />
                          </td>
                          <td className="px-4 py-2">
                            <button
                              type="button"
                              className="text-red-600 hover:text-red-800"
                              onClick={() => removeDrugRow(index)}
                              disabled={hasResult || drugs.length <= 1}
                            >
                              <XCircle className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  type="button"
                  className="mt-2 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all"
                  onClick={addDrugRow}
                  disabled={!!hasResult}
                >
                  Thêm thuốc
                </button>
              </div>
              {/* Contraindications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  Chống chỉ định
                </label>
                {contraindications.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      value={item}
                      onChange={(e) => {
                        const newContraindications = [...contraindications]
                        newContraindications[index] = e.target.value
                        setContraindications(newContraindications)
                      }}
                      placeholder="Nhập chống chỉ định"
                      disabled={!!hasResult}
                    />
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-800"
                      onClick={() => removeContraindication(index)}
                      disabled={!!hasResult}
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="mt-2 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all"
                  onClick={addContraindication}
                  disabled={!!hasResult}
                >
                  Thêm chống chỉ định
                </button>
              </div>
              {/* Side Effects */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Tác dụng phụ
                </label>
                {sideEffects.map((effect, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      value={effect}
                      onChange={(e) => {
                        const newSideEffects = [...sideEffects]
                        newSideEffects[index] = e.target.value
                        setSideEffects(newSideEffects)
                      }}
                      placeholder="Nhập tác dụng phụ"
                      disabled={!!hasResult}
                    />
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-800"
                      onClick={() => removeSideEffect(index)}
                      disabled={!!hasResult}
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="mt-2 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all"
                  onClick={addSideEffect}
                  disabled={!!hasResult}
                >
                  Thêm tác dụng phụ
                </button>
              </div>
            </div>
            {/* <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tải lượng HIV</label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={hivLoad}
                onChange={(e) => setHivLoad(e.target.value)}
                placeholder="e.g., < 40 copies/mL"
                disabled={!!hasResult}
              />
            </div> */}
          </div>
        </div>
      )}
    </div>
  )
}

export default ArvTreatmentForm
