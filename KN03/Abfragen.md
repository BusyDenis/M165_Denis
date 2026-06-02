# MongoDB Übersicht

[TOC]

Eine Übersicht über die Befehle von MongoDB. Eine komplette Referenz finden sie auf der Webseite von MongoDB. Folgend die wichtigsten Links:

- Manual: <https://www.mongodb.com/docs/manual/>
- GUI (MongoDB Compass): <https://www.mongodb.com/try/download/compass>
- Dokumentation mongosh (Mongo Shell): <https://www.mongodb.com/docs/v4.4/introduction/>
- Dokumentation Java Driver: https://www.mongodb.com/docs/drivers/java/sync/current/

## Grundsätzliches

Der Primärschlüssel von jedem Dokument ist im Wert *_id* gespeichert. Wenn kein entsprechendes Feld im Dokument mitgeliefert wird, wird ein Wert generiert.

Dert Wert des Feldes *_id* ist ein [Wert des Typs BsonId](https://www.mongodb.com/docs/manual/reference/method/ObjectId/).

### Verbindung

-  Pfad-zu-mongodbsh\mongosh
-  Pfad-zu-mongodbsh\mongosh "ConnectionString". Beispiel: mongosh "mongodb://54.204.116.170:27017/"

### Administration

- `show databases`: Zeigt alle Datenbanken
- `show dbs`: gleich wie *show databases*
- `use databasename`: Wechselt zu der Datenbank
- `show collections`: Zeigt alle Collections
- `show tables`: gleich wie *show collections*

**Datenbank erstellen**: Es gibt keinen Befehl, um eine Datenbank zu erstellen. Verwenden sie `use datenbankname`, um in die Datenbank zu wechseln. Sobald sie Dokumente hinzufügen, wir die Datenbank erstellt

**Collection erstellen**: Eine Collection wird automatisch erstellt, wenn Sie Werte hinzufügen. Sie können eine Collection aber auch explizit erstellen - wie Sie es bei der Modellierung gesehen haben - indem Sie den Befehl `db.createCollection()` verwenden.

**Collection löschen**: Eine Collection wird gelöscht mit dem Befehl `db.collection.drop()`. Natürlich müssen Sie die korrekte Collection-Name verwenden.

## CRUD Operationen

### Read

- `db.<collection>.find(<json-query>,<json-projection>)`: Findet ein Dokument und liefert spezifische Inhalte zurück. Wenn sie alle Inhalte zurück liefern möchten, kann der Abfrage-Teil weggelassen werden.
- [Logische](https://www.mongodb.com/docs/manual/reference/operator/query-logical/) und [Vergleich](https://www.mongodb.com/docs/manual/reference/operator/query-comparison/) Operatoren werden mit entsprechenden reservierten Begriffen abgedeckt

**Beispiel:**

Folgend ein Beispiel einer SQL-Abfrage und wie das Äquivalent in einer MongoDB-Abfrage aussehen würde:

~~~sql
SELECT *
FROM inventory
WHERE status = 'A' OR quantity < 30
~~~


~~~shell
db.inventory.find({$or: [{status: 'A'}, {quantity:{$lt:30}}]})
~~~

Die Lese-Abfrage liefert einen *Cursor* zurück, auf den [verschiedene Methoden](https://www.mongodb.com/docs/manual/reference/method/js-cursor/) wie *limit(), max(), pretty(), etc* angewendet werden können. Dazu später mehr.

Wenn sie nur spezifische Felder zurückgeben möchten, können sie dies steuern, indem sie der Methode *find()* ein zusätzliches Objekt übergeben. Diese Technik nennt sich [*Projection*](https://www.mongodb.com/docs/manual/tutorial/project-fields-from-query-results/)

~~~shell
db.inventory.find({$or: [{status: 'A'}, {quantity:{$lt:30}}]}, {status:1, _id:0, quantity:1})
~~~

Im Fall oben, werden die beiden Felder *status* und *quantity* zurückgeliefert, aber nicht das Feld *_id*. Sobald sie eine Projektion übergeben, werden nur die Felder zurückgeliefert, die dort definiert sind. Sie müssen nicht alle anderen Felder ausblenden. Die Ausnahme bildet das Feld *_id*, welches immer zurückgeliefert wird, ausser sie verhindern dies explizit.

### Insert

Wenn das JSON-Dokument kein Feld *_id* enthält wird das Feld automatisch erstellt und gefüllt. Falls eine *_id* definiert ist, aber diese Id bereits als Dokument-Identifier existiert, wird das Dokument nicht hinzugefügt.

- `db.<collection>.insertOne(<json-document>)`: Fügt ein Dokument der Collection hinzu
- `db.<collection>.insertMany(<json-document-array>)`: Fügt mehrere Dokumente der Collection hinzu.

Beispiele:

```javascript
// Fügt ein Dokument hinzu. Feld _id wird automatisch erstellt.
db.student.insertOne({"firstname": "Felix"});
// Fügt ein Dokument hinzu. Feld _id wird explizit erstellt.
db.student.insertOne({"_id": new ObjectId(), "firstname": "Sam"});
// Fügt drei Dokumente hinzu. _id wird automatisch erstellt.
db.student.instertMany([{"name":"Bart"}, {"name": "Lisa"}, {"name":"Maggie"}]);
```

Dass in der MongoDB die JavaScript verwendet werden kann ist hilfreich, speziell, wenn man die *_id* wiederverwenden möchte für Referenzen wie das folgende Beispiel zeigt.

```javascript
// Erstellt eine neue IDs und speichert diese in Variablen.
var stud1Id = new ObjectId();
var stud2Id = new ObjectId();
// Verwendung der Variablen.
db.student.insertOne({_id: stud1Id, "firstname": "Felix"});
db.student.insertOne({_id: stud2Id, "firstname": "Sam"});
db.class.insertOne({"name": "AP20a", "students":[stud1Id, stud2Id]});
```


### Update

- `db.<collection>.updateOne(<filter-json>, <update-json>, <options-json>)`: Aktualisiert das **erste** gefundene Dokument. Optimalerweise arbeiten sie mit der *_id* als Filterung
- `db.<collection>.updateMany(<filter-json>, <update-json>, <options-json>)`: Aktualisiert mehrere Dokumente. 
- `db.<collection>.replaceOne(<filter-json>, <update-json>, <options-json>)`. Ersetzt ein (Teil eines) Dokument.

Das JSON für den Aktualisierungsteil folgt dabei einem speziellen Muster und verwendet spezifische Schlüsselwörter. 

**Beispiel:**

Folgend ein Beispiel eines SQL-Updates und wie das Äquivalent in eines MongoDB-Updates aussehen würde. Natürlich könnten Sie auch hier Variablen verwendet wie bei *Insert* gezeigt

~~~sql
UPDATE inventory
SET (sizeuom = 'in', status = 'P')
WHERE quantity < 50
~~~


~~~shell
db.inventory.updateMany({'quantity': {$lt: 50}}, {$set: {"size.uom": 'in', status: "P"}})
~~~

### Delete

- `db.<collection>.deleteOne(<filter-json>)`: Löscht das **erste** gefundene Dokument. Optimalerweise arbeiten sie mit der *_id* als Filterung.
- `db.<collection>.deleteMany(<filter-json>)`: Löscht mehrere Dokumente. 



## Aggregationen und erweiterte Abfragen

### Aggregationen

Mit [Aggregationen](https://www.mongodb.com/docs/manual/core/aggregation-pipeline/) können komplexere Abfragen gestaltet werden. Schauen sie sich  folgendes SQL-Query an, welches mit den bisherigen MongoDB-Befehlen nicht ausgeführt werden kann.

~~~sql
SELECT name, sum(quantity) AS totalQuantity
FROM orders
WHERE size = 'medium'
GROUP BY name
~~~

Mit Aggregation können hintereinander Befehle ausgeführt werden, wobei der Output des eines Befehles dem nächsten übergeben wird (Pipeline). Die einzelnen Befehle werden hier *Stages* genannt und die Verknüpfung der *Stages* ergibt eine *Pipeline*.

Das SQL-Beispiel wird wie folgt dargestellt

~~~shell
db.orders.aggregate( [
   // Stage 1: Filter
   {
      $match: { size: "medium" }
   },
   // Stage 2: Group remaining documents by name and calculate total quantity
   {
      $group: { _id: "$name", totalQuantity: { $sum: "$quantity" } }
   }
] )
~~~

Die Schlüsselwörter *$match* und *$group* geben dabei an um welche Art von *Stage* es sich handelt. Die Stages können sich dabei auch wiederholen, z.B. 

~~~shell
db.orders.aggregate( [
   // Stage 1: Filter
   {
      $match: { size: "medium" }
   },
   // Stage 2: Group remaining documents by name and calculate total quantity
   {
      $group: { _id: "$name", totalQuantity: { $sum: "$quantity" } }
   },
   // Stage 3: Filter again
   {
      $match: { totalQuantity: { "$gte": 20 } }
   },
   // Stage 4: Sort
   {
       $sort: { totalQuantity: -1 }
   }
] )

~~~

**Vergleich zu SQL**

Auf der MongoDB-Seite findet man einen [Vergleich zwischen den SQL Begriffen und MongoDB Aggregations-Operationen](https://www.mongodb.com/docs/manual/reference/sql-aggregation-comparison/).

| SQL Begriff / Konzept / Funktion | MongoDB Aggregation Operation |
|----------------------------------|-------------------------------|
| WHERE                            | $match                        |
| GROUP BY                         | $group                        |
| HAVING                           | $match                        |
| SELECT                           | $project                      |
| ORDER BY                         | $sort                         |
| LIMIT                            | $limit                        |
| SUM()                            | $sum                          |
| COUNT()                          | $sum (ja, das ist korrekt.)   |
| join                             | $lookup                       |
|                                  | $unwind                       |

### Erweiterte Abfragen

Die bisher angeschauten Abfragen sind eher einfach. Es existieren natürlich auch Konzepte, um kompliziertere Abfragen abzusetzen, zum Beispiel:

- [Abfragen von verschachtelten Dokumenten](https://www.mongodb.com/docs/manual/tutorial/query-embedded-documents/)
- [Abfragen von Arrays](https://www.mongodb.com/docs/manual/tutorial/query-arrays/)
- [Null-Werte und fehlende Felder](https://www.mongodb.com/docs/manual/tutorial/query-for-null-fields/)

Lesen sie sich auf den entsprechenden Seiten in die Konzepte ein.

### Lookups (joins)

Obwohl wir in MongoDB keine expliziten Fremdschlüssel-Beziehungen einfügen können, gibt es den *Stage* [*lookup*](https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/#mongodb-pipeline-pipe.-lookup) bei in der Aggregationen-Pipeline, die einen *join* ausführen kann. Lose Beziehungen mit Referenzen existieren oft ja trotzdem. In der einfachsten Form ist die Syntax für ein [*lookup*](https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/#mongodb-pipeline-pipe.-lookup) wie folgt

~~~shell
{
   $lookup:
     {
       from: <collection to join>,
       localField: <field from the input documents>,
       foreignField: <field from the documents of the "from" collection>,
       as: <output array field>
     }
}
~~~



