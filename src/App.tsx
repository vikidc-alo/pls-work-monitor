import React, { useState, useMemo, useEffect, useCallback } from 'react';

export const EQUIPMENT_CATEGORIES = [
  'PAA',
  'PUBT',
  'PTP',
  'Instalasi Listrik',
  'Proteksi Kebakaran',
  'Elevator & Eskalator'
] as const;

export type EquipmentCategory = typeof EQUIPMENT_CATEGORIES[number];

export type JobStatus =
  | 'Belum Mulai'
  | 'Terjadwal'
  | 'Sedang Dikerjakan'
  | 'Menunggu Laporan'
  | 'Ada Kendala'
  | 'Selesai';

export type IssueStatus = 'Open' | 'In Progress' | 'Waiting Client' | 'Resolved';

export type IssueCategory =
  | 'Alat belum tersedia'
  | 'Client belum siap'
  | 'Dokumen belum lengkap'
  | 'Personel tidak tersedia'
  | 'Peralatan pengujian'
  | 'Cuaca'
  | 'Akses lokasi'
  | 'Administrasi'
  | 'Laporan'
  | 'Lainnya';

export interface ClientItem {
  id: string;
  clientCode: string;
  companyName: string;
  address: string;
  city: string;
  pic: string;
  phone: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

export interface PersonnelItem {
  id: string;
  employeeCode: string;
  fullName: string;
  role: string;
  expertise: string;
  phone: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

export interface EquipmentObjectItem {
  id: string;
  name: string;
  category: EquipmentCategory;
  description?: string;
  isActive: boolean;
}

export interface ScheduleJobItem {
  id: string;
  scheduleId: string;
  category: EquipmentCategory;
  objectName: string;
  objectId?: string;
  targetQuantity: number;
  completedQuantity: number;
  notes: string;
}

export interface ScheduleItem {
  id: string;
  date: string; // YYYY-MM-DD
  month: string;
  clientId: string;
  location: string;
  categories: EquipmentCategory[];
  personnelIds: string[];
  notes: string;
  laporanMasuk: number;
}

export interface IssueItem {
  id: string;
  scheduleId: string;
  jobItemId?: string;
  clientName?: string;
  jobName?: string;
  category: IssueCategory;
  description: string;
  status: IssueStatus;
  date: string;
  resolutionNotes: string;
}

export interface ToastMessage {
  id: number;
  message: string;
  type?: 'success' | 'info' | 'warning';
}

const SEED_CLIENTS: ClientItem[] = [
  {
    id: 'CLI-01',
    clientCode: 'CLI-ABC',
    companyName: 'PT ABC Indonesia',
    address: 'Kawasan Industri Rungkut Blok A-12',
    city: 'Surabaya',
    pic: 'Hendra Setiawan',
    phone: '0812-3456-7890',
    email: 'hse@abcindonesia.co.id',
    isActive: true,
    createdAt: '2026-01-10'
  },
  {
    id: 'CLI-02',
    clientCode: 'CLI-MJY',
    companyName: 'PT Maju Jaya',
    address: 'Jl. Raya Berbek Industri No. 45',
    city: 'Sidoarjo',
    pic: 'Rina Kusuma',
    phone: '0813-8899-1122',
    email: 'k3@majujaya.com',
    isActive: true,
    createdAt: '2026-02-14'
  },
  {
    id: 'CLI-03',
    clientCode: 'CLI-XYZ',
    companyName: 'PT XYZ Chemical',
    address: 'Kawasan Industri Gresik Kav. 8-10',
    city: 'Gresik',
    pic: 'Bambang Irawan',
    phone: '0811-2233-4455',
    email: 'safety@xyzchem.co.id',
    isActive: true,
    createdAt: '2026-03-01'
  },
  {
    id: 'CLI-04',
    clientCode: 'CLI-SJA',
    companyName: 'PT Sejahtera Abadi',
    address: 'Jl. Raya Ngoro Industri Park B-3',
    city: 'Mojokerto',
    pic: 'Anton Wijaya',
    phone: '0817-6655-4433',
    email: 'hse.sejahtera@abadi.co.id',
    isActive: true,
    createdAt: '2026-04-18'
  },
  {
    id: 'CLI-05',
    clientCode: 'CLI-NTM',
    companyName: 'PT Nusantara Metal',
    address: 'PIER Industrial Estate Rembang',
    city: 'Pasuruan',
    pic: 'Maya Pratiwi',
    phone: '0819-0011-2233',
    email: 'admin.k3@nusantarametal.id',
    isActive: true,
    createdAt: '2026-05-20'
  }
];

const SEED_PERSONNEL: PersonnelItem[] = [
  {
    id: 'PER-01',
    employeeCode: 'PLS-INS-01',
    fullName: 'Andi Wijaya',
    role: 'Inspector Senior',
    expertise: 'Instalasi Listrik, Penyalur Petir & Fire System',
    phone: '0812-7788-9901',
    email: 'andi.wijaya@pls-k3.co.id',
    isActive: true,
    createdAt: '2025-11-01'
  },
  {
    id: 'PER-02',
    employeeCode: 'PLS-INS-02',
    fullName: 'Budi Santoso',
    role: 'Inspector Senior',
    expertise: 'Pesawat Angkat & Angkut (PAA), PUBT',
    phone: '0812-7788-9902',
    email: 'budi.santoso@pls-k3.co.id',
    isActive: true,
    createdAt: '2025-11-01'
  },
  {
    id: 'PER-03',
    employeeCode: 'PLS-INS-03',
    fullName: 'Candra Setiawan',
    role: 'Inspector Madya',
    expertise: 'PAA, PTP & Mesin Produksi',
    phone: '0812-7788-9903',
    email: 'candra.setiawan@pls-k3.co.id',
    isActive: true,
    createdAt: '2026-01-15'
  },
  {
    id: 'PER-04',
    employeeCode: 'PLS-INS-04',
    fullName: 'Dwi Prasetyo',
    role: 'Inspector Madya',
    expertise: 'Bejana Tekan (PUBT) & Proteksi Kebakaran',
    phone: '0812-7788-9904',
    email: 'dwi.prasetyo@pls-k3.co.id',
    isActive: true,
    createdAt: '2026-02-01'
  },
  {
    id: 'PER-05',
    employeeCode: 'PLS-INS-05',
    fullName: 'Eko Kurniawan',
    role: 'Inspector Spesialis',
    expertise: 'Elevator, Eskalator & Hoist',
    phone: '0812-7788-9905',
    email: 'eko.kurniawan@pls-k3.co.id',
    isActive: true,
    createdAt: '2026-03-10'
  },
  {
    id: 'PER-06',
    employeeCode: 'PLS-INS-06',
    fullName: 'Fajar Ramadhan',
    role: 'Inspector Pratama',
    expertise: 'Proteksi Kebakaran & Grounding Listrik',
    phone: '0812-7788-9906',
    email: 'fajar.ramadhan@pls-k3.co.id',
    isActive: false,
    createdAt: '2026-04-01'
  }
];

const SEED_OBJECTS: EquipmentObjectItem[] = [
  { id: 'OBJ-01', name: 'Forklift', category: 'PAA', description: 'Diesel & Battery Counterbalance', isActive: true },
  { id: 'OBJ-02', name: 'Crane', category: 'PAA', description: 'Overhead & Mobile Crane', isActive: true },
  { id: 'OBJ-03', name: 'Hoist', category: 'PAA', description: 'Electric Chain / Wire Hoist', isActive: true },
  { id: 'OBJ-04', name: 'Reach Truck', category: 'PAA', description: 'Warehouse Stacker', isActive: true },
  { id: 'OBJ-05', name: 'Hand Pallet', category: 'PAA', description: 'Manual & Electric Pallet Truck', isActive: true },
  { id: 'OBJ-06', name: 'Tower Crane', category: 'PAA', description: 'Konstruksi & Proyek Sipil', isActive: true },
  { id: 'OBJ-07', name: 'Scissor Lift', category: 'PAA', description: 'Aerial Work Platform', isActive: true },
  { id: 'OBJ-08', name: 'Air Receiver', category: 'PUBT', description: 'Tangki Penampung Udara Bertekanan', isActive: true },
  { id: 'OBJ-09', name: 'Compressor', category: 'PUBT', description: 'Screw & Piston Air Compressor', isActive: true },
  { id: 'OBJ-10', name: 'Pressure Vessel', category: 'PUBT', description: 'Bejana Reaktor & Separator', isActive: true },
  { id: 'OBJ-11', name: 'Steam Boiler', category: 'PUBT', description: 'Ketel Uap Pipa Air / Api', isActive: true },
  { id: 'OBJ-12', name: 'Diesel Engine', category: 'PTP', description: 'Prime & Standby Generator Diesel', isActive: true },
  { id: 'OBJ-13', name: 'Mesin Produksi', category: 'PTP', description: 'Mesin Press, Bubut, Stamping', isActive: true },
  { id: 'OBJ-14', name: 'Panel Distribusi Utama (LVMDP)', category: 'Instalasi Listrik', description: 'Main Switchboard Tegangan Rendah', isActive: true },
  { id: 'OBJ-15', name: 'Instalasi Penyalur Petir', category: 'Instalasi Listrik', description: 'Sistem Franklin & Elektrostatis', isActive: true },
  { id: 'OBJ-16', name: 'Fire Hydrant & Pompa', category: 'Proteksi Kebakaran', description: 'Jockey, Electric & Diesel Fire Pump', isActive: true },
  { id: 'OBJ-17', name: 'Fire Alarm System', category: 'Proteksi Kebakaran', description: 'MCFA Smoke & Heat Detector', isActive: true },
  { id: 'OBJ-18', name: 'Passenger Elevator', category: 'Elevator & Eskalator', description: 'Lift Penumpang & Service', isActive: true },
  { id: 'OBJ-19', name: 'Freight Elevator', category: 'Elevator & Eskalator', description: 'Lift Barang Kapasitas Besar', isActive: true },
  { id: 'OBJ-20', name: 'Eskalator & Travelator', category: 'Elevator & Eskalator', description: 'Tangga Berjalan Area Publik', isActive: true }
];

const SEED_SCHEDULES: ScheduleItem[] = [
  {
    id: 'VISIT-01',
    date: '2026-10-08',
    month: 'Oktober 2026',
    clientId: 'CLI-01',
    location: 'Surabaya (Plant 1)',
    categories: ['PAA', 'PUBT', 'PTP'],
    personnelIds: ['PER-01', 'PER-02', 'PER-03'],
    notes: 'Pemeriksaan armada material handling, tangki bejana dan genset utama',
    laporanMasuk: 9
  },
  {
    id: 'VISIT-02',
    date: '2026-10-05',
    month: 'Oktober 2026',
    clientId: 'CLI-02',
    location: 'Sidoarjo (Workshop A)',
    categories: ['PUBT', 'PTP'],
    personnelIds: ['PER-02', 'PER-04'],
    notes: 'Uji hidrostatik dan safety valve boiler serta genset pabrik',
    laporanMasuk: 12
  },
  {
    id: 'VISIT-03',
    date: '2026-10-06',
    month: 'Oktober 2026',
    clientId: 'CLI-03',
    location: 'Gresik (Kav 8)',
    categories: ['Instalasi Listrik', 'Proteksi Kebakaran'],
    personnelIds: ['PER-01'],
    notes: 'Pengukuran grounding pembumian tangki kimia dan smoke detector',
    laporanMasuk: 14
  },
  {
    id: 'VISIT-04',
    date: '2026-10-07',
    month: 'Oktober 2026',
    clientId: 'CLI-04',
    location: 'Mojokerto (Bay 2)',
    categories: ['PAA', 'PUBT', 'Proteksi Kebakaran'],
    personnelIds: ['PER-01', 'PER-02', 'PER-04'],
    notes: 'Inspeksi crane bay perbaikan dan uji pancar debit hidran',
    laporanMasuk: 0
  },
  {
    id: 'VISIT-05',
    date: '2026-10-08',
    month: 'Oktober 2026',
    clientId: 'CLI-05',
    location: 'Pasuruan (Plant Rembang)',
    categories: ['Elevator & Eskalator', 'PAA'],
    personnelIds: ['PER-03', 'PER-05'],
    notes: 'Safety gear car test lift barang dan uji beban hoist',
    laporanMasuk: 0
  },
  {
    id: 'VISIT-06',
    date: '2026-10-12',
    month: 'Oktober 2026',
    clientId: 'CLI-01',
    location: 'Surabaya (Plant 2)',
    categories: ['PAA', 'PUBT', 'PTP'],
    personnelIds: ['PER-01', 'PER-02', 'PER-03'],
    notes: 'Inspeksi multi-disiplin fasilitas ekspansi pabrik baru',
    laporanMasuk: 0
  },
  {
    id: 'VISIT-07',
    date: '2026-10-16',
    month: 'Oktober 2026',
    clientId: 'CLI-03',
    location: 'Gresik (Kav 10)',
    categories: ['PAA', 'PTP'],
    personnelIds: ['PER-02', 'PER-04'],
    notes: 'Inspeksi berkala unit penanganan palet dan genset cadangan',
    laporanMasuk: 0
  }
];

const SEED_SCHEDULE_JOBS: ScheduleJobItem[] = [
  // VISIT-01: PT ABC Indonesia (Scenario: 4 items, target 12, completed 9 -> 75%)
  { id: 'JOB-01-01', scheduleId: 'VISIT-01', category: 'PAA', objectName: 'Forklift', targetQuantity: 5, completedQuantity: 5, notes: 'Unit 1-5 area gudang finished goods tuntas' },
  { id: 'JOB-01-02', scheduleId: 'VISIT-01', category: 'PAA', objectName: 'Crane', targetQuantity: 2, completedQuantity: 1, notes: '1 unit crane bay 2 belum siap, area masih dipakai produksi' },
  { id: 'JOB-01-03', scheduleId: 'VISIT-01', category: 'PUBT', objectName: 'Air Receiver', targetQuantity: 3, completedQuantity: 3, notes: 'Ketiga tangki bejana lulus uji ketebalan ultrasonik' },
  { id: 'JOB-01-04', scheduleId: 'VISIT-01', category: 'PTP', objectName: 'Diesel Engine', targetQuantity: 2, completedQuantity: 0, notes: 'Menunggu pergantian filter oli sebelum pengujian beban' },

  // VISIT-02: PT Maju Jaya (12 target, 12 completed)
  { id: 'JOB-02-01', scheduleId: 'VISIT-02', category: 'PUBT', objectName: 'Steam Boiler', targetQuantity: 4, completedQuantity: 4, notes: 'Uji hidrostatik boiler tuntas' },
  { id: 'JOB-02-02', scheduleId: 'VISIT-02', category: 'PUBT', objectName: 'Pressure Vessel', targetQuantity: 4, completedQuantity: 4, notes: 'Inspeksi internal bejana selesai' },
  { id: 'JOB-02-03', scheduleId: 'VISIT-02', category: 'PTP', objectName: 'Diesel Engine', targetQuantity: 4, completedQuantity: 4, notes: 'Running test genset tanpa kendala' },

  // VISIT-03: PT XYZ Chemical (14 target, 14 completed)
  { id: 'JOB-03-01', scheduleId: 'VISIT-03', category: 'Instalasi Listrik', objectName: 'Panel Distribusi Utama (LVMDP)', targetQuantity: 6, completedQuantity: 6, notes: 'Thermovisi dan tahanan isolasi baik' },
  { id: 'JOB-03-02', scheduleId: 'VISIT-03', category: 'Proteksi Kebakaran', objectName: 'Fire Alarm System', targetQuantity: 8, completedQuantity: 8, notes: 'Pengujian smoke detector 8 zona selesai' },

  // VISIT-04: PT Sejahtera Abadi (18 target, 7 completed)
  { id: 'JOB-04-01', scheduleId: 'VISIT-04', category: 'PAA', objectName: 'Crane', targetQuantity: 6, completedQuantity: 2, notes: '4 unit terkendala isolasi LOTO' },
  { id: 'JOB-04-02', scheduleId: 'VISIT-04', category: 'PUBT', objectName: 'Air Receiver', targetQuantity: 6, completedQuantity: 5, notes: '1 unit menunggu pembersihan kerak' },
  { id: 'JOB-04-03', scheduleId: 'VISIT-04', category: 'Proteksi Kebakaran', objectName: 'Fire Hydrant & Pompa', targetQuantity: 6, completedQuantity: 0, notes: 'Tekanan pipa drop, menunggu perbaikan pompa jockey' },

  // VISIT-05: PT Nusantara Metal (8 target, 5 completed)
  { id: 'JOB-05-01', scheduleId: 'VISIT-05', category: 'Elevator & Eskalator', objectName: 'Freight Elevator', targetQuantity: 3, completedQuantity: 2, notes: '1 unit masih menunggu beban uji balok kalibrasi' },
  { id: 'JOB-05-02', scheduleId: 'VISIT-05', category: 'PAA', objectName: 'Hoist', targetQuantity: 5, completedQuantity: 3, notes: 'Dua hoist di bay barat dalam proses perbaikan' },

  // VISIT-06: PT ABC Indonesia (25 target, 0 completed)
  { id: 'JOB-06-01', scheduleId: 'VISIT-06', category: 'PAA', objectName: 'Forklift', targetQuantity: 10, completedQuantity: 0, notes: 'Armada logistik plant ekspansi' },
  { id: 'JOB-06-02', scheduleId: 'VISIT-06', category: 'PUBT', objectName: 'Compressor', targetQuantity: 5, completedQuantity: 0, notes: 'Kompresor udara sentral' },
  { id: 'JOB-06-03', scheduleId: 'VISIT-06', category: 'PTP', objectName: 'Mesin Produksi', targetQuantity: 10, completedQuantity: 0, notes: 'Mesin stamping baru' },

  // VISIT-07: PT XYZ Chemical (6 target, 0 completed)
  { id: 'JOB-07-01', scheduleId: 'VISIT-07', category: 'PAA', objectName: 'Reach Truck', targetQuantity: 4, completedQuantity: 0, notes: 'Gudang distribusi kimia' },
  { id: 'JOB-07-02', scheduleId: 'VISIT-07', category: 'PTP', objectName: 'Diesel Engine', targetQuantity: 2, completedQuantity: 0, notes: 'Genset darurat laboratorium' }
];

const SEED_ISSUES: IssueItem[] = [
  {
    id: 'ISS-01',
    scheduleId: 'VISIT-01',
    jobItemId: 'JOB-01-02',
    category: 'Alat belum tersedia',
    description: '1 unit crane bay 2 belum tersedia karena masih digunakan shift perbaikan mendadak.',
    status: 'Waiting Client',
    date: '2026-10-08',
    resolutionNotes: 'Konfirmasi Spv Mekanik estimasi dapat dites pukul 14.30.'
  },
  {
    id: 'ISS-02',
    scheduleId: 'VISIT-04',
    jobItemId: 'JOB-04-01',
    category: 'Client belum siap',
    description: 'Crane bay 2 masih dipakai shift perbaikan, isolasi energi (LOTO) belum siap.',
    status: 'Waiting Client',
    date: '2026-10-07',
    resolutionNotes: 'Koordinasi ulang dengan Spv Mekanik pukul 13.00.'
  },
  {
    id: 'ISS-03',
    scheduleId: 'VISIT-05',
    jobItemId: 'JOB-05-01',
    category: 'Alat belum tersedia',
    description: 'Beban uji balok kalibrasi 5T dari workshop rekanan masih dalam perjalanan.',
    status: 'In Progress',
    date: '2026-10-08',
    resolutionNotes: 'Logistik mengonfirmasi estimasi tiba di lokasi esok pagi.'
  },
  {
    id: 'ISS-04',
    scheduleId: 'VISIT-03',
    jobItemId: 'JOB-03-01',
    category: 'Dokumen belum lengkap',
    description: 'Single line diagram revisi 2025 belum diverifikasi kepala teknik.',
    status: 'Resolved',
    date: '2026-10-05',
    resolutionNotes: 'Softcopy arsip sudah dikirimkan via email oleh PIC HSE.'
  }
];

export const ISSUE_CATEGORIES: IssueCategory[] = [
  'Alat belum tersedia',
  'Client belum siap',
  'Dokumen belum lengkap',
  'Personel tidak tersedia',
  'Peralatan pengujian',
  'Cuaca',
  'Akses lokasi',
  'Administrasi',
  'Laporan',
  'Lainnya'
];

export const INDO_MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const STORAGE_KEYS = {
  CLIENTS: 'pls_v16_clients',
  PERSONNEL: 'pls_v16_personnel',
  OBJECTS: 'pls_v16_objects',
  SCHEDULES: 'pls_v16_schedules',
  JOBS: 'pls_v16_jobs',
  ISSUES: 'pls_v16_issues',
  INIT_FLAG: 'pls_v16_initialized'
} as const;

export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return fallback;
      return JSON.parse(stored) as T;
    } catch (err) {
      console.warn(`[Storage] Failed to read key "${key}":`, err);
      return fallback;
    }
  },
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn(`[Storage] Failed to persist key "${key}":`, err);
    }
  },
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.warn(`[Storage] Failed to remove key "${key}":`, err);
    }
  },
  isInitialized(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEYS.INIT_FLAG) === 'true';
    } catch {
      return false;
    }
  },
  markInitialized(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.INIT_FLAG, 'true');
    } catch (err) {
      console.warn('[Storage] Failed to mark initialized:', err);
    }
  },
  resetAll(): void {
    try {
      Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    } catch (err) {
      console.warn('[Storage] Reset failed:', err);
    }
  }
};

export const calcUtils = {
  calculateItemProgress(completed: number, target: number): number {
    const safeTarget = Math.max(1, Number(target) || 1);
    const safeCompleted = Math.max(0, Math.min(safeTarget, Number(completed) || 0));
    return Math.round((safeCompleted / safeTarget) * 100);
  },

  calculateVisitProgress(jobs: ScheduleJobItem[]): {
    totalTarget: number;
    totalCompleted: number;
    progress: number;
  } {
    const totalTarget = jobs.reduce((sum, j) => sum + (Number(j.targetQuantity) || 0), 0);
    const totalCompleted = jobs.reduce((sum, j) => sum + (Number(j.completedQuantity) || 0), 0);
    const progress = totalTarget > 0 ? Math.round((totalCompleted / totalTarget) * 100) : 0;
    return { totalTarget, totalCompleted, progress };
  },

  calculateOverallProgress(allJobs: ScheduleJobItem[]): {
    totalTarget: number;
    totalCompleted: number;
    overallProgress: number;
  } {
    const totalTarget = allJobs.reduce((sum, j) => sum + (Number(j.targetQuantity) || 0), 0);
    const totalCompleted = allJobs.reduce((sum, j) => sum + (Number(j.completedQuantity) || 0), 0);
    const overallProgress = totalTarget > 0 ? Math.round((totalCompleted / totalTarget) * 100) : 0;
    return { totalTarget, totalCompleted, overallProgress };
  },

  getItemStatus(progress: number, hasActiveIssue: boolean): JobStatus {
    if (hasActiveIssue) return 'Ada Kendala';
    if (progress >= 100) return 'Selesai';
    if (progress > 0) return 'Sedang Dikerjakan';
    return 'Belum Mulai';
  },

  getVisitStatus(progress: number, hasActiveIssue: boolean): JobStatus {
    if (hasActiveIssue) return 'Ada Kendala';
    if (progress >= 100) return 'Selesai';
    if (progress > 0) return 'Sedang Dikerjakan';
    return 'Terjadwal';
  },

  validateQuantities(target: number, completed: number): { valid: boolean; error?: string } {
    if (target <= 0) {
      return { valid: false, error: 'Target quantity harus lebih besar dari 0.' };
    }
    if (completed < 0) {
      return { valid: false, error: 'Jumlah selesai tidak boleh bernilai negatif.' };
    }
    if (completed > target) {
      return { valid: false, error: 'Jumlah selesai tidak boleh melebihi jumlah target.' };
    }
    return { valid: true };
  }
};

export function StatusBadge({ status }: { status: JobStatus | IssueStatus | string }) {
  let badgeClass = 'bg-slate-100 text-slate-700 border-slate-300';

  switch (status) {
    case 'Selesai':
    case 'Resolved':
    case 'Lengkap':
      badgeClass = 'bg-emerald-50 text-[#0F4A32] border-emerald-300 font-bold';
      break;
    case 'Sedang Dikerjakan':
    case 'In Progress':
    case 'Sebagian':
      badgeClass = 'bg-amber-50 text-amber-800 border-amber-300 font-semibold';
      break;
    case 'Terjadwal':
      badgeClass = 'bg-teal-50 text-teal-800 border-teal-300 font-semibold';
      break;
    case 'Ada Kendala':
    case 'Open':
    case 'Laporan Belum Masuk':
    case 'Terlambat':
      badgeClass = 'bg-rose-50 text-[#7A1215] border-rose-300 font-bold';
      break;
    case 'Waiting Client':
    case 'Menunggu Laporan':
      badgeClass = 'bg-sky-50 text-sky-800 border-sky-300 font-semibold';
      break;
    case 'Belum Mulai':
    case 'Belum Masuk':
    default:
      badgeClass = 'bg-slate-100 text-slate-600 border-slate-200';
      break;
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] border shadow-2xs whitespace-nowrap ${badgeClass}`}>
      {status}
    </span>
  );
}

export function ProgressBar({ progress, color = 'maroon' }: { progress: number; color?: 'maroon' | 'green' | 'purple' }) {
  const clamped = Math.max(0, Math.min(100, Math.round(progress)));
  const bgClass =
    color === 'green'
      ? 'bg-[#0F4A32]'
      : color === 'purple'
      ? 'bg-purple-700'
      : 'bg-[#7A1215]';

  return (
    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/60 shadow-inner">
      <div
        className={`h-full ${bgClass} rounded-full transition-all duration-300`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export function EmptyState({
  title,
  description,
  actionText,
  onAction
}: {
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}) {
  return (
    <div className="text-center py-10 px-4 bg-white rounded-xl border border-dashed border-slate-300">
      <div className="w-11 h-11 mx-auto rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-2 border border-slate-200">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h4 className="text-xs font-bold text-slate-800">{title}</h4>
      {description && <p className="text-[11px] text-slate-500 mt-0.5 max-w-sm mx-auto">{description}</p>}
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-3 px-3 py-1.5 rounded-lg bg-[#7A1215] text-white text-xs font-semibold hover:bg-[#600e10] transition-colors shadow-2xs"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

export function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = 'Konfirmasi',
  danger = false,
  onConfirm,
  onCancel
}: {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 transform transition-all animate-in fade-in zoom-in-95">
        <h4 className="text-sm font-bold text-slate-900">{title}</h4>
        <p className="text-xs text-slate-600 mt-2 leading-relaxed">{message}</p>
        <div className="mt-5 flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className={`px-3.5 py-1.5 rounded-lg text-white text-xs font-semibold shadow-2xs transition-colors ${
              danger ? 'bg-[#7A1215] hover:bg-[#600e10]' : 'bg-[#0F4A32] hover:bg-[#0b3624]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'kalender' | 'jadwal' | 'progress' | 'kendala' | 'laporan' | 'master-klien' | 'master-personel' | 'master-objek'
  >('dashboard');

  // Load from centralized LocalStorage with automatic seed initialization
  const [clients, setClients] = useState<ClientItem[]>(() => {
    return storage.get(STORAGE_KEYS.CLIENTS, SEED_CLIENTS);
  });
  const [personnel, setPersonnel] = useState<PersonnelItem[]>(() => {
    return storage.get(STORAGE_KEYS.PERSONNEL, SEED_PERSONNEL);
  });
  const [equipmentObjects, setEquipmentObjects] = useState<EquipmentObjectItem[]>(() => {
    return storage.get(STORAGE_KEYS.OBJECTS, SEED_OBJECTS);
  });
  const [schedules, setSchedules] = useState<ScheduleItem[]>(() => {
    return storage.get(STORAGE_KEYS.SCHEDULES, SEED_SCHEDULES);
  });
  const [scheduleJobs, setScheduleJobs] = useState<ScheduleJobItem[]>(() => {
    return storage.get(STORAGE_KEYS.JOBS, SEED_SCHEDULE_JOBS);
  });
  const [issues, setIssues] = useState<IssueItem[]>(() => {
    return storage.get(STORAGE_KEYS.ISSUES, SEED_ISSUES);
  });

  // Automatically write to LocalStorage whenever domain state mutates
  useEffect(() => {
    storage.set(STORAGE_KEYS.CLIENTS, clients);
  }, [clients]);

  useEffect(() => {
    storage.set(STORAGE_KEYS.PERSONNEL, personnel);
  }, [personnel]);

  useEffect(() => {
    storage.set(STORAGE_KEYS.OBJECTS, equipmentObjects);
  }, [equipmentObjects]);

  useEffect(() => {
    storage.set(STORAGE_KEYS.SCHEDULES, schedules);
  }, [schedules]);

  useEffect(() => {
    storage.set(STORAGE_KEYS.JOBS, scheduleJobs);
  }, [scheduleJobs]);

  useEffect(() => {
    storage.set(STORAGE_KEYS.ISSUES, issues);
  }, [issues]);

  useEffect(() => {
    if (!storage.isInitialized()) {
      storage.markInitialized();
    }
  }, []);

  /* Calendar View State */
  const [calYear, setCalYear] = useState<number>(2026);
  const [calMonth, setCalMonth] = useState<number>(9); // 9 = Oktober (0-indexed)
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-08');

  /* UI Interactivity & Modal States */
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<ScheduleJobItem | null>(null);
  const [jobModalScheduleId, setJobModalScheduleId] = useState<string>('');
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientItem | null>(null);
  const [isPersonnelModalOpen, setIsPersonnelModalOpen] = useState(false);
  const [editingPersonnel, setEditingPersonnel] = useState<PersonnelItem | null>(null);
  const [isObjectModalOpen, setIsObjectModalOpen] = useState(false);
  const [editingObject, setEditingObject] = useState<EquipmentObjectItem | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [pendingConfirm, setPendingConfirm] = useState<{
    title: string;
    message: string;
    confirmText?: string;
    danger?: boolean;
    onConfirm: () => void;
  } | null>(null);

  /* Filter States */
  const [filterCalClient, setFilterCalClient] = useState('Semua');
  const [filterCalCategory, setFilterCalCategory] = useState('Semua');
  const [filterCalPersonnel, setFilterCalPersonnel] = useState('Semua');
  const [filterCalStatus, setFilterCalStatus] = useState('Semua');

  const [filterJadwalClient, setFilterJadwalClient] = useState('Semua');
  const [filterJadwalCategory, setFilterJadwalCategory] = useState('Semua');
  const [filterJadwalPersonnel, setFilterJadwalPersonnel] = useState('Semua');
  const [filterJadwalStatus, setFilterJadwalStatus] = useState('Semua');

  const [clientSearch, setClientSearch] = useState('');
  const [clientStatusFilter, setClientStatusFilter] = useState<'Semua' | 'Aktif' | 'Nonaktif'>('Semua');
  const [personnelSearch, setPersonnelSearch] = useState('');
  const [personnelStatusFilter, setPersonnelStatusFilter] = useState<'Semua' | 'Aktif' | 'Nonaktif'>('Semua');
  const [objectCategoryFilter, setObjectCategoryFilter] = useState<string>('Semua');
  const [progressStatusFilter, setProgressStatusFilter] = useState('Semua');

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  /* Form States */
  const [visitForm, setVisitForm] = useState({
    clientId: '',
    date: '2026-10-08',
    location: '',
    categories: [] as EquipmentCategory[],
    personnelIds: [] as string[],
    notes: '',
    initialJobName: 'Forklift',
    initialTarget: 5
  });

  const [jobForm, setJobForm] = useState({
    category: 'PAA' as EquipmentCategory,
    objectName: 'Forklift',
    customObjectName: '',
    isCustomObject: false,
    saveToMaster: false,
    targetQuantity: 5,
    completedQuantity: 0,
    notes: ''
  });

  const [personnelForm, setPersonnelForm] = useState({
    employeeCode: '',
    fullName: '',
    role: 'Inspector Madya',
    expertise: '',
    phone: '',
    email: '',
    isActive: true
  });

  const [clientForm, setClientForm] = useState({
    clientCode: '',
    companyName: '',
    address: '',
    city: 'Surabaya',
    pic: '',
    phone: '',
    email: '',
    isActive: true
  });

  const [objectForm, setObjectForm] = useState({
    name: '',
    category: 'PAA' as EquipmentCategory,
    description: '',
    isActive: true
  });

  const [issueForm, setIssueForm] = useState({
    scheduleId: '',
    jobItemId: '',
    category: ISSUE_CATEGORIES[0],
    description: '',
    status: 'Open' as IssueStatus,
    resolutionNotes: ''
  });

  const activeClients = useMemo(() => clients.filter((c) => c.isActive), [clients]);
  const activePersonnel = useMemo(() => personnel.filter((p) => p.isActive), [personnel]);

  const currentMonthLabel = useMemo(() => `${INDO_MONTHS[calMonth]} ${calYear}`, [calMonth, calYear]);

  // Client name resolver (Single Source of Truth)
  const getClientName = useCallback(
    (clientId: string) => {
      const client = clients.find((c) => c.id === clientId);
      return client ? client.companyName : 'Perusahaan (Nonaktif/Dihapus)';
    },
    [clients]
  );

  // Personnel names resolver
  const getPersonnelNames = useCallback(
    (ids: string[]) => {
      return ids
        .map((id) => personnel.find((p) => p.id === id)?.fullName || id)
        .filter(Boolean);
    },
    [personnel]
  );

  // Auto initialize default client for visit form
  useEffect(() => {
    if (activeClients.length > 0 && !visitForm.clientId) {
      setVisitForm((prev) => ({
        ...prev,
        clientId: activeClients[0].id,
        location: activeClients[0].city
      }));
    }
  }, [activeClients, visitForm.clientId]);

  // Computed metrics for a visit
  const getVisitComputedData = useCallback(
    (schedule: ScheduleItem) => {
      const jobs = scheduleJobs.filter((j) => j.scheduleId === schedule.id);
      const { totalTarget, totalCompleted, progress } = calcUtils.calculateVisitProgress(jobs);

      const hasActiveIssue = issues.some(
        (iss) => iss.scheduleId === schedule.id && iss.status !== 'Resolved'
      );

      const status = calcUtils.getVisitStatus(progress, hasActiveIssue);

      return {
        jobs,
        totalTarget,
        totalCompleted,
        progress,
        status,
        hasActiveIssue
      };
    },
    [scheduleJobs, issues]
  );

  // Computed metrics for a job
  const getJobComputedData = useCallback(
    (job: ScheduleJobItem) => {
      const progress = calcUtils.calculateItemProgress(job.completedQuantity, job.targetQuantity);
      const hasIssue = issues.some((iss) => iss.jobItemId === job.id && iss.status !== 'Resolved');
      const status = calcUtils.getItemStatus(progress, hasIssue);

      return {
        target: job.targetQuantity,
        completed: job.completedQuantity,
        progress,
        status,
        hasIssue
      };
    },
    [issues]
  );

  // Dynamic Executive KPI pipeline
  const kpis = useMemo(() => {
    const monthPrefix = `${calYear}-${String(calMonth + 1).padStart(2, '0')}`;
    const monthVisits = schedules.filter((s) => s.date.startsWith(monthPrefix));

    const totalVisit = monthVisits.length;
    let selesaiVisit = 0;
    let berjalanVisit = 0;
    let terjadwalVisit = 0;
    let kendalaVisit = 0;

    let totalJobItems = 0;
    let unitTargetTotal = 0;
    let unitSelesaiTotal = 0;
    let totalLaporanMasuk = 0;

    monthVisits.forEach((v) => {
      const computed = getVisitComputedData(v);
      if (computed.status === 'Selesai') selesaiVisit++;
      else if (computed.status === 'Sedang Dikerjakan') berjalanVisit++;
      else if (computed.status === 'Ada Kendala') kendalaVisit++;
      else terjadwalVisit++;

      totalJobItems += computed.jobs.length;
      unitTargetTotal += computed.totalTarget;
      unitSelesaiTotal += computed.totalCompleted;
      totalLaporanMasuk += Number(v.laporanMasuk) || 0;
    });

    const overallProgress = unitTargetTotal > 0 ? Math.round((unitSelesaiTotal / unitTargetTotal) * 100) : 0;
    const pendingLaporan = Math.max(0, unitTargetTotal - totalLaporanMasuk);

    return {
      totalVisit,
      selesaiVisit,
      berjalanVisit,
      terjadwalVisit,
      kendalaVisit,
      totalJobItems,
      unitTargetTotal,
      unitSelesaiTotal,
      overallProgress,
      totalLaporanMasuk,
      pendingLaporan
    };
  }, [schedules, calYear, calMonth, getVisitComputedData]);

  const calendarFilteredVisits = useMemo(() => {
    return schedules.filter((s) => {
      const computed = getVisitComputedData(s);
      const clientName = getClientName(s.clientId);
      const matchClient = filterCalClient === 'Semua' || clientName === filterCalClient;
      const matchCategory = filterCalCategory === 'Semua' || s.categories.includes(filterCalCategory as EquipmentCategory);
      const matchPersonnel = filterCalPersonnel === 'Semua' || s.personnelIds.includes(filterCalPersonnel);
      const matchStatus = filterCalStatus === 'Semua' || computed.status === filterCalStatus;
      return matchClient && matchCategory && matchPersonnel && matchStatus;
    });
  }, [schedules, filterCalClient, filterCalCategory, filterCalPersonnel, filterCalStatus, getVisitComputedData, getClientName]);

  const visitsOnSelectedDate = useMemo(() => {
    return calendarFilteredVisits.filter((s) => s.date === selectedDate);
  }, [calendarFilteredVisits, selectedDate]);

  const filteredSchedules = useMemo(() => {
    return schedules.filter((s) => {
      const computed = getVisitComputedData(s);
      const clientName = getClientName(s.clientId);
      const matchClient = filterJadwalClient === 'Semua' || clientName === filterJadwalClient;
      const matchCategory = filterJadwalCategory === 'Semua' || s.categories.includes(filterJadwalCategory as EquipmentCategory);
      const matchPersonnel = filterJadwalPersonnel === 'Semua' || s.personnelIds.includes(filterJadwalPersonnel);
      const matchStatus = filterJadwalStatus === 'Semua' || computed.status === filterJadwalStatus;
      return matchClient && matchCategory && matchPersonnel && matchStatus;
    });
  }, [schedules, filterJadwalClient, filterJadwalCategory, filterJadwalPersonnel, filterJadwalStatus, getVisitComputedData, getClientName]);

  const selectedSchedule = useMemo(() => {
    return schedules.find((s) => s.id === selectedScheduleId) || null;
  }, [schedules, selectedScheduleId]);

  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(calYear, calMonth, 1).getDay();
    const startOffset = (firstDayIndex + 6) % 7; // Monday = 0
    const daysInCurrentMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(calYear, calMonth, 0).getDate();

    const days: { day: number; isCurrentMonth: boolean; dateStr: string; visits: ScheduleItem[] }[] = [];

    // Prev month padding
    for (let i = startOffset - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevM = calMonth === 0 ? 11 : calMonth - 1;
      const prevY = calMonth === 0 ? calYear - 1 : calYear;
      const dateStr = `${prevY}-${String(prevM + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayVisits = calendarFilteredVisits.filter((v) => v.date === dateStr);
      days.push({ day: d, isCurrentMonth: false, dateStr, visits: dayVisits });
    }

    // Current month days
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayVisits = calendarFilteredVisits.filter((v) => v.date === dateStr);
      days.push({ day: d, isCurrentMonth: true, dateStr, visits: dayVisits });
    }

    // Next month padding
    const remaining = (7 - (days.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      const nextM = calMonth === 11 ? 0 : calMonth + 1;
      const nextY = calMonth === 11 ? calYear + 1 : calYear;
      const dateStr = `${nextY}-${String(nextM + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayVisits = calendarFilteredVisits.filter((v) => v.date === dateStr);
      days.push({ day: d, isCurrentMonth: false, dateStr, visits: dayVisits });
    }

    return days;
  }, [calYear, calMonth, calendarFilteredVisits]);

  const handlePrevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear(calYear - 1);
    } else {
      setCalMonth(calMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear(calYear + 1);
    } else {
      setCalMonth(calMonth + 1);
    }
  };

  const handleTodayMonth = () => {
    setCalYear(2026);
    setCalMonth(9);
    setSelectedDate('2026-10-08');
    showToast('Beralih ke Oktober 2026.');
  };

  const handleOpenAddVisit = (prefillDate?: string) => {
    const defaultClient = activeClients[0];
    setVisitForm({
      clientId: defaultClient ? defaultClient.id : '',
      date: prefillDate || selectedDate || '2026-10-08',
      location: defaultClient ? defaultClient.city : 'Surabaya',
      categories: ['PAA'],
      personnelIds: activePersonnel.slice(0, 2).map((p) => p.id),
      notes: '',
      initialJobName: 'Forklift',
      initialTarget: 5
    });
    setIsVisitModalOpen(true);
  };

  const toggleCategoryInVisitForm = (cat: EquipmentCategory) => {
    setVisitForm((prev) => {
      const exists = prev.categories.includes(cat);
      const newCats = exists ? prev.categories.filter((c) => c !== cat) : [...prev.categories, cat];
      return { ...prev, categories: newCats };
    });
  };

  const togglePersonnelInVisitForm = (pId: string) => {
    setVisitForm((prev) => {
      const exists = prev.personnelIds.includes(pId);
      return {
        ...prev,
        personnelIds: exists ? prev.personnelIds.filter((id) => id !== pId) : [...prev.personnelIds, pId]
      };
    });
  };

  const handleSaveVisit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!visitForm.clientId) {
      showToast('Pilih perusahaan klien.', 'warning');
      return;
    }
    if (!visitForm.date) {
      showToast('Tentukan tanggal visit.', 'warning');
      return;
    }
    if (!visitForm.location.trim()) {
      showToast('Isi lokasi fasilitas visit.', 'warning');
      return;
    }
    if (visitForm.categories.length === 0) {
      showToast('Pilih minimal satu kategori pekerjaan.', 'warning');
      return;
    }
    if (visitForm.personnelIds.length === 0) {
      showToast('Pilih minimal satu personel pemeriksa.', 'warning');
      return;
    }

    const newId = `VISIT-${String(schedules.length + 1).padStart(2, '0')}`;
    const dateMonthName = `${INDO_MONTHS[new Date(visitForm.date).getMonth()]} ${new Date(visitForm.date).getFullYear()}`;

    const newSchedule: ScheduleItem = {
      id: newId,
      date: visitForm.date,
      month: dateMonthName,
      clientId: visitForm.clientId,
      location: visitForm.location,
      categories: visitForm.categories,
      personnelIds: visitForm.personnelIds,
      notes: visitForm.notes,
      laporanMasuk: 0
    };

    const newJobs: ScheduleJobItem[] = visitForm.categories.map((cat, idx) => {
      const defaultObj = equipmentObjects.find((o) => o.category === cat && o.isActive)?.name || 'Peralatan Umum';
      return {
        id: `JOB-${newId}-${idx + 1}`,
        scheduleId: newId,
        category: cat,
        objectName: idx === 0 && visitForm.initialJobName ? visitForm.initialJobName : defaultObj,
        targetQuantity: Math.max(1, Number(visitForm.initialTarget) || 5),
        completedQuantity: 0,
        notes: `Pekerjaan riksa uji ${cat}`
      };
    });

    setSchedules((prev) => [...prev, newSchedule]);
    setScheduleJobs((prev) => [...prev, ...newJobs]);
    setSelectedDate(visitForm.date);
    setIsVisitModalOpen(false);
    setSelectedScheduleId(newId);
    showToast(`Visit ${newId} berhasil dibuat.`);
  };

  const handleDeleteVisit = (scheduleId: string) => {
    const sch = schedules.find((s) => s.id === scheduleId);
    const clientName = sch ? getClientName(sch.clientId) : scheduleId;

    setPendingConfirm({
      title: 'Hapus Kunjungan Visit?',
      message: `Visit "${scheduleId}" (${clientName}) beserta seluruh detail pekerjaan dan kendala terkait akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.`,
      confirmText: 'Hapus Visit',
      danger: true,
      onConfirm: () => {
        setSchedules((prev) => prev.filter((s) => s.id !== scheduleId));
        setScheduleJobs((prev) => prev.filter((j) => j.scheduleId !== scheduleId));
        setIssues((prev) => prev.filter((i) => i.scheduleId !== scheduleId));
        if (selectedScheduleId === scheduleId) {
          setSelectedScheduleId(null);
        }
        showToast(`Visit ${scheduleId} berhasil dihapus.`);
      }
    });
  };

  const handleUpdateJobCompleted = (jobId: string, newCompleted: number) => {
    setScheduleJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          const clamped = Math.max(0, Math.min(j.targetQuantity, newCompleted));
          return { ...j, completedQuantity: clamped };
        }
        return j;
      })
    );
  };

  const handleUpdateLaporan = (scheduleId: string, newCount: number) => {
    setSchedules((prev) =>
      prev.map((sch) => {
        if (sch.id === scheduleId) {
          const computed = getVisitComputedData(sch);
          const clamped = Math.max(0, Math.min(computed.totalTarget, newCount));
          return { ...sch, laporanMasuk: clamped };
        }
        return sch;
      })
    );
    showToast('Jumlah laporan masuk diperbarui.');
  };

  const handleOpenAddJob = (scheduleId: string, defaultCat?: EquipmentCategory) => {
    setEditingJob(null);
    setJobModalScheduleId(scheduleId);
    const cat = defaultCat || 'PAA';
    const firstObj = equipmentObjects.find((o) => o.category === cat && o.isActive)?.name || 'Forklift';

    setJobForm({
      category: cat,
      objectName: firstObj,
      customObjectName: '',
      isCustomObject: false,
      saveToMaster: false,
      targetQuantity: 5,
      completedQuantity: 0,
      notes: ''
    });
    setIsJobModalOpen(true);
  };

  const handleOpenEditJob = (job: ScheduleJobItem) => {
    setEditingJob(job);
    setJobModalScheduleId(job.scheduleId);
    const isCustom = !equipmentObjects.some((o) => o.name === job.objectName && o.category === job.category);

    setJobForm({
      category: job.category,
      objectName: isCustom ? '__CUSTOM__' : job.objectName,
      customObjectName: isCustom ? job.objectName : '',
      isCustomObject: isCustom,
      saveToMaster: false,
      targetQuantity: job.targetQuantity,
      completedQuantity: job.completedQuantity,
      notes: job.notes
    });
    setIsJobModalOpen(true);
  };

  const handleSaveJob = (e: React.FormEvent) => {
    e.preventDefault();

    const targetQty = Number(jobForm.targetQuantity);
    const completedQty = Number(jobForm.completedQuantity) || 0;

    const validation = calcUtils.validateQuantities(targetQty, completedQty);
    if (!validation.valid) {
      showToast(validation.error || 'Validasi kuantitas gagal.', 'warning');
      return;
    }

    let finalObjName = jobForm.objectName;
    if (jobForm.isCustomObject || jobForm.objectName === '__CUSTOM__') {
      if (!jobForm.customObjectName.trim()) {
        showToast('Isi nama objek spesifik.', 'warning');
        return;
      }
      finalObjName = jobForm.customObjectName.trim();

      if (jobForm.saveToMaster) {
        const alreadyExists = equipmentObjects.some(
          (o) => o.name.toLowerCase() === finalObjName.toLowerCase() && o.category === jobForm.category
        );
        if (!alreadyExists) {
          const newObjId = `OBJ-${String(equipmentObjects.length + 1).padStart(2, '0')}`;
          const newMasterObj: EquipmentObjectItem = {
            id: newObjId,
            name: finalObjName,
            category: jobForm.category,
            description: `Ditambahkan dari pekerjaan lapangan visit ${jobModalScheduleId}`,
            isActive: true
          };
          setEquipmentObjects((prev) => [...prev, newMasterObj]);
          showToast(`Objek "${finalObjName}" disimpan ke Master Data.`);
        }
      }
    }

    if (editingJob) {
      setScheduleJobs((prev) =>
        prev.map((j) =>
          j.id === editingJob.id
            ? {
                ...j,
                category: jobForm.category,
                objectName: finalObjName,
                targetQuantity: targetQty,
                completedQuantity: completedQty,
                notes: jobForm.notes
              }
            : j
        )
      );
      showToast(`Pekerjaan ${finalObjName} diperbarui.`);
    } else {
      const newJobId = `JOB-${jobModalScheduleId}-${Date.now().toString().slice(-4)}`;
      const newJobItem: ScheduleJobItem = {
        id: newJobId,
        scheduleId: jobModalScheduleId,
        category: jobForm.category,
        objectName: finalObjName,
        targetQuantity: targetQty,
        completedQuantity: completedQty,
        notes: jobForm.notes
      };

      setSchedules((prev) =>
        prev.map((s) => {
          if (s.id === jobModalScheduleId && !s.categories.includes(jobForm.category)) {
            return { ...s, categories: [...s.categories, jobForm.category] };
          }
          return s;
        })
      );

      setScheduleJobs((prev) => [...prev, newJobItem]);
      showToast(`Pekerjaan "${finalObjName}" (${targetQty} unit) ditambahkan.`);
    }

    setIsJobModalOpen(false);
  };

  const handleDeleteJob = (job: ScheduleJobItem) => {
    setPendingConfirm({
      title: 'Hapus Pekerjaan Ini?',
      message: `Pekerjaan "${job.objectName}" (${job.targetQuantity} unit) akan dihapus dari visit ini. Total unit dan persentase progress visit akan dihitung ulang secara otomatis.`,
      confirmText: 'Hapus Pekerjaan',
      danger: true,
      onConfirm: () => {
        setScheduleJobs((prev) => prev.filter((j) => j.id !== job.id));
        setIssues((prev) => prev.filter((i) => i.jobItemId !== job.id));
        showToast(`Pekerjaan ${job.objectName} berhasil dihapus.`);
      }
    });
  };

  const handleOpenAddClient = () => {
    setEditingClient(null);
    setClientForm({
      clientCode: `CLI-${String(clients.length + 1).padStart(2, '0')}`,
      companyName: '',
      address: '',
      city: 'Surabaya',
      pic: '',
      phone: '',
      email: '',
      isActive: true
    });
    setIsClientModalOpen(true);
  };

  const handleOpenEditClient = (c: ClientItem) => {
    setEditingClient(c);
    setClientForm({
      clientCode: c.clientCode,
      companyName: c.companyName,
      address: c.address,
      city: c.city,
      pic: c.pic,
      phone: c.phone,
      email: c.email,
      isActive: c.isActive
    });
    setIsClientModalOpen(true);
  };

  const handleSaveClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientForm.companyName.trim()) {
      showToast('Nama perusahaan klien wajib diisi.', 'warning');
      return;
    }

    if (editingClient) {
      setClients((prev) =>
        prev.map((c) =>
          c.id === editingClient.id
            ? {
                ...c,
                clientCode: clientForm.clientCode,
                companyName: clientForm.companyName,
                address: clientForm.address,
                city: clientForm.city,
                pic: clientForm.pic,
                phone: clientForm.phone,
                email: clientForm.email,
                isActive: clientForm.isActive
              }
            : c
        )
      );
      showToast(`Data klien ${clientForm.companyName} diperbarui.`);
    } else {
      const newId = `CLI-${String(clients.length + 1).padStart(2, '0')}`;
      const newClient: ClientItem = {
        id: newId,
        clientCode: clientForm.clientCode,
        companyName: clientForm.companyName,
        address: clientForm.address,
        city: clientForm.city,
        pic: clientForm.pic,
        phone: clientForm.phone,
        email: clientForm.email,
        isActive: clientForm.isActive,
        createdAt: '2026-10-08'
      };
      setClients((prev) => [...prev, newClient]);
      showToast(`Klien baru ${clientForm.companyName} ditambahkan.`);
    }
    setIsClientModalOpen(false);
  };

  const handleToggleClientStatus = (c: ClientItem) => {
    if (c.isActive) {
      setPendingConfirm({
        title: 'Nonaktifkan Klien?',
        message: `Klien "${c.companyName}" akan dinonaktifkan dan tidak muncul pada pilihan pembuatan visit baru. Seluruh histori visit sebelumnya tetap aman.`,
        confirmText: 'Nonaktifkan',
        danger: true,
        onConfirm: () => {
          setClients((prev) => prev.map((item) => (item.id === c.id ? { ...item, isActive: false } : item)));
          showToast(`Klien ${c.companyName} dinonaktifkan.`);
        }
      });
    } else {
      setClients((prev) => prev.map((item) => (item.id === c.id ? { ...item, isActive: true } : item)));
      showToast(`Klien ${c.companyName} diaktifkan kembali.`);
    }
  };

  const handleOpenAddPersonnel = () => {
    const nextNum = personnel.length + 1;
    setEditingPersonnel(null);
    setPersonnelForm({
      employeeCode: `PLS-INS-${String(nextNum).padStart(2, '0')}`,
      fullName: '',
      role: 'Inspector Madya',
      expertise: '',
      phone: '',
      email: '',
      isActive: true
    });
    setIsPersonnelModalOpen(true);
  };

  const handleOpenEditPersonnel = (p: PersonnelItem) => {
    setEditingPersonnel(p);
    setPersonnelForm({
      employeeCode: p.employeeCode,
      fullName: p.fullName,
      role: p.role,
      expertise: p.expertise,
      phone: p.phone,
      email: p.email,
      isActive: p.isActive
    });
    setIsPersonnelModalOpen(true);
  };

  const handleSavePersonnel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personnelForm.fullName.trim()) {
      showToast('Nama lengkap personel wajib diisi.', 'warning');
      return;
    }

    if (editingPersonnel) {
      setPersonnel((prev) =>
        prev.map((item) =>
          item.id === editingPersonnel.id
            ? {
                ...item,
                employeeCode: personnelForm.employeeCode,
                fullName: personnelForm.fullName,
                role: personnelForm.role,
                expertise: personnelForm.expertise,
                phone: personnelForm.phone,
                email: personnelForm.email,
                isActive: personnelForm.isActive
              }
            : item
        )
      );
      showToast(`Data personel ${personnelForm.fullName} diperbarui.`);
    } else {
      const newId = `PER-${String(personnel.length + 1).padStart(2, '0')}`;
      const newPersonnel: PersonnelItem = {
        id: newId,
        employeeCode: personnelForm.employeeCode,
        fullName: personnelForm.fullName,
        role: personnelForm.role,
        expertise: personnelForm.expertise,
        phone: personnelForm.phone,
        email: personnelForm.email,
        isActive: personnelForm.isActive,
        createdAt: '2026-10-08'
      };
      setPersonnel((prev) => [...prev, newPersonnel]);
      showToast(`Personel baru ${personnelForm.fullName} ditambahkan.`);
    }
    setIsPersonnelModalOpen(false);
  };

  const handleTogglePersonnelStatus = (p: PersonnelItem) => {
    if (p.isActive) {
      setPendingConfirm({
        title: 'Nonaktifkan Personel?',
        message: `Personel "${p.fullName}" akan dinonaktifkan dan tidak dapat ditugaskan pada visit baru. Histori tugas sebelumnya tetap aman.`,
        confirmText: 'Nonaktifkan',
        danger: true,
        onConfirm: () => {
          setPersonnel((prev) => prev.map((item) => (item.id === p.id ? { ...item, isActive: false } : item)));
          showToast(`Personel ${p.fullName} dinonaktifkan.`);
        }
      });
    } else {
      setPersonnel((prev) => prev.map((item) => (item.id === p.id ? { ...item, isActive: true } : item)));
      showToast(`Personel ${p.fullName} aktif kembali.`);
    }
  };

  const handleOpenAddObject = (defaultCat?: EquipmentCategory) => {
    setEditingObject(null);
    setObjectForm({
      name: '',
      category: defaultCat || 'PAA',
      description: '',
      isActive: true
    });
    setIsObjectModalOpen(true);
  };

  const handleSaveObject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!objectForm.name.trim()) {
      showToast('Nama objek spesifik wajib diisi.', 'warning');
      return;
    }

    if (editingObject) {
      setEquipmentObjects((prev) =>
        prev.map((o) =>
          o.id === editingObject.id
            ? {
                ...o,
                name: objectForm.name,
                category: objectForm.category,
                description: objectForm.description,
                isActive: objectForm.isActive
              }
            : o
        )
      );
      showToast(`Objek spesifik ${objectForm.name} diperbarui.`);
    } else {
      const newId = `OBJ-${String(equipmentObjects.length + 1).padStart(2, '0')}`;
      const newObj: EquipmentObjectItem = {
        id: newId,
        name: objectForm.name,
        category: objectForm.category,
        description: objectForm.description,
        isActive: objectForm.isActive
      };
      setEquipmentObjects((prev) => [...prev, newObj]);
      showToast(`Objek baru "${objectForm.name}" berhasil ditambahkan.`);
    }
    setIsObjectModalOpen(false);
  };

  const handleToggleObjectStatus = (obj: EquipmentObjectItem) => {
    setEquipmentObjects((prev) =>
      prev.map((o) => (o.id === obj.id ? { ...o, isActive: !o.isActive } : o))
    );
    showToast(`Status objek ${obj.name} diubah menjadi ${!obj.isActive ? 'Aktif' : 'Nonaktif'}.`);
  };

  const handleOpenAddIssue = (scheduleId: string, jobItem?: ScheduleJobItem) => {
    setIssueForm({
      scheduleId,
      jobItemId: jobItem ? jobItem.id : '',
      category: ISSUE_CATEGORIES[0],
      description: '',
      status: 'Waiting Client',
      resolutionNotes: ''
    });
    setIsIssueModalOpen(true);
  };

  const handleSaveIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueForm.description.trim()) {
      showToast('Deskripsi kendala wajib diisi.', 'warning');
      return;
    }

    const newId = `ISS-${String(issues.length + 1).padStart(2, '0')}`;
    const newIssue: IssueItem = {
      id: newId,
      scheduleId: issueForm.scheduleId,
      jobItemId: issueForm.jobItemId || undefined,
      category: issueForm.category,
      description: issueForm.description,
      status: issueForm.status,
      date: '2026-10-08',
      resolutionNotes: issueForm.resolutionNotes
    };

    setIssues((prev) => [...prev, newIssue]);
    setIsIssueModalOpen(false);
    showToast('Kendala operasional dicatat.');
  };

  const handleToggleIssueStatus = (issueId: string, newStatus: IssueStatus) => {
    setIssues((prev) =>
      prev.map((item) => (item.id === issueId ? { ...item, status: newStatus } : item))
    );
    showToast(`Status kendala diubah ke ${newStatus}.`);
  };

  const handleResetData = () => {
    setPendingConfirm({
      title: 'Reset ke Data Awal?',
      message: 'Seluruh data localStorage akan direset kembali ke data default simulasi awal. Gunakan opsi ini jika ingin memulai pengujian ulang.',
      confirmText: 'Reset Sekarang',
      danger: true,
      onConfirm: () => {
        storage.resetAll();
        setClients(SEED_CLIENTS);
        setPersonnel(SEED_PERSONNEL);
        setEquipmentObjects(SEED_OBJECTS);
        setSchedules(SEED_SCHEDULES);
        setScheduleJobs(SEED_SCHEDULE_JOBS);
        setIssues(SEED_ISSUES);
        setSelectedScheduleId(null);
        showToast('Data berhasil direset ke kondisi awal simulasi.');
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex flex-col md:flex-row antialiased select-none">
      {/* Toast Notification Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto px-4 py-2.5 rounded-lg text-xs font-semibold shadow-lg border flex items-center space-x-2 transition-all transform translate-y-0 ${
              t.type === 'warning'
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-emerald-50 text-[#0F4A32] border-emerald-300'
            }`}
          >
            <span>{t.type === 'warning' ? '⚠️' : '✓'}</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Confirmation Dialog Component */}
      <ConfirmationModal
        isOpen={Boolean(pendingConfirm)}
        title={pendingConfirm?.title || ''}
        message={pendingConfirm?.message || ''}
        confirmText={pendingConfirm?.confirmText}
        danger={pendingConfirm?.danger}
        onConfirm={() => {
          pendingConfirm?.onConfirm();
          setPendingConfirm(null);
        }}
        onCancel={() => setPendingConfirm(null)}
      />

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#7A1215] text-white flex-shrink-0 flex flex-col justify-between shadow-lg z-20">
        <div>
          {/* Header Brand */}
          <div className="p-4 md:p-5 border-b border-rose-900/60 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-[#0F4A32] flex items-center justify-center font-black text-sm text-white shadow-inner border border-emerald-400/40">
                PLS
              </div>
              <div>
                <h1 className="font-extrabold tracking-tight text-sm text-white leading-tight">PLS WORK MONITOR</h1>
                <p className="text-[10px] text-rose-200 tracking-wider font-semibold">PT PRIMA LAKSANA SARANA</p>
              </div>
            </div>

            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="md:hidden p-1.5 rounded-md text-white hover:bg-rose-900 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileNavOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>

          {/* Navigation Menus */}
          <nav className={`p-3 space-y-4 ${isMobileNavOpen ? 'block' : 'hidden md:block'}`}>
            <div>
              <span className="px-2 text-[10px] uppercase tracking-wider font-extrabold text-rose-300/80 block mb-1.5">
                OPERASIONAL
              </span>
              <div className="space-y-1">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                  { id: 'kalender', label: 'Kalender Visit', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                  { id: 'jadwal', label: 'Jadwal Visit', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
                  { id: 'progress', label: 'Progress Visit', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                  { id: 'kendala', label: 'Kendala', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
                  { id: 'laporan', label: 'Monitoring Laporan', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' }
                ].map((menu) => {
                  const isActive = activeTab === menu.id;
                  return (
                    <button
                      key={menu.id}
                      onClick={() => {
                        setActiveTab(menu.id as any);
                        setIsMobileNavOpen(false);
                      }}
                      className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-[#0F4A32] text-white shadow-sm border-l-4 border-emerald-400'
                          : 'text-rose-100 hover:bg-rose-900/50 hover:text-white'
                      }`}
                    >
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menu.icon} />
                      </svg>
                      <span>{menu.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="px-2 text-[10px] uppercase tracking-wider font-extrabold text-rose-300/80 block mb-1.5">
                MASTER DATA
              </span>
              <div className="space-y-1">
                {[
                  { id: 'master-klien', label: 'Perusahaan Klien', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
                  { id: 'master-personel', label: 'Personel Lapangan', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
                  { id: 'master-objek', label: 'Kategori & Objek', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' }
                ].map((menu) => {
                  const isActive = activeTab === menu.id;
                  return (
                    <button
                      key={menu.id}
                      onClick={() => {
                        setActiveTab(menu.id as any);
                        setIsMobileNavOpen(false);
                      }}
                      className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-[#0F4A32] text-white shadow-sm border-l-4 border-emerald-400'
                          : 'text-rose-100 hover:bg-rose-900/50 hover:text-white'
                      }`}
                    >
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menu.icon} />
                      </svg>
                      <span>{menu.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>
        </div>

        {/* Sidebar Footer with Reset Button */}
        <div className={`p-4 border-t border-rose-900/60 text-xs text-rose-200/80 ${isMobileNavOpen ? 'block' : 'hidden md:block'}`}>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-white text-[11px]">Sistem Internal Operasional</span>
          </div>
          <p className="mt-1 text-[10px] text-rose-200/60">Persistent LocalStorage • Ready for Supabase</p>
          <button
            onClick={handleResetData}
            className="mt-3 w-full py-1.5 px-2 bg-rose-900/40 hover:bg-rose-900/80 text-[10px] text-rose-100 rounded border border-rose-800 font-semibold transition-colors flex items-center justify-center space-x-1"
          >
            <span>🔄 Reset Data Simulasi</span>
          </button>
        </div>
      </aside>

      {/* Main App Canvas Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-10 shadow-2xs">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#7A1215]">
                PLS WORK MONITOR V1.6
              </span>
              <span className="text-slate-300 text-xs">/</span>
              <span className="text-xs font-semibold text-slate-500">
                {activeTab === 'dashboard'
                  ? 'Dashboard Monitoring Pekerjaan'
                  : activeTab === 'kalender'
                  ? 'Kalender Visit Operasional'
                  : activeTab === 'jadwal'
                  ? 'Jadwal Visit Lapangan'
                  : activeTab === 'progress'
                  ? 'Progress Pekerjaan Visit'
                  : activeTab === 'kendala'
                  ? 'Kendala Operasional'
                  : activeTab === 'laporan'
                  ? 'Monitoring Laporan'
                  : activeTab === 'master-klien'
                  ? 'Master Perusahaan Klien'
                  : activeTab === 'master-personel'
                  ? 'Master Personel Lapangan'
                  : 'Master Kategori & Objek Spesifik'}
              </span>
            </div>
            <h2 className="text-lg md:text-xl font-bold text-slate-900 mt-0.5">
              {activeTab === 'dashboard' && 'Dashboard Monitoring Visit & Pekerjaan'}
              {activeTab === 'kalender' && 'Kalender Visit & Pelaksanaan'}
              {activeTab === 'jadwal' && 'Daftar Jadwal Visit Lapangan'}
              {activeTab === 'progress' && 'Monitoring Progress Visit & Pekerjaan'}
              {activeTab === 'kendala' && 'Kendala & Hambatan Lapangan'}
              {activeTab === 'laporan' && 'Monitoring Laporan Masuk'}
              {activeTab === 'master-klien' && 'Master Data Perusahaan Klien'}
              {activeTab === 'master-personel' && 'Master Data Personel & Ahli K3'}
              {activeTab === 'master-objek' && 'Kategori K3 & Objek Spesifik'}
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            {(activeTab === 'dashboard' || activeTab === 'kalender' || activeTab === 'jadwal') && (
              <button
                onClick={() => handleOpenAddVisit()}
                className="bg-[#7A1215] hover:bg-[#600e10] text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1 shadow-2xs transition-colors"
              >
                <span>+ Tambah Visit</span>
              </button>
            )}

            {activeTab === 'kendala' && (
              <button
                onClick={() => handleOpenAddIssue(schedules[0]?.id || '')}
                className="bg-[#7A1215] hover:bg-[#600e10] text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1 shadow-2xs"
              >
                <span>+ Tambah Kendala</span>
              </button>
            )}

            {activeTab === 'master-klien' && (
              <button
                onClick={handleOpenAddClient}
                className="bg-[#7A1215] hover:bg-[#600e10] text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1 shadow-2xs"
              >
                <span>+ Tambah Klien</span>
              </button>
            )}

            {activeTab === 'master-personel' && (
              <button
                onClick={handleOpenAddPersonnel}
                className="bg-[#7A1215] hover:bg-[#600e10] text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1 shadow-2xs"
              >
                <span>+ Tambah Personel</span>
              </button>
            )}

            {activeTab === 'master-objek' && (
              <button
                onClick={() => handleOpenAddObject()}
                className="bg-[#7A1215] hover:bg-[#600e10] text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1 shadow-2xs"
              >
                <span>+ Tambah Objek</span>
              </button>
            )}
          </div>
        </header>

        {/* Content Body */}
        <main className="p-4 md:p-8 space-y-6 flex-1 max-w-7xl w-full mx-auto">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Period Switcher */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-500">Periode Aktif:</span>
                  <span className="text-sm font-extrabold text-[#7A1215]">{currentMonthLabel}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={handlePrevMonth}
                    className="px-2.5 py-1 rounded border border-slate-300 text-xs font-semibold hover:bg-slate-50 transition-colors"
                  >
                    ‹ Bulan Lalu
                  </button>
                  <button
                    onClick={handleTodayMonth}
                    className="px-2.5 py-1 rounded bg-[#0F4A32] text-white text-xs font-bold hover:bg-[#0b3624] transition-colors"
                  >
                    Bulan Ini
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="px-2.5 py-1 rounded border border-slate-300 text-xs font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Bulan Depan ›
                  </button>
                </div>
              </div>

              {/* 5 Distinct Dashboard Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">TOTAL VISIT</span>
                  <div className="mt-1 text-2xl font-black text-slate-900">{kpis.totalVisit}</div>
                  <p className="text-[10px] text-slate-400 mt-0.5">Kunjungan lapangan</p>
                </div>

                <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">TOTAL PEKERJAAN</span>
                  <div className="mt-1 text-2xl font-black text-teal-800">{kpis.totalJobItems}</div>
                  <p className="text-[10px] text-teal-700/80 mt-0.5">Rincian item alat</p>
                </div>

                <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F4A32]">UNIT REALISASI</span>
                  <div className="mt-1 text-2xl font-black text-[#0F4A32]">
                    {kpis.unitSelesaiTotal} <span className="text-xs text-slate-400 font-semibold">/ {kpis.unitTargetTotal} unit</span>
                  </div>
                  <p className="text-[10px] text-emerald-700/80 mt-0.5">{kpis.overallProgress}% total unit teruji</p>
                </div>

                <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">VISIT BERJALAN</span>
                  <div className="mt-1 text-2xl font-black text-amber-700">{kpis.berjalanVisit}</div>
                  <p className="text-[10px] text-amber-800/80 mt-0.5">{kpis.selesaiVisit} visit selesai</p>
                </div>

                <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs col-span-2 md:col-span-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A1215]">VISIT KENDALA</span>
                  <div className="mt-1 text-2xl font-black text-[#7A1215]">{kpis.kendalaVisit}</div>
                  <p className="text-[10px] text-rose-700/80 mt-0.5">{kpis.totalLaporanMasuk} laporan masuk</p>
                </div>
              </div>

              {/* Progress Keseluruhan Card */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Progress Kumulatif Unit K3 {currentMonthLabel}</h3>
                    <p className="text-xs text-slate-500">
                      Dihitung dari bobot unit teruji di seluruh detail pekerjaan visit ({kpis.unitSelesaiTotal} selesai dari {kpis.unitTargetTotal} unit target).
                    </p>
                  </div>
                  <span className="text-lg font-black text-[#0F4A32]">{kpis.overallProgress}%</span>
                </div>
                <ProgressBar progress={kpis.overallProgress} color="green" />
              </div>

              {/* Jadwal Terdekat & Kendala Aktif */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">Jadwal Visit Lapangan Terdekat</h3>
                      <p className="text-xs text-slate-500">Menampilkan visit dengan detail pekerjaan aktif</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('jadwal')}
                      className="text-xs font-semibold text-[#7A1215] hover:text-[#600e10]"
                    >
                      Lihat Semua Visit →
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-4">Tanggal</th>
                          <th className="py-2.5 px-4">Perusahaan</th>
                          <th className="py-2.5 px-4">Pekerjaan</th>
                          <th className="py-2.5 px-4">Unit</th>
                          <th className="py-2.5 px-4">Personel</th>
                          <th className="py-2.5 px-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {schedules.slice(0, 5).map((job) => {
                          const computed = getVisitComputedData(job);
                          const clientName = getClientName(job.clientId);
                          const pNames = getPersonnelNames(job.personnelIds);
                          return (
                            <tr
                              key={job.id}
                              onClick={() => setSelectedScheduleId(job.id)}
                              className="hover:bg-slate-50 cursor-pointer transition-colors"
                            >
                              <td className="py-3 px-4 font-semibold text-slate-700 whitespace-nowrap">{job.date}</td>
                              <td className="py-3 px-4 font-bold text-slate-900">{clientName}</td>
                              <td className="py-3 px-4">
                                <span className="font-medium text-slate-800">
                                  {computed.jobs.length} pekerjaan ({job.categories.join(', ')})
                                </span>
                              </td>
                              <td className="py-3 px-4 font-semibold text-slate-700">
                                {computed.totalCompleted}/{computed.totalTarget} unit
                              </td>
                              <td className="py-3 px-4 text-slate-800">
                                {pNames.slice(0, 2).join(', ')}{pNames.length > 2 && ` +${pNames.length - 2}`}
                              </td>
                              <td className="py-3 px-4">
                                <StatusBadge status={computed.status} />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Kendala Aktif */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between overflow-hidden">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">Kendala Aktif</h3>
                      <p className="text-xs text-slate-500">Hambatan operasional riil</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-rose-50 text-[#7A1215] text-[11px] font-bold border border-rose-200">
                      {issues.filter((i) => i.status !== 'Resolved').length} Aktif
                    </span>
                  </div>

                  <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-72">
                    {issues.filter((i) => i.status !== 'Resolved').length === 0 ? (
                      <EmptyState title="Tidak ada kendala aktif" description="Seluruh pekerjaan berjalan lancar tanpa kendala." />
                    ) : (
                      issues
                        .filter((i) => i.status !== 'Resolved')
                        .slice(0, 4)
                        .map((iss) => {
                          const linkedSch = schedules.find((s) => s.id === iss.scheduleId);
                          const clientName = linkedSch ? getClientName(linkedSch.clientId) : 'Klien Lapangan';
                          const linkedJob = scheduleJobs.find((j) => j.id === iss.jobItemId);

                          return (
                            <div
                              key={iss.id}
                              className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-white space-y-1 transition-colors"
                            >
                              <div className="flex justify-between items-start gap-1">
                                <span className="font-bold text-xs text-slate-900">{clientName}</span>
                                <StatusBadge status={iss.status} />
                              </div>
                              <p className="text-[11px] text-[#7A1215] font-semibold">
                                {linkedJob ? `[${linkedJob.category}] ${linkedJob.objectName}` : 'Pekerjaan Visit'}
                              </p>
                              <p className="text-xs text-slate-700 line-clamp-2">{iss.description}</p>
                            </div>
                          );
                        })
                    )}
                  </div>

                  <div className="p-3 border-t border-slate-100 bg-slate-50">
                    <button
                      onClick={() => setActiveTab('kendala')}
                      className="w-full py-1.5 px-3 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
                    >
                      Buka Halaman Kendala
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Kalender Tab */}
          {activeTab === 'kalender' && (
            <div className="space-y-5">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handlePrevMonth}
                      className="p-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
                    >
                      ‹ Bulan Sebelumnya
                    </button>
                    <h3 className="text-base font-extrabold text-[#7A1215] px-2">{currentMonthLabel}</h3>
                    <button
                      onClick={handleNextMonth}
                      className="p-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
                    >
                      Bulan Berikutnya ›
                    </button>
                    <button
                      onClick={handleTodayMonth}
                      className="ml-2 px-3 py-1.5 rounded-lg bg-[#0F4A32] text-white text-xs font-bold hover:bg-[#0b3624] transition-colors"
                    >
                      Hari Ini
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenAddVisit(selectedDate)}
                      className="bg-[#7A1215] hover:bg-[#600e10] text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center space-x-1.5 shadow-2xs transition-colors"
                    >
                      <span>+ Tambah Visit</span>
                    </button>
                  </div>
                </div>

                {/* Unified Calendar Filters */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Perusahaan</label>
                    <select
                      value={filterCalClient}
                      onChange={(e) => setFilterCalClient(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 font-semibold focus:outline-none"
                    >
                      <option value="Semua">Semua Perusahaan</option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.companyName}>{c.companyName}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Kategori</label>
                    <select
                      value={filterCalCategory}
                      onChange={(e) => setFilterCalCategory(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 font-semibold focus:outline-none"
                    >
                      <option value="Semua">Semua Kategori</option>
                      {EQUIPMENT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Personel</label>
                    <select
                      value={filterCalPersonnel}
                      onChange={(e) => setFilterCalPersonnel(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 font-semibold focus:outline-none"
                    >
                      <option value="Semua">Semua Personel</option>
                      {personnel.map((p) => (
                        <option key={p.id} value={p.id}>{p.fullName}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Status</label>
                    <select
                      value={filterCalStatus}
                      onChange={(e) => setFilterCalStatus(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 font-semibold focus:outline-none"
                    >
                      <option value="Semua">Semua Status</option>
                      <option value="Belum Mulai">Belum Mulai</option>
                      <option value="Terjadwal">Terjadwal</option>
                      <option value="Sedang Dikerjakan">Sedang Dikerjakan</option>
                      <option value="Ada Kendala">Ada Kendala</option>
                      <option value="Selesai">Selesai</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 7-Column Calendar Grid */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="grid grid-cols-7 bg-slate-50 text-slate-700 font-bold text-xs border-b border-slate-200 text-center py-2.5">
                  <div>Senin</div>
                  <div>Selasa</div>
                  <div>Rabu</div>
                  <div>Kamis</div>
                  <div>Jumat</div>
                  <div>Sabtu</div>
                  <div className="text-rose-600">Minggu</div>
                </div>

                <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 text-xs">
                  {calendarDays.map((cd, idx) => {
                    const isSelected = cd.dateStr === selectedDate;
                    const isToday = cd.dateStr === '2026-10-08';
                    const hasVisits = cd.visits.length > 0;

                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedDate(cd.dateStr)}
                        className={`min-h-[92px] md:min-h-[110px] p-2 transition-all cursor-pointer flex flex-col justify-between ${
                          !cd.isCurrentMonth
                            ? 'bg-slate-50/40 text-slate-400'
                            : isSelected
                            ? 'bg-rose-50/70 ring-2 ring-inset ring-[#7A1215]'
                            : 'bg-white hover:bg-slate-50/80'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span
                            className={`w-6 h-6 flex items-center justify-center rounded-full text-[11px] font-bold ${
                              isToday
                                ? 'bg-[#7A1215] text-white'
                                : isSelected
                                ? 'bg-rose-200 text-rose-900'
                                : 'text-slate-700'
                            }`}
                          >
                            {cd.day}
                          </span>
                          {hasVisits && (
                            <span className="text-[10px] font-black text-[#0F4A32] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              {cd.visits.length} Visit
                            </span>
                          )}
                        </div>

                        <div className="mt-1 space-y-1 overflow-hidden">
                          {cd.visits.slice(0, 2).map((v) => {
                            const cName = getClientName(v.clientId);
                            return (
                              <div
                                key={v.id}
                                className="text-[10px] truncate px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 font-medium text-slate-800 flex items-center space-x-1"
                                title={`${cName} (${v.categories.join(', ')})`}
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-[#7A1215] flex-shrink-0"></span>
                                <span className="truncate">{cName}</span>
                              </div>
                            );
                          })}
                          {cd.visits.length > 2 && (
                            <div className="text-[9px] text-[#7A1215] font-bold px-1">
                              +{cd.visits.length - 2} visit lainnya
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selected Date Details Panel */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                      DAFTAR VISIT PADA TANGGAL INI
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                      📅 {selectedDate} ({visitsOnSelectedDate.length} Kunjungan Terdaftar)
                    </h3>
                  </div>

                  <button
                    onClick={() => handleOpenAddVisit(selectedDate)}
                    className="bg-[#0F4A32] hover:bg-[#0b3624] text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1"
                  >
                    <span>+ Tambah Visit pada Tanggal Ini</span>
                  </button>
                </div>

                {visitsOnSelectedDate.length === 0 ? (
                  <EmptyState
                    title="Belum ada visit pada tanggal ini"
                    description={`Tidak ada jadwal pemeriksaan K3 untuk tanggal ${selectedDate}. Silakan tambahkan visit baru.`}
                    actionText="+ Buat Visit Sekarang"
                    onAction={() => handleOpenAddVisit(selectedDate)}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {visitsOnSelectedDate.map((job, idx) => {
                      const computed = getVisitComputedData(job);
                      const clientName = getClientName(job.clientId);
                      const pNames = getPersonnelNames(job.personnelIds);
                      return (
                        <div
                          key={job.id}
                          className="p-4 rounded-xl border border-slate-200 bg-white hover:border-[#7A1215]/50 shadow-2xs space-y-3 transition-all flex flex-col justify-between"
                        >
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">
                                  VISIT {idx + 1} • {job.id}
                                </span>
                                <h4 className="text-sm font-bold text-slate-900">{clientName}</h4>
                                <p className="text-xs text-slate-500">📍 {job.location}</p>
                              </div>
                              <StatusBadge status={computed.status} />
                            </div>

                            {/* Pekerjaan List Preview */}
                            <div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                                Rincian Pekerjaan ({computed.jobs.length} Item):
                              </span>
                              <div className="space-y-1">
                                {computed.jobs.slice(0, 3).map((jb) => {
                                  const jc = getJobComputedData(jb);
                                  return (
                                    <div
                                      key={jb.id}
                                      className="flex justify-between items-center bg-slate-50 px-2 py-1 rounded text-[11px] border border-slate-200/60"
                                    >
                                      <span className="font-semibold text-slate-800 truncate">
                                        [{jb.category}] {jb.objectName}
                                      </span>
                                      <span className="font-mono text-slate-600 flex-shrink-0 ml-2">
                                        {jb.completedQuantity}/{jb.targetQuantity} unit ({jc.progress}%)
                                      </span>
                                    </div>
                                  );
                                })}
                                {computed.jobs.length > 3 && (
                                  <div className="text-[10px] text-slate-400 italic">
                                    +{computed.jobs.length - 3} pekerjaan lainnya...
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Personnel */}
                            <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
                              <span className="font-bold block text-[10px] text-slate-500 uppercase mb-0.5">
                                Tim Personel Pemeriksa:
                              </span>
                              <p className="font-semibold text-slate-900">{pNames.join(', ')}</p>
                            </div>

                            {/* Weighted Progress */}
                            <div>
                              <div className="flex justify-between text-xs font-semibold mb-1">
                                <span className="text-slate-600">Progress Visit:</span>
                                <span className="font-bold text-[#7A1215]">
                                  {computed.totalCompleted}/{computed.totalTarget} Unit ({computed.progress}%)
                                </span>
                              </div>
                              <ProgressBar progress={computed.progress} color={computed.progress === 100 ? 'green' : 'maroon'} />
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[11px] text-slate-400">
                              Laporan: {job.laporanMasuk}/{computed.totalTarget} unit
                            </span>
                            <button
                              onClick={() => setSelectedScheduleId(job.id)}
                              className="px-3 py-1.5 rounded-lg bg-[#7A1215] hover:bg-[#600e10] text-white text-xs font-semibold transition-colors"
                            >
                              Detail & Pekerjaan →
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Jadwal Tab */}
          {activeTab === 'jadwal' && (
            <div className="space-y-5">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Jadwal Visit Lapangan</h3>
                    <p className="text-xs text-slate-500">
                      1 Baris = 1 Kunjungan Lapangan (Memuat Banyak Pekerjaan/Objek & Personel).
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpenAddVisit()}
                    className="bg-[#7A1215] hover:bg-[#600e10] text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center space-x-1 shadow-2xs transition-colors"
                  >
                    <span>+ Tambah Visit</span>
                  </button>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Perusahaan</label>
                    <select
                      value={filterJadwalClient}
                      onChange={(e) => setFilterJadwalClient(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 font-semibold focus:outline-none"
                    >
                      <option value="Semua">Semua Perusahaan</option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.companyName}>{c.companyName}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Kategori</label>
                    <select
                      value={filterJadwalCategory}
                      onChange={(e) => setFilterJadwalCategory(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 font-semibold focus:outline-none"
                    >
                      <option value="Semua">Semua Kategori</option>
                      {EQUIPMENT_CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Personel</label>
                    <select
                      value={filterJadwalPersonnel}
                      onChange={(e) => setFilterJadwalPersonnel(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 font-semibold focus:outline-none"
                    >
                      <option value="Semua">Semua Personel</option>
                      {personnel.map((p) => (
                        <option key={p.id} value={p.id}>{p.fullName}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Status</label>
                    <select
                      value={filterJadwalStatus}
                      onChange={(e) => setFilterJadwalStatus(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 font-semibold focus:outline-none"
                    >
                      <option value="Semua">Semua Status</option>
                      <option value="Belum Mulai">Belum Mulai</option>
                      <option value="Terjadwal">Terjadwal</option>
                      <option value="Sedang Dikerjakan">Sedang Dikerjakan</option>
                      <option value="Ada Kendala">Ada Kendala</option>
                      <option value="Selesai">Selesai</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Table / List */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                {filteredSchedules.length === 0 ? (
                  <EmptyState
                    title="Belum ada jadwal visit yang cocok"
                    description="Coba ubah filter pencarian atau buat jadwal visit baru."
                    actionText="+ Tambah Visit"
                    onAction={() => handleOpenAddVisit()}
                  />
                ) : (
                  <>
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                          <tr>
                            <th className="py-3 px-4">Tanggal</th>
                            <th className="py-3 px-4">Perusahaan</th>
                            <th className="py-3 px-4">Lokasi</th>
                            <th className="py-3 px-4">Detail Pekerjaan</th>
                            <th className="py-3 px-4">Personel</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 w-32">Progress</th>
                            <th className="py-3 px-4 text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredSchedules.map((item) => {
                            const computed = getVisitComputedData(item);
                            const clientName = getClientName(item.clientId);
                            const pNames = getPersonnelNames(item.personnelIds);
                            return (
                              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                <td className="py-3.5 px-4 font-semibold text-slate-700 whitespace-nowrap">{item.date}</td>
                                <td className="py-3.5 px-4 font-bold text-slate-900">{clientName}</td>
                                <td className="py-3.5 px-4 text-slate-600">{item.location}</td>
                                <td className="py-3.5 px-4">
                                  <div className="font-semibold text-slate-800">
                                    {computed.jobs.length} Pekerjaan
                                  </div>
                                  <div className="text-[10px] text-slate-500">
                                    {item.categories.join(', ')}
                                  </div>
                                </td>
                                <td className="py-3.5 px-4 text-slate-800 font-medium">
                                  <span>{pNames[0] || '-'}</span>
                                  {pNames.length > 1 && (
                                    <span className="ml-1 text-[10px] font-bold text-[#0F4A32] bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200">
                                      +{pNames.length - 1}
                                    </span>
                                  )}
                                </td>
                                <td className="py-3.5 px-4">
                                  <StatusBadge status={computed.status} />
                                </td>
                                <td className="py-3.5 px-4">
                                  <div className="text-[10px] font-bold text-slate-600 mb-1">
                                    {computed.totalCompleted}/{computed.totalTarget} unit ({computed.progress}%)
                                  </div>
                                  <ProgressBar progress={computed.progress} color={computed.progress === 100 ? 'green' : 'maroon'} />
                                </td>
                                <td className="py-3.5 px-4 text-right space-x-1">
                                  <button
                                    onClick={() => setSelectedScheduleId(item.id)}
                                    className="px-2.5 py-1 rounded-md bg-[#7A1215] text-white hover:bg-[#600e10] text-[11px] font-semibold transition-colors"
                                  >
                                    Detail
                                  </button>
                                  <button
                                    onClick={() => handleDeleteVisit(item.id)}
                                    className="px-2 py-1 rounded-md bg-slate-100 text-slate-500 hover:bg-rose-100 hover:text-rose-700 text-[11px] transition-colors"
                                    title="Hapus visit"
                                  >
                                    ✕
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y divide-slate-100">
                      {filteredSchedules.map((item) => {
                        const computed = getVisitComputedData(item);
                        const clientName = getClientName(item.clientId);
                        const pNames = getPersonnelNames(item.personnelIds);
                        return (
                          <div key={item.id} className="p-4 space-y-2.5">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-[11px] font-bold text-[#7A1215]">{item.date}</span>
                                <h4 className="font-bold text-sm text-slate-900">{clientName}</h4>
                                <p className="text-xs text-slate-500">📍 {item.location}</p>
                              </div>
                              <StatusBadge status={computed.status} />
                            </div>

                            <div className="bg-slate-50 p-2 rounded-lg text-xs">
                              <span className="font-semibold text-slate-700">Pekerjaan ({computed.jobs.length}): </span>
                              <span className="text-slate-600">{computed.jobs.map((j) => j.objectName).join(', ')}</span>
                            </div>

                            <div className="text-xs text-slate-700 bg-slate-50 p-2 rounded-lg">
                              <span className="font-semibold">Personel: </span>
                              {pNames.join(', ')}
                            </div>

                            <div>
                              <div className="flex justify-between text-xs font-semibold mb-1">
                                <span>Progress Unit</span>
                                <span>{computed.totalCompleted}/{computed.totalTarget} ({computed.progress}%)</span>
                              </div>
                              <ProgressBar progress={computed.progress} color={computed.progress === 100 ? 'green' : 'maroon'} />
                            </div>

                            <div className="flex space-x-2 pt-1">
                              <button
                                onClick={() => setSelectedScheduleId(item.id)}
                                className="w-full py-2 rounded-lg bg-[#7A1215] text-white text-xs font-semibold"
                              >
                                Buka Detail & Pekerjaan
                              </button>
                              <button
                                onClick={() => handleDeleteVisit(item.id)}
                                className="px-3 py-2 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold"
                              >
                                Hapus
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Progress Tab */}
          {activeTab === 'progress' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-500">Total Visit</span>
                  <div className="text-xl font-black text-slate-900 mt-1">{schedules.length}</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-500">Unit Target</span>
                  <div className="text-xl font-black text-slate-600 mt-1">{kpis.unitTargetTotal}</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-teal-700">Unit Teruji</span>
                  <div className="text-xl font-black text-teal-800 mt-1">{kpis.unitSelesaiTotal}</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-[#0F4A32]">Progress Global</span>
                  <div className="text-xl font-black text-[#0F4A32] mt-1">{kpis.overallProgress}%</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 col-span-2 md:col-span-1">
                  <span className="text-[10px] font-bold uppercase text-[#7A1215]">Ada Kendala</span>
                  <div className="text-xl font-black text-[#7A1215] mt-1">{kpis.kendalaVisit}</div>
                </div>
              </div>

              {/* Status Filters */}
              <div className="flex flex-wrap gap-1.5 bg-white p-3 rounded-xl border border-slate-200">
                {['Semua', 'Terjadwal', 'Sedang Dikerjakan', 'Selesai', 'Ada Kendala'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setProgressStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      progressStatusFilter === st
                        ? 'bg-[#7A1215] text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Progress Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {schedules
                  .filter((s) => {
                    const comp = getVisitComputedData(s);
                    return progressStatusFilter === 'Semua' || comp.status === progressStatusFilter;
                  })
                  .map((item) => {
                    const computed = getVisitComputedData(item);
                    const clientName = getClientName(item.clientId);
                    const pNames = getPersonnelNames(item.personnelIds);

                    return (
                      <div
                        key={item.id}
                        className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between hover:shadow-md transition-shadow"
                      >
                        <div className="space-y-2.5">
                          <div className="flex justify-between items-start">
                            <span className="text-[11px] font-bold text-slate-400">{item.date}</span>
                            <StatusBadge status={computed.status} />
                          </div>

                          <div>
                            <h4 className="font-bold text-sm text-slate-900">{clientName}</h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">📍 {item.location}</p>
                          </div>

                          {/* List of jobs in visit */}
                          <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                            <span className="text-[10px] font-bold uppercase text-slate-500 block">
                              Detail Pekerjaan ({computed.jobs.length}):
                            </span>
                            {computed.jobs.map((jb) => {
                              const jc = getJobComputedData(jb);
                              return (
                                <div key={jb.id} className="text-[11px] flex justify-between items-center">
                                  <span className="font-medium text-slate-800">
                                    {jb.objectName}
                                  </span>
                                  <div className="flex items-center space-x-1.5">
                                    <span className="font-mono text-slate-600">
                                      {jb.completedQuantity}/{jb.targetQuantity}
                                    </span>
                                    {jc.hasIssue && (
                                      <span className="px-1 text-[9px] bg-rose-100 text-[#7A1215] font-bold rounded">
                                        Kendala
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="text-[11px] text-slate-600">
                            <span className="font-semibold">Personel: </span>
                            {pNames.join(', ')}
                          </div>

                          {/* Weighted Progress Bar */}
                          <div className="pt-2">
                            <div className="flex justify-between text-xs font-bold mb-1">
                              <span className="text-slate-600">Progress Visit:</span>
                              <span className="text-[#7A1215]">
                                {computed.totalCompleted}/{computed.totalTarget} ({computed.progress}%)
                              </span>
                            </div>
                            <ProgressBar progress={computed.progress} color={computed.progress === 100 ? 'green' : 'maroon'} />
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 mt-3 flex justify-between items-center text-xs">
                          <span className="text-slate-500 text-[11px]">
                            Laporan: {item.laporanMasuk}/{computed.totalTarget} unit
                          </span>
                          <button
                            onClick={() => setSelectedScheduleId(item.id)}
                            className="font-bold text-[#7A1215] hover:underline"
                          >
                            Detail Pekerjaan →
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Kendala Tab */}
          {activeTab === 'kendala' && (
            <div className="space-y-5">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap justify-between items-center gap-3">
                <div>
                  <h3 className="font-bold text-base text-slate-900">Kendala Operasional</h3>
                  <p className="text-xs text-slate-500">Log hambatan teknis, alat, perizinan, dan kesiapan lokasi visit & pekerjaan</p>
                </div>
                <button
                  onClick={() => handleOpenAddIssue(schedules[0]?.id || '')}
                  className="bg-[#7A1215] hover:bg-[#600e10] text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center space-x-1 shadow-2xs transition-colors"
                >
                  <span>+ Tambah Kendala</span>
                </button>
              </div>

              {issues.length === 0 ? (
                <EmptyState
                  title="Tidak ada kendala aktif"
                  description="Semua pekerjaan visit berjalan lancar tanpa kendala."
                  actionText="+ Tambah Kendala"
                  onAction={() => handleOpenAddIssue(schedules[0]?.id || '')}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {issues.map((iss) => {
                    const linkedSch = schedules.find((s) => s.id === iss.scheduleId);
                    const clientName = linkedSch ? getClientName(linkedSch.clientId) : 'Klien Lapangan';
                    const linkedJob = scheduleJobs.find((j) => j.id === iss.jobItemId);

                    return (
                      <div
                        key={iss.id}
                        className={`bg-white rounded-xl border p-4 shadow-2xs space-y-3 ${
                          iss.status === 'Resolved' ? 'border-slate-200 opacity-75' : 'border-rose-200 bg-rose-50/20'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400">{iss.date}</span>
                            <h4 className="font-bold text-sm text-slate-900">{clientName}</h4>
                            <p className="text-xs text-[#7A1215] font-semibold">
                              Pekerjaan: {linkedJob ? `[${linkedJob.category}] ${linkedJob.objectName}` : 'Seluruh Visit'}
                            </p>
                          </div>
                          <StatusBadge status={iss.status} />
                        </div>

                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                          <span className="text-xs font-bold text-slate-800 block mb-0.5">Jenis: {iss.category}</span>
                          <p className="text-xs text-slate-700">{iss.description}</p>
                        </div>

                        {iss.resolutionNotes && (
                          <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
                            <span className="font-bold text-[#0F4A32] block">Tindak Lanjut:</span>
                            <p className="text-emerald-900 text-[11px] mt-0.5">{iss.resolutionNotes}</p>
                          </div>
                        )}

                        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-1.5">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">Ubah Status:</span>
                          <div className="flex space-x-1">
                            {(['Open', 'In Progress', 'Waiting Client', 'Resolved'] as IssueStatus[]).map((st) => (
                              <button
                                key={st}
                                onClick={() => handleToggleIssueStatus(iss.id, st)}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                                  iss.status === st ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Laporan Tab */}
          {activeTab === 'laporan' && (
            <div className="space-y-5">
              {(() => {
                const totalTargetUnits = kpis.unitTargetTotal;
                const totalLaporanReceived = kpis.totalLaporanMasuk;
                const pendingLaporanUnits = Math.max(0, totalTargetUnits - totalLaporanReceived);
                const kelengkapanRatio = totalTargetUnits > 0 ? Math.round((totalLaporanReceived / totalTargetUnits) * 100) : 0;

                return (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Total Unit Target</span>
                      <div className="text-2xl font-black text-[#0F4A32] mt-1">{totalTargetUnits} <span className="text-xs font-normal">unit</span></div>
                      <p className="text-[10px] text-slate-400 mt-1">Seluruh item alat visit</p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Laporan Masuk</span>
                      <div className="text-2xl font-black text-purple-800 mt-1">{totalLaporanReceived} <span className="text-xs font-normal">laporan</span></div>
                      <p className="text-[10px] text-slate-400 mt-1">Diterima tim administrasi</p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Laporan Belum Masuk</span>
                      <div className="text-2xl font-black text-[#7A1215] mt-1">{pendingLaporanUnits} <span className="text-xs font-normal">unit</span></div>
                      <p className="text-[10px] text-slate-400 mt-1">Menunggu penyusunan LHP</p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Kelengkapan</span>
                      <div className="text-2xl font-black text-slate-900 mt-1">{kelengkapanRatio}%</div>
                      <div className="mt-2">
                        <ProgressBar progress={kelengkapanRatio} color="purple" />
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Perusahaan</th>
                        <th className="py-3 px-4">Tanggal Visit</th>
                        <th className="py-3 px-4 text-center">Detail Pekerjaan</th>
                        <th className="py-3 px-4 text-center">Total Unit</th>
                        <th className="py-3 px-4 text-center">Laporan Masuk</th>
                        <th className="py-3 px-4 w-32">Kelengkapan</th>
                        <th className="py-3 px-4">Status Laporan</th>
                        <th className="py-3 px-4 text-right">Update Laporan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {schedules.map((item) => {
                        const computed = getVisitComputedData(item);
                        const clientName = getClientName(item.clientId);
                        let statusLaporan = 'Laporan Belum Masuk';
                        if (item.laporanMasuk >= computed.totalTarget && computed.totalTarget > 0) {
                          statusLaporan = 'Lengkap';
                        } else if (item.laporanMasuk > 0) {
                          statusLaporan = 'Sebagian';
                        }

                        const reportPct = computed.totalTarget > 0 ? Math.round((item.laporanMasuk / computed.totalTarget) * 100) : 0;

                        return (
                          <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-slate-900">{clientName}</td>
                            <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">{item.date}</td>
                            <td className="py-3.5 px-4 text-center font-semibold text-slate-700">
                              {computed.jobs.length} Pekerjaan
                            </td>
                            <td className="py-3.5 px-4 text-center font-bold text-slate-700">{computed.totalTarget}</td>
                            <td className="py-3.5 px-4 text-center font-black text-purple-800">{item.laporanMasuk}</td>
                            <td className="py-3.5 px-4">
                              <div className="text-[10px] font-semibold text-slate-500 mb-1">{reportPct}%</div>
                              <ProgressBar progress={reportPct} color="purple" />
                            </td>
                            <td className="py-3.5 px-4">
                              <StatusBadge status={statusLaporan} />
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="inline-flex items-center space-x-1">
                                <button
                                  onClick={() => handleUpdateLaporan(item.id, item.laporanMasuk - 1)}
                                  disabled={item.laporanMasuk <= 0}
                                  className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 font-bold flex items-center justify-center transition-colors"
                                >
                                  -
                                </button>
                                <span className="w-6 text-center font-bold text-xs">{item.laporanMasuk}</span>
                                <button
                                  onClick={() => handleUpdateLaporan(item.id, item.laporanMasuk + 1)}
                                  disabled={item.laporanMasuk >= computed.totalTarget}
                                  className="w-6 h-6 rounded bg-[#7A1215] hover:bg-[#600e10] disabled:opacity-30 text-white font-bold flex items-center justify-center transition-colors"
                                >
                                  +
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Master Klien Tab */}
          {activeTab === 'master-klien' && (
            <div className="space-y-5">
              <div className="bg-white p-4 md:p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Master Data Perusahaan Klien</h3>
                    <p className="text-xs text-slate-500">
                      Kelola mitra perusahaan riksa uji K3. Entitas nonaktif mempertahankan histori namun tidak muncul pada visit baru.
                    </p>
                  </div>
                  <button
                    onClick={handleOpenAddClient}
                    className="bg-[#7A1215] hover:bg-[#600e10] text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center space-x-1 shadow-2xs transition-colors"
                  >
                    <span>+ Tambah Klien</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100">
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      placeholder="Cari nama perusahaan, kota, atau PIC..."
                      value={clientSearch}
                      onChange={(e) => setClientSearch(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 font-medium focus:outline-none"
                    />
                  </div>
                  <div>
                    <select
                      value={clientStatusFilter}
                      onChange={(e) => setClientStatusFilter(e.target.value as any)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 font-semibold focus:outline-none"
                    >
                      <option value="Semua">Semua Status</option>
                      <option value="Aktif">Hanya Klien Aktif</option>
                      <option value="Nonaktif">Hanya Nonaktif</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Kode</th>
                        <th className="py-3 px-4">Nama Perusahaan</th>
                        <th className="py-3 px-4">Kota & Alamat</th>
                        <th className="py-3 px-4">PIC K3</th>
                        <th className="py-3 px-4">Kontak</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {clients
                        .filter((c) => {
                          const matchSearch =
                            c.companyName.toLowerCase().includes(clientSearch.toLowerCase()) ||
                            c.city.toLowerCase().includes(clientSearch.toLowerCase()) ||
                            c.pic.toLowerCase().includes(clientSearch.toLowerCase());
                          const matchStatus =
                            clientStatusFilter === 'Semua' ||
                            (clientStatusFilter === 'Aktif' && c.isActive) ||
                            (clientStatusFilter === 'Nonaktif' && !c.isActive);
                          return matchSearch && matchStatus;
                        })
                        .map((c) => (
                          <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-slate-600">{c.clientCode}</td>
                            <td className="py-3 px-4 font-bold text-slate-900">{c.companyName}</td>
                            <td className="py-3 px-4 text-slate-600">
                              <span className="font-semibold block text-slate-800">{c.city}</span>
                              <span className="text-[11px] text-slate-400 line-clamp-1">{c.address}</span>
                            </td>
                            <td className="py-3 px-4 text-slate-800 font-medium">{c.pic}</td>
                            <td className="py-3 px-4 text-slate-600">
                              <div>{c.phone}</div>
                              <div className="text-[10px] text-slate-400">{c.email}</div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                  c.isActive
                                    ? 'bg-emerald-50 text-[#0F4A32] border-emerald-300'
                                    : 'bg-slate-100 text-slate-500 border-slate-300'
                                }`}
                              >
                                {c.isActive ? 'Aktif' : 'Nonaktif'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                              <button
                                onClick={() => handleOpenEditClient(c)}
                                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleToggleClientStatus(c)}
                                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                                  c.isActive
                                    ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                                    : 'bg-emerald-50 text-[#0F4A32] hover:bg-emerald-100 border border-emerald-200'
                                }`}
                              >
                                {c.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Master Personel Tab */}
          {activeTab === 'master-personel' && (
            <div className="space-y-5">
              <div className="bg-white p-4 md:p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Master Data Personel & Ahli K3</h3>
                    <p className="text-xs text-slate-500">
                      Kelola personel riksa uji. Personel nonaktif tidak dapat dipilih untuk visit baru tetapi histori tugas tetap tersimpan.
                    </p>
                  </div>
                  <button
                    onClick={handleOpenAddPersonnel}
                    className="bg-[#7A1215] hover:bg-[#600e10] text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center space-x-1 shadow-2xs transition-colors"
                  >
                    <span>+ Tambah Personel</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100">
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      placeholder="Cari nama personel, keahlian, atau kode..."
                      value={personnelSearch}
                      onChange={(e) => setPersonnelSearch(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 font-medium focus:outline-none"
                    />
                  </div>
                  <div>
                    <select
                      value={personnelStatusFilter}
                      onChange={(e) => setPersonnelStatusFilter(e.target.value as any)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 font-semibold focus:outline-none"
                    >
                      <option value="Semua">Semua Status</option>
                      <option value="Aktif">Hanya Personel Aktif</option>
                      <option value="Nonaktif">Hanya Nonaktif</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Kode</th>
                        <th className="py-3 px-4">Nama Lengkap</th>
                        <th className="py-3 px-4">Jabatan</th>
                        <th className="py-3 px-4">Keahlian & Spesialisasi</th>
                        <th className="py-3 px-4">Kontak</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {personnel
                        .filter((p) => {
                          const matchSearch =
                            p.fullName.toLowerCase().includes(personnelSearch.toLowerCase()) ||
                            p.employeeCode.toLowerCase().includes(personnelSearch.toLowerCase()) ||
                            p.expertise.toLowerCase().includes(personnelSearch.toLowerCase());
                          const matchStatus =
                            personnelStatusFilter === 'Semua' ||
                            (personnelStatusFilter === 'Aktif' && p.isActive) ||
                            (personnelStatusFilter === 'Nonaktif' && !p.isActive);
                          return matchSearch && matchStatus;
                        })
                        .map((p) => {
                          const assignmentCount = schedules.filter((s) => s.personnelIds.includes(p.id)).length;
                          return (
                            <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                              <td className="py-3.5 px-4 font-mono font-bold text-slate-600">{p.employeeCode}</td>
                              <td className="py-3.5 px-4">
                                <span className="font-bold text-slate-900 block">{p.fullName}</span>
                                <span className="text-[10px] text-slate-400">{assignmentCount} riwayat visit</span>
                              </td>
                              <td className="py-3.5 px-4 font-medium text-slate-800">{p.role}</td>
                              <td className="py-3.5 px-4 text-slate-600 max-w-xs">{p.expertise}</td>
                              <td className="py-3.5 px-4 text-slate-600">
                                <div>{p.phone}</div>
                                <div className="text-[10px] text-slate-400">{p.email}</div>
                              </td>
                              <td className="py-3.5 px-4 text-center">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                    p.isActive
                                      ? 'bg-emerald-50 text-[#0F4A32] border-emerald-300'
                                      : 'bg-slate-100 text-slate-500 border-slate-300'
                                  }`}
                                >
                                  {p.isActive ? 'Aktif' : 'Nonaktif'}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                                <button
                                  onClick={() => handleOpenEditPersonnel(p)}
                                  className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleTogglePersonnelStatus(p)}
                                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                                    p.isActive
                                      ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                                      : 'bg-emerald-50 text-[#0F4A32] hover:bg-emerald-100 border border-emerald-200'
                                  }`}
                                >
                                  {p.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Master Objek Tab */}
          {activeTab === 'master-objek' && (
            <div className="space-y-5">
              <div className="bg-white p-4 md:p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Master Kategori & Objek Spesifik</h3>
                    <p className="text-xs text-slate-500">
                      Kategori K3 tetap 6 kategori baku. Objek spesifik dapat ditambahkan secara fleksibel sesuai kebutuhan lapangan (Scissor Lift, Gondola, Shackle, dll).
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpenAddObject()}
                    className="bg-[#7A1215] hover:bg-[#600e10] text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center space-x-1 shadow-2xs transition-colors"
                  >
                    <span>+ Tambah Objek Baru</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setObjectCategoryFilter('Semua')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      objectCategoryFilter === 'Semua'
                        ? 'bg-[#7A1215] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Semua Kategori ({equipmentObjects.length})
                  </button>
                  {EQUIPMENT_CATEGORIES.map((cat) => {
                    const count = equipmentObjects.filter((o) => o.category === cat).length;
                    return (
                      <button
                        key={cat}
                        onClick={() => setObjectCategoryFilter(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          objectCategoryFilter === cat
                            ? 'bg-[#7A1215] text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {equipmentObjects
                  .filter((o) => objectCategoryFilter === 'Semua' || o.category === objectCategoryFilter)
                  .map((obj) => (
                    <div
                      key={obj.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow"
                    >
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-bold text-slate-400 font-mono">{obj.id}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
                            {obj.category}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 mt-1">{obj.name}</h4>
                        {obj.description && (
                          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{obj.description}</p>
                        )}
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            obj.isActive ? 'text-[#0F4A32] bg-emerald-50' : 'text-slate-400 bg-slate-100'
                          }`}
                        >
                          {obj.isActive ? 'Aktif' : 'Nonaktif'}
                        </span>

                        <div className="flex space-x-1">
                          <button
                            onClick={() => {
                              setEditingObject(obj);
                              setObjectForm({
                                name: obj.name,
                                category: obj.category,
                                description: obj.description || '',
                                isActive: obj.isActive
                              });
                              setIsObjectModalOpen(true);
                            }}
                            className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleToggleObjectStatus(obj)}
                            className={`px-2 py-0.5 rounded font-semibold text-[11px] transition-colors ${
                              obj.isActive
                                ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                                : 'bg-emerald-50 text-[#0F4A32] hover:bg-emerald-100 border border-emerald-200'
                            }`}
                          >
                            {obj.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal Detail Visit */}
      {selectedSchedule && (() => {
        const computed = getVisitComputedData(selectedSchedule);
        const clientName = getClientName(selectedSchedule.clientId);
        const pNames = getPersonnelNames(selectedSchedule.personnelIds);

        return (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
              {/* Modal Header */}
              <div className="bg-[#7A1215] text-white p-4 flex justify-between items-start flex-shrink-0">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] uppercase tracking-wider text-rose-200 font-bold">
                      DETAIL VISIT LAPANGAN
                    </span>
                    <span className="text-rose-300">•</span>
                    <span className="text-xs font-mono bg-rose-900/80 px-2 py-0.5 rounded text-white">
                      {selectedSchedule.id}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">{clientName}</h3>
                  <p className="text-xs text-rose-100">
                    📅 {selectedSchedule.date} • 📍 {selectedSchedule.location}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedScheduleId(null)}
                  className="w-7 h-7 rounded-full bg-rose-900/60 hover:bg-rose-900 text-white flex items-center justify-center font-bold text-xs transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-4 sm:p-6 space-y-5 text-xs overflow-y-auto flex-1">
                {/* Visit Summary Card */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Status Visit:</span>
                    <div className="mt-1">
                      <StatusBadge status={computed.status} />
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Personel Ditugaskan:</span>
                    <p className="font-semibold text-slate-900 mt-1">{pNames.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Laporan Selesai:</span>
                    <p className="font-semibold text-purple-900 mt-1">
                      {selectedSchedule.laporanMasuk} dari {computed.totalTarget} unit laporan
                    </p>
                  </div>
                </div>

                {/* Weighted Visit Progress Bar */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold text-slate-800">PROGRESS KESELURUHAN VISIT</span>
                      <span className="text-[11px] text-slate-500 block">
                        Dihitung dari total {computed.totalCompleted} unit selesai dari {computed.totalTarget} unit target
                      </span>
                    </div>
                    <span className="text-xl font-black text-[#7A1215]">{computed.progress}%</span>
                  </div>
                  <ProgressBar progress={computed.progress} color={computed.progress === 100 ? 'green' : 'maroon'} />
                </div>

                {/* Detail Pekerjaan Table */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">PEKERJAAN DALAM VISIT INI</h4>
                      <p className="text-[11px] text-slate-500">
                        Setiap objek memiliki target, jumlah selesai, progress dan kendala tersendiri.
                      </p>
                    </div>

                    <button
                      onClick={() => handleOpenAddJob(selectedSchedule.id, selectedSchedule.categories[0])}
                      className="px-3 py-1.5 rounded-lg bg-[#0F4A32] hover:bg-[#0b3624] text-white text-xs font-bold flex items-center space-x-1 shadow-2xs transition-colors"
                    >
                      <span>+ Tambah Pekerjaan</span>
                    </button>
                  </div>

                  {computed.jobs.length === 0 ? (
                    <EmptyState
                      title="Belum ada rincian pekerjaan"
                      description="Tambahkan objek pemeriksaan pertama untuk memulai pencatatan progress unit."
                      actionText="+ Tambah Pekerjaan Sekarang"
                      onAction={() => handleOpenAddJob(selectedSchedule.id, selectedSchedule.categories[0])}
                    />
                  ) : (
                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                          <tr>
                            <th className="py-2.5 px-3">Kategori & Objek</th>
                            <th className="py-2.5 px-3 text-center">Target</th>
                            <th className="py-2.5 px-3 text-center">Selesai</th>
                            <th className="py-2.5 px-3 w-28">Progress</th>
                            <th className="py-2.5 px-3">Status</th>
                            <th className="py-2.5 px-3 text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {computed.jobs.map((jb) => {
                            const jc = getJobComputedData(jb);
                            const jobActiveIssue = issues.find(
                              (i) => i.jobItemId === jb.id && i.status !== 'Resolved'
                            );

                            return (
                              <tr key={jb.id} className="hover:bg-slate-50 transition-colors">
                                <td className="py-3 px-3">
                                  <div className="font-bold text-slate-900">{jb.objectName}</div>
                                  <div className="text-[10px] text-slate-500 font-semibold">{jb.category}</div>
                                  {jb.notes && (
                                    <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1 italic">
                                      {jb.notes}
                                    </div>
                                  )}
                                  {jobActiveIssue && (
                                    <div className="mt-1 px-1.5 py-0.5 bg-rose-50 border border-rose-200 text-[#7A1215] text-[10px] rounded inline-flex items-center space-x-1">
                                      <span>⚠️ Kendala: {jobActiveIssue.category}</span>
                                    </div>
                                  )}
                                </td>
                                <td className="py-3 px-3 text-center font-bold text-slate-700">
                                  {jb.targetQuantity}
                                </td>
                                <td className="py-3 px-3 text-center">
                                  <div className="inline-flex items-center space-x-1">
                                    <button
                                      onClick={() => handleUpdateJobCompleted(jb.id, jb.completedQuantity - 1)}
                                      disabled={jb.completedQuantity <= 0}
                                      className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold disabled:opacity-30 text-[11px] transition-colors"
                                    >
                                      -
                                    </button>
                                    <span className="w-6 text-center font-bold text-slate-900">
                                      {jb.completedQuantity}
                                    </span>
                                    <button
                                      onClick={() => handleUpdateJobCompleted(jb.id, jb.completedQuantity + 1)}
                                      disabled={jb.completedQuantity >= jb.targetQuantity}
                                      className="w-5 h-5 rounded bg-[#0F4A32] hover:bg-[#0b3624] text-white font-bold disabled:opacity-30 text-[11px] transition-colors"
                                    >
                                      +
                                    </button>
                                  </div>
                                </td>
                                <td className="py-3 px-3">
                                  <div className="flex justify-between text-[10px] font-semibold mb-0.5">
                                    <span className="text-slate-500">Unit</span>
                                    <span className="font-bold text-slate-700">{jc.progress}%</span>
                                  </div>
                                  <ProgressBar progress={jc.progress} color={jc.progress === 100 ? 'green' : 'maroon'} />
                                </td>
                                <td className="py-3 px-3">
                                  <StatusBadge status={jc.status} />
                                </td>
                                <td className="py-3 px-3 text-right whitespace-nowrap space-x-1">
                                  <button
                                    onClick={() => handleOpenEditJob(jb)}
                                    className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors"
                                    title="Edit target / nama"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleOpenAddIssue(selectedSchedule.id, jb)}
                                    className="p-1 rounded bg-rose-50 hover:bg-rose-100 text-[#7A1215] text-[11px] font-medium border border-rose-200 transition-colors"
                                    title="Laporkan kendala pada objek ini"
                                  >
                                    Kendala
                                  </button>
                                  <button
                                    onClick={() => handleDeleteJob(jb)}
                                    className="p-1 rounded bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-700 text-[11px] transition-colors"
                                    title="Hapus pekerjaan"
                                  >
                                    ✕
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot className="bg-slate-50 border-t border-slate-200 font-bold text-slate-800">
                          <tr>
                            <td className="py-2.5 px-3">TOTAL PEKERJAAN ({computed.jobs.length} Item)</td>
                            <td className="py-2.5 px-3 text-center">{computed.totalTarget} unit</td>
                            <td className="py-2.5 px-3 text-center text-[#0F4A32]">{computed.totalCompleted} unit</td>
                            <td className="py-2.5 px-3 font-black text-[#7A1215]">{computed.progress}% Selesai</td>
                            <td colSpan={2} className="py-2.5 px-3 text-right">
                              <span className="text-[10px] text-slate-400 font-normal">
                                Bobot unit otomatis terintegrasi ke dashboard
                              </span>
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </div>

                {/* Laporan Update Section */}
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-purple-950 block">Monitoring Laporan Visit</span>
                    <span className="text-[11px] text-purple-800">
                      {selectedSchedule.laporanMasuk} dari {computed.totalTarget} unit laporan riksa uji telah masuk
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => handleUpdateLaporan(selectedSchedule.id, selectedSchedule.laporanMasuk - 1)}
                      disabled={selectedSchedule.laporanMasuk <= 0}
                      className="w-7 h-7 rounded bg-white border border-purple-300 font-bold text-purple-900 disabled:opacity-40 transition-colors"
                    >
                      -
                    </button>
                    <span className="font-black text-sm px-1 text-purple-900">{selectedSchedule.laporanMasuk}</span>
                    <button
                      onClick={() => handleUpdateLaporan(selectedSchedule.id, selectedSchedule.laporanMasuk + 1)}
                      disabled={selectedSchedule.laporanMasuk >= computed.totalTarget}
                      className="w-7 h-7 rounded bg-purple-700 text-white font-bold disabled:opacity-40 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {selectedSchedule.notes && (
                  <div className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="font-semibold block text-[10px] text-slate-400 uppercase">Catatan Visit:</span>
                    <p className="mt-0.5">{selectedSchedule.notes}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 flex space-x-2">
                  <button
                    onClick={() => handleOpenAddIssue(selectedSchedule.id)}
                    className="w-1/2 py-2.5 rounded-xl border border-[#7A1215] text-[#7A1215] hover:bg-rose-50 font-bold transition-colors"
                  >
                    ⚠️ Laporkan Kendala Visit
                  </button>
                  <button
                    onClick={() => setSelectedScheduleId(null)}
                    className="w-1/2 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-black transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Modal Add/Edit Job */}
      {isJobModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#7A1215] text-white p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm">
                  {editingJob ? 'Edit Detail Pekerjaan' : '+ Tambah Detail Pekerjaan'}
                </h3>
                <p className="text-[11px] text-rose-200">Visit {jobModalScheduleId}</p>
              </div>
              <button onClick={() => setIsJobModalOpen(false)} className="text-white hover:text-rose-200 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kategori Pekerjaan *</label>
                <select
                  value={jobForm.category}
                  onChange={(e) => {
                    const newCat = e.target.value as EquipmentCategory;
                    const firstObj = equipmentObjects.find((o) => o.category === newCat && o.isActive)?.name || 'Peralatan Umum';
                    setJobForm({
                      ...jobForm,
                      category: newCat,
                      objectName: firstObj,
                      isCustomObject: false
                    });
                  }}
                  className="w-full p-2 rounded-lg border border-slate-300 font-semibold"
                >
                  {EQUIPMENT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block font-bold text-slate-700">Objek Spesifik *</label>
                  <button
                    type="button"
                    onClick={() => setJobForm({ ...jobForm, isCustomObject: !jobForm.isCustomObject, objectName: '__CUSTOM__' })}
                    className="text-[11px] font-bold text-[#7A1215] hover:underline"
                  >
                    {jobForm.isCustomObject ? 'Pilih dari Master Data' : '+ Objek Lainnya...'}
                  </button>
                </div>

                {!jobForm.isCustomObject ? (
                  <select
                    value={jobForm.objectName}
                    onChange={(e) => {
                      if (e.target.value === '__CUSTOM__') {
                        setJobForm({ ...jobForm, isCustomObject: true, objectName: '__CUSTOM__' });
                      } else {
                        setJobForm({ ...jobForm, objectName: e.target.value });
                      }
                    }}
                    className="w-full p-2 rounded-lg border border-slate-300 font-medium"
                  >
                    {equipmentObjects
                      .filter((o) => o.category === jobForm.category && o.isActive)
                      .map((obj) => (
                        <option key={obj.id} value={obj.name}>{obj.name}</option>
                      ))}
                    <option value="__CUSTOM__">+ Objek Lainnya...</option>
                  </select>
                ) : (
                  <div className="space-y-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Scissor Lift, Man Basket, Shackle..."
                      value={jobForm.customObjectName}
                      onChange={(e) => setJobForm({ ...jobForm, customObjectName: e.target.value })}
                      className="w-full p-2 rounded-lg border border-slate-300 font-medium bg-white"
                    />

                    <label className="flex items-center space-x-2 text-slate-700 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={jobForm.saveToMaster}
                        onChange={(e) => setJobForm({ ...jobForm, saveToMaster: e.target.checked })}
                        className="rounded text-[#0F4A32] focus:ring-[#0F4A32]"
                      />
                      <span className="text-[11px] font-semibold">
                        Simpan objek ini ke Master Data agar selalu tersedia
                      </span>
                    </label>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jumlah Target *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={jobForm.targetQuantity}
                    onChange={(e) => setJobForm({ ...jobForm, targetQuantity: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg border border-slate-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jumlah Selesai</label>
                  <input
                    type="number"
                    min="0"
                    max={jobForm.targetQuantity}
                    value={jobForm.completedQuantity}
                    onChange={(e) => setJobForm({ ...jobForm, completedQuantity: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg border border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                <span className="font-semibold text-slate-600">Estimasi Progress Objek:</span>
                <span className="font-bold text-[#0F4A32]">
                  {calcUtils.calculateItemProgress(jobForm.completedQuantity, jobForm.targetQuantity)}%
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Catatan Pekerjaan</label>
                <textarea
                  rows={2}
                  placeholder="Keterangan unit, nomor seri, lokasi bay..."
                  value={jobForm.notes}
                  onChange={(e) => setJobForm({ ...jobForm, notes: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300 font-medium"
                />
              </div>

              <div className="pt-2 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setIsJobModalOpen(false)}
                  className="w-1/2 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-lg bg-[#7A1215] text-white font-semibold hover:bg-[#600e10] transition-colors"
                >
                  Simpan Pekerjaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Visit */}
      {isVisitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="bg-[#7A1215] text-white p-4 flex justify-between items-center sticky top-0 z-10">
              <div>
                <h3 className="font-bold text-sm">+ Buat Jadwal Visit Baru</h3>
                <p className="text-[11px] text-rose-200">1 Perusahaan + 1 Tanggal + 1 Lokasi + Multi Kategori & Personel</p>
              </div>
              <button onClick={() => setIsVisitModalOpen(false)} className="text-white hover:text-rose-200 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveVisit} className="p-5 space-y-4 text-xs">
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 text-xs border-b border-slate-100 pb-1 uppercase tracking-wider text-[10px]">
                  1. Informasi Perusahaan & Kunjungan
                </h4>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Perusahaan Klien *</label>
                  <select
                    value={visitForm.clientId}
                    onChange={(e) => {
                      const cId = e.target.value;
                      const cObj = clients.find((c) => c.id === cId);
                      setVisitForm({
                        ...visitForm,
                        clientId: cId,
                        location: cObj ? cObj.city : visitForm.location
                      });
                    }}
                    required
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold"
                  >
                    {activeClients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.companyName} ({c.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tanggal Visit *</label>
                    <input
                      type="date"
                      required
                      value={visitForm.date}
                      onChange={(e) => setVisitForm({ ...visitForm, date: e.target.value })}
                      className="w-full p-2 rounded-lg border border-slate-300 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Lokasi Visit *</label>
                    <input
                      type="text"
                      required
                      placeholder="Surabaya (Plant 1)..."
                      value={visitForm.location}
                      onChange={(e) => setVisitForm({ ...visitForm, location: e.target.value })}
                      className="w-full p-2 rounded-lg border border-slate-300 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Kategori Multi-Select */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-[10px]">
                    2. Kategori Pekerjaan * (Minimal 1)
                  </h4>
                  <span className="text-[10px] text-rose-800 font-bold">
                    {visitForm.categories.length} Dipilih
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {EQUIPMENT_CATEGORIES.map((cat) => {
                    const isSelected = visitForm.categories.includes(cat);
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => toggleCategoryInVisitForm(cat)}
                        className={`p-2.5 rounded-lg border text-left text-xs font-bold transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#0F4A32] text-white border-[#0F4A32] shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>{cat}</span>
                        <span>{isSelected ? '✓' : '+'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Personel Multi-Select */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-[10px]">
                    3. Personel Pemeriksa * (Minimal 1)
                  </h4>
                  <span className="text-[10px] text-emerald-800 font-bold">
                    {visitForm.personnelIds.length} Personel
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activePersonnel.map((p) => {
                    const isSelected = visitForm.personnelIds.includes(p.id);
                    return (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => togglePersonnelInVisitForm(p.id)}
                        className={`p-2 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-50 text-[#0F4A32] border-[#0F4A32] font-bold shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <div className="font-semibold">{p.fullName}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{p.role}</div>
                        </div>
                        <span className={`text-xs ${isSelected ? 'font-black text-[#0F4A32]' : 'text-slate-400'}`}>
                          {isSelected ? '✓' : '+'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Target Estimasi Awal */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-100">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Unit Tiap Kategori</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={visitForm.initialTarget}
                    onChange={(e) => setVisitForm({ ...visitForm, initialTarget: Number(e.target.value) })}
                    className="w-full p-2 rounded-lg border border-slate-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Catatan Tambahan</label>
                  <input
                    type="text"
                    placeholder="APD khusus, safety induction..."
                    value={visitForm.notes}
                    onChange={(e) => setVisitForm({ ...visitForm, notes: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div className="pt-2 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setIsVisitModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-lg bg-[#7A1215] text-white font-semibold hover:bg-[#600e10] transition-colors"
                >
                  Simpan Visit & Buat Pekerjaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Master Objek */}
      {isObjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#7A1215] text-white p-4 flex justify-between items-center">
              <h3 className="font-bold text-sm">
                {editingObject ? 'Edit Objek Spesifik' : '+ Tambah Objek Spesifik Baru'}
              </h3>
              <button onClick={() => setIsObjectModalOpen(false)} className="text-white hover:text-rose-200 font-bold">
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveObject} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kategori Utama *</label>
                <select
                  value={objectForm.category}
                  onChange={(e) => setObjectForm({ ...objectForm, category: e.target.value as EquipmentCategory })}
                  className="w-full p-2 rounded-lg border border-slate-300 font-semibold"
                >
                  {EQUIPMENT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Objek Spesifik *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Scissor Lift, Man Basket, Gondola..."
                  value={objectForm.name}
                  onChange={(e) => setObjectForm({ ...objectForm, name: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi / Keterangan</label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Aerial work platform kapasitas 500kg..."
                  value={objectForm.description}
                  onChange={(e) => setObjectForm({ ...objectForm, description: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Status</label>
                <select
                  value={objectForm.isActive ? 'true' : 'false'}
                  onChange={(e) => setObjectForm({ ...objectForm, isActive: e.target.value === 'true' })}
                  className="w-full p-2 rounded-lg border border-slate-300 font-semibold"
                >
                  <option value="true">Aktif (Dapat dipilih pada visit)</option>
                  <option value="false">Nonaktif</option>
                </select>
              </div>

              <div className="pt-2 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setIsObjectModalOpen(false)}
                  className="w-1/2 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-lg bg-[#7A1215] text-white font-semibold hover:bg-[#600e10] transition-colors"
                >
                  Simpan Objek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Master Personel */}
      {isPersonnelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#7A1215] text-white p-4 flex justify-between items-center">
              <h3 className="font-bold text-sm">
                {editingPersonnel ? 'Edit Data Personel' : '+ Tambah Personel Baru'}
              </h3>
              <button onClick={() => setIsPersonnelModalOpen(false)} className="text-white hover:text-rose-200 font-bold">
                ✕
              </button>
            </div>
            <form onSubmit={handleSavePersonnel} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kode Personel</label>
                  <input
                    type="text"
                    required
                    value={personnelForm.employeeCode}
                    onChange={(e) => setPersonnelForm({ ...personnelForm, employeeCode: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={personnelForm.isActive ? 'true' : 'false'}
                    onChange={(e) => setPersonnelForm({ ...personnelForm, isActive: e.target.value === 'true' })}
                    className="w-full p-2 rounded-lg border border-slate-300 font-semibold"
                  >
                    <option value="true">Aktif</option>
                    <option value="false">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso, S.T."
                  value={personnelForm.fullName}
                  onChange={(e) => setPersonnelForm({ ...personnelForm, fullName: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Jabatan / Peran</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Inspector Senior"
                  value={personnelForm.role}
                  onChange={(e) => setPersonnelForm({ ...personnelForm, role: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Keahlian & Spesialisasi K3</label>
                <input
                  type="text"
                  placeholder="Contoh: PAA, PUBT, Listrik..."
                  value={personnelForm.expertise}
                  onChange={(e) => setPersonnelForm({ ...personnelForm, expertise: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nomor Telepon</label>
                  <input
                    type="text"
                    placeholder="0812-xxxx-xxxx"
                    value={personnelForm.phone}
                    onChange={(e) => setPersonnelForm({ ...personnelForm, phone: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="personel@pls-k3.co.id"
                    value={personnelForm.email}
                    onChange={(e) => setPersonnelForm({ ...personnelForm, email: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div className="pt-2 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setIsPersonnelModalOpen(false)}
                  className="w-1/2 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-lg bg-[#7A1215] text-white font-semibold hover:bg-[#600e10] transition-colors"
                >
                  Simpan Personel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Master Klien */}
      {isClientModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#7A1215] text-white p-4 flex justify-between items-center">
              <h3 className="font-bold text-sm">
                {editingClient ? 'Edit Data Klien' : '+ Tambah Klien Baru'}
              </h3>
              <button onClick={() => setIsClientModalOpen(false)} className="text-white hover:text-rose-200 font-bold">
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveClient} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kode Klien</label>
                  <input
                    type="text"
                    required
                    value={clientForm.clientCode}
                    onChange={(e) => setClientForm({ ...clientForm, clientCode: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={clientForm.isActive ? 'true' : 'false'}
                    onChange={(e) => setClientForm({ ...clientForm, isActive: e.target.value === 'true' })}
                    className="w-full p-2 rounded-lg border border-slate-300 font-semibold"
                  >
                    <option value="true">Aktif</option>
                    <option value="false">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Perusahaan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PT Semen Perkasa"
                  value={clientForm.companyName}
                  onChange={(e) => setClientForm({ ...clientForm, companyName: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kota</label>
                  <input
                    type="text"
                    required
                    placeholder="Surabaya / Gresik"
                    value={clientForm.city}
                    onChange={(e) => setClientForm({ ...clientForm, city: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">PIC K3 / HSE</label>
                  <input
                    type="text"
                    placeholder="Nama PIC"
                    value={clientForm.pic}
                    onChange={(e) => setClientForm({ ...clientForm, pic: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Alamat Fasilitas</label>
                <textarea
                  rows={2}
                  placeholder="Kawasan Industri..."
                  value={clientForm.address}
                  onChange={(e) => setClientForm({ ...clientForm, address: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Telepon</label>
                  <input
                    type="text"
                    placeholder="0812-xxxx-xxxx"
                    value={clientForm.phone}
                    onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="hse@perusahaan.co.id"
                    value={clientForm.email}
                    onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div className="pt-2 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setIsClientModalOpen(false)}
                  className="w-1/2 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-lg bg-[#7A1215] text-white font-semibold hover:bg-[#600e10] transition-colors"
                >
                  Simpan Klien
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Kendala */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#7A1215] text-white p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm">+ Tambah Kendala Lapangan</h3>
                <p className="text-[11px] text-rose-200">Log hambatan visit atau objek pekerjaan spesifik</p>
              </div>
              <button onClick={() => setIsIssueModalOpen(false)} className="text-white hover:text-rose-200 font-bold">
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveIssue} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Hubungkan ke Visit Lapangan</label>
                <select
                  value={issueForm.scheduleId}
                  onChange={(e) => {
                    const schId = e.target.value;
                    setIssueForm({
                      ...issueForm,
                      scheduleId: schId,
                      jobItemId: ''
                    });
                  }}
                  className="w-full p-2 rounded-lg border border-slate-300 font-medium"
                >
                  <option value="">Pilih Visit...</option>
                  {schedules.map((s) => {
                    const clientName = getClientName(s.clientId);
                    return (
                      <option key={s.id} value={s.id}>
                        {s.date} - {clientName} ({s.categories.join(', ')})
                      </option>
                    );
                  })}
                </select>
              </div>

              {issueForm.scheduleId && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hubungkan ke Objek/Pekerjaan (Opsional)</label>
                  <select
                    value={issueForm.jobItemId}
                    onChange={(e) => {
                      setIssueForm({
                        ...issueForm,
                        jobItemId: e.target.value
                      });
                    }}
                    className="w-full p-2 rounded-lg border border-slate-300 font-medium"
                  >
                    <option value="">Seluruh Visit Umum</option>
                    {scheduleJobs
                      .filter((j) => j.scheduleId === issueForm.scheduleId)
                      .map((j) => (
                        <option key={j.id} value={j.id}>
                          [{j.category}] {j.objectName} ({j.completedQuantity}/{j.targetQuantity} unit)
                        </option>
                      ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Jenis Kendala</label>
                <select
                  value={issueForm.category}
                  onChange={(e) => setIssueForm({ ...issueForm, category: e.target.value as IssueCategory })}
                  className="w-full p-2 rounded-lg border border-slate-300 font-medium"
                >
                  {ISSUE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi Hambatan *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Jelaskan kendala di lokasi visit atau pada objek..."
                  value={issueForm.description}
                  onChange={(e) => setIssueForm({ ...issueForm, description: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Status Kendala</label>
                <select
                  value={issueForm.status}
                  onChange={(e) => setIssueForm({ ...issueForm, status: e.target.value as IssueStatus })}
                  className="w-full p-2 rounded-lg border border-slate-300 font-medium"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Waiting Client">Waiting Client</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Catatan Solusi / Rencana Tindak</label>
                <input
                  type="text"
                  placeholder="Rencana penanganan..."
                  value={issueForm.resolutionNotes}
                  onChange={(e) => setIssueForm({ ...issueForm, resolutionNotes: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300 font-medium"
                />
              </div>

              <div className="pt-2 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setIsIssueModalOpen(false)}
                  className="w-1/2 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-lg bg-[#7A1215] text-white font-semibold hover:bg-[#600e10] transition-colors"
                >
                  Laporkan Kendala
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}