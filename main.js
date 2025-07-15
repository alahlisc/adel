// main.js

const tableBody = document.querySelector("#expensesTable tbody");
const totalAmountEl = document.getElementById("totalAmount");
const totalTransactionsEl = document.getElementById("totalTransactions");
const maxAmountEl = document.getElementById("maxAmount");
const avgAmountEl = document.getElementById("avgAmount");

const sheetSelector = document.createElement("select");
sheetSelector.id = "sheetSelector";
sheetSelector.classList.add("btn", "btn-secondary");
document.querySelector(".export-buttons").prepend(sheetSelector);

let allData = {};

fetch("data/jason.json")
  .then((res) => res.json())
  .then((data) => {
    allData = data;
    const sheets = Object.keys(data);
    sheets.forEach((sheet) => {
      const option = document.createElement("option");
      option.value = sheet;
      option.textContent = sheet;
      sheetSelector.appendChild(option);
    });
    renderTable(sheets[0]);
  });

sheetSelector.addEventListener("change", () => {
  renderTable(sheetSelector.value);
});

function renderTable(sheetName) {
  const rows = allData[sheetName].filter((row) => row["القيمة"] != null);
  tableBody.innerHTML = "";

  let total = 0;
  let max = 0;

  rows.forEach((row, index) => {
    const tr = document.createElement("tr");
    const amount = Number(row["القيمة"]);
    total += amount;
    if (amount > max) max = amount;

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${row["رقم إيصال"] || row["رقم الصك"] || "-"}</td>
      <td class="amount">${amount.toLocaleString()} د.ل</td>
      <td>${row["اسم المستلم"] || "-"}</td>
      <td>${row["البيان"] || "-"}</td>
      <td>${excelDateToDate(row["التاريخ"] || "").toLocaleDateString("ar-EG")}</td>
      <td>-</td>
      <td>-</td>
    `;
    tableBody.appendChild(tr);
  });

  totalAmountEl.textContent = `${total.toLocaleString()} د.ل`;
  totalTransactionsEl.textContent = `${rows.length} حركة`;
  maxAmountEl.textContent = `${max.toLocaleString()} د.ل`;
  avgAmountEl.textContent = `${(total / rows.length).toFixed(2)} د.ل`;
}

function excelDateToDate(serial) {
  if (!serial || typeof serial !== "number") return new Date();
  const excelEpoch = new Date(1899, 11, 30);
  const date = new Date(excelEpoch.getTime() + serial * 86400000);
  return date;
}
