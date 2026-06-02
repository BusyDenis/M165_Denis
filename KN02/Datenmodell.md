# MongoDB Datenmodellierung

[TOC]

## Grundsätzliche Überlegungen

Da wir grundsätzlich von vier verschiedenen Familien von NoSql Datenbank-Typen sprechen, wird es gleich klar, dass es kein einheitliches Konzept zur Datenmodellierung geben kann, welches universell gültig ist. **Allerdings kann das konzeptionelle Schema immer als Grundlage dienen**. Im Folgenden werden mit dem konzeptionellen Diagramm über eine Schule arbeiten.

![konzeptionellesERM](../x_res/ModelSchoolManagement-Konzept.png)

Wenn Sie ein logisches oder physisches Datenmodell aus einer relationalen Datenbank bereits haben, lässt sich dieses so auch in MongoDB umsetzen. Allerdings ignorieren Sie dann die Vorteile von Document-Stores.  

Obwohl wir das ERM direkt aus der relationalen Datenbank übernehmen könnten, macht es Sinn dies zu überdenken und unsere Applikation einzubeziehen. Die Frage ist also wie wir die Daten verwenden werden. Folgend ein Beispiel bei dem verschachtelte Objekte verwendet werden. Das Dokument könnte hierbei im XML- oder JSON-Format gespeichert sein und tatsächlich verwendet MongoDB (welches wir in unserem Modul verwenden werden) das JSON-Format. 

![DocumentStore-Model1](./x_res/DocumentStore-Model1.png)

Es gilt sowohl Vorteile als auch Nachteile eines Modelles abzuwägen. Ein **Vorteil** im Model oben ist, dass eine Klasse inklusive aller Studenten mit einer Abfrage ausgelesen werden können. Ein **Nachteil** im Model oben ist, dass das Auslesen **aller** Studenten teuer (im Sinne von Rechenleistung) ist. Die Frage ist also wie oft sie welche Art von Abfragen stellen und so entscheiden welches Datenmodell sinnvoll ist.

Ein weiteres Beispiel, bei der die Verschachtelung noch weiter getrieben wird. **Dieses Model ist nicht sinnvoll**. Sie können zwar alle Daten mit einer Abfrage auslesen, aber sie müssen **viele Redundanzen** einführen. Jede Lehrperson, jedes Modul ist mehrfach gespeichert. 

![    ](./x_res/DocumentStore-Model2.png)

## Vergleich zu Eigenschaften der Relationalen Datenbanken

Folgend vergleichen wir einige Eigenschaften der relationalen Datenbanken

### Referenzielle Integrität

Referenzielle Integrität wird nicht gewährleistet. Die Applikation ist Zuständig, dass die Daten mit der notwendigen Integrität gespeichert werden. 

![RefInteg](./x_res/RefInteg.png)

Im folgenden Beispiel können sie jederzeit dem Wert *Document1Id* einen Wert zuweisen, welcher im Dokument *Document1* nicht als *ID* existiert. Die Datenbank stellt keine Überprüfung an, obwohl im Schema so modelliert.

**Document1:**

~~~ json
[{
	ID: 1,
    Description: "Document with ID 1",
    Other: {...}
},{
	ID: 2,
    Description: "Document with ID 2",
    Other: {...}
}]
~~~

**Document2:**

~~~ json
[{
	ID: 100,
    Document1ID: 55,
    Value:0
}]
~~~

### Normalisierung und Redundanzen

Auf Normalisierung wird in NoSql Datenbanken oft explizit verzichtet. Schauen sie sich den folgenden Vergleich aus einem relationalen Datenmodell (links) und einem möglichen Datenmodell für einen Document-Store (rechts).![Normalisierung](./x_res/Normalisierung.png)

In der Document-Store Datenbank würde man wahrscheinlich darauf verzichten, die Adresse als eigene Collection zu speichern, da die Adresse selten bis nie alleine ausgelesen wird, sondern immer im Zusammenhang mit einer Person - entweder Student oder Teacher. Es kann tatsächlich vorkommen, dass so eine Adresse zweimal erfasst wird. Dies wird aber selten der Fall sein. 

Ihr Datenmodell hängt natürlich stark vom Anwendungsfalls ab. Wenn sie eine Applikation erstellen deren Hauptanwendung die Verwaltung von Adressdaten ist (z.B. Adressbuch, GPS, etc), würden sie keine Redundanzen einfügen wollen.



## Modellierungstechniken

Als Erstes müssen Sie ihr konzeptionelles Schema (siehe ganz oben) in sinnvolle Collections aufteilen. Auch wenn Sie grundsätzlich frei sind, gibt es ein paar Richtlinien, die sich einzuhalten lohnen und helfen ein logisches Schema aufgrund des konzeptionellen zu erstellen. 

Die folgende Tabelle gibt einen Überblick über die Möglichkeiten. Im Detail können Sie die Varianten unter diesen URLs nachlesen.

<https://www.mongodb.com/docs/manual/data-modeling/>

<https://www.mongodb.com/docs/manual/data-modeling/concepts/embedding-vs-references/>

<https://www.mongodb.com/docs/manual/applications/data-models/>

<https://dev.to/sovannaro/understanding-relationships-in-mongodb-one-to-one-one-to-many-and-many-to-many-5fof>

**Abbildungslogik**

| Beziehungstyp                      | Umsetzungen in MongoDB                                       |
| ---------------------------------- | ------------------------------------------------------------ |
| one-to-one (Referenz)              | Beide Entitäten werden zu eigenen Entitäten. Die Beziehung wird über einen Fremdschlüssen gemacht. Es gibt daher also 2 Collections/Schemas. |
| one-to-one (Eingebettet)           | Eine Entität wird in die andere eingebettet als Unterdokument, so dass nur ein Dokument notwendig wird. Es gibt also nur 1 Collection/Schema. |
| one-to-many (Referenz)             | Gleiche Logik wie bei one-to-one. Das Resultat ist 2 Collections/Schemas. |
| one-to-many (Eingebettet)          | Gleiche Logik wie bei one-to-one. Das Resultat ist 1 Collection/Schema. |
| many-to-many (mit Zwischentabelle) | Sie können many-to-many Beziehungen natürlich wie bei relationalen Datenbanken mit Zwischentabellen abbilden. Dies ist grundsätzlich nicht zu empfehlen, da die Vorteile verloren gehen. Das Resultat ist 3 Collections/Schemas |
| many-to-many (mit Einbettung)      | Sie müssen auch hier mit Referenzen arbeiten, aber reduzieren die Anzahl Collections. Sie erstellen grundsätzlich 2 Collections für die beiden Entitäten und fügen einer der beiden Collections ein Array mit Referenzen auf die andere Collection hinzu. Das Resultat ist 2 Collections/Schemas. |



Folgend nochmals das konzeptionelle Schema, welches zu Beginn verwendet wurde, welches zeigt wie die Auflösung der Beziehungstypen angewandt wurden.

**Rot**: many-to-many-Beziehung 1. Achtung: Dies ist eine Dreiecksbeziehung und muss so aufgelöst werden. Angewandt wurde eine Einbettung, wobei der `Teacher` das Array mit dem Namen `Teach` mit den Referenzen auf `Class` und `Module` besitzt.

![Resolve-red](./x_res/Resolve-red.png)

**Blau**: one-to-many-Beziehung 1. Der Student wurde in der Klasse direkt eingebettet. Es war eine Design-Entscheidung diese Beziehung zuerst zu modellieren. Man hätte auch die many-to-many-Beziehung zwischen Student und Modul nun auflösen können. Die Reihenfolge hätte aber keine Rolle gespielt. 

![Resolve-blue](./x_res/Resolve-blue.png)

**Grün**: many-to-many-Beziehung 2: Auch hier wurde mit der Einbettung gearbeitet, wobei das `Module` das Array `Grade` mit den Referenz auf `Student` besitzt.

![Resolve-green](./x_res/Resolve-green.png)

**Violett**: one-to-many-Beziehung 2: Die beiden Entitäten `Teacher` und `Class` sind bereits Teil einer Anordnung und Verschachtelung. Aus diesem Grund bleibt nur die Möglichkeit die Beziehung über Referenzen zu lösen. Diese wurde mit dem Feld `ClassTeacher` gelöst.

![Resolve-purple](./x_res/Resolve-purple.png)

**Gelb**: one-to-one-Beziehung. Die Beziehung für den Klassensprecher kann nur noch via Referenzen gelöst werden, da beide Entitäten bereits für die andere Beziehung verschachtelt sind. Die bereits vorhandene Verschachtelung erlaubt aber einfach ein boolean-Feld `IsClassSpeaker` zu erstellen, anstatt einem Referenzwert.

![Resolve-yellow](./x_res/Resolve-yellow.png)



## JSON Schema

Bisher wurde verschachtelte Rechtecke verwendet, um die Verschachtelung von JSON-Objekten darzustellen. Tatsächlich gibt es kein Standard eine NoSql-Datenbank zu visualisieren. 

Da MongoDB JSON als Datenbank-Dokument verwendet, können wir aber auf JSON-Schemas ausweichen und die Datenbank korrekt darzustellen. Mithilfe von JSON-Schemas können wir einen Dokument-Typ einer Collection spezifizieren und auch sogar validieren. Sie finden unter *Quellen* zwei Links, die ihnen Informationen liefern. 

Es gibt grundsätzlich **eine JSON-Schema-Datei pro Collection**.

Nachdem Sie wissen welche Collections erstellt werden, können Sie die JSON Schemas erstellen. Diese Schemas sind notwendig, so dass Ihre Daten in MongoDB validiert werden können. **Ein JSON Schema Dokument ist ein Meta-Dokument. Also ein JSON-Dokument welches die Struktur eines anderen JSON-Dokuments beschreibt.**

Sie können hier über JSON-Schemas nachlesen. Bevor Sie in die Details gehen, lesen Sie die folgenden Unterkapitel!

<https://json-schema.org/learn/>

<https://www.mongodb.com/basics/json-schema-examples>



### Regel für dieses TBZ-Modul

Folgender Ausschnitt zeigt die Meta-Daten eines JSON-Schemas. In Kommentare wird erklärt was erwartet wird.

```json
{    
  "$schema": "http://json-schema.org/draft-04/schema#", // Immer diesen Wert verwenden 
  "$id": "https://tbz.ch/example.json",    				// Immer diesen Wert verwenden
  "title": "Class",    									// Name der Collection!
  "description": "",    								// Können Sie komplett weglassen
  "type": "object",    									// Notwendig. Siehe Dokumentation
  "properties": {}										// Notwendig. Siehe Dokumentation
}
```



### Vereinfachtes Vorgehen

Es ist oft einfacher ein bestehendes Schema zu lesen. Noch einfacher ist es ein Beispiel-JSON-Dokument zu erstellen mit Beispiel-Daten wie sie eingefügt werden könnten.  Gehen Sie wie folgt vor:

- Erstellen Sie pro Collection ein JSON-Dokument mit Beispiel-Daten
- Lassen Sie sich ihr JSON-Schema generieren unter <https://www.jsonschema.net/> für jedes Beispiel-Dokument. 
- Nehmen Sie diese JSON-Schemas als Grundlage für Ihr Lernen.



### MongoDB Collections erstellen mit Validierung

Nachdem Sie nun verschiedene JSON-Schema Dokumente erstellt haben, können Sie diese verwenden, um Ihre Collections zu erstellen. Die Details finden Sie unter dieser URL:
<https://www.mongodb.com/docs/manual/core/schema-validation/specify-json-schema/>

Beachten Sie, dass Sie 

- einen Teil der Meta-Daten weglassen müssen
- durchgehend den Wert "type" mit dem Wert "bsonType" ersetzen müssen.



## Weitere Quellen

- <https://phoenixnap.com/kb/nosql-data-modeling>
