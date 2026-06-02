![TBZ Logo](../x_res/tbz_logo.png)


[TOC]

# KN-M-01: Installation und Verwaltung von MongoDB

Beachten Sie die [allgemeinen Informationen zu den Abgaben](https://gitlab.com/ch-tbz-it/Stud/m165/m165/-/blob/v2.0/Abgaben.md).

In dieser Arbeit werden Sie MongoDB installieren. Dabei werden Sie auch einige Inhalt von Modul m346 wiederholen. 

## A) Installation (30%)

**Bevor Sie beginnen, stellen Sie sicher, dass Sie verstanden haben was Sie anschliessend abgeben müssen.**

Lesen Sie die [Anleitung zur Installation](../MongoDB/Installation.md) und erstellen Sie einen neuen MongoDb-Server als AWS Instanz. **Achtung**: Verwenden Sie kein Passwort welches Sie sonst auch verwenden, weil Sie es in Git abgeben und dadurch mir zeigen werden. Schauen Sie sich Befehle im `runcmd`-Teil der Cloud-Init Datei an, damit Sie einen Überblick über den Ablauf kriegen.

Installieren Sie dann die Applikation [MongoDB Compass](https://www.mongodb.com/products/compass) als grafische Unterstützung. Verbinden Sie sich mit Ihrer Datenbank. Der Verbindungstext ist

`mongodb://<IhrBenutzer>:<IhrPasswort>@<IhreIp>:27017/?authSource=admin&readPreference=primary&ssl=false`. 

Falls die Verbindung nicht funktionieren sollte, führen Sie den folgenden Befehl aus dem Cloud-Init noch manuell aus: `sudo mongosh < /home/ubuntu/mongodbuser.txt`

Quellen:

- [Installationsanleitung](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/)
- [Connection String](https://www.mongodb.com/docs/manual/reference/connection-string/)
- [Authentifizierung aktivieren](https://www.mongodb.com/docs/manual/tutorial/configure-scram-client-authentication/)
- [Netzwerk-Konfiguration](https://www.mongodb.com/docs/manual/core/security-mongodb-configuration/)

**Abgaben:**

- Ihre Cloud-Init Datei mit dem geänderten Passwort
- Screenshot von Compass mit der Liste der bereits bestehenden Datenbanken.
- Schauen Sie sich Ihren *Connection String* an. Erklären Sie was die Option *authSource=admin* macht und wieso dieser Parameter so korrekt ist.  (Schauen Sie in den Quellen nach)
- Im **cloud-init** finden Sie zweimal den Linux Befehle *sed*. 
  - Erklären Sie was die beiden Befehle bewirken. (Schauen Sie in den Quellen nach). Sie sollen erklären wieso die beiden Befehle notwendig sind, resp. was der Einfluss auf unsere MongoDB ist.
  - Zeigen Sie mit einem Screenshot den Inhalt der MongoDB Konfigurations-Datei in dem die beiden ersetzten Werte sichtbar sind. Sie können die Datei z.B. mit *nano* öffnen oder mit *cat* den Inhalt anzeigen lassen und mit *grep* filtern.
  



## B) Erste Schritte GUI (30%)

Erstellen Sie nun eine erste Datenbank (**Name: Ihr Nachname**) und darin eine Collection (**Name: Ihr Vorname**). Sie können das GUI Compass verwenden. **Achtung**: Gross-Kleinschreibung ist relevant bei den Abfragen.

Nun werden Sie ein JSON-Dokument hinzufügen - ebenfalls über das GUI. 

- Das Attribut `_id` können Sie einfach so stehen lassen. Jedes Dokument hat **automatisch** den Primärschlüssel `_id`. Wenn Sie es entfernen wird im Hintergrund trotzdem diese `_id` geschrieben.
- Fügen Sie zusätzlich noch Attribute mit den Datentypen string, int (oder double) **und Datum** hinzu, z. B. Adresse, Grösse, Geburtsdatum, etc. Erstellen Sie einen **Screenshot** von Ihrem einzufügendem Dokument **bevor** Sie weiterfahren.

![insert-1](./x_res/insert-1.png)

![insert-1](./x_res/insert-2.png)

- Sie können im UI das Dokument nun editieren und die Datentypen anschauen. Wurde Ihr Datum als Datum gespeichert? Wahrscheinlich nicht. **Ändern Sie den Datentyp auf ein Datum**.
- Exportieren Sie die Daten in eine JSON-Datei. Sie finden den Export-Knopf gleichen neben der Einfüge-Option (Sichtbar im Screenshot oben). Nach dem Export schauen Sie sich den Export an und erklären Sie was Sie hätten tun müssen, um direkt ein Datum einzufügen, ohne dass manuelle Änderungen notwendig sind. 

**Quellen**:

- [JSON aus Modul 162](https://gitlab.com/ch-tbz-it/Stud/m162/-/blob/main/Daten_Formate/Json.md)
- [Datentypen aus Modul 162](https://gitlab.com/ch-tbz-it/Stud/m162/-/blob/main/Daten_Formate/Datentypen.md)

**Abgaben:**

- Screenshot (oder JSON) Ihres einzufügenden Dokuments (bevor Sie es einfügen)
- Screenshot Ihrer Compass-Applikation mit der Datenbank, Collection **und Dokument** sichtbar, nachdem Sie den Datentyp geändert haben.
- Export-Datei und Erklärung zu dem Datentyp mit möglichen Implikationen auf andere Datentypen. Wieso ist dieser komplizierte Weg notwendig, um ein Datum zu definieren?



## C) Erste Schritte Shell (10%)

In Ihrem Compass GUI haben Sie auch eine Shell integriert. Klicken Sie auf den Text MONGOSH ganz unten und die Shell wird sich erweitern, so dass Sie Befehle eingeben können. Geben Sie die folgenden Befehle ein. **Achtung**: Gross- und Kleinschreibung sind relevant!

1. show dbs;
2. show databases;
3. use *Ihre-Datenbank*. Verwenden Sie den Namen Ihrer Datenbank aus B), z. B. *use Muster*. Gross-Kleinschreibung ist **relevant**.
4. show collections;
5. show tables;
6. var test="hallo";
7. test;

Verbinden Sie sich nun mit Ihrem AWS Server via SSH. Sie kennen den Befehl aus m346, Schauen Sie in Ihren Unterlagen nach.

Rufen Sie nun auf Ihrem Server die Shell auf mit dem Befehl: `sudo mongosh --authenticationDatabase "admin" -u "uname" -p "password"`. Sie sind nun wieder mit der MongoDB Shell verbunden, aber direkt auf dem Server. Geben Sie nun die gleichen Befehle ein wie vorher in Compass, um zu zeigen, dass dies ebenfalls funktioniert.

Die Befehle 6-7 zeigen, dass Sie in dieser Shell grundsätzlich JavaScript-Befehle eingeben können! Dies macht Sinn, da JSON (JavaScript-Object-Notation) JavaScript-nah ist. 

**Abgaben:**

- Screenshot von Compass, der zeigt, dass Sie die Befehle eingegeben haben
- Screenshot von der MongoDB-Shell auf dem Linux-Server, der zeigt, dass Sie die Befehle eingegeben haben. 
- Was machen die Befehle 1-5? Was ist der Unterschied zwischen Collections und Tables?

## D) Rechte und Rollen (30%)

Sie haben in Teil A erklärt was der Parameter `authSource`  definiert. Sie werden nun mit neuen Benutzer zeigen, dass dies auch stimmt und der Parameter somit relevant ist.

1. Ändern Sie den Verbindungstext und versuchen Sie als `authSource` eine andere Datenbank als `admin` anzugeben (aber eine existierende). Zeigen Sie so, dass der Zugriff nicht mehr funktioniert.
2. Erstellen Sie zwei neue Benutzer mit folgenden Bedingungen für Ihre Themendatenbank:
   1. Verwenden Sie für beide Benutzer built-in Rollen, aber **keine**, die any im Namen hat (z.B. readWrite**Any**Database, read**Any**Database). 
   2. Benutzer 1 darf Daten nur lesen. Authentifizierungsdatenbank ist Ihre Themendatenbank.
   3. Benutzer 2 darf Daten lesen und schreiben. Authentifizierungsdatenbank ist `admin`.

**Abgaben:**

- Screenshot des Fehlers bei einer Verbindung mit der falschen Authentifizierungsquelle
- Skript, welches die beiden Benutzer erstellt.
- Screenshots, die zeigen, dass die Rechte für Benutzer 1 funktionieren, im Speziellen:
  - Screenshot für das Einloggen (Verbindungstext sichtbar)
  - Screenshot für das Lesen von Daten **ohne** Fehler
  - Screenshot für das Schreiben von Daten **mit** Fehler.
- Screenshots, die zeigen, dass die Rechte für Benutzer 2 funktionieren, im Speziellen:
  - Screenshot für das Einloggen (Verbindungstext sichtbar)
  - Screenshot für das Lesen von Daten **ohne** Fehler
  - Screenshot für das Schreiben von Daten **ohne** Fehler.
