// =====================
// DATOS DE TU SHEET
// =====================
const SHEET_ID = "1EZTXRB06qm68Xrs6DGVuK5KEyd4Zez1t_ONu4e7ihfU";
const API_KEY = "AIzaSyBbU7VsAR3M3VADQ3aFxBVto86M1k6EMuY";

// TABS (pestañas)
const TABS = [
  "GARANTIAS LIMA",
  "CERRAR LIMA",
  "GARANTIAS PROVINCIA",
  "FUERA DE GARANTÍA PROVINCIA",
  "CANCELADOS"
];

let dataTable;

// =====================
// CREAR BOTONES
// =====================
const tabsDiv = document.getElementById("tabs");

TABS.forEach(tab => {
  const btn = document.createElement("button");
  btn.textContent = tab;
  btn.onclick = () => loadSheet(tab);
  tabsDiv.appendChild(btn);
});

// =====================
// CARGAR DATOS DEL SHEET
// =====================
async function loadSheet(sheetName) {
  const encodedName = encodeURIComponent(sheetName);

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodedName}?key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.values) {
      alert("Esta hoja no tiene datos");
      return;
    }

    const rows = data.values;
    const table = document.getElementById("dataTable");

    let html = "<thead><tr>";
    rows[0].forEach(col => {
      html += `<th>${col}</th>`;
    });
    html += "</tr></thead><tbody>";

    rows.slice(1).forEach(row => {
      html += "<tr>";
      rows[0].forEach((_, i) => {
        html += `<td>${row[i] || ""}</td>`;
      });
      html += "</tr>";
    });

    html += "</tbody>";

    table.innerHTML = html;

    if (dataTable) {
      dataTable.destroy();
    }

    dataTable = new simpleDatatables.DataTable(table);

  } catch (error) {
    console.error("Error cargando la hoja:", error);
    alert("Error al conectar con Google Sheets");
  }
}