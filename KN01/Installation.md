# MongoDB Installation

[TOC]

Sie verwenden AWS Ubuntu-Instanzen. Lesen Sie die entsprechende [Anleitung von MongoDB](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/), falls Sie die Installation selbstständig vornehmen möchten. 

Es ist bereits eine Cloud-Init-Konfiguration verfügbar, die Ihnen die Installation abnimmt. Stellen Sie sicher, dass Sie folgende Einstellung in AWS haben:

- Verwenden Sie [dieses Cloud-Init-Skript](cloudinit-mongodb.yaml), **aber passen Sie das Passwort an**!
- Erstellen Sie einen neue SSH-Key oder verwenden Sie einen bisherigen und fügen Sie ihn dem Cloud-Init hinzu. Sie können auch die Keys aus früheren Modulen wiederverwenden. Lassen Sie aber den Key für die Lehrperson drin!
- Kleine Instanz-Typ Grösse (Mikro reicht)
- Speicherplatz: 20GB
- Fügen Sie eine statische IP hinzu, damit Sie nicht jedes mal Ihre Verbindung anpassen müssen.
- Finden Sie raus welche Ports MongoDB benötigt und öffnen Sie diese auf Ihrer Instanz.



## Überprüfung der Installation

1. Warten Sie bis die Installation abgeschlossen ist. Überprüfen Sie die Cloud-Init Log-Datei: */var/log/cloud-init-output.log*
2. Testen Sie, ob Sie sich mit der MongoDB verbinden können mit Ihren Benutzerangaben: `sudo mongosh -u admin`
