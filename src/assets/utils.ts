function download(filename: string, dataURL: string): void {
  // based on https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
  const element = document.createElement("a");
  element.setAttribute("href", dataURL);
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

export function downloadText(filename: string, text: string): void {
  download(
    filename,
    "data:text/plain;charset=utf-8,\ufeff" + encodeURIComponent(text)
  );
}

export function downloadSVGasPNG(filename: string, svgSelector: string): void {
  // based on https://stackoverflow.com/a/69695782/1140589

  const svgElem = document.querySelector(svgSelector);
  if (!svgElem) {
    console.error("SVG element not found: " + svgSelector);
    return;
  }

  const domRect = svgElem.getBoundingClientRect();

  let svgData = new XMLSerializer().serializeToString(svgElem);
  svgData = '<?xml version="1.0" standalone="no"?>\r\n' + svgData;
  svgData = insertStyleSheets(svgData);

  // workaround a Firefox bug that cannot draw SVG of relative size
  svgData = svgData.replace(
    'width="100%" height="100%"',
    'width="' + domRect.width + '" height="' + domRect.width + '"'
  );
  // downloadText(filename.replace("png", "svg"), svgData);

  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const DOMURL = window.URL || window.webkitURL || window;
  const svgUrl = DOMURL.createObjectURL(svgBlob);

  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = domRect.width;
    canvas.height = domRect.height;
    ctx?.drawImage(img, 0, 0, domRect.width, domRect.height);
    DOMURL.revokeObjectURL(svgUrl);

    const imgURI = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");

    download(filename, imgURI);
  };
  img.onerror = (e) => {
    console.error("Image not loaded", e);
  };

  img.src = svgUrl;
}

function insertStyleSheets(svgData: string): string {
  // based on https://stackoverflow.com/a/41346127/1140589
  let styleStr = "<style>";
  for (const sheet of document.styleSheets) {
    try {
      // we need a try-catch block for external stylesheets that could be there...
      styleStr += Array.prototype.reduce.call(
        sheet.cssRules,
        function (a, b) {
          return a + b.cssText; // just concatenate all our cssRules' text
        },
        ""
      );
    } catch (e) {
      console.log(e);
    }
  }
  styleStr += "</style>";

  // svgData.
  return svgData.replace(/<defs([^>]*)>/, "<defs$1>" + styleStr);
}

export const SYMBOL_DECEASED = "+"; // "💀";
