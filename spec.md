# Specification

## Summary
**Goal:** Implement the Motoko backend with full data persistence and wire all MediAI features to a connected frontend UI.

**Planned changes:**
- Implement `backend/main.mo` Motoko actor with stable storage for User, Prescription, MedicalReport, MedicationReminder, DrugInteraction, DietRecord, HospitalRecord, and PriceRecord data models
- Add backend CRUD functions for prescriptions, reminders, drug interactions, diet recommendations, hospital searches, and medicine price comparisons
- Create `frontend/src/hooks/useMediAIQueries.ts` with React Query hooks wired to all backend actor functions
- Create `frontend/src/components/Dashboard.tsx` with four tabs: My Prescriptions, My Reminders, Drug Interactions, and Diet Plans — styled with glassmorphism/neon theme and backed by query hooks
- Create `frontend/src/components/MedicineComparison.tsx` with a medicine name input that generates pharmacy links for 1mg, PharmEasy, and Netmeds, saves results to backend, and is embedded in a new "Tools" section in App.tsx
- Create `frontend/src/components/DrugInteractionChecker.tsx` with multi-input (up to 5 medicines), simulated interaction warnings with amber/red neon styling, and backend persistence
- Update `frontend/src/components/Navbar.tsx` to show a Dashboard link and Internet Identity login/logout button, displaying truncated principal ID when authenticated

**User-visible outcome:** Authenticated users can log in via Internet Identity, access a personal dashboard to view and manage prescriptions, reminders, drug interaction history, and diet plans, use the medicine price comparison tool to find pharmacy links, and check drug interactions — with all data persisted on-chain via the Motoko backend.
