// ============================================================
// KN-M-03 Teil D) – Daten verändern (Update)
// Datenbank: irontrack
// ------------------------------------------------------------
// Drei Befehle auf drei UNTERSCHIEDLICHEN Collections:
//   - updateOne()   mit _id als Filter            -> members
//   - updateMany()  ohne _id, $or, >1 Dokument    -> exercises
//   - replaceOne()  ersetzt ein Dokument          -> equipment
// Das Skript räumt zuerst auf und fügt die Daten neu hinzu.
// ============================================================

db = db.getSiblingDB("irontrack");

// ---- Aufräumen + Seed-Daten ----
db.members.drop(); db.exercises.drop(); db.equipment.drop();

var ex1 = new ObjectId(), ex2 = new ObjectId(), ex3 = new ObjectId(), ex4 = new ObjectId(), ex5 = new ObjectId();
var m1 = new ObjectId(), m2 = new ObjectId(), m3 = new ObjectId();
var eq1 = new ObjectId(), eq2 = new ObjectId(), eq3 = new ObjectId(), eq4 = new ObjectId();

db.members.insertMany([
  { _id: m1, firstName: "Denis", lastName: "Suciu", membershipCode: "P", heightCm: 180 },
  { _id: m2, firstName: "Lena",  lastName: "Meier", membershipCode: "B", heightCm: 168 },
  { _id: m3, firstName: "Tim",   lastName: "Brunner", membershipCode: "S", heightCm: 175 }
]);
db.exercises.insertMany([
  { _id: ex1, name: "Back Squat",  muscleGroup: "Legs",  type: "C" },
  { _id: ex2, name: "Bench Press", muscleGroup: "Chest", type: "C" },
  { _id: ex3, name: "Deadlift",    muscleGroup: "Back",  type: "C" },
  { _id: ex4, name: "Bicep Curl",  muscleGroup: "Arms",  type: "I" },
  { _id: ex5, name: "Cable Row",   muscleGroup: "Back",  type: "I" }
]);
db.equipment.insertMany([
  { _id: eq1, name: "Olympic Barbell", category: "Free Weights", quantity: 8 },
  { _id: eq2, name: "Power Rack",      category: "Rack",         quantity: 4 },
  { _id: eq3, name: "Flat Bench",      category: "Bench",        quantity: 6 },
  { _id: eq4, name: "Cable Machine",   category: "Machine",      quantity: 2 }
]);

// ---- 1) updateOne() mit _id als Filter (members) ----
// Tim wechselt von Student- auf Premium-Abo.
var r1 = db.members.updateOne(
  { _id: m3 },
  { $set: { membershipCode: "P" } }
);
print("updateOne members  -> matched=" + r1.matchedCount + " modified=" + r1.modifiedCount);

// ---- 2) updateMany() ohne _id, $or, verändert mehrere Dokumente (exercises) ----
// Alle Bein- ODER Rücken-Übungen als "reviewed" markieren (3 Dokumente: Squat, Deadlift, Cable Row).
var r2 = db.exercises.updateMany(
  { $or: [ { muscleGroup: "Legs" }, { muscleGroup: "Back" } ] },
  { $set: { reviewed: true } }
);
print("updateMany exercises -> matched=" + r2.matchedCount + " modified=" + r2.modifiedCount);

// ---- 3) replaceOne() ersetzt ein ganzes Dokument (equipment) ----
// Das Cable Machine-Dokument wird komplett neu gesetzt (Bestand erhöht).
var r3 = db.equipment.replaceOne(
  { name: "Cable Machine" },
  { name: "Cable Machine", category: "Machine", quantity: 3 }
);
print("replaceOne equipment -> matched=" + r3.matchedCount + " modified=" + r3.modifiedCount);
