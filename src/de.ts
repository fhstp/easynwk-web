export default {
  data() {
    return {
      de: {
        //networkMap: {
        family: "Familie",
        friends: "Freund*innen/Bekannte",
        colleagues: "Kolleg*innen",
        professionals: "prof. Helfer*innen",
        maptext: "Klicke in die Karte, um",
        maptext2: " die Position festzulegen",
        zoomreset: "Zoom zurücksetzen",
        clusterconnect: "komplett verbinden (Clique erzeugen)",
        deconnect: "alle Beziehungen lösen",
        closebrush: "Auswahlrechteck schließen",
        //},
        //sideMenu: {
        newNWK: "Neue NWK",
        open: "Öffnen",
        save: "Speichern",
        openDemo: "Demo laden",
        exportPNG: "PNG exportieren",
        exportkeyfigures: "Kennzahlen exportieren",
        createPDF: "PDF erstellen",
        keyfigures: "Kennzahlen",
        abouteasyNWK: "Über die easyNWK",
        sourcecode: "Source Code ",
        imprint: "Impressum",
        //},
        //statisticPanel: {
        overview: "Überblick",
        sector: "Sektor",
        profhelp: "Prof. Hilfe",
        horizon: "Horizont",
        horizoncumulative: "Horizont (kumulativ)",
        gender: "Geschlecht",
        networksize: "Netzwerkgröße",
        relationshipweight: "Beziehungsgewicht",
        totaldensity: "Dichte gesamt",
        categorydensity: "Dichte der Kategorie",
        stars: "Star(s)",
        categorystar: "Star(s) (pro Kategorie)",
        bridges: "Brücken",
        bridgepersons: "Brückenperson(en)",
        isolatedpersons: "Isolierte",
        personswithoutedgetotheego: "Personen ohne Kante zur Ankerperson",
        networkmsg:
          "Anzahl der Kontakte im Netzwerk exklusive Ankerperson und exklusive Personen ohne Kante zur Ankerperson",
        relationshipmsg:
          "Summierte Nähe bzw. Distanz der Kontakte zur Ankerperson. Je höher die Kennzahl, umso näher stehen die Personen der Ankerperson.",
        densitymsg:
          "Verhältnis der tatsächlich vorhandenen zu den theoretisch möglichen Verbindungen (exklusive der Verbindungen zwischen Anker- und Kontaktpersonen, inklusive Personen ohne Kante zur Ankerperson). Optional: Maßzahl liegt zwischen 0 (nur isolierte Kontakte) und 1 (jede Person im Netzwerk ist mit jeder anderen verbunden).",
        starsmsg:
          "Kontakt(e) mit den meisten Verbindungen im Netzwerk (neben der Ankerperson)",
        bridgemsg: "Anzahl der Verbindungen zwischen den Sektoren im Netzwerk",
        bridgesmsg2:
          "Kontakt(e), die einzelne Sektoren im Netzwerk miteinander verbinden",
        isolatedmsg:
          "Kontakt(e), die ausschließlich mit der Ankerperson verbunden sind",
        noedgemsg:
          "Lebende Personen ohne aktualisierte Verbindung zur Ankerperson. Verbindungen mit anderen Personen im Netzwerk und damit indirekte Verbindung zur Ankerperson sind möglich.",

        //},
        //viewOptions: {
        viewsettings: "Ansichtseinstellungen",
        anonymiseon: "Anonymisieren",
        horizonson: "Horizonte ein",
        connectionson: "Verbindungen ein",
        namesofcontactson: "Kontaktnamen ein",
        ageofcontactson: "Alter der Kontakte ein",
        roleofcontactson: "Rolle der Kontakte ein",
        anonymiseoff: "De-Anonymisieren",
        horizonsoff: "Horizonte aus",
        connectionsoff: "Verbindungen aus",
        namesofcontactsoff: "Kontaktnamen aus",
        ageofcontactsoff: "Alter der Kontakte aus",
        roleofcontactsoff: "Rolle der Kontakte aus",
        //},
        //pdfView: {
        printorpdf: "Drucken bzw. als PDF drucken",
        closeandback: "Schließen & zur easyNWK zurückkehren",
        printtext:
          "Um eine PDF Datei dieser Ansicht zu erzeugen, wählen Sie im Druckdialog 'Als PDF speichern.",
        printtext2:
          "'Sie können die Daten der Kontakte auch markieren, kopieren und in einem Textverarbeitungsprogramm einfügen.",
        //},
        //egoPanel: {},
        //egoEdit: {
        ego: "Ankerperson",
        editego: "Ankerperson bearbeiten",
        name: "Name",
        genders: "Geschlecht",
        male: "männlich",
        female: "weiblich",
        diverse: "divers",
        notspecified: "not nicht festgelegt",
        age: "Alter",
        notesaboutego: "Notizen zum Kontakt",
        whoisinthecenter: "Wer steht im Zentrum der NWK?",
        mandatoryfield: "Pflichtfeld",
        done: "Schließen",
        //},
        //alterPanel: {
        contacts: "Kontakte",
        nocontactsyet1: "Noch keine Kontakte vorhanden.",
        nocontactsyet2: "Klicken Sie auf den Button mit dem  ",
        nocontactsyet3: " Symbol, um Kontakte in der Netzwerkkarte anzulegen.",
        editconnections: "Beziehungen des Kontakts bearbeiten",
        deletecontact: "Kontakt entfernen",
        //},
        //alterEdit: {
        addcontact: "Kontakt hinzufügen",
        editcontact: "Kontakt bearbeiten",
        nickname: "Vorname oder Spitzname",
        socialrole: "Soziale Rolle des Kontakts, Auswahlmöglichkeiten",
        altergender:
          "biologisches und/oder soziales Geschlecht; Kategorisierung obliegt der Ankerperson",
        category: "Kategorie",
        positiononmap: "Die Position in der Karte muss noch festgelegt werden.",
        role: "Rolle",
        human: "Mensch",
        agetitle: "Optional,soziales Alter der Kontaktperson",
        deceased: "verstorben",
        deceasedcheck: "Häkchen, falls Kontaktperson verstorben",
        relationship: "Beziehung",
        relationtitle: "Aktualisierung der Verbindung",
        existingtitle:
          "Beziehung wird aktuell gepflegt, aktualisierte Verbindung.",
        multititle:
          "Anker- und Kontaktperson begegnen sich in mehreren sozialen Rollen. Beziehung erfüllt mehrere Funktionen.",
        norelationtitle:
          "Ankerperson und diese Person pflegen zurzeit keinen Kontakt, Beziehung ist nicht aktualisiert (sondern beendet/unterbrochen).",
        existing: "besteht",
        multiplex: "multiplex",
        nocurrentrelationship: "keine aktuelle Beziehung",
        notesaboutcontact: "Notizen zum Kontakt",
        nextcontact: "Nächster Kontakt",
        close: "Schließen",
        cancel: "Abbrechen",
        //},
        //alterConnections: {
        relationshipsof: "Beziehungen von",
        clickoncontacttoconnect: "Klicke auf einen Kontakt um diesen mit",
        clickoncontacttoconnect2:
          "  zu verbinden bzw. die Verbindung zu lösen.",
        possiblecontacts: "Mögliche Kontakte",
        connectedcontacts: "Verbundene Kontakte",
        //},
        //errorMessage:
        sthwentwrong: "Irgendetwas ist schief gelaufen :-(",
        withmsg: "Mit ",
        canundo: "Rückgängig",
        fullscreen: "Vollbildmodus",
        restore: "Wiederherstellen",
        canundo2: "kann der Fehler möglicherweiser behoben werden.",
        withmsg2: "Mit ",
        deletedata: "Zwischenspeicher löschen",
        deletedata2:
          "können Sie easyNWK in den Auslieferungszustand zurücksetzen.",
        attention: "Achtung:",
        attention2: "Dabei gehen die momentan bearbeiteten Daten verloren.",
        tempdata: "Zwischengespeicherte Daten:",
        tempdata2: "(können kopiert werden)",
        deletetempdata: "Zwischenspeicher löschen",
      },
    };
  },
};
