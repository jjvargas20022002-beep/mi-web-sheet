const SHEET_ID = "1eaNxCpm8JF1JcZS3_ldwMRINGYFaW6RsQQWybvRi_P8";
const API_KEY = "AIzaSyBbU7VsAR3M3VADQ3aFxBVto86M1k6EMuY";

const TABS = [
  "GARANTIAS LIMA",
  "ONLINE LIMA",
  "GARANTIAS PROVINCIA",
  "FUERA DE GARANTÍA PROVINCIA",
  "CANCELADOS"
];

const BRANCHES = {
  LIMA: ["ALL","LI1","LI2","LI3","LI4","LI7"],
  PROVINCIA: ["ALL","ARE","CUS","CAJ","HUN","JUN","LAL","PIU","SAN"]
};

let dataTable;
let allRows = [];
let currentTab = "";

const tabsDiv = document.getElementById("tabs");
const branchSelect = document.getElementById("branchFilter");

TABS.forEach(tab => {
  const btn = document.createElement("button");
  btn.textContent = tab;
  btn.onclick = () => loadSheet(tab);
  tabsDiv.appendChild(btn);
});

branchSelect.onchange = () => renderTable();

async function loadSheet(sheetName) {
  currentTab = sheetName;
  const encodedName = encodeURIComponent(sheetName);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodedName}?key=${API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.values) {
    alert("Esta hoja no tiene datos");
    return;
  }

  allRows = data.values;
  loadBranches(sheetName);
  renderTable();
}

function loadBranches(tab) {
  branchSelect.innerHTML = "";

  const isLima = tab.includes("LIMA");
  const list = isLima ? BRANCHES.LIMA : BRANCHES.PROVINCIA;

  list.forEach(branch => {
    const opt = document.createElement("option");
    opt.value = branch;
    opt.textContent = branch;
    branchSelect.appendChild(opt);
  });
}

function renderTable() {
  const table = document.getElementById("dataTable");
  const selectedBranch = branchSelect.value;

  let html = "<thead><tr>";
  allRows[0].forEach(col => html += `<th>${col}</th>`);
  html += "</tr></thead><tbody>";

  allRows.slice(1).forEach(row => {
    if (selectedBranch !== "ALL" && row[0] !== selectedBranch) return;

    html += "<tr>";
    allRows[0].forEach((_, i) => {
      html += `<td>${row[i] || ""}</td>`;
    });
    html += "</tr>";
  });

  html += "</tbody>";
  table.innerHTML = html;

  if (dataTable) dataTable.destroy();
  dataTable = new simpleDatatables.DataTable(table);
}