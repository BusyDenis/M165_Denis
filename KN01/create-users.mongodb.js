// ============================================================
// KN-M-01 Teil D) - Erstellen von zwei Benutzern
// ------------------------------------------------------------
// Themendatenbank = deine Datenbank aus Teil B) (Name: dein Nachname)
// Ersetze Suciu ueberall durch deinen tatsaechlichen Datenbanknamen.
//
// Wichtig zu den Rollen:
//   - Es werden NUR built-in Rollen verwendet.
//   - KEINE Rolle mit "Any" im Namen (also nicht readAnyDatabase /
//     readWriteAnyDatabase), sondern db-spezifische Rollen "read" / "readWrite".
//
// Ausfuehren als admin, z.B. auf dem Server:
//   sudo mongosh --authenticationDatabase "admin" -u "admin" -p "<adminPw>" < create-users.mongodb.js
// oder Inhalt in die Compass-MONGOSH-Shell einfuegen.
// ============================================================

// ----- Benutzer 1: darf NUR LESEN -----
// Authentifizierungsdatenbank = Themendatenbank (deine Suciu-DB)
use Suciu;
db.createUser({
  user: "leser",
  pwd: "Leser-Pw.2026",
  roles: [
    { role: "read", db: "Suciu" }   // built-in, db-spezifisch, ohne "Any"
  ]
});

// ----- Benutzer 2: darf LESEN und SCHREIBEN -----
// Authentifizierungsdatenbank = admin
use admin;
db.createUser({
  user: "schreiber",
  pwd: "Schreiber-Pw.2026",
  roles: [
    { role: "readWrite", db: "Suciu" }  // built-in, db-spezifisch, ohne "Any"
  ]
});
