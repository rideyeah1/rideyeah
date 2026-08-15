/**
 * RIDEYEAH · Resumen del pipeline B2B
 * -----------------------------------
 * Lee acquisition/03-prospeccion/prospects.csv y responde las tres preguntas
 * que se hacen a diario: qué hay en el pipeline, a quién toca contactar hoy, y
 * qué filas están mal capturadas.
 *
 * No tiene dependencias: solo Node (>= 18), igual que el resto del repo.
 *
 * Uso:
 *   node acquisition/tools/pipeline.mjs                 resumen completo
 *   node acquisition/tools/pipeline.mjs --due           seguimientos vencidos/hoy
 *   node acquisition/tools/pipeline.mjs --segment hotel filtra por segmento
 *   node acquisition/tools/pipeline.mjs --check         solo problemas de datos
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const CSV = join(HERE, "..", "03-prospeccion", "prospects.csv");

// Estados que cuentan como "el prospecto sigue vivo" — son los que exigen una
// próxima fecha de seguimiento.
const ACTIVE = new Set([
  "researching",
  "contacted",
  "replied",
  "interested",
  "quote_requested",
  "negotiating",
]);
const CLOSED = new Set(["won", "lost", "not_qualified"]);
const ALL_STATUSES = ["new", ...ACTIVE, "won", "lost", "nurture", "not_qualified"];

/**
 * Parser de CSV suficiente para este archivo: respeta comillas dobles, comas
 * dentro de comillas y "" como comilla escapada. No soporta saltos de línea
 * dentro de un campo — si algún día hacen falta, este es el lugar a cambiar.
 */
function parseCsv(text) {
  const rows = [];
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const cells = [];
    let cur = "";
    let quoted = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (quoted) {
        if (ch === '"') {
          if (line[i + 1] === '"') {
            cur += '"';
            i++;
          } else quoted = false;
        } else cur += ch;
      } else if (ch === '"') quoted = true;
      else if (ch === ",") {
        cells.push(cur);
        cur = "";
      } else cur += ch;
    }
    cells.push(cur);
    rows.push(cells.map((c) => c.trim()));
  }
  if (!rows.length) return [];
  const header = rows.shift();
  return rows.map((cells) => Object.fromEntries(header.map((h, i) => [h, cells[i] ?? ""])));
}

const isExample = (r) => /^EXAMPLE/i.test(r.company || "");
const money = (n) => "$" + Math.round(n).toLocaleString("en-US");
const today = () => new Date().toISOString().slice(0, 10);

function bar(n, max, width = 24) {
  if (!max) return "";
  return "█".repeat(Math.max(1, Math.round((n / max) * width)));
}

// ---------- argumentos ----------
const argv = process.argv.slice(2);
const flag = (name) => argv.includes(name);
const value = (name) => {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : null;
};

if (!existsSync(CSV)) {
  console.error(`No encuentro el CRM en ${CSV}`);
  process.exit(1);
}

let rows = parseCsv(readFileSync(CSV, "utf8"));
const examples = rows.filter(isExample).length;
rows = rows.filter((r) => !isExample(r));

const segment = value("--segment");
if (segment) rows = rows.filter((r) => r.segment === segment);

// ---------- validación ----------
const problems = [];
for (const r of rows) {
  const who = r.company || "(sin nombre)";
  if (!r.company) problems.push("Fila sin nombre de empresa");
  if (!r.segment) problems.push(`${who}: sin segmento`);
  else if (!["corporate", "hotel", "travel", "crew", "broker"].includes(r.segment))
    problems.push(`${who}: segmento desconocido "${r.segment}"`);
  if (r.status && !ALL_STATUSES.includes(r.status))
    problems.push(`${who}: estado desconocido "${r.status}"`);
  if ((r.email || r.phone) && !r.source)
    problems.push(`${who}: tiene contacto pero no dice de dónde salió (source vacío)`);
  if (ACTIVE.has(r.status) && !r.next_followup)
    problems.push(`${who}: activo (${r.status}) sin next_followup — se va a perder`);
  if (r.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(r.email))
    problems.push(`${who}: email con formato inválido "${r.email}"`);
}

if (flag("--check")) {
  if (!problems.length) console.log("Sin problemas de datos.");
  else {
    console.log(`${problems.length} problema(s):\n`);
    for (const p of problems) console.log(`  · ${p}`);
  }
  process.exit(problems.length ? 1 : 0);
}

// ---------- seguimientos vencidos ----------
const due = rows
  .filter((r) => r.next_followup && r.next_followup <= today() && !CLOSED.has(r.status))
  .sort((a, b) => a.next_followup.localeCompare(b.next_followup));

if (flag("--due")) {
  console.log(`\nSeguimientos para hoy o vencidos (${due.length})\n`);
  if (!due.length) console.log("  Nada pendiente.\n");
  for (const r of due) {
    const late = r.next_followup < today() ? " ⚠ vencido" : "";
    console.log(`  ${r.next_followup}${late}  ${r.company}`);
    console.log(`      ${r.contact_name || "(sin contacto)"} · ${r.title || "—"} · ${r.status}`);
    if (r.notes) console.log(`      ${r.notes}`);
  }
  console.log();
  process.exit(0);
}

// ---------- resumen ----------
const byStatus = {};
const bySegment = {};
let pipelineValue = 0;
let wonValue = 0;

for (const r of rows) {
  const st = r.status || "(vacío)";
  byStatus[st] = (byStatus[st] || 0) + 1;
  const sg = r.segment || "(vacío)";
  bySegment[sg] = bySegment[sg] || { count: 0, value: 0 };
  bySegment[sg].count++;
  const v = Number(r.est_monthly_value) || 0;
  bySegment[sg].value += v;
  if (ACTIVE.has(r.status)) pipelineValue += v;
  if (r.status === "won") wonValue += v;
}

console.log("\nRIDEYEAH · Pipeline B2B");
console.log("─".repeat(52));
console.log(`Prospectos reales:        ${rows.length}`);
if (examples) console.log(`Filas de ejemplo:         ${examples}  (borrar al cargar datos reales)`);
if (segment) console.log(`Filtro de segmento:       ${segment}`);

if (!rows.length) {
  console.log(`
El CRM está vacío. Es el estado correcto para arrancar — mejor vacío que con
datos inventados.

Siguiente paso: acquisition/03-prospeccion/protocolo-investigacion.md
Ritmo objetivo: 10 empresas investigadas y 10 contactadas por día.
`);
  process.exit(0);
}

console.log("\nPor estado");
const maxStatus = Math.max(...Object.values(byStatus));
for (const st of ALL_STATUSES.concat(
  Object.keys(byStatus).filter((s) => !ALL_STATUSES.includes(s))
)) {
  if (!byStatus[st]) continue;
  console.log(
    `  ${st.padEnd(16)} ${String(byStatus[st]).padStart(4)}  ${bar(byStatus[st], maxStatus)}`
  );
}

console.log("\nPor segmento");
console.log(`  ${"segmento".padEnd(12)} ${"n".padStart(4)}   valor mensual estimado`);
for (const [sg, d] of Object.entries(bySegment).sort((a, b) => b[1].value - a[1].value)) {
  console.log(`  ${sg.padEnd(12)} ${String(d.count).padStart(4)}   ${money(d.value)}`);
}

console.log("\nValor");
console.log(`  Pipeline activo:        ${money(pipelineValue)}/mes estimado`);
console.log(`  Cuentas ganadas:        ${money(wonValue)}/mes`);

console.log("\nAcciones");
console.log(`  Seguimientos vencidos u hoy:  ${due.length}   (--due para verlos)`);
console.log(
  `  Problemas de datos:           ${problems.length}${problems.length ? "   (--check para verlos)" : ""}`
);
console.log();
