// Print CV button functionality. Opens the print dialog when clicked.

(() => {
  'use strict';
  const printButton = document.getElementById('print-cv');
  printButton?.addEventListener('click', () => window.print());
})();
