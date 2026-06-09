# KN-M-01: Installation und Verwaltung von MongoDB

**Modul m165 · Denis Suciu** — Lösung zur Aufgabe [KN-M-01.md](./KN-M-01.md).
MongoDB 6.0 auf einer AWS Ubuntu 22.04 EC2-Instanz, provisioniert per Cloud-Init.

### Dateien & Server

| Datei | Inhalt |
|-------|--------|
| [`cloudinit-mongodb.yaml`](./cloudinit-mongodb.yaml) | Cloud-Init mit geändertem Passwort + eigenem SSH-Key (Teil A) |
| [`create-users.mongodb.js`](./create-users.mongodb.js) | Skript für die zwei Benutzer (Teil D) |
| `pictures/` | Screenshots + Export-Datei |

| Server | Wert |
|---|---|
| Instanz | t3.micro · Ubuntu 22.04 · 20 GB · Region us-east-1 |
| Elastic IP | `32.196.73.49` · Ports **22** + **27017** offen |
| MongoDB | 6.0.28, Admin `admin` / `m165-Demo-Pw.2026` (Auth-DB `admin`) |

> Alle Passwörter sind **Wegwerf-Passwörter** (Vorgabe: kein echtes Passwort in Git).

---

## A) Installation (30 %)

**Vorgehen:** In `cloudinit-mongodb.yaml` das Admin-Passwort geändert und meinen SSH-Key ergänzt (Lehrer-Keys belassen). In AWS eine EC2-Instanz erstellt (t3.micro, 20 GB, Elastic IP, Security Group mit Ports 22 + 27017) und das Cloud-Init als *User Data* eingefügt. Nach dem Boot via SSH geprüft (`cloud-init-output.log`, `systemctl status mongod`), dann mit **Compass** verbunden:

```
mongodb://admin:m165-Demo-Pw.2026@32.196.73.49:27017/?authSource=admin&readPreference=primary&ssl=false
```

> **Hinweis:** Diese Compass-Version lehnte den String beim Einfügen mit *„option authsource is not supported"* ab. Verbunden habe ich mich mit dem verkürzten `mongodb://admin:m165-Demo-Pw.2026@32.196.73.49:27017/` bzw. über das Formular (Authentication Database = `admin`). Ohne Angabe von `authSource` setzt MongoDB die Auth-DB automatisch auf `admin` — also den korrekten Wert.

![Compass mit der Liste der bestehenden Datenbanken](./pictures/a-compass-dblist.png)

**Welche Ports?** MongoDB lauscht auf **TCP 27017** (plus 22 für SSH) — beide in der Security Group geöffnet.

**Frage – `authSource=admin`:** `authSource` legt fest, in welcher Datenbank MongoDB den Benutzer und seine Credentials sucht. Unser `admin`-Benutzer wurde mit `use admin; db.createUser(...)` in der `admin`-DB angelegt, also muss MongoDB ihn dort suchen. Eine andere oder fehlende Auth-DB würde den Benutzer nicht finden → Login scheitert. Darum ist `authSource=admin` korrekt (Gegenbeweis in Teil D).

**Frage – die zwei `sed`-Befehle** (bearbeiten `/etc/mongod.conf` in-place):

1. `sed 's/127.0.0.1/0.0.0.0/g'` — setzt `bindIp` von `127.0.0.1` (nur localhost) auf `0.0.0.0` (alle Interfaces). **Nötig**, damit die DB überhaupt von aussen / Compass erreichbar ist.
2. `sed 's/#security:/security:\n  authorization: enabled/g'` — aktiviert die **Authentifizierung** (`authorization: enabled`). **Nötig**, sonst wäre die DB zusammen mit `bindIp: 0.0.0.0` offen im Internet; erst dadurch greifen Benutzer und Rollen.

Beide ersetzten Werte auf dem Server geprüft mit `grep -E "bindIp|authorization" /etc/mongod.conf`:

![mongod.conf mit bindIp 0.0.0.0 und authorization enabled](./pictures/a-mongod-conf.png)

---

## B) Erste Schritte GUI (30 %)

In Compass die Datenbank **`Suciu`** (Nachname) mit Collection **`Denis`** (Vorname) angelegt und ein Dokument mit den Typen string / int / Datum eingefügt:

```json
{ "adresse": "Musterstrasse 1, 8000 Zürich", "groesse": 178, "geburtsdatum": "2000-05-12" }
```

![Dokument vor dem Einfügen](./pictures/b-insert-before.png)

`geburtsdatum` war zunächst ein **String**; im Editiermodus den Datentyp auf **Date** geändert (Typen jetzt: `String`, `Int32`, `Date`):

![Dokument nach Änderung auf Date](./pictures/b-after-date.png)

Danach als JSON exportiert → [`pictures/b-export.json`](./pictures/b-export.json).

**Frage – Datum direkt korrekt einfügen?** Im Export erscheint das Datum als Extended JSON: `"geburtsdatum": { "$date": "2000-05-12T00:00:00.000Z" }`. Man hätte also direkt diese `{ "$date": "..." }`-Notation verwenden müssen. **Warum so kompliziert?** JSON kennt kein Datum (nur string, number, boolean, null, object, array). MongoDB speichert intern **BSON** mit Typen wie `Date`, `ObjectId`, `Int32`; um diese in JSON auszudrücken, gibt es **Extended JSON** mit `$`-Wrappern (`$date`, `$oid`, …). Ein normaler String bliebe ein String — Sortierung/Vergleiche und Datums-Operatoren funktionieren dann nicht.

---

## C) Erste Schritte Shell (10 %)

Folgende Befehle in der **Compass-MONGOSH** und via SSH in **mongosh auf dem Server** ausgeführt:

```js
show dbs
show databases
use Suciu
show collections
show tables
var test = "hallo"
test
```

Server-Login: `ssh ubuntu@32.196.73.49`, dann `sudo mongosh --authenticationDatabase "admin" -u "admin" -p "m165-Demo-Pw.2026"`.

![Befehle in der Compass-Shell](./pictures/c-compass-shell.png)
![Befehle in mongosh auf dem Server](./pictures/c-server-shell.png)

**Frage – Befehle 1–5 & Collections vs. Tables:**

| # | Befehl | Wirkung |
|---|--------|---------|
| 1 | `show dbs` | Listet alle Datenbanken auf. |
| 2 | `show databases` | Alias zu `show dbs`. |
| 3 | `use Suciu` | Wechselt in die Datenbank. |
| 4 | `show collections` | Listet die Collections der aktuellen DB. |
| 5 | `show tables` | Alias zu `show collections`. |

Eine **Table** (SQL) hat ein **festes Schema** (gleiche Spalten je Zeile); eine **Collection** (MongoDB) ist **schemalos** — Dokumente dürfen unterschiedlich aufgebaut sein. `show tables` ist nur ein Synonym; technisch gibt es in MongoDB nur Collections. Befehle 6–7 zeigen, dass die Shell echtes **JavaScript** ausführt.

---

## D) Rechte und Rollen (30 %)

**1. Falsche `authSource` → Fehler.** Verbindung als `admin`, aber mit `authSource=Suciu` statt `admin`:

```
mongodb://admin:m165-Demo-Pw.2026@32.196.73.49:27017/?authSource=Suciu
```

→ **`Authentication failed`**, da der `admin`-Benutzer nur in `admin` existiert. Bestätigt Teil A.

![Authentication failed bei falscher authSource](./pictures/d-wrong-authsource.png)

**2. Zwei Benutzer erstellt** ([`create-users.mongodb.js`](./create-users.mongodb.js)) — built-in Rollen ohne „Any":

- **`leser`** — nur lesen, Auth-DB `Suciu`, Rolle `read`.
- **`schreiber`** — lesen + schreiben, Auth-DB `admin`, Rolle `readWrite` auf `Suciu`.

**3. Benutzer 1 (`leser`)** — getestet in mongosh: `db.auth("leser","Leser-Pw.2026")` → `{ ok: 1 }`, `db.Denis.find()` liefert das Dokument, `db.Denis.insertOne({test:1})` → **`not authorized`**.

![Login Benutzer 1](./pictures/d-user1-login.png)
![Benutzer 1 – Lesen OK](./pictures/d-user1-read-ok.png)
![Benutzer 1 – Schreiben verweigert](./pictures/d-user1-write-fail.png)

**4. Benutzer 2 (`schreiber`)** — `use admin; db.auth("schreiber","Schreiber-Pw.2026")` → `{ ok: 1 }`, dann `use Suciu`: `find()` liefert das Dokument, `insertOne({test:2})` → **`acknowledged: true`**.

![Login Benutzer 2](./pictures/d-user2-login.png)
![Benutzer 2 – Lesen OK](./pictures/d-user2-read-ok.png)
![Benutzer 2 – Schreiben OK](./pictures/d-user2-write-ok.png)

Damit gezeigt: `read` erlaubt nur Lesen, `readWrite` auch Schreiben — und die Auth-DB entscheidet, wo der Benutzer gefunden wird.

---

## Abgaben-Übersicht

| Teil | Abgabe | Ort |
|------|--------|-----|
| A | Cloud-Init mit geändertem Passwort | [`cloudinit-mongodb.yaml`](./cloudinit-mongodb.yaml) |
| A | DB-Liste in Compass · `mongod.conf` | `a-compass-dblist.png` · `a-mongod-conf.png` |
| A | Erklärung `authSource` & `sed`-Befehle | Abschnitt A |
| B | Dokument vorher · nach Datumsänderung · Export | `b-insert-before.png` · `b-after-date.png` · `b-export.json` |
| B | Erklärung Datum / Extended JSON | Abschnitt B |
| C | Befehle Compass · Server | `c-compass-shell.png` · `c-server-shell.png` |
| C | Erklärung Befehle 1–5 + Collections/Tables | Abschnitt C |
| D | Fehler falsche `authSource` · Benutzer-Skript | `d-wrong-authsource.png` · [`create-users.mongodb.js`](./create-users.mongodb.js) |
| D | Benutzer 1: Login / Lesen OK / Schreiben Fehler | `d-user1-login.png` · `d-user1-read-ok.png` · `d-user1-write-fail.png` |
| D | Benutzer 2: Login / Lesen OK / Schreiben OK | `d-user2-login.png` · `d-user2-read-ok.png` · `d-user2-write-ok.png` |
