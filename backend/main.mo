import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type UserProfile = {
    name : Text;
    email : Text;
  };

  type Prescription = {
    id : Text;
    userId : Text;
    extractedText : Text;
    analysisResult : Text;
    timestamp : Int;
  };

  type MedicationReminder = {
    id : Text;
    userId : Text;
    medicineName : Text;
    dosage : Text;
    reminderTime : Int;
    isActive : Bool;
  };

  type DrugInteractionRecord = {
    id : Text;
    userId : Text;
    medications : [Text];
    interactionSummary : Text;
    timestamp : Int;
  };

  type DietRecord = {
    id : Text;
    userId : Text;
    dietPlan : Text;
    timestamp : Int;
  };

  type HospitalRecord = {
    id : Text;
    userId : Text;
    location : Text;
    results : Text;
    timestamp : Int;
  };

  type PriceRecord = {
    id : Text;
    userId : Text;
    medicineName : Text;
    links : Text;
    timestamp : Int;
  };

  public type EmergencyStatus = {
    #Requested;
    #Dispatched;
    #Arriving;
    #Arrived;
    #Completed;
  };

  type EmergencyCase = {
    id : Text;
    userId : Text;
    latitude : Float;
    longitude : Float;
    status : EmergencyStatus;
    hospitalId : ?Text;
    timestamp : Int;
  };

  type HospitalSearchLog = {
    id : Text;
    userId : Text;
    query : Text;
    latitude : Float;
    longitude : Float;
    emergency : Bool;
    timestamp : Int;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let prescriptions = Map.empty<Text, Prescription>();
  let reminders = Map.empty<Text, MedicationReminder>();
  let drugInteractions = Map.empty<Text, DrugInteractionRecord>();
  let dietRecords = Map.empty<Text, DietRecord>();
  let hospitalRecords = Map.empty<Text, HospitalRecord>();
  let priceRecords = Map.empty<Text, PriceRecord>();
  let emergencyCases = Map.empty<Text, EmergencyCase>();
  let hospitalLogs = Map.empty<Text, HospitalSearchLog>();

  func generateUUID() : Text {
    Time.now().toText();
  };

  // ── User Profile functions ──────────────────────────────────────────────────

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles.add(caller, profile);
  };

  // ── Prescription functions ──────────────────────────────────────────────────

  public shared ({ caller }) func savePrescription(userId : Text, rawText : Text, analysisResult : Text) : async Text {
    if (caller.toText() != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Cannot save prescriptions for another user");
    };
    let id = generateUUID();
    let prescription = {
      id;
      userId;
      extractedText = rawText;
      analysisResult;
      timestamp = Time.now();
    };
    prescriptions.add(id, prescription);
    id;
  };

  public query ({ caller }) func getPrescriptions(userId : Text) : async [Prescription] {
    if (caller.toText() != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Cannot view prescriptions of another user");
    };
    prescriptions.values().toArray().filter(
      func(prescription) {
        prescription.userId == userId;
      }
    );
  };

  public query ({ caller }) func getPrescriptionById(id : Text) : async ?Prescription {
    switch (prescriptions.get(id)) {
      case (null) { null };
      case (?prescription) {
        if (caller.toText() != prescription.userId and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Cannot view prescriptions of another user");
        };
        ?prescription;
      };
    };
  };

  public shared ({ caller }) func deletePrescription(id : Text) : async Bool {
    switch (prescriptions.get(id)) {
      case (null) { false };
      case (?prescription) {
        if (caller.toText() != prescription.userId and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Cannot delete prescriptions of another user");
        };
        prescriptions.remove(id);
        true;
      };
    };
  };

  // ── Reminder functions ──────────────────────────────────────────────────────

  public shared ({ caller }) func addReminder(userId : Text, medicineName : Text, dosage : Text, reminderTime : Int) : async Text {
    if (caller.toText() != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Cannot add reminders for another user");
    };
    let id = generateUUID();
    let reminder = {
      id;
      userId;
      medicineName;
      dosage;
      reminderTime;
      isActive = true;
    };
    reminders.add(id, reminder);
    id;
  };

  public query ({ caller }) func getReminders(userId : Text) : async [MedicationReminder] {
    if (caller.toText() != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Cannot view reminders of another user");
    };
    reminders.values().toArray().filter(
      func(reminder) {
        reminder.userId == userId;
      }
    );
  };

  public shared ({ caller }) func updateReminderStatus(id : Text, isActive : Bool) : async Bool {
    switch (reminders.get(id)) {
      case (null) { false };
      case (?reminder) {
        if (caller.toText() != reminder.userId and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Cannot update reminders of another user");
        };
        let updatedReminder = { reminder with isActive };
        reminders.add(id, updatedReminder);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteReminder(id : Text) : async Bool {
    switch (reminders.get(id)) {
      case (null) { false };
      case (?reminder) {
        if (caller.toText() != reminder.userId and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Cannot delete reminders of another user");
        };
        reminders.remove(id);
        true;
      };
    };
  };

  // ── Drug interaction functions ──────────────────────────────────────────────

  public shared ({ caller }) func saveDrugInteractionResult(userId : Text, medications : [Text], interactionSummary : Text) : async Text {
    if (caller.toText() != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Cannot save drug interaction results for another user");
    };
    let id = generateUUID();
    let record = {
      id;
      userId;
      medications;
      interactionSummary;
      timestamp = Time.now();
    };
    drugInteractions.add(id, record);
    id;
  };

  public query ({ caller }) func getDrugInteractionHistory(userId : Text) : async [DrugInteractionRecord] {
    if (caller.toText() != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Cannot view drug interaction history of another user");
    };
    drugInteractions.values().toArray().filter(
      func(record) {
        record.userId == userId;
      }
    );
  };

  // ── Diet recommendation functions ───────────────────────────────────────────

  public shared ({ caller }) func saveDietRecommendation(userId : Text, dietPlan : Text) : async Text {
    if (caller.toText() != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Cannot save diet recommendations for another user");
    };
    let id = generateUUID();
    let record = {
      id;
      userId;
      dietPlan;
      timestamp = Time.now();
    };
    dietRecords.add(id, record);
    id;
  };

  public query ({ caller }) func getDietHistory(userId : Text) : async [DietRecord] {
    if (caller.toText() != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Cannot view diet history of another user");
    };
    dietRecords.values().toArray().filter(
      func(record) {
        record.userId == userId;
      }
    );
  };

  // ── Hospital recommendation functions ───────────────────────────────────────

  public shared ({ caller }) func saveHospitalSearch(userId : Text, location : Text, results : Text) : async Text {
    if (caller.toText() != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Cannot save hospital searches for another user");
    };
    let id = generateUUID();
    let record = {
      id;
      userId;
      location;
      results;
      timestamp = Time.now();
    };
    hospitalRecords.add(id, record);
    id;
  };

  public query ({ caller }) func getHospitalHistory(userId : Text) : async [HospitalRecord] {
    if (caller.toText() != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Cannot view hospital history of another user");
    };
    hospitalRecords.values().toArray().filter(
      func(record) {
        record.userId == userId;
      }
    );
  };

  // ── Price comparison functions ──────────────────────────────────────────────

  public shared ({ caller }) func savePriceComparison(userId : Text, medicineName : Text, links : Text) : async Text {
    if (caller.toText() != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Cannot save price comparisons for another user");
    };
    let id = generateUUID();
    let record = {
      id;
      userId;
      medicineName;
      links;
      timestamp = Time.now();
    };
    priceRecords.add(id, record);
    id;
  };

  public query ({ caller }) func getPriceHistory(userId : Text) : async [PriceRecord] {
    if (caller.toText() != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Cannot view price history of another user");
    };
    priceRecords.values().toArray().filter(
      func(record) {
        record.userId == userId;
      }
    );
  };

  // ── Emergency Ambulance functions ───────────────────────────────────────────

  public shared ({ caller }) func requestAmbulance(latitude : Float, longitude : Float) : async Text {
    let userId = caller.toText();
    let caseId = generateUUID();
    let newCase : EmergencyCase = {
      id = caseId;
      userId;
      latitude;
      longitude;
      status = #Requested;
      hospitalId = null;
      timestamp = Time.now();
    };
    emergencyCases.add(caseId, newCase);

    let logId = generateUUID();
    let logEntry : HospitalSearchLog = {
      id = logId;
      userId;
      query = "emergency ambulance";
      latitude;
      longitude;
      emergency = true;
      timestamp = Time.now();
    };
    hospitalLogs.add(logId, logEntry);

    caseId;
  };

  public query ({ caller }) func getEmergencyStatus(caseId : Text) : async ?EmergencyCase {
    switch (emergencyCases.get(caseId)) {
      case (null) { null };
      case (?emergencyCase) {
        if (caller.toText() != emergencyCase.userId and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Cannot view emergency cases of another user");
        };
        ?emergencyCase;
      };
    };
  };

  public query ({ caller }) func getMyEmergencies() : async [EmergencyCase] {
    let userId = caller.toText();
    emergencyCases.values().toArray().filter(
      func(c) {
        c.userId == userId;
      }
    );
  };

  public shared ({ caller }) func updateEmergencyStatus(caseId : Text, newStatus : EmergencyStatus) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update emergency status");
    };
    switch (emergencyCases.get(caseId)) {
      case (null) { false };
      case (?c) {
        let updatedCase = { c with status = newStatus };
        emergencyCases.add(caseId, updatedCase);
        true;
      };
    };
  };
};
