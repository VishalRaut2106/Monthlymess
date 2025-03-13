let lunchTiffinRate = 0;
let dinnerTiffinRate = 0;
let bedRentAmount = 0;
let isBedRentApplicable = false;

const tableBody = document.getElementById('tableBody');
const totaltiffinElement = document.getElementById('totaltiffin');
const totalDeductionsElement = document.getElementById('totalDeductions');
const grandTotalElement = document.getElementById('grandTotal');
const fixedBillElement = document.getElementById('fixedBill');

//input 
const setupModal = document.getElementById('setupModal');
const setupForm = document.getElementById('setupForm');
const hasBedRentCheckbox = document.getElementById('hasBedRent');
const bedRentGroup = document.getElementById('bedRentGroup');

document.addEventListener('DOMContentLoaded', () => {
  setupModal.style.display = 'flex';
});

// bed rent
hasBedRentCheckbox.addEventListener('change', () => {
  bedRentGroup.style.display = hasBedRentCheckbox.checked ? 'block' : 'none';
});

// submission
setupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const messName = document.getElementById('messNameInput').value;
  lunchTiffinRate = parseInt(document.getElementById('lunchRate').value) || 0;
  dinnerTiffinRate = parseInt(document.getElementById('dinnerRate').value) || 0;
  isBedRentApplicable = hasBedRentCheckbox.checked;
  bedRentAmount = isBedRentApplicable ? parseInt(document.getElementById('bedRent').value) || 0 : 0;

  // Update mess name
  document.getElementById('messName').innerText = messName;

  setupModal.style.display = 'none';

  generateTable();
});

function generateTable() {
  const month = parseInt(document.getElementById('monthSelect').value);
  const year = new Date().getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  tableBody.innerHTML = '';
  const savedData = JSON.parse(localStorage.getItem('messData')) || {};

  for (let i = 1; i <= daysInMonth; i++) {
    const date = `${i}-${month + 1}-${year}`;
    const rowData = savedData[date] || { lunch: 'No', dinner: 'No' };

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${date}</td>
      <td>
        <select class="lunch" onchange="updateData('${date}', 'lunch', this.value)">
          <option value="No" ${rowData.lunch === 'No' ? 'selected' : ''}>No</option>
          <option value="Yes" ${rowData.lunch === 'Yes' ? 'selected' : ''}>Yes</option>
        </select>
      </td>
      <td>
        <select class="dinner" onchange="updateData('${date}', 'dinner', this.value)">
          <option value="No" ${rowData.dinner === 'No' ? 'selected' : ''}>No</option>
          <option value="Yes" ${rowData.dinner === 'Yes' ? 'selected' : ''}>Yes</option>
        </select>
      </td>
      <td class="deduction">0</td>
    `;
    tableBody.appendChild(row);
  }

  updateSummary();
}

function updateData(date, tiffinsType, value) {
  const savedData = JSON.parse(localStorage.getItem('messData')) || {};
  if (!savedData[date]) {
    savedData[date] = { lunch: 'No', dinner: 'No' };
  }
  savedData[date][tiffinsType] = value;
  localStorage.setItem('messData', JSON.stringify(savedData));
  updateSummary();
}

function updateSummary() {
  const rows = tableBody.querySelectorAll('tr');
  let totaltiffins = 0;
  let totalDeductions = 0;

  rows.forEach(row => {
    const lunch = row.querySelector('.lunch').value === 'Yes' ? 1 : 0;
    const dinner = row.querySelector('.dinner').value === 'Yes' ? 1 : 0;
    const deduction = (lunch * lunchTiffinRate) + (dinner * dinnerTiffinRate);

    row.querySelector('.deduction').innerText = deduction;
    totaltiffins += lunch + dinner;
    totalDeductions += deduction;
  });

  totaltiffinElement.innerText = totaltiffins;
  totalDeductionsElement.innerText = totalDeductions;

  const grandTotal = totalDeductions + (isBedRentApplicable ? bedRentAmount : 0);
  grandTotalElement.innerText = grandTotal;

  fixedBillElement.innerText = isBedRentApplicable
    ? `Bed Rent: ₹${bedRentAmount}`
    : "No Bed Rent Applied";
}

function resetTable() {
  localStorage.removeItem('messData');
  generateTable();
}

function showTotalBill() {
  alert(`Your total bill is ₹${grandTotalElement.innerText}`);
}

function exportToPDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();


  pdf.setFont("helvetica");

  const headerRowHeight = 10;
  const headerRowYPosition = 10;

  pdf.setFillColor(135, 206, 235);
  pdf.rect(0, headerRowYPosition - 5, 210, headerRowHeight, 'F');

  pdf.setTextColor(0, 0, 0);


  pdf.text(`Mess Name: ${document.getElementById('messName').innerText}`, 10, headerRowYPosition);
  pdf.text(`Month: ${document.getElementById('monthSelect').selectedOptions[0].innerText}`, 120, headerRowYPosition);

  // Table section
  pdf.autoTable({
    startY: headerRowYPosition + headerRowHeight,
    head: [['Date', 'Lunch', 'Dinner', 'Bill (Rupees)']],
    body: Array.from(tableBody.rows).map(row => [
      row.cells[0].innerText,
      row.cells[1].querySelector('select').value,
      row.cells[2].querySelector('select').value,
      row.cells[3].innerText
    ])
  });


  const finalY = pdf.autoTable.previous.finalY + 10;
  pdf.text(`Total Tiffins: ${totaltiffinElement.innerText}`, 10, finalY);
  pdf.text(`Total Mess Bill Rupees:${totalDeductionsElement.innerText}`, 100, finalY);


  const finalY2 = finalY + 10;
  pdf.text(fixedBillElement.innerText, 10, finalY2);
  pdf.text(`Total Bill in Rupees:${grandTotalElement.innerText}`, 100, finalY2);

  // Save PDF
  pdf.save("mess_bill.pdf");
}

generateTable();
