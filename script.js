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
    courses.forEach(({ name, credits }) => {
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
    if (confirm("Are you sure you want to clear all saved data?")) {
      localStorage.removeItem("grades");
      loadPage();
    }
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
        if (credits > 2) {
          academicBody.innerHTML += row;
        } else {
          projectBody.innerHTML += row;
        }
      }
    });

    document.getElementById("overallCgpa").textContent = calcOverallCgpa(saved);
  }

  window.onload = loadPage;