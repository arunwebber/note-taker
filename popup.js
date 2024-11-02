let noteWindow; // Variable to hold the reference to the popup window

document.getElementById("newNoteButton").addEventListener("click", function() {
    noteWindow = window.open("note.html", "New Note", "width=400,height=300");
});

document.getElementById("viewNotesButton").addEventListener("click", function() {
    document.getElementById("noteContainer").style.display = "none";
    document.getElementById("notesList").style.display = "block";
    document.getElementById("editNoteContainer").style.display = "none";
    displayNotes();
});

document.getElementById("saveNoteButton").addEventListener("click", function() {
    const title = document.getElementById("noteTitleInput").value;
    const content = document.getElementById("noteInput").value;
    if (title.trim() !== "" && content.trim() !== "") {
        saveNote(title, content);
        document.getElementById("noteTitleInput").value = ""; // Clear title input
        document.getElementById("noteInput").value = ""; // Clear content input
    }
});

// Add event listener for search bar
document.getElementById("searchBar").addEventListener("input", function() {
    const searchTerm = this.value.toLowerCase();
    filterNotes(searchTerm);
});

function saveNote(title, content) {
    chrome.storage.local.get({ notes: [] }, function(result) {
        const notes = result.notes;
        // Prepend the new note to the beginning of the array
        notes.unshift({ title, content });
        chrome.storage.local.set({ notes: notes }, function() {
            console.log("Note saved.");
            if (noteWindow) {
                noteWindow.close(); // Close the popup window after saving
            }
            displayNotes(); // Refresh notes display
        });
    });
}

function displayNotes() {
    chrome.storage.local.get({ notes: [] }, function(result) {
        const notes = result.notes;
        const notesList = document.getElementById("notes");
        notesList.innerHTML = ""; // Clear existing notes

        // Display notes in reverse order
        for (let i = notes.length - 1; i >= 0; i--) {
            const note = notes[i];
            const listItem = document.createElement("li");
            listItem.textContent = note.title;
            listItem.addEventListener("click", function() {
                openNoteForEditing(i); // Pass the correct index for editing
            });
            notesList.appendChild(listItem);
        }
    });
}

function filterNotes(searchTerm) {
    const notesList = document.getElementById("notes");
    const notesItems = notesList.getElementsByTagName("li");

    for (let i = 0; i < notesItems.length; i++) {
        const noteTitle = notesItems[i].textContent.toLowerCase();
        if (noteTitle.includes(searchTerm)) {
            notesItems[i].style.display = ""; // Show matching note
        } else {
            notesItems[i].style.display = "none"; // Hide non-matching note
        }
    }
}

function openNoteForEditing(index) {
    chrome.storage.local.get({ notes: [] }, function(result) {
        const notes = result.notes;
        const note = notes[index];

        noteWindow = window.open("note.html", "Edit Note", "width=400,height=300");
        
        noteWindow.onload = function() {
            noteWindow.document.getElementById("titleField").value = note.title;
            noteWindow.document.getElementById("textArea").value = note.content;

            noteWindow.document.getElementById("saveButton").onclick = function() {
                saveEditedNoteToStorage(index, noteWindow.document.getElementById("titleField").value, noteWindow.document.getElementById("textArea").value);
            };
        };
    });
}

function saveEditedNoteToStorage(index, title, content) {
    chrome.storage.local.get({ notes: [] }, function(result) {
        const notes = result.notes;
        
        if (title.trim() !== "" && content.trim() !== "") {
            notes[index] = { title, content }; // Replace existing note
            chrome.storage.local.set({ notes: notes }, function() {
                console.log("Note updated.");
                noteWindow.close(); // Close the editing window after saving
                displayNotes(); // Refresh the notes list
            });
        } else {
            alert("Title and content cannot be empty!"); // Alert if inputs are empty
        }
    });
}
