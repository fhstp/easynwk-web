# easyNWK Version History

## version 2.5.0, released ... 2024

* (feature) optionally set emoji for ego and each alter
* (usability) version slider always on as soon as more than 1 version
* (usability) filename of PDF with date in YYYY-MM-dd

## version 2.4.0, released 28 Aug 2024

* (feature) opening and importing .nwk files created with easyNWK 1.5
* (feature) revised simple statistics for practicioneers (incl. Nähe, stdev, counts by gender and horizon)
* (feature) revised statistics export (one line per versions and column of the statistics panel)
* (usability) better feedback on opening unsuitable files
* (security) various updates of libraries

## version 2.3.0, released 8 Jul 2024

* (feature) font-size of alteri labels can be changed
* (feature) view option settings are presisted in local storage
* (usability) view options panel redesigned using checkboxes
* (bugfix) save anoynimized to JSON in the data structure for multiple maps
* (bugfix) anoynimize alteri list in export/print view
* (security) various updates of libraries

## version 2.2.0, released 30 Apr 2024

* (feature) make the web app multi-linugal [#83](https://github.com/fhstp/easynwk-web/issues/83)

## version 2.1.0, released 26 Feb 2024

* (feature) create or duplicate network maps to document change over time [#118](https://github.com/fhstp/easynwk-web/issues/118)
  * warning: new JSON file format (network maps saved in previous versions can be opened in 2.1.0)

## version 2.0.6, released 25 Aug 2023

* (feature) zoom with brushbox, mouse wheel, and sector labels [#103](https://github.com/fhstp/easynwk-web/issues/103)
* (feature) toggle fullscreen mode [#137](https://github.com/fhstp/easynwk-web/issues/137)
* (bugfix) layout on mobile devices not calculating height of address bar

## version 2.0.5, released 14 Aug 2023

* (usability) sort alters in connectionlist form by name alphabethically [#110](https://github.com/fhstp/easynwk-web/issues/110)
* (usability) show border of outer horizon even in no_horizon mode to indicate border of network  [#130](https://github.com/fhstp/easynwk-web/issues/130)
* (bugfix) support 4:3 landscape in fullscreen and normal mode using additional media queries [#104](https://github.com/fhstp/easynwk-web/issues/104)
* (bugfix) prevent scrolling in landscape mode
* (security) various updates of libraries

## version 2.0.4, released 25 May 2023

* (feature) display ego name and age on top of network map
* (feature) add roles "Ex-Partner*in", "Mitbewohner*in", change abbreviation for "Schwager/Schwägerin"
* (usability) do not show horizons by default
* (usability) enforce that age of ego and alteri is a non-negative number
* (bugfix) change link to PDF view to relative url [#128](https://github.com/fhstp/easynwk-web/issues/128)
* (security) various updates of libraries

## version 2.0.3, released 11 Nov 2022

* (feature) add alter with double click on map [#61](https://github.com/fhstp/easynwk-web/issues/61)
* (feature) close alter edit mode with double click on map [#45](https://github.com/fhstp/easynwk-web/issues/45)
* (feature) rectangle to select multiple alters on map and fully connect/disconnect them
* (usability) Escape key closes edit alter form and optionally cancels add alter [#97](https://github.com/fhstp/easynwk-web/issues/97)
* (usability) alter symbols are drawn on top of everything else (esp. alter names) [#64](https://github.com/fhstp/easynwk-web/issues/64)
* (bugfix) print view network map in color [#47](https://github.com/fhstp/easynwk-web/issues/47)
* (bugfix) double click works within edit alter location
* (security) large update of libraries

## version 2.0.2, released 24 Sep 2022

* (feature) print all entered data or copy to text editor #47
* (feature) show role and age in the network map optionally
* (usability) move view options into a panel below contacts #64
* (bugfix) metadata about language (avoid translation of divers to Taucher) #71
* (bugfix) provide favicon in a relative location
* (security) various updates of libraries

## version 2.0.1, released 25 Apr 2022

* (feature) contacts outside outer horizon cannot be connected
* (security) various updates of libraries

## version 2.0.0, released 8 Feb 2022
