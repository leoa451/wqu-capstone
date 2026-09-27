interface PortfolioResult {
  id: string;
  name: string;
  annualized_return: number;
  annualized_volatility: number;
  sharpe: number;
  max_drawdown: number;
  turnover: number;
}

interface PublishedRun {
  id: string;
  label: string;
  test_period: string;
  transaction_cost_bps: number;
  constraint_violations: number;
  portfolios: PortfolioResult[];
}

type MetricKey = "annualized_return" | "annualized_volatility" | "sharpe" | "max_drawdown" | "turnover";
type MetricKind = "percent" | "number";

const RESULTS_URL = new URL("./results/index.json", import.meta.url);
const METRICS: ReadonlyArray<readonly [MetricKey, MetricKind]> = [
  ["annualized_return", "percent"],
  ["annualized_volatility", "percent"],
  ["sharpe", "number"],
  ["max_drawdown", "percent"],
  ["turnover", "percent"],
];

function requiredElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing dashboard element: ${id}`);
  return element as T;
}

const elements = {
  status: requiredElement<HTMLElement>("publication-status"),
  message: requiredElement<HTMLElement>("status-message"),
  picker: requiredElement<HTMLElement>("run-picker"),
  select: requiredElement<HTMLSelectElement>("run-select"),
  rows: requiredElement<HTMLTableSectionElement>("comparison-rows"),
  context: requiredElement<HTMLElement>("run-context"),
  returnValue: requiredElement<HTMLElement>("return-value"),
  sharpeValue: requiredElement<HTMLElement>("sharpe-value"),
  violationValue: requiredElement<HTMLElement>("violation-value"),
  refresh: requiredElement<HTMLElement>("refresh-button"),
};

const percent = new Intl.NumberFormat("en", { style: "percent", maximumFractionDigits: 2 });
const number = new Intl.NumberFormat("en", { maximumFractionDigits: 2 });
let runs: PublishedRun[] = [];

function metricText(value: number | null | undefined, kind: MetricKind): string {
  if (value === null || value === undefined) return "—";
  return Number.isFinite(value) ? (kind === "percent" ? percent : number).format(value) : "—";
}

function setStatus(label: string, message: string, error = false): void {
  elements.status.textContent = label;
  elements.status.setAttribute("type", error ? "red" : "blue");
  elements.message.textContent = message;
  elements.message.classList.toggle("error", error);
}

function emptyTable(message: string): void {
  const row = document.createElement("tr");
  const cell = document.createElement("td");
  cell.colSpan = 6;
  cell.className = "empty-cell";
  cell.textContent = message;
  row.append(cell);
  elements.rows.replaceChildren(row);
}

function resetView(message: string): void {
  elements.picker.hidden = true;
  elements.select.replaceChildren();
  elements.returnValue.textContent = "—";
  elements.sharpeValue.textContent = "—";
  elements.violationValue.textContent = "—";
  elements.context.textContent = "No evaluation run selected.";
  emptyTable(message);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function checkManifest(data: unknown): PublishedRun[] {
  if (!isRecord(data) || data.schema_version !== 1 || !Array.isArray(data.runs)) {
    throw new Error("The results file has an unsupported format.");
  }
  const ids = new Set<string>();
  for (const run of data.runs as unknown[]) {
    if (!isRecord(run) ||
        typeof run.id !== "string" || !run.id ||
        typeof run.label !== "string" || !run.label ||
        typeof run.test_period !== "string" || !run.test_period ||
        typeof run.transaction_cost_bps !== "number" || !Number.isFinite(run.transaction_cost_bps) || run.transaction_cost_bps < 0 ||
        typeof run.constraint_violations !== "number" || !Number.isInteger(run.constraint_violations) || run.constraint_violations < 0 ||
        !Array.isArray(run.portfolios) || run.portfolios.length === 0 ||
        !run.portfolios.some((portfolio: unknown) => isRecord(portfolio) && portfolio.id === "model") ||
        ids.has(run.id)) {
      throw new Error("A published run is incomplete or duplicated.");
    }
    ids.add(run.id);
    for (const portfolio of run.portfolios as unknown[]) {
      if (!isRecord(portfolio) || typeof portfolio.id !== "string" ||
          typeof portfolio.name !== "string" || !portfolio.name) {
        throw new Error("A portfolio in the results file has no id or name.");
      }
      for (const [key] of METRICS) {
        if (typeof portfolio[key] !== "number" || !Number.isFinite(portfolio[key])) {
          throw new Error("A portfolio in the results file has an invalid metric.");
        }
      }
    }
  }
  return data.runs as PublishedRun[];
}

function renderRun(run: PublishedRun): void {
  const model = run.portfolios.find((portfolio) => portfolio.id === "model");
  if (!model) throw new Error("The selected run has no model portfolio.");
  elements.returnValue.textContent = metricText(model.annualized_return, "percent");
  elements.sharpeValue.textContent = metricText(model.sharpe, "number");
  elements.violationValue.textContent = String(run.constraint_violations);
  elements.context.textContent = `${run.label} · Test period: ${run.test_period} · Transaction cost: ${number.format(run.transaction_cost_bps)} bps`;

  const rows = run.portfolios.map((portfolio) => {
    const row = document.createElement("tr");
    const name = document.createElement("td");
    name.textContent = portfolio.name;
    row.append(name);
    for (const [key, kind] of METRICS) {
      const cell = document.createElement("td");
      cell.textContent = metricText(portfolio[key], kind);
      row.append(cell);
    }
    return row;
  });
  elements.rows.replaceChildren(...rows);
}

async function loadResults(): Promise<void> {
  setStatus("Checking results", "Loading the published results file.");
  try {
    const response = await fetch(RESULTS_URL, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    runs = checkManifest(await response.json());
    if (runs.length === 0) {
      resetView("No published portfolio results yet.");
      setStatus("No results published", "The dashboard is ready. No model evaluation has been published.");
      return;
    }

    const previous = elements.select.value;
    elements.select.replaceChildren(...runs.map((run) => {
      const option = document.createElement("option");
      option.value = run.id;
      option.textContent = run.label;
      return option;
    }));
    elements.select.value = runs.some((run) => run.id === previous) ? previous : runs[0].id;
    elements.picker.hidden = runs.length < 2;
    const selected = runs.find((run) => run.id === elements.select.value);
    if (selected) renderRun(selected);
    setStatus("Results published", `${runs.length} saved evaluation run${runs.length === 1 ? "" : "s"} available.`);
  } catch (error: unknown) {
    resetView("Results could not be loaded.");
    const detail = error instanceof Error ? error.message : String(error);
    setStatus("Results unavailable", `The published results file could not be read: ${detail}`, true);
  }
}

elements.select.addEventListener("change", () => {
  const run = runs.find((item) => item.id === elements.select.value);
  if (run) renderRun(run);
});
elements.refresh.addEventListener("click", loadResults);
loadResults();
