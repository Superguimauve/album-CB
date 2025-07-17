const container = document.getElementById("note-container");
const adminPanel = document.getElementById("admin-panel");
const dashboardBtn = document.getElementById("dashboard-btn");
const passwordPopup = document.getElementById("password-popup");

let isAdmin = false;

function loadNotes() {
  const notes = JSON.parse(localStorage.getItem("notes") || "[]");
  container.innerHTML = "";

  notes.forEach((note, index) => {
    const div = document.createElement("div");
    div.className = "note";

    if (note.type === "image") {
      div.innerHTML = \`
        <img src="\${note.content}" alt="Image" />
        <textarea onchange="updateNote(\${index}, this.value)">\${note.text || ""}</textarea>
        \${isAdmin ? '<div class="actions"><button onclick="deleteNote(' + index + ')">supprimer</button></div>' : ""}
      \`;
    } else if (note.type === "video") {
      div.innerHTML = \`
        <video src="\${note.content}" controls></video>
        <textarea onchange="updateNote(\${index}, this.value)">\${note.text || ""}</textarea>
        \${isAdmin ? '<div class="actions"><button onclick="deleteNote(' + index + ')">supprimer</button></div>' : ""}
      \`;
    }

    container.appendChild(div);
  });
}

function updateNote(index, text) {
  const notes = JSON.parse(localStorage.getItem("notes") || "[]");
  notes[index].text = text;
  localStorage.setItem("notes", JSON.stringify(notes));
}

function deleteNote(index) {
  const notes = JSON.parse(localStorage.getItem("notes") || "[]");
  notes.splice(index, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  loadNotes();
}

function addFiles() {
  const input = document.getElementById("fileInput");
  const files = input.files;
  const notes = JSON.parse(localStorage.getItem("notes") || "[]");

  for (const file of files) {
    const reader = new FileReader();
    reader.onload = function (e) {
      notes.push({
        type: file.type.startsWith("video") ? "video" : "image",
        content: e.target.result,
        text: ""
      });
      localStorage.setItem("notes", JSON.stringify(notes));
      loadNotes();
    };
    reader.readAsDataURL(file);
  }
}

function checkPassword() {
  const input = document.getElementById("password-input");
  if (input.value === "cb2025") {
    isAdmin = true;
    adminPanel.style.display = "block";
    passwordPopup.style.display = "none";
    loadNotes();
  } else {
    alert("Mot de passe incorrect");
  }
}

dashboardBtn.onclick = () => {
  passwordPopup.style.display = "flex";
};

loadNotes();