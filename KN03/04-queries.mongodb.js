// ============================================================
// KN-M-03 Teil C) – Daten abfragen (find)
// Datenbank: irontrack
// ------------------------------------------------------------
// Bedingungen (alle erfüllt, NIE mit _id gefiltert):
//   1. mind. eine Abfrage pro Collection (4 Collections)
//   2. Filter auf ein DateTime-Feld           -> trainers.hireDate
//   3. ODER-Verknüpfung (nicht _id)           -> exercises
//   4. UND-Verknüpfung (andere Collection)    -> members
//   5. Regex für Teilstring                   -> equipment
//   6. Projektion MIT _id                     -> members
//   7. Projektion OHNE _id                    -> trainers
// Das Skript räumt zuerst auf und fügt die Daten neu hinzu.
// ============================================================

db = db.getSiblingDB("irontrack");

// ---- Aufräumen + Seed-Daten ----
db.members.drop(); db.trainers.drop(); db.exercises.drop(); db.equipment.drop();

var t1 = new ObjectId(), t2 = new ObjectId(), t3 = new ObjectId();
var eq1 = new ObjectId(), eq2 = new ObjectId(), eq3 = new ObjectId(), eq4 = new ObjectId();
var ex1 = new ObjectId(), ex2 = new ObjectId(), ex3 = new ObjectId(), ex4 = new ObjectId(), ex5 = new ObjectId();
var m1 = new ObjectId(), m2 = new ObjectId(), m3 = new ObjectId(), m4 = new ObjectId();

db.trainers.insertMany([
  { _id: t1, firstName: "Max",   lastName: "Keller", specialization: "Powerlifting",   hireDate: new Date("2021-03-01") },
  { _id: t2, firstName: "Sara",  lastName: "Frei",   specialization: "Hypertrophy",     hireDate: new Date("2022-09-15") },
  { _id: t3, firstName: "Jonas", lastName: "Weber",  specialization: "Olympic Lifting", hireDate: new Date("2020-01-10") }
]);
db.equipment.insertMany([
  { _id: eq1, name: "Olympic Barbell", category: "Free Weights", quantity: 8 },
  { _id: eq2, name: "Power Rack",      category: "Rack",         quantity: 4 },
  { _id: eq3, name: "Flat Bench",      category: "Bench",        quantity: 6 },
  { _id: eq4, name: "Cable Machine",   category: "Machine",      quantity: 2 }
]);
db.exercises.insertMany([
  { _id: ex1, name: "Back Squat",  muscleGroup: "Legs",  type: "C", equipmentId: eq2 },
  { _id: ex2, name: "Bench Press", muscleGroup: "Chest", type: "C", equipmentId: eq3 },
  { _id: ex3, name: "Deadlift",    muscleGroup: "Back",  type: "C", equipmentId: eq1 },
  { _id: ex4, name: "Bicep Curl",  muscleGroup: "Arms",  type: "I", equipmentId: eq1 },
  { _id: ex5, name: "Cable Row",   muscleGroup: "Back",  type: "I", equipmentId: eq4 }
]);
db.members.insertMany([
  { _id: m1, firstName: "Denis", lastName: "Suciu", birthDate: new Date("2000-05-12"),
    heightCm: 180, startWeightKg: 78.5, membershipCode: "P", trainerId: t1 },
  { _id: m2, firstName: "Lena", lastName: "Meier", birthDate: new Date("1998-11-23"),
    heightCm: 168, startWeightKg: 62.0, membershipCode: "B", trainerId: t2 },
  { _id: m3, firstName: "Tim", lastName: "Brunner", birthDate: new Date("2003-07-08"),
    heightCm: 175, startWeightKg: 70.0, membershipCode: "S", trainerId: t1 },
  { _id: m4, firstName: "Nina", lastName: "Roth", birthDate: new Date("1995-02-28"),
    heightCm: 172, startWeightKg: 65.5, membershipCode: "P", trainerId: t3 }
]);

print("===== 1) trainers – Filter auf DateTime + Projektion OHNE _id =====");
// Trainer, die vor dem 01.01.2022 angestellt wurden
printjson(
  db.trainers.find(
    { hireDate: { $lt: new Date("2022-01-01") } },
    { _id: 0, firstName: 1, lastName: 1, hireDate: 1 }
  ).toArray()
);

print("===== 2) exercises – ODER-Verknüpfung ($or, nicht _id) =====");
// Übungen, die Rücken trainieren ODER Grundübungen (Compound) sind
printjson(
  db.exercises.find(
    { $or: [ { muscleGroup: "Back" }, { type: "C" } ] }
  ).toArray()
);

print("===== 3) members – UND-Verknüpfung ($and) + Projektion MIT _id =====");
// Premium-Mitglieder, die mindestens 175 cm gross sind
printjson(
  db.members.find(
    { $and: [ { membershipCode: "P" }, { heightCm: { $gte: 175 } } ] },
    { _id: 1, firstName: 1, membershipCode: 1, heightCm: 1 }
  ).toArray()
);

print("===== 4) equipment – Regex (Teilstring) =====");
// Geräte, deren Name den Teilstring "Ba" enthält (z. B. Barbell)
printjson(
  db.equipment.find(
    { name: { $regex: /Ba/i } }
  ).toArray()
);
