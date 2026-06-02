// ============================================================
// KN-M-02 Teil C – Collections der IronTrack-Datenbank erstellen
// ------------------------------------------------------------
// Thema: Kraft-/Fitnessstudio "IronTrack"
//
// HINWEIS: Den folgenden Befehl ZUERST separat ausführen, damit
// in die (noch nicht existierende) Datenbank gewechselt wird:
//
//     use irontrack;
//
// Die Datenbank entsteht beim ersten Schreibzugriff – das
// createCollection unten genügt.
//
// ACHTUNG: In dieser Aufgabe wird BEWUSST KEIN JSON-Schema /
// keine Validierung verwendet. Die Schemas folgen in einer
// späteren Aufgabe.
// ============================================================

db.createCollection("members");     // Mitglieder; bettet workouts[] -> exercises[] ein
db.createCollection("trainers");    // Coaches (per trainerId referenziert)
db.createCollection("exercises");   // Übungs-Katalog (per exerciseId referenziert)
db.createCollection("equipment");   // Geräte (per equipmentId referenziert)

// Kontrolle: zeigt die erstellten Collections an
show collections;
