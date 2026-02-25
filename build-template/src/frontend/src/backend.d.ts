import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PriceRecord {
    id: string;
    userId: string;
    links: string;
    timestamp: bigint;
    medicineName: string;
}
export interface DrugInteractionRecord {
    id: string;
    interactionSummary: string;
    userId: string;
    medications: Array<string>;
    timestamp: bigint;
}
export interface MedicationReminder {
    id: string;
    dosage: string;
    userId: string;
    isActive: boolean;
    reminderTime: bigint;
    medicineName: string;
}
export interface DietRecord {
    id: string;
    userId: string;
    timestamp: bigint;
    dietPlan: string;
}
export interface HospitalRecord {
    id: string;
    userId: string;
    results: string;
    timestamp: bigint;
    location: string;
}
export interface Prescription {
    id: string;
    analysisResult: string;
    userId: string;
    extractedText: string;
    timestamp: bigint;
}
export interface UserProfile {
    name: string;
    email: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}

export type EmergencyStatus =
    | { 'Requested': null }
    | { 'Dispatched': null }
    | { 'Arriving': null }
    | { 'Arrived': null }
    | { 'Completed': null };

export interface EmergencyCase {
    id: string;
    userId: string;
    latitude: number;
    longitude: number;
    status: EmergencyStatus;
    hospitalId: string | null;
    timestamp: bigint;
}

export interface HospitalSearchLog {
    id: string;
    userId: string;
    query: string;
    latitude: number;
    longitude: number;
    emergency: boolean;
    timestamp: bigint;
}

export interface backendInterface {
    addReminder(userId: string, medicineName: string, dosage: string, reminderTime: bigint): Promise<string>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deletePrescription(id: string): Promise<boolean>;
    deleteReminder(id: string): Promise<boolean>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDietHistory(userId: string): Promise<Array<DietRecord>>;
    getDrugInteractionHistory(userId: string): Promise<Array<DrugInteractionRecord>>;
    getHospitalHistory(userId: string): Promise<Array<HospitalRecord>>;
    getPrescriptionById(id: string): Promise<Prescription | null>;
    getPrescriptions(userId: string): Promise<Array<Prescription>>;
    getPriceHistory(userId: string): Promise<Array<PriceRecord>>;
    getReminders(userId: string): Promise<Array<MedicationReminder>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveDietRecommendation(userId: string, dietPlan: string): Promise<string>;
    saveDrugInteractionResult(userId: string, medications: Array<string>, interactionSummary: string): Promise<string>;
    saveHospitalSearch(userId: string, location: string, results: string): Promise<string>;
    savePrescription(userId: string, rawText: string, analysisResult: string): Promise<string>;
    savePriceComparison(userId: string, medicineName: string, links: string): Promise<string>;
    updateReminderStatus(id: string, isActive: boolean): Promise<boolean>;
    requestAmbulance(latitude: number, longitude: number): Promise<string>;
    getEmergencyStatus(caseId: string): Promise<Array<EmergencyCase>>;
    getMyEmergencies(): Promise<Array<EmergencyCase>>;
    updateEmergencyStatus(caseId: string, newStatus: EmergencyStatus): Promise<boolean>;
}

