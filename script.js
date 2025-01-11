let lunchTiffinRate = 0;
let dinnerTiffinRate = 0;
let bedRentAmount = 0;
let isBedRentApplicable = false;

const tableBody = document.getElementById('tableBody');
const totaltiffinElement = document.getElementById('totaltiffin');
const totalDeductionsElement = document.getElementById('totalDeductions');
const grandTotalElement = document.getElementById('grandTotal');
const fixedBillElement = document.getElementById('fixedBill');

function askUserDetails() {
  const messName = prompt("Enter your Mess Name:");
  document.getElementById('messName').innerText = messName;

  lunchTiffinRate = parseFloat(prompt("Enter the Lunch Tiffin rate per day:")) || 0;
  dinnerTiffinRate = parseFloat(prompt("Enter the Dinner Tiffin rate per day:")) || 0;

  const hasBedRent = prompt("Do you have a bed rent? (Yes/No)").toLowerCase();
  if (hasBedRent === "yes") {
    isBedRentApplicable = true;
    bedRentAmount = parseFloat(prompt("Enter the Bed Rent amount:")) || 0;
  } else {
    isBedRentApplicable = false;
    bedRentAmount = 0;
  }

  updateSummary();
}

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

  pdf.text(`Mess Name: ${document.getElementById('messName').innerText}`, 10, 10);
 pdf.text(`Month: ${document.getElementById('monthSelect').selectedOptions[0].innerText}`, 10, 20);

  pdf.autoTable({
    startY: 30,
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
  pdf.text(`Total Mess Bill: Rupees ${totalDeductionsElement.innerText}`, 10, finalY + 10);
  pdf.text(fixedBillElement.innerText, 10, finalY + 20);
  pdf.text(`Total Bill: ₹${grandTotalElement.innerText}`, 10, finalY + 30);

  pdf.save("mess_bill.pdf");
}

generateTable();
