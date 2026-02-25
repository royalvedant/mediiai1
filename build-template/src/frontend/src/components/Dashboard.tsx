import { useState } from 'react';
import { Trash2, Bell, BellOff, FileText, Pill, Salad, AlertTriangle, Loader2, Lock } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import {
  usePrescriptions,
  useReminders,
  useDrugInteractions,
  useDietHistory,
  useDeletePrescription,
  useUpdateReminderStatus,
  useDeleteReminder,
} from '../hooks/useMediAIQueries';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

function EmptyState({ icon: Icon, message }: { icon: React.ElementType; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{
          background: 'rgba(0,212,255,0.08)',
          border: '1px solid rgba(0,212,255,0.2)',
          boxShadow: '0 0 20px rgba(0,212,255,0.1)',
        }}
      >
        <Icon size={28} style={{ color: 'rgba(0,212,255,0.5)' }} />
      </div>
      <p
        className="text-sm font-medium"
        style={{
          color: 'rgba(0,212,255,0.5)',
          textShadow: '0 0 8px rgba(0,212,255,0.3)',
        }}
      >
        {message}
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 size={32} className="animate-spin" style={{ color: '#00d4ff' }} />
    </div>
  );
}

function PrescriptionsTab({ userId }: { userId: string }) {
  const { data: prescriptions, isLoading } = usePrescriptions(userId);
  const deleteMutation = useDeletePrescription();

  if (isLoading) return <LoadingState />;
  if (!prescriptions || prescriptions.length === 0) {
    return <EmptyState icon={FileText} message="No prescriptions yet. Upload your first prescription!" />;
  }

  return (
    <div className="space-y-4">
      {prescriptions.map((rx) => (
        <div
          key={rx.id}
          className="rounded-xl p-5"
          style={{
            background: 'rgba(0,212,255,0.04)',
            border: '1px solid rgba(0,212,255,0.15)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={14} style={{ color: '#00d4ff', flexShrink: 0 }} />
                <span className="text-xs font-mono" style={{ color: 'rgba(0,212,255,0.6)' }}>
                  {new Date(Number(rx.timestamp) / 1_000_000).toLocaleDateString()}
                </span>
              </div>
              {rx.extractedText && (
                <p
                  className="text-sm mb-3 line-clamp-2"
                  style={{ color: 'rgba(255,255,255,0.6)' }}
                >
                  <span className="font-semibold" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    Extracted:{' '}
                  </span>
                  {rx.extractedText}
                </p>
              )}
              {rx.analysisResult && (
                <p
                  className="text-sm"
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                >
                  <span className="font-semibold" style={{ color: '#00d4ff' }}>
                    Analysis:{' '}
                  </span>
                  {rx.analysisResult}
                </p>
              )}
            </div>
            <button
              onClick={() => deleteMutation.mutate({ id: rx.id, userId })}
              disabled={deleteMutation.isPending}
              className="p-2 rounded-lg transition-all duration-200 flex-shrink-0"
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.2)',
                color: 'rgba(239,68,68,0.7)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.2)';
                (e.currentTarget as HTMLElement).style.color = '#ef4444';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)';
                (e.currentTarget as HTMLElement).style.color = 'rgba(239,68,68,0.7)';
              }}
            >
              {deleteMutation.isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Trash2 size={14} />
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function RemindersTab({ userId }: { userId: string }) {
  const { data: reminders, isLoading } = useReminders(userId);
  const toggleMutation = useUpdateReminderStatus();
  const deleteMutation = useDeleteReminder();

  if (isLoading) return <LoadingState />;
  if (!reminders || reminders.length === 0) {
    return <EmptyState icon={Bell} message="No reminders set. Add your first medicine reminder!" />;
  }

  return (
    <div className="space-y-4">
      {reminders.map((reminder) => (
        <div
          key={reminder.id}
          className="rounded-xl p-5"
          style={{
            background: reminder.isActive ? 'rgba(0,212,255,0.06)' : 'rgba(255,255,255,0.02)',
            border: `1px solid ${reminder.isActive ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.08)'}`,
            backdropFilter: 'blur(10px)',
            opacity: reminder.isActive ? 1 : 0.6,
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Pill size={14} style={{ color: reminder.isActive ? '#00d4ff' : 'rgba(255,255,255,0.4)' }} />
                <span
                  className="font-semibold text-sm"
                  style={{ color: reminder.isActive ? '#e0f7ff' : 'rgba(255,255,255,0.5)' }}
                >
                  {reminder.medicineName}
                </span>
              </div>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Dosage: {reminder.dosage}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Time: {new Date(Number(reminder.reminderTime) / 1_000_000).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  toggleMutation.mutate({ id: reminder.id, isActive: !reminder.isActive, userId })
                }
                disabled={toggleMutation.isPending}
                className="p-2 rounded-lg transition-all duration-200"
                style={{
                  background: reminder.isActive ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${reminder.isActive ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.1)'}`,
                  color: reminder.isActive ? '#00d4ff' : 'rgba(255,255,255,0.4)',
                }}
                title={reminder.isActive ? 'Deactivate reminder' : 'Activate reminder'}
              >
                {toggleMutation.isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : reminder.isActive ? (
                  <Bell size={14} />
                ) : (
                  <BellOff size={14} />
                )}
              </button>
              <button
                onClick={() => deleteMutation.mutate({ id: reminder.id, userId })}
                disabled={deleteMutation.isPending}
                className="p-2 rounded-lg transition-all duration-200"
                style={{
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  color: 'rgba(239,68,68,0.7)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.2)';
                  (e.currentTarget as HTMLElement).style.color = '#ef4444';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)';
                  (e.currentTarget as HTMLElement).style.color = 'rgba(239,68,68,0.7)';
                }}
              >
                {deleteMutation.isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DrugInteractionsTab({ userId }: { userId: string }) {
  const { data: interactions, isLoading } = useDrugInteractions(userId);

  if (isLoading) return <LoadingState />;
  if (!interactions || interactions.length === 0) {
    return <EmptyState icon={AlertTriangle} message="No drug interaction checks yet." />;
  }

  return (
    <div className="space-y-4">
      {interactions.map((record) => (
        <div
          key={record.id}
          className="rounded-xl p-5"
          style={{
            background: 'rgba(251,191,36,0.04)',
            border: '1px solid rgba(251,191,36,0.2)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={14} style={{ color: '#fbbf24' }} />
            <span className="text-xs font-mono" style={{ color: 'rgba(251,191,36,0.6)' }}>
              {new Date(Number(record.timestamp) / 1_000_000).toLocaleDateString()}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {record.medications.map((med, i) => (
              <span
                key={i}
                className="px-2 py-1 rounded-md text-xs font-medium"
                style={{
                  background: 'rgba(251,191,36,0.1)',
                  border: '1px solid rgba(251,191,36,0.25)',
                  color: '#fbbf24',
                }}
              >
                {med}
              </span>
            ))}
          </div>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {record.interactionSummary}
          </p>
        </div>
      ))}
    </div>
  );
}

function DietPlansTab({ userId }: { userId: string }) {
  const { data: dietRecords, isLoading } = useDietHistory(userId);

  if (isLoading) return <LoadingState />;
  if (!dietRecords || dietRecords.length === 0) {
    return <EmptyState icon={Salad} message="No diet plans yet. Check your drug interactions to get diet recommendations!" />;
  }

  return (
    <div className="space-y-4">
      {dietRecords.map((record) => (
        <div
          key={record.id}
          className="rounded-xl p-5"
          style={{
            background: 'rgba(34,197,94,0.04)',
            border: '1px solid rgba(34,197,94,0.2)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Salad size={14} style={{ color: '#22c55e' }} />
            <span className="text-xs font-mono" style={{ color: 'rgba(34,197,94,0.6)' }}>
              {new Date(Number(record.timestamp) / 1_000_000).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm whitespace-pre-wrap" style={{ color: 'rgba(255,255,255,0.75)' }}>
            {record.dietPlan}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { identity } = useInternetIdentity();
  const userId = identity?.getPrincipal().toString() ?? null;

  if (!identity || !userId) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background: 'rgba(0,212,255,0.08)',
            border: '1px solid rgba(0,212,255,0.2)',
            boxShadow: '0 0 30px rgba(0,212,255,0.1)',
          }}
        >
          <Lock size={36} style={{ color: 'rgba(0,212,255,0.5)' }} />
        </div>
        <div className="text-center">
          <h3
            className="text-xl font-bold mb-2"
            style={{ color: '#00d4ff', textShadow: '0 0 10px rgba(0,212,255,0.5)' }}
          >
            Authentication Required
          </h3>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Please log in to access your personal health dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Tabs defaultValue="prescriptions" className="w-full">
        <TabsList
          className="w-full mb-6 p-1 rounded-xl"
          style={{
            background: 'rgba(0,212,255,0.06)',
            border: '1px solid rgba(0,212,255,0.15)',
          }}
        >
          <TabsTrigger
            value="prescriptions"
            className="flex-1 text-xs sm:text-sm data-[state=active]:text-white"
            style={{ borderRadius: '8px' }}
          >
            <FileText size={14} className="mr-1.5 hidden sm:inline" />
            My Prescriptions
          </TabsTrigger>
          <TabsTrigger
            value="reminders"
            className="flex-1 text-xs sm:text-sm data-[state=active]:text-white"
            style={{ borderRadius: '8px' }}
          >
            <Bell size={14} className="mr-1.5 hidden sm:inline" />
            My Reminders
          </TabsTrigger>
          <TabsTrigger
            value="interactions"
            className="flex-1 text-xs sm:text-sm data-[state=active]:text-white"
            style={{ borderRadius: '8px' }}
          >
            <AlertTriangle size={14} className="mr-1.5 hidden sm:inline" />
            Drug Interactions
          </TabsTrigger>
          <TabsTrigger
            value="diet"
            className="flex-1 text-xs sm:text-sm data-[state=active]:text-white"
            style={{ borderRadius: '8px' }}
          >
            <Salad size={14} className="mr-1.5 hidden sm:inline" />
            Diet Plans
          </TabsTrigger>
        </TabsList>

        <TabsContent value="prescriptions">
          <PrescriptionsTab userId={userId} />
        </TabsContent>
        <TabsContent value="reminders">
          <RemindersTab userId={userId} />
        </TabsContent>
        <TabsContent value="interactions">
          <DrugInteractionsTab userId={userId} />
        </TabsContent>
        <TabsContent value="diet">
          <DietPlansTab userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
