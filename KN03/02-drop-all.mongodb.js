// ============================================================
// KN-M-03 Teil B) – Skript 1: ALLE Collections löschen (Aufräumen)
// Datenbank: irontrack
// ------------------------------------------------------------
// Dient zum "Aufräumen", damit andere Skripts auf einer leeren
// Datenbank starten können. Verwendet collection.drop().
// ============================================================

db = db.getSiblingDB("irontrack");

db.members.drop();
db.trainers.drop();
db.exercises.drop();
db.equipment.drop();

// Kontrolle: sollte keine Collections mehr anzeigen
print("Verbleibende Collections: " + db.getCollectionNames());
