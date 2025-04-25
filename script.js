const gradePoints = { S: 10, A: 9, B: 8, C: 7, D: 6, E: 4 };

const courses = [
  { name: "Maths 1", level: "fl", credits: 4 },
  { name: "Stats 1", level: "fl", credits: 4 },
  { name: "CT", level: "fl", credits: 4 },
  { name: "English 1", level: "fl", credits: 4 },
  { name: "Maths 2", level: "fl", credits: 4 },
  { name: "Stats 2", level: "fl", credits: 4 },
  { name: "Python", level: "fl", credits: 4 },
  { name: "English 2", level: "fl", credits: 4 },
  { name: "DBMS", level: "dp", credits: 4 },
  { name: "PDSA", level: "dp", credits: 4 },
  { name: "MAD 1", level: "dp", credits: 4 },
  { name: "Java", level: "dp", credits: 4 },
  { name: "MAD 2", level: "dp", credits: 4 },
  { name: "System Commands", level: "dp", credits: 3 },
  { name: "MAD 1 Project", level: "dp", credits: 2 },
  { name: "MAD 2 Project", level: "dp", credits: 2 },
  { name: "MLF", level: "ds", credits: 4 },
  { name: "MLT", level: "ds", credits: 4 },
  { name: "MLP", level: "ds", credits: 4 },
  { name: "BDM", level: "ds", credits: 4 },
  { name: "BA", level: "ds", credits: 4 },
  { name: "TDS", level: "ds", credits: 3 },
  { name: "BDM Project", level: "ds", credits: 2 },
  { name: "MLP Project", level: "ds", credits: 2 },
  { name: "SE", level: "dg", credits: 4 },
  { name: "ST", level: "dg", credits: 4 },
  { name: "AI", level: "dg", credits: 4 },
  { name: "DL", level: "dg", credits: 4 },
  { name: "SPG", level: "dg", credits: 4 }
];

let customCourses = [];

const toggleButton = document.getElementById('themeToggle');
toggleButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
  toggleButton.textContent = document.body.classList.contains('dark-theme') ? '☀️ Light Mode' : '🌙 Dark Mode';
});

function createGradeOptions(selected = "") {
  return ['<option value="">--</option>'].concat(Object.keys(gradePoints).map(g =>
    `<option value="${g}" ${selected === g ? "selected" : ""}>${g}</option>`
  )).join("");
}

function updateGrade(course, grade) {
  const data = JSON.parse(localStorage.getItem("grades") || "{}");
  data[course] = grade;
  localStorage.setItem("grades", JSON.stringify(data));
  loadPage();
}

function calcOverallCgpa(data) {
  let totalCredits = 0, totalPoints = 0;

  const allCourses = [...courses, ...customCourses];
  allCourses.forEach(({ name, credits }) => {
    const grade = data[name];
    if (grade in gradePoints) {
      totalCredits += credits;
      totalPoints += gradePoints[grade] * credits;
    }
  });

  return totalCredits ? (totalPoints / totalCredits).toFixed(2) : "0.00";
}

function getSelectedLevels() {
  return Array.from(document.querySelectorAll(".levelFilter:checked")).map(cb => cb.value);
}

function resetGrades() {
  showResetMessage("Are you sure you want to clear all saved data?", () => {
    localStorage.removeItem("grades");
    customCourses = [];
    loadPage();
  });
}

function showResetMessage(text, onConfirm) {
  const modal = document.getElementById("confirm-modal");
  const textEl = document.getElementById("confirm-text");
  const okBtn = document.getElementById("confirm-ok");
  const cancelBtn = document.getElementById("confirm-cancel");

  textEl.textContent = text;
  modal.style.display = "flex";

  const cleanup = () => {
    modal.style.display = "none";
    okBtn.removeEventListener("click", confirmHandler);
    cancelBtn.removeEventListener("click", cancelHandler);
  };

  const confirmHandler = () => {
    onConfirm();
    cleanup();
  };

  const cancelHandler = () => {
    cleanup();
  };

  okBtn.addEventListener("click", confirmHandler);
  cancelBtn.addEventListener("click", cancelHandler);
}




async function addCourse() {
  const name = await showDialog("Course Name (optional):") || `Custom Elective ${customCourses.length + 1}`;
  const creditInput = await showDialog("Course Credit:");
  const credit = parseInt(creditInput);
  if (isNaN(credit) || credit <= 0) return showErrorMessage("Invalid credit value! Please enter a positive number.");

  const gradeInput = await showDialog("Your Grade (S/A/B/C/D/E):");
  if (!gradeInput) return showErrorMessage("Grade is required!");
  const grade = gradeInput.toUpperCase();
  if (!gradePoints[grade]) return showErrorMessage("Invalid grade! Use S, A, B, C, D, or E.");

  customCourses.push({ name, credits: credit, level: "de" });

  const data = JSON.parse(localStorage.getItem("grades") || "{}");
  data[name] = grade;
  localStorage.setItem("grades", JSON.stringify(data));

  loadPage();
}

function showDialog(title, placeholder = "") {
  return new Promise((resolve) => {
    const dialog = document.getElementById("custom-dialog");
    const input = document.getElementById("dialog-input");
    const titleEl = document.getElementById("dialog-title");

    titleEl.textContent = title;
    input.value = "";
    input.placeholder = placeholder;
    dialog.style.display = "flex";

    const onOk = () => {
      cleanup();
      dialog.style.display = "none";
      resolve(input.value.trim());
    };

    const onCancel = () => {
      cleanup();
      dialog.style.display = "none";
      resolve(null);
    };

    const cleanup = () => {
      okBtn.removeEventListener("click", onOk);
      cancelBtn.removeEventListener("click", onCancel);
    };

    const okBtn = document.getElementById("dialog-ok");
    const cancelBtn = document.getElementById("dialog-cancel");

    okBtn.addEventListener("click", onOk);
    cancelBtn.addEventListener("click", onCancel);
  });
}

function showErrorMessage(text) {
  const modal = document.getElementById("message-modal");
  const box = document.getElementById("message-box");
  const textEl = document.getElementById("message-text");
  const closeBtn = document.getElementById("message-close");

  textEl.textContent = text;
  modal.style.display = "flex";

  const close = () => {
    modal.style.display = "none";
    closeBtn.removeEventListener("click", close);
  };

  closeBtn.addEventListener("click", close);
}





function loadPage() {
  const saved = JSON.parse(localStorage.getItem("grades") || "{}");
  const academicBody = document.getElementById("academicBody");
  const projectBody = document.getElementById("projectBody");
  const searchText = document.getElementById("searchBar").value.toLowerCase();
  const selectedLevels = getSelectedLevels();

  academicBody.innerHTML = "";
  projectBody.innerHTML = "";

  courses.forEach(({ name, level, credits }) => {
    if (selectedLevels.includes(level) && name.toLowerCase().includes(searchText)) {
      const row = `<tr>
        <td>${name}</td>
        <td><select onchange="updateGrade('${name}', this.value)">${createGradeOptions(saved[name] || "")}</select></td>
      </tr>`;
      if (credits > 2) academicBody.innerHTML += row;
      else projectBody.innerHTML += row;
    }
  });

  if (selectedLevels.includes("de")) {
    customCourses.forEach(({ name, credits }) => {
      const row = `<tr>
        <td>${name}</td>
        <td><select onchange="updateGrade('${name}', this.value)">${createGradeOptions(saved[name] || "")}</select></td>
      </tr>`;
      if (credits > 2) academicBody.innerHTML += row;
      else projectBody.innerHTML += row;
    });
  }

  document.getElementById("overallCgpa").textContent = calcOverallCgpa(saved);

  document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('drawerNav').classList.toggle('open');
  });

  const addBtn = document.querySelector(".addbutton");
  if (addBtn) addBtn.style.display = selectedLevels.includes("de") ? "inline-block" : "none";
}

window.onload = loadPage;
