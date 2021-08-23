export function download(filename: string, text: string): void {
  // based on https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:application/octet-stream," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
