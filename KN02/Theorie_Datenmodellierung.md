# Theorie Datenmodellierung

[TOC]

## ERD und ERM

**ERD**: "Entity-Relationship Diagram"

**ERM**: "Entity-Relationship Model"

Es gibt viele verschiedenen Definitionen über die beiden Begriffe und oft werden sie als Synonyme behandelt. Wenn sie bei ihrem Beruf praktisch mit Datenbanken und Modellen arbeiten, werden ihre Kollegen kaum einen Unterschied zwischen den Begriffen machen.

Ein ERD ist immer **ein einzelnes** Diagramm, wobei ein ERM **eine Sammlung** von Diagramme sein kann. Im einfachsten Fall - wenn ein ERM aus einem Diagramm besteht - ist das ERM und ERD tatsächlich fast das gleiche. Ein ERM kann zusätzliche Meta-Daten enthalten, aber auf die gehen wir hier nicht ein und spielen keine Rolle.

ERDs werden nicht nur zur Modellierungen von Datenbanken verwendet, sondern bringt allgemein Daten in einen semantischen Kontext.

![ERD vs ERM](./x_res/ERD_ERM/ERDvsERM.png)

In diesem Beispiel zur Unterscheidung zwischen ERM und ERD wäre es durchaus möglich ein einziges Diagramm zu erstellen. Dabei kann man auf Wiederholungen verzichten (Schule), dafür kann es sehr schnell unübersichtlich werden, wenn viele Entitäten im Diagramm existieren. Denken sie an das anfangs gezeigte Diagramm von [Magento](./x_res/ERD_ERM/Magento_ERM.jpg).

Ein ERD besteht aus Entitäten und Beziehungen (Assoziationen)

![ERD](./x_res/ERD_ERM/ERD_begriffe.png)

**Entität**: Ein Objekt welches Daten enthält, die im Detail spezifiziert werden können. Die Entität "Lehrperson" kann zum Beispiel die Attribute "Vorname", "Nachname", "Alter" etc haben. Später werden wir die Attribute ebenfalls darstellen. Eine Entität ohne Attribute ist einfach eine abstrakte Version, die noch konkretisiert werden muss.
**Hinweis**: Eine Entität wird später in der Datenbank zu einer Tabelle, aber auf der Ebene von ERDs reden wir immer von Entitäten!

**Beziehung / Assoziation**: Eine Beziehung zwischen Entitäten wird durch einen Strich gekennzeichnet. Im Beispiel sehen wir, dass alle Entitäten *eine* Assoziation zueinander besitzen. Dies ist aber keinesfalls immer der Fall *(keine, mehrere)*. Auch Assoziationen können weiter spezifiziert werden.

## Assoziationen (Beziehungen) und Kardinalitäten

Assoziationen zwischen Entitäten können genau bestimmt werden wie das folgende Beispiel zeigt

![Kardinalitaeten](x_res/Assoziationen/Kardinalitaeten.png)

**Kardinalität**: Die Kardinalität ist eine Mengenangabe und sagt aus, wie viele Entitäten des einen Typs mit den Entitäten des anderen Typs in Beziehungen stehen können. Daraus folgt auch, dass Assoziationen in beide Richtungen bestehen (aber nur *ein Strich* gezeichnet wird).

**Bezeichnung**: Die Beziehungsbezeichnung sagt aus, wie man die Beziehung deuten muss. Im Beispiel oben könnte die Beziehung zwischen Mitarbeiter und Abteilung auch "hat Freunde in" oder "macht Präsentation für" sein. Je nachdem was die Bezeichnung ist, kann sich die Kardinalität ändern.

Wir unterscheiden zwischen vier verschiedenen Beziehungstypen

| Abkürzung | Erklärung |
| --------- | ----------------------------------- |
| 1 | Genau ein Datensatz |
| c | Kein oder genau ein Datensatz |
| m | Mindestens ein Datensatz. Kann auch unendlich viele haben. |
| mc | Beliebig viele Datensätze. Also kein, ein oder unendlich viele |

Sie können ein Beziehungstypen und Kardinalitäten wie folgt lesen. Ziehen sie immer die weiter entfernte Kardinalität mit ein, also die Kardinalität beim anderen Objekt. Die Beziehungstypen zwischen Mitarbeiter und Abteilung ist also m-1 (oder m:1).

![Kardinalitaeten_lesen](x_res/Assoziationen/Kardinalitaeten-lesen.png)

Wir unterscheiden zwischen den folgenden Kombinationen aus den vier Beziehungstypen:

- Hierarchischen Beziehungen - in der Abbildung dunkelgrau
- Konditionellen Beziehungen - in der Abbildung hellgrau
- Netzwerkförmigen Beziehungen - in der Abbildung weiss

![Beziehungstypen](x_res/Assoziationen/Beziehungstypen.png)



## Redundanzen

Wieso betreiben wir überhaupt den Aufwand unsere Daten in Entitäten zu verpacken und zu strukturieren? Können wir nicht einfach eine einzige Entität und damit auch eine einzige Tabelle verwenden? Schauen wir uns ein Beispiel an.

![Redundazen](x_res/Redundanzen/redundanzen.png)

Wir sehen in diesem Beispiel, dass viele Daten mehrfach abgespeichert werden. Diese nennt man Redundanzen. Redundante Daten sind fehleranfällig bei Änderungen oder Löschung der Einträge. Man spricht hier von Anomalien, wobei grundsätzlich in drei unterteilt wird:

- **Einfüge-Anomalie**: Dies passiert, wenn ein Primärschlüssel so gewählt wird, dass man keine neue Daten einfügen kann, weil sonst der Primärschlüssel verletzt wird. Beim Beispiel oben wäre dies der Fall, wenn der *Name* als Primärschlüssel dienen würde. Dann kann eine Person mit dem gleichen Namen nur einmal eingetragen werden und dann aber auch nur einmal einen Kauf auslösen
- **Änderung-Anomalie**: Dies passiert, wenn man einen Eintrag ändern möchte, aber es sein kann, dass der gleiche Eintrag mehrmals vorkommt. im Beispiel oben wäre dies der Fall, wenn Gustav Meier-Senn nach seiner letzten Bestellung anruft und eine Änderung seiner Adresse durchgeben möchte. Die Person beim Support, trägt dann die Adresse nach, aber nur für die genannte Bestellung. Gustav Meier-Senn existiert dann in der Datenbank mit zwei Adressen.
- **Lösch-Anomalie**: Dies passiert, wenn man Werte löschen möchte, aber dadurch zuviele Daten löschen muss. Beim Beispiel wäre dies der Fall, wenn Herr Beat Merz seine Bestellung stornieren möchte. Wenn der entsprechende Datensatz gelöscht wird, wird auch der Name und die Adresse gelöscht. Aber diese Informationen sollten erhalten bleiben für eine zukünftige Bestellung.



## Konzeptionelles, Logisches und Physisches Datenmodell

Für die drei Modelle gibt es auch unterschiedliche Beschreibungen und die verschiedenen Modellarten haben einen fliessenden Übergang und teilen einige Eigenschaften. Verwenden sie folgende einfache Unterteilung:

**Konzeptionelles Modell**: Ein konzeptionelles Schema zeigt das Grundkonzept des Modells, welches mehr oder weniger detailliert ausfällt.

- Entitäten werden oft ohne Attribute dargestellt, können aber Attribute enthalten
- Entitäten können netzwerkförmige Beziehungstypen haben, also m(c):m(c).
- Verwenden sie [draw.io](https://www.drawio.com/) oder andere einfache Tools

**Logisches Modell**: Ein logisches Modell beachtet bereits die Umsetzbarkeit auf einem relationalen Datenbank Management System (DBMS), aber noch ohne auf die spezifischen Eigenheiten eines DBMS einzugehen.

- Attribute sind definiert.
- Alle netzwerkförmigen Beziehungstypen sind aufgelöst
- Datentypen können definiert sein, aber werden allgemein gehalten und es werden nicht DBMS-spezifische Typen verwendet (z.B. String und nicht varchar(x) ).
- Verwenden sie draw.io oder andere einfache Tools

**Physisches Modell**: Das physische Modell enthält alle Details, die für die Umsetzung auf einem spezifischen DBMS notwendig ist.

- Alle Regeln eines logischen Schemas werden eingehalten
- Datentypen und andere Eigenschaften eines spezifischen DBMS werden konkret verwendet
- Verwenden sie ein DBMS spezifisches Tool

In den späteren Übungen wird spezifsch nach einem Modell-Typ verlangt. Stellen sie sicher, dass sie sich die Regeln merken.

Die folgende Übersicht zeigt die wichtigsten Unterschiede zwischen den verschiedenen Modelltypen. **Achtung**: Die Definition - der verschiedenen Typen wie wir sie verwenden - kann variieren, abhängig vom Lehrbuch. 

![Konz-Log-Phy-ERD-Uebersicht](./x_res/Konz_Log-Phy/Konz-Log-Phy-ERD-Uebersicht.png)

### Vom Konzeptionellen zum Logischen Modell

Die Umwandlung vom konzeptionellen in ein logisches Modell kann mit ein paar einfachen Regeln erreicht werden, die später beschrieben werden. Bevor wir die Schritte beschreiben, führen wir **zwei wichtige** Konzepte ein, die für die Umwandlung benötigt werden.

#### Primärschlüssel und Fremdschlüssel

![Attribute](x_res/Konz_Log-Phy/Attributes.png)

Die meisten Attribute, die im vorangehenden Beispiel eingeführt wurden, scheinen klar und beziehen sich direkt auf die Entität. Wieso aber eine *AbteilungId* und eine *MitarbeiterId* bei dem Mitarbeiter notwendig sind, ist nicht sofort offensichtlich. Diese beiden Felder werden benötigt, um zwei wichtigen Regeln einzuhalten:

**Primärschlüssel**: Jede Entität benötigt ein Attribut oder eine Kombination von Attributen, die ein Tupel eindeutig indentifziert. Dieses Attribut wird **Primärschlüssel (PS) oder Primary Key (PK)** genannt. Im folgenden Beispiel ist dies die *MitarbeiterId* für die *Mitarbeiter*-Tabelle und die *AbteilungId* für die *Abteilung*.

**Fremdschlüssel**: Alle hierarchischen und konditionellen Beziehungen benötigen einen **Fremdschlüssel (FS) oder Foreign Key (FK)**, der die Beziehung definiert und auf den PK der anderen Entität zeigt. Im folgenden Beispiel ist dies das Attribut *Abteilungskürzel*. **Der FK wird immer auf der Seite der Beziehung eingeführt, die die m oder mc Beziehung hat**. Schauen sie sich auch das folgende Beispiel mit Daten an. Es wird klar, dass über die AbteilungId definiert wird in welcher Abteilung ein Mitarbeiter arbeitet. Es sind nur Werte zulässig, die in der Tabelle **Abteilung** definiert wurden.

![AttributeWithFkPk](x_res/Konz_Log-Phy/attributes_with_PKFK.png)

![AttributeWithFkPk](x_res/Konz_Log-Phy/attributes_with_PKFK-data.png)

Das allgemein Vorgehen kann durch das folgende Bild verdeutlicht werden. PKs und FKs werden in den Attributen bei einem ERD gekennzeichnet. In einem physischen ERD müssen diese explizit Beziehungen modelliert werden und das DBMS stellt die Begriffe für PK und FK entsprechend dar. Dazu gehen wir später im Detail ein.

![allgemein](x_res/Konz_Log-Phy/Attributes_general.png)

#### Auflösung von netzwerkförmigen Beziehungen m(c) : m(c)

Netzwerkförmige Beziehungen können mit Hilfe einer **Zwischentabelle**, (**Transformations-Entität** oder **assoziative Entität**) aufgelöst werden. Dies ist notwendig, weil diese in relationalen DBMS nicht implementiert werden können. Es wird einfach eine zusätzliche Tabelle zwischen die netzwerkförmigen Beziehung gestellt mit den folgenden Regeln:

1. Die Beziehung der ursprünglichen Entitäten fällt weg
2. Es wird eine neue Entität hinzugefügt (Transformations-Entität)
3. Es werden neue Beziehungen zwischen den ursprünglichen Entitäten und der neu erstellten Transformationsentität hinzugefügt.
4. Die Kardinalitäten werden verschoben in der Position.

![nton_solution](x_res/Konz_Log-Phy/N_N_aufloesung.png)

#### Umwandlungsprozess Variante 1

Diese Variante findet man öfters in der Praxis.

1. Primärschlüssel hinzufügen. Jede bestehende Entität kriegt einen Primärschlüssel, oft eine ID (Laufnummer). 
2. Netzwerkförmige Beziehungen mit Transformationstabellen auflösen. Es werden also neue Entitäten geschaffen.
3. Fremdschlüssel hinzufügen. Die Fremdschlüssel können nun korrekt gesetzt werden, da keine netzwerkförmigen Beziehungen mehr existieren.
4. Tabellen, die nun keinen PK haben (Transformationsentitäten) haben alle FKs in Kombination als PK.
5. Restliche Attribute hinzufügen.

![Variante1](x_res/Konz_Log-Phy/konz_to_log_variante1.png)

#### Umwandlungsprozess Variante 2

Diese Variante ist einfacher und vereinheitlicht die Vergabe von Primärschlüssel

1. Netzwerkförmige Beziehungen mit Transformationstabellen auflösen. Es werden also neue Entitäten geschaffen.
2. Primärschlüssel hinzufügen. Jede bestehende Entität kriegt einen Primärschlüssel, oft eine ID (Laufnummer).
3. Fremdschlüssel hinzufügen. Die Fremdschlüssel können nun korrekt gesetzt werden, da keine netzwerkförmigen Beziehungen mehr existieren.
4. Restliche Attribute hinzufügen.

![Variante1](x_res/Konz_Log-Phy/konz_to_log_variante2.png)

>![Hinweis](../x_res/Hinweis.png)**Hinweis**: Wenn die Zwischentabelle zwischen drei verbundenen Entitäten erstellt wird, spricht man auch von einer **tenären Beziehung**, bei mehreren von einer **n-ären Beziehung**. <br>
> Die in der Ziwschentabelle platzierten Attribute betreffen **immer beide verbundenen Entitäten**, analog zu chemischen Verbindungen: H<sub>2</sub>O &rarr; H<sub>2</sub>O hat Eigenschaften (z.B. Siedepunkt), die weder H noch O allein besitzen.

### Vom Logischen zum Physischen Modell

Dem logische Datenmodell werden in diesem Schritt auch die Datentypen hinzugefügt, die spezifische für das gewählte DBMS sind. Aber man verwendet nun DBMS eigene Tools für die Modellierung. Normalerweise kann man das Modell per Knopfdruck in Tabellen umwandeln (z.B. MySql Workbench) oder die Tabellen werden automatisch zusammen mit dem Modell angelegt (z.B. MS Sql Server oder auch Access).

![Attribute](x_res/Konz_Log-Phy/AttributesWithDatatype.png)

Mit der Einführung von physischen Tabellen, werden auch neue Begriffe notwendig.

![Tabelle_Labels](./x_res/Konz_Log-Phy/Tabelle_labelled.png)

- Tabelle: Wir reden hier nicht mehr von einer Entität, sondern von einer Tabelle, obwohl auch hier oft die Bezeichnung Entität verwendet wird.
- Tabellenanme: Dies ist die eindeutige Bezeichnung der Tabelle (und auch der Entität)
- Attribut, Spalte, Column: Jede Spalte muss innerhalb der Tabelle eindeutig sein. Jede Spalte hat einen Datentyp und dadurch einen Wertebereich.
- Datensatz, Record, Row, Zeile, Tuple: Bezeichnet einen Datensatz, der ein Objekt dieser Tabelle enthält. In Beispielfall also einen Mitarbeiter mit all seinen Attributen.
- Feld, Field, Value, Wert: Bezeichnet einen spezifischen Wert eines Objekts (also eines Mitarbeiters). Der Wert muss der Definition der Spalte genügen (mit Datentyp). Ein Wert kann NULL sein also keinen Wert enthalten.

Eine Definition der Tabellen Mitarbeiter und Abteilung sieht wie folgt aus.

![TableDefintion](x_res/Konz_Log-Phy/tabledefinition.png)

Oben sehen sie jeweils den Tabellennamen und anschliessend alle Spalten mit den korrekten Eigenschaften. 

- Datatype: Hier steht der Datentyp, der bei jedem DBMS unterschiedlich sein kann.
- PK: Steht für **Primary Key**. 
- NN: Steht für **Not Null**. Hier definieren sie, ob diese Spalte einen Eintrag benötigt. Ein leerer Wert wäre ungültig. Dieses Feld macht den Unterschied zwischen den Kardinalitäten c und 1. Aus diesem Grund redet man im physischen Modell nur von 1:m Beziehungen. Ob 1:m oder c:m wird über dieses Feld gesteuert
- UQ: Steht für **Unique**. Hier wird definiert, ob ein Wert in dieser Spalte nur einmalig erscheinen darf. Ein *PK* ist automatisch auch *Unique*.
- FK: Steht für **Foreign Key**. Der Datentyp dieses Feldes muss übereinstimmen mit dem Datentyp des *PK*s der anderen Tabelle. 

#### Bedeutung von 1, c und m im physischen Datenmodell

In der Umgangssprache und in der Praxis werden sie oft den Begriff 1:N hören. Dies ist gleichbedeutend wie 1:m in unserer Schreibweise. Eigentlich wird damit eine 1:mc oder eine c:mc Beziehung gemeint. In der folgenden Erklärung wird gezeigt wieso es eigentlich immer mc und nicht m ist und wie zwischen 1 und c unterschieden wird.

![1cmcBez](x_res/Konz_Log-Phy/pysisches-1-mc-beispiel.png)



## Normalformen

Durch die Grösse des Inhalts wurde dieser Teil in eine eigene Datei ausgelagert

[Theorie Normalformen](./Theorie_Normalisierung.md)



## Datenkonsistenz und -Integrität

Eine Datenbank muss grundsätzlich **Datenkonsistenz** - **also Widerspruchsfreiheit** - gewährleisten. Ein Teil davon haben wir abgedeckt über das Datenmodell, indem wir keine Redundanzen zulassen.

Die Applikation, die die Daten verwendet, muss zusätzlich sicherstellen, dass auch die korrekten Daten in die Spalten geschrieben werden, z.B. sollte Vor- und Nachname nicht vertauscht werden. Diese Logik kann weder das DBMS noch das Datenmodell verhindern.

Das DBMS leistet aber durchaus einen Beitrag an die Datenkonsistenz der Daten, indem es sicherstellt, dass keine FKs eingefügt werden, wenn kein PK dazu existiert. Dies nennt man **Referenzielle Integrität**.

![3NF_1](x_res/ReferentielleIntegritaet/refInteg.png)

In diesem Beispiel wurde ein Mitarbeiter hinzugefügt für die Abteilung *Sales* (SA). Das DBMS wird dies aber verhindern und einen Fehler zurückliefern, da keine Abteilung mit dem Kürzel *SA* existiert.

## Weitere Quellen

- <https://www.palladio-consulting.de/datenmodell/>: Beschreibt die verschiedenen Datenmodelle
- <https://de.wikipedia.org/wiki/Anomalie_(Informatik)>: Anomalien

## Lernziele

- Sie kennen die Begriffe ERM und ERD und wissen was sie bedeuten.

- Sie kennen den Unterschied zwischen ERM und ERD und können diesen erläutern.

- Sie kennen die Begriffe, die im Zusammenhang mit ERDs und Kardinalitäten verwendet werden.

- Sie kennen die 4 Kardinalitätstypen und können diese erklären. 

- Sie können Kardinalitäten lesen und erläutern.

- Sie können Kardinalitäten setzen und begründen.

- Sie wissen, dass es verschiedenen Kardinalitätsdarstellungen gibt.

- Sie kennen die drei verschiedenen Beziehungstypen und können ein Kardinalitätspaar dem Beziehungstyp zuweisen.

- Sie können den Begriff "Redundanzen" erklären.

- Sie können Redundanzen erkennen.

- Sie kennen die drei Anomalien, die im Zusammenhang mit Redundanzen auftreten können und

- können beispiele nennen.

- Sie kennen die Unterschiede zwischen einem konzeptionellen, logischen und physischen Modell und können diese nennen.

- Sie können ein konzeptionelles Modell in ein logisches Umwandeln und die richtige Darstellung verwenden

  - Sie kennen die Begriffe PK und FK und können sie erklären.

  - Sie kennen die Regeln zum setzen von PKs und FKs in einem logischen Diagramm.

  - Sie können netzwerkförmige Beziehungen auflösen und Transformationtabellen erstellen. 
  Sie können ein logische Modell in ein physisches umwandeln und die richtige Darstellung verwenden

- Sie kennen die Begriffe, die im Zusammenhang mit physischen Tabellen verwendet werden.

- Sie können ein logisches Modell in ein physisches umwandeln und die richtige Darstellung verwenden.

  - Sie können den Zusammenhang zwischen der Kardinalität C und dem Attribut "Not Null" erklären und Beispiel anbringen.

  - Sie können aufgrund von Tabellen und Daten auf das physische, resp. logische Schema ableiten und ein Modell der Daten erstellen.

- Sie können die Eigenheiten der Normalform 1 erklären. 
- Sie können Daten in die Normalform 1 umwandeln und die Umwandlungsregeln erklären
- Sie können die Eigenheiten der Normalform 2 erklären.
- Sie können Daten in die Normalform 2 umwandeln und die Umwandlungsregeln erklären.
- Sie können die Eigenheiten der Normalform 3 erklären.
- Sie können Daten in die Normalform 3 umwandeln und die Umwandlungsregeln erklären.
- Sie können die Begriffe der Datenkonsistenz und Datenintegrität erklären und Beispiele dazu nennen.

