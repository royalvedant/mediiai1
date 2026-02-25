import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type {
  Prescription,
  MedicationReminder,
  DrugInteractionRecord,
  DietRecord,
  HospitalRecord,
  PriceRecord,
  UserProfile,
} from '../backend';

// ── User Profile ────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ── Prescriptions ────────────────────────────────────────────────────────────

export function usePrescriptions(userId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Prescription[]>({
    queryKey: ['prescriptions', userId],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getPrescriptions(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function usePrescriptionById(id: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Prescription | null>({
    queryKey: ['prescription', id],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getPrescriptionById(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useSavePrescription() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      rawText,
      analysisResult,
    }: {
      userId: string;
      rawText: string;
      analysisResult: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.savePrescription(userId, rawText, analysisResult);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions', variables.userId] });
    },
  });
}

export function useDeletePrescription() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deletePrescription(id);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions', variables.userId] });
    },
  });
}

// ── Reminders ────────────────────────────────────────────────────────────────

export function useReminders(userId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<MedicationReminder[]>({
    queryKey: ['reminders', userId],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getReminders(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useAddReminder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      medicineName,
      dosage,
      reminderTime,
    }: {
      userId: string;
      medicineName: string;
      dosage: string;
      reminderTime: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addReminder(userId, medicineName, dosage, reminderTime);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reminders', variables.userId] });
    },
  });
}

export function useUpdateReminderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      isActive,
      userId,
    }: {
      id: string;
      isActive: boolean;
      userId: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateReminderStatus(id, isActive);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reminders', variables.userId] });
    },
  });
}

export function useDeleteReminder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteReminder(id);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reminders', variables.userId] });
    },
  });
}

// ── Drug Interactions ────────────────────────────────────────────────────────

export function useDrugInteractions(userId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<DrugInteractionRecord[]>({
    queryKey: ['drugInteractions', userId],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getDrugInteractionHistory(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useSaveDrugInteraction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      medications,
      interactionSummary,
    }: {
      userId: string;
      medications: string[];
      interactionSummary: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveDrugInteractionResult(userId, medications, interactionSummary);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['drugInteractions', variables.userId] });
    },
  });
}

// ── Diet Recommendations ─────────────────────────────────────────────────────

export function useDietHistory(userId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<DietRecord[]>({
    queryKey: ['dietHistory', userId],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getDietHistory(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useSaveDietRecommendation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, dietPlan }: { userId: string; dietPlan: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveDietRecommendation(userId, dietPlan);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['dietHistory', variables.userId] });
    },
  });
}

// ── Hospital Searches ────────────────────────────────────────────────────────

export function useHospitalHistory(userId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<HospitalRecord[]>({
    queryKey: ['hospitalHistory', userId],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getHospitalHistory(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useSaveHospitalSearch() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      location,
      results,
    }: {
      userId: string;
      location: string;
      results: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveHospitalSearch(userId, location, results);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['hospitalHistory', variables.userId] });
    },
  });
}

// ── Price Comparisons ────────────────────────────────────────────────────────

export function usePriceHistory(userId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<PriceRecord[]>({
    queryKey: ['priceHistory', userId],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getPriceHistory(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useSavePriceComparison() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      medicineName,
      links,
    }: {
      userId: string;
      medicineName: string;
      links: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.savePriceComparison(userId, medicineName, links);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['priceHistory', variables.userId] });
    },
  });
}

// ── Emergency Ambulance ──────────────────────────────────────────────────────

export function useRequestAmbulance() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      latitude,
      longitude,
    }: {
      latitude: number;
      longitude: number;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.requestAmbulance(latitude, longitude);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myEmergencies'] });
    },
  });
}

export function useEmergencyStatus(caseId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['emergencyStatus', caseId],
    queryFn: async () => {
      if (!actor || !caseId) return null;
      const result = await actor.getEmergencyStatus(caseId);
      return result.length > 0 ? result[0] : null; 
    },
    enabled: !!actor && !isFetching && !!caseId,
    refetchInterval: 3000, 
  });
}

export function useMyEmergencies() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['myEmergencies'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyEmergencies();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000, 
  });
}

export function useUpdateEmergencyStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      caseId,
      newStatus,
    }: {
      caseId: string;
      newStatus: any; 
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateEmergencyStatus(caseId, newStatus);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['emergencyStatus', variables.caseId] });
      queryClient.invalidateQueries({ queryKey: ['myEmergencies'] });
    },
  });
}
