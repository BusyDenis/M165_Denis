// ============================================================
// KN-M-03 Teil B) – Skript 2: Einzelne Datensätze löschen
// Datenbank: irontrack
// ------------------------------------------------------------
// - deleteOne()  mit _id als Filter
// - deleteMany() mit ODER-Verknüpfung ($or) über mehrere _id,
//   löscht aber NICHT alle Datensätze.
// Das Skript ist selbständig: es legt zuerst die Seed-Daten an
// (drop + insert mit ObjectId-Variablen) und löscht dann.
// ============================================================

db = db.getSiblingDB("irontrack");

// ---- Saubere Ausgangslage + Seed-Daten ----
db.members.drop(); db.trainers.drop(); db.exercises.drop(); db.equipment.drop();

var t1 = new ObjectId(), t2 = new ObjectId(), t3 = new ObjectId();
var ex1 = new ObjectId(), ex2 = new ObjectId(), ex3 = new ObjectId(), ex4 = new ObjectId(), ex5 = new ObjectId();

db.trainers.insertMany([
  { _id: t1, firstName: "Max",   lastName: "Keller", specialization: "Powerlifting",   hireDate: new Date("2021-03-01") },
  { _id: t2, firstName: "Sara",  lastName: "Frei",   specialization: "Hypertrophy",     hireDate: new Date("2022-09-15") },
  { _id: t3, firstName: "Jonas", lastName: "Weber",  specialization: "Olympic Lifting", hireDate: new Date("2020-01-10") }
]);
db.exercises.insertMany([
  { _id: ex1, name: "Back Squat",  muscleGroup: "Legs",  type: "C" },
  { _id: ex2, name: "Bench Press", muscleGroup: "Chest", type: "C" },
  { _id: ex3, name: "Deadlift",    muscleGroup: "Back",  type: "C" },
  { _id: ex4, name: "Bicep Curl",  muscleGroup: "Arms",  type: "I" },
  { _id: ex5, name: "Cable Row",   muscleGroup: "Back",  type: "I" }
]);

// ---- deleteOne() mit _id als Filter ----
// Entfernt genau einen Trainer (Jonas Weber).
db.trainers.deleteOne({ _id: t3 });

// ---- deleteMany() mit ODER über mehrere _id (nicht alle!) ----
// Entfernt 2 von 5 Übungen, die übrigen bleiben bestehen.
db.exercises.deleteMany({ $or: [ { _id: ex4 }, { _id: ex5 } ] });

// Kontrolle
print("trainers übrig:  " + db.trainers.countDocuments() + "  (vorher 3)");
print("exercises übrig: " + db.exercises.countDocuments() + "  (vorher 5)");
