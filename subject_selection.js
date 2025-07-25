
const studentName = localStorage.getItem("studentName");
    if (studentName) {
     document.getElementById("greeting").innerText = `Hello, ${studentName}! Select a subject to begin.`;
     } else {
     window.location.href = "name-entry.html"; // Redirect back if no name
    }