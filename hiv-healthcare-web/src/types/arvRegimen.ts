export interface ARVRegimen {
    _id?: string;
    arvName: string;
    arvDescription?: string;
    drugs: string[]; // Danh sách thuốc
    dosages: string[]; // Liều dùng
    contraindications: string[]; // Chống chỉ định
    sideEffects: string[]; // Tác dụng phụ
}