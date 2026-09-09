
/*
  Monday reference generator:
  - Day/date/week/term/year are supplied dynamically.
  - No generated metadata is baked into image assets.
  - Row counts are explicit configuration values.
*/
const mondayReferenceConfig = {
  weekday: "MONDAY",
  dateISO: "2026-10-05",
  term: "TERM 4",
  week: 1,

  // Approved row-count ranges:
  // Appointments 3–4; Students 3–5; Life Skills GO 5–7; Tasks/Admin 5–7;
  // Sentrals 8–12; Calls/Email/Messages 5–7.
  appointmentsRows: 4,
  studentsRows: 5,
  lifeSkillsRows: 6,
  taskRows: 6,
  sentralRows: 10,
  callRows: 6,
  notesLines: 4
};

function formatDateLong(iso) {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).toUpperCase();
}

function bindGeneratedMetadata(config) {
  const values = {
    weekday: config.weekday,
    "date-long": formatDateLong(config.dateISO),
    term: config.term,
    week: String(config.week)
  };
  document.querySelectorAll("[data-bind]").forEach(el => {
    const key = el.getAttribute("data-bind");
    el.textContent = values[key] ?? "";
  });
}

function addTableRows(tbodyId, count, cells) {
  const tbody = document.getElementById(tbodyId);
  tbody.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const tr = document.createElement("tr");
    for (let c = 0; c < cells; c++) tr.appendChild(document.createElement("td"));
    tbody.appendChild(tr);
  }
}

function addTaskRows(containerId, count) {
  const el = document.getElementById(containerId);
  el.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const row = document.createElement("div");
    row.className = "task-row";
    row.innerHTML = '<span class="check"></span><span style="flex:1"></span>';
    el.appendChild(row);
  }
}

function addNotes(count) {
  const el = document.getElementById("notesRows");
  el.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const line = document.createElement("div");
    line.className = "note-line";
    el.appendChild(line);
  }
}

/* Strict QA: fail visibly in console if any content exceeds a page. */
function assertNoPageOverflow() {
  document.querySelectorAll(".page").forEach((page, i) => {
    const overflowY = page.scrollHeight > page.clientHeight + 1;
    const overflowX = page.scrollWidth > page.clientWidth + 1;
    if (overflowY || overflowX) {
      console.error(`PAGE ${i + 1} OVERFLOW`, {
        scrollHeight: page.scrollHeight,
        clientHeight: page.clientHeight,
        scrollWidth: page.scrollWidth,
        clientWidth: page.clientWidth
      });
      page.dataset.overflow = "true";
    }
  });

  /* Also assert child bounds stay inside page bounds. */
  document.querySelectorAll(".page").forEach((page, i) => {
    const pr = page.getBoundingClientRect();
    page.querySelectorAll("*").forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.right > pr.right + 1 || r.bottom > pr.bottom + 1) {
        console.error(`PAGE ${i + 1}: element exceeds page`, el);
      }
    });
  });
}

function renderMondayReference(config) {
  bindGeneratedMetadata(config);
  addTableRows("appointmentsRows", config.appointmentsRows, 2);
  addTableRows("studentRows", config.studentsRows, 3);
  addTableRows("lifeSkillsRows", config.lifeSkillsRows, 3);
  addTableRows("sentralRows", config.sentralRows, 2);
  addTableRows("callRows", config.callRows, 3);

  const leftCount = Math.ceil(config.taskRows / 2);
  const rightCount = Math.floor(config.taskRows / 2);
  addTaskRows("taskColA", leftCount);
  addTaskRows("taskColB", rightCount);
  addNotes(config.notesLines);

  requestAnimationFrame(assertNoPageOverflow);
}

renderMondayReference(mondayReferenceConfig);
