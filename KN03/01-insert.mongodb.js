// ============================================================
// KN-M-03 Teil A) – Daten hinzufügen (Insert)
// Datenbank: irontrack   (Thema: Kraft-/Fitnessstudio)
// ------------------------------------------------------------
// - Alle _id werden über new ObjectId() in Variablen gesetzt
//   (keine hartcodierten Werte) und für Referenzen wiederverwendet.
// - insertMany() für trainers / equipment / exercises
// - insertOne()  UND insertMany() für members (beide demonstriert)
//
// Ausführen:  mongosh "<connection-string>" --file 01-insert.mongodb.js
// oder Inhalt in die MONGOSH-Shell von Compass einfügen.
// ============================================================

// Datenbank wählen (funktioniert auch beim Ausführen als Datei)
db = db.getSiblingDB("irontrack");

// Saubere Ausgangslage, damit das Skript mehrfach ausführbar ist
// (sonst würden bei jedem Lauf neue Dokumente dazukommen).
db.members.drop(); db.trainers.drop(); db.exercises.drop(); db.equipment.drop();

// ---- ObjectId-Variablen (keine hartcodierten Werte) ----
var t1 = new ObjectId(), t2 = new ObjectId(), t3 = new ObjectId();
var eq1 = new ObjectId(), eq2 = new ObjectId(), eq3 = new ObjectId(), eq4 = new ObjectId();
var ex1 = new ObjectId(), ex2 = new ObjectId(), ex3 = new ObjectId(), ex4 = new ObjectId(), ex5 = new ObjectId();
var m1 = new ObjectId(), m2 = new ObjectId(), m3 = new ObjectId(), m4 = new ObjectId();

// ---- trainers (insertMany) ----
db.trainers.insertMany([
  { _id: t1, firstName: "Max",   lastName: "Keller", specialization: "Powerlifting",    hireDate: new Date("2021-03-01") },
  { _id: t2, firstName: "Sara",  lastName: "Frei",   specialization: "Hypertrophy",      hireDate: new Date("2022-09-15") },
  { _id: t3, firstName: "Jonas", lastName: "Weber",  specialization: "Olympic Lifting",  hireDate: new Date("2020-01-10") }
]);

// ---- equipment (insertMany) ----
db.equipment.insertMany([
  { _id: eq1, name: "Olympic Barbell", category: "Free Weights", quantity: 8 },
  { _id: eq2, name: "Power Rack",      category: "Rack",         quantity: 4 },
  { _id: eq3, name: "Flat Bench",      category: "Bench",        quantity: 6 },
  { _id: eq4, name: "Cable Machine",   category: "Machine",      quantity: 2 }
]);

// ---- exercises (insertMany) – equipmentId referenziert equipment ----
db.exercises.insertMany([
  { _id: ex1, name: "Back Squat",  muscleGroup: "Legs",  type: "C", equipmentId: eq2 },
  { _id: ex2, name: "Bench Press", muscleGroup: "Chest", type: "C", equipmentId: eq3 },
  { _id: ex3, name: "Deadlift",    muscleGroup: "Back",  type: "C", equipmentId: eq1 },
  { _id: ex4, name: "Bicep Curl",  muscleGroup: "Arms",  type: "I", equipmentId: eq1 },
  { _id: ex5, name: "Cable Row",   muscleGroup: "Back",  type: "I", equipmentId: eq4 }
]);

// ---- members: zuerst EIN Dokument mit insertOne() ----
// (workouts[] -> exercises[] sind eingebettet; trainerId referenziert trainers)
db.members.insertOne({
  _id: m1, firstName: "Denis", lastName: "Suciu",
  birthDate: new Date("2000-05-12"), heightCm: 180, startWeightKg: 78.5,
  membershipCode: "P", trainerId: t1,
  workouts: [
    { date: new Date("2026-01-10"), focus: "Push", durationMin: 65,
      exercises: [ { exerciseId: ex2, sets: 5, reps: 5, weightKg: 80.0 } ] },
    { date: new Date("2026-01-13"), focus: "Legs", durationMin: 70,
      exercises: [ { exerciseId: ex1, sets: 5, reps: 5, weightKg: 100.0 } ] }
  ]
});

// ---- members: dann MEHRERE Dokumente mit insertMany() ----
db.members.insertMany([
  { _id: m2, firstName: "Lena", lastName: "Meier",
    birthDate: new Date("1998-11-23"), heightCm: 168, startWeightKg: 62.0,
    membershipCode: "B", trainerId: t2,
    workouts: [ { date: new Date("2026-02-02"), focus: "Pull", durationMin: 55,
      exercises: [ { exerciseId: ex3, sets: 3, reps: 8, weightKg: 90.0 } ] } ] },
  { _id: m3, firstName: "Tim", lastName: "Brunner",
    birthDate: new Date("2003-07-08"), heightCm: 175, startWeightKg: 70.0,
    membershipCode: "S", trainerId: t1, workouts: [] },
  { _id: m4, firstName: "Nina", lastName: "Roth",
    birthDate: new Date("1995-02-28"), heightCm: 172, startWeightKg: 65.5,
    membershipCode: "P", trainerId: t3,
    workouts: [ { date: new Date("2026-03-05"), focus: "Full Body", durationMin: 80,
      exercises: [ { exerciseId: ex5, sets: 4, reps: 12, weightKg: 45.0 } ] } ] }
]);

// Kontrolle
print("members:   " + db.members.countDocuments());
print("trainers:  " + db.trainers.countDocuments());
print("exercises: " + db.exercises.countDocuments());
print("equipment: " + db.equipment.countDocuments());
