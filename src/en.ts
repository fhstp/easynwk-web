export default {
  data() {
    return {
      en: {
        //networkMap: {
        family: "Family",
        friends: "Friends",
        colleagues: "Colleagues",
        professionals: "prof. Help",
        maptext: "Click on the map ",
        maptext2: "to determine the position",
        zoomreset: "Reset zoom",
        clusterconnect: "Connect contacts (create clique)",
        deconnect: "Remove all connections",
        closebrush: "Close selection",
        //},
        //sideMenu: {
        newNWK: "New NWK",
        open: "Open",
        save: "Save",
        openDemo: "Open demo",
        exportPNG: "Export PNG",
        exportkeyfigures: "Export key figures",
        createPDF: "Create PDF",
        keyfigures: "Key figures",
        abouteasyNWK: "About the easyNWK",
        sourcecode: "Source code ",
        imprint: "Imprint",
        //},
        //statisticPanel: {
        overview: "Overview",
        sector: "Sector",
        profhelp: "prof. help",
        horizon: "Horizon",
        horizoncumulative: "Horizon (cumulative)",
        gender: "Gender",
        networksize: "Network size",
        relationshipweight: "Relationship weight",
        totaldensity: "Total density",
        categorydensity: "Category density",
        categorystar: "Star (per category)",
        stars: "Star(s)",
        bridges: "Bridges",
        bridgepersons: "Bridge person(s)",
        isolatedpersons: "Isolated person(s)",
        personswithoutedgetotheego: "Person(s) without edge to the ego",
        networkmsg:
          "Number of contacts in the network without ego and without contacts that do not have an edge to the ego",
        relationshipmsg:
          "Summed proximity or distance of the contacts to the ego. The higher the indicator, the closer the contacts are to the ego.",
        densitymsg:
          "Ratio of the actually existing connections to the theoretically possible connections (excluding connections between ego and contacts, including contacts without edge to ego). Optional: Measurement is between 0 (isolated contacts only) and 1 (every person in the network is connected to everyone else).",
        starsmsg:
          "Contact(s) with most connections in the network (besides the ego)",
        bridgesmsg2: "Contact(s) connecting individual sectors in the network",
        bridgemsg:
          "Amount of contact(s) connecting individual sectors in the network",
        isolatedmsg: "Contact(s) associated exclusively with the ego",
        noedgemsg:
          "Living contacts without an updated connection to the ego. Connections with other people in the network and thus indirect connection to the ego are possible.",

        //},
        //viewOptions: {
        viewsettings: "View settings",
        anonymiseon: "Anonymise",
        horizonson: "Horizons on",
        connectionson: "Connections on",
        namesofcontactson: "Name of contacts on",
        ageofcontactson: "Age of contacts on",
        roleofcontactson: "Role of contacts on",
        anonymiseoff: "De-anonymise",
        horizonsoff: "Horizons off",
        connectionsoff: "Connections off",
        namesofcontactsoff: "Name of contacts off",
        ageofcontactsoff: "Age of contacts off",
        roleofcontactsoff: "Role of contacts off",
        //},
        //pdfView: {
        printorpdf: "Print or print as PDF",
        closeandback: "Close & go back to easyNWK",
        printtext:
          "In order to generate a PDF file of this view, select 'Save as PDF' in the print dialogue.",
        printtext2:
          "You can also highlight the data and copy & paste it into a word processor.",
        //},
        //egoPanel: {},
        //egoEdit: {
        ego: "Ego",
        editego: "Edit ego",
        name: "Name",
        genders: "Gender",
        male: "male",
        female: "female",
        diverse: "diverse",
        notspecified: "not specified",
        age: "Age",
        notesaboutego: "Notes about ego",
        whoisinthecenter: "Who is in the center of the NWK?",
        mandatoryfield: "Mandatory field",
        done: "Done",
        //},
        //alterPanel: {
        contacts: "Contacts",
        nocontactsyet1: "No contacts available yet.",
        nocontactsyet2: "Click on the button with the  ",
        nocontactsyet3: "  symbol to add contacts to the networkmap.",
        editconnections: "Edit the relationships of the contact",
        deletecontact: "Delete contact",
        //},
        //alterEdit: {
        addcontact: "Add contact",
        editcontact: "Edit contact",
        nickname: "Name or nickname",
        socialrole: "Social role of contact, options",
        altergender:
          "biological and/or social sex; categorisation is the responsibility of the ego",
        category: "Category",
        positiononmap: "The position on the map still has to be determined.",
        role: "Role",
        human: "Human",
        agetitle: "Optional, social age of the contact",
        deceased: "deceased",
        deceasedcheck: "Check if contact person died",
        relationship: "Relationship",
        relationtitle: "Updating the connection",
        existingtitle:
          "Relationship is currently maintained, connection updated.",
        multititle:
          "Ego and contact person meet in several social roles. Relationship fulfills several functions.",
        norelationtitle:
          "Ego and this person are currently not in contact, relationship is not updated (but ended/broken).",
        existing: "existing",
        multiplex: "multiplex",
        nocurrentrelationship: "no current relationship",
        notesaboutcontact: "Notes about contact",
        nextcontact: "Next contact",
        close: "Close",
        cancel: "Cancel",
        //},
        //alterConnections: {
        relationshipsof: "Relationships of",
        clickoncontacttoconnect:
          "Click on the contact to connect or cancel the connection with",
        clickoncontacttoconnect2: ".",
        possiblecontacts: "Possible contacts",
        connectedcontacts: "Connected contacts",
        //},
        //errorMessage:
        sthwentwrong: "Something went wrong :-(",
        withmsg: "",
        canundo: "Undo",
        fullscreen: "Full screen mode",
        restore: "Restore",
        canundo2: "could possibly fix the error.",
        withmsg2: "With ",
        deletedata: "Delete cache",
        deletedata2: " you can reset the easyNWK to the original state.",
        attention: "Attention:",
        attention2: "The currently processed data will be lost.",
        tempdata: "Cached data: ",
        tempdata2: "(can be copied)",
        deletetempdata: "Delete cache",
        profi: "Professional Help",
        horizon_cum: "Horizon (cumulative)",
        circle3: "Circle 3",
        circle2: "Circle 2",
        circle1: "Circle 1",
        networkwithoutprofhelp: "Network without professional help",
        entirenetwork: "Entire Network",
      },
    };
  },
};
