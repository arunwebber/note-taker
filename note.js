document.addEventListener('DOMContentLoaded', function() {
    console.log('Script loaded'); // Check if this shows up

    document.getElementById('saveButton').addEventListener('click', function() {
        const title = document.getElementById("titleField").value; // Use the correct ID
        const content = document.getElementById("textArea").value; // Use the correct ID

        // Check if title and content are not empty
        if (title.trim() !== "" && content.trim() !== "") {
            saveNoteToStorage(title, content);
        } else {
            alert("Title and content cannot be empty!"); // Alert user if input is empty
        }
    });

    function saveNoteToStorage(title, content) {
        chrome.storage.local.get({ notes: [] }, function(result) {
            const notes = result.notes;
            notes.push({ title, content });
            chrome.storage.local.set({ notes: notes }, function() {
                console.log("Note saved.");
                window.close(); // Close the window after saving
            });
        });
    }
});

// Character count and cursor position tracking
const textArea = document.getElementById('textArea');
const statusBar = document.createElement('div');
statusBar.className = 'status-bar';
statusBar.textContent = 'Characters: 0 | Position: Line 1, Col 1';
document.getElementById('container').appendChild(statusBar);

textArea.addEventListener('input', updateStatus);
textArea.addEventListener('keyup', updateStatus);
textArea.addEventListener('click', updateStatus);

function updateStatus() {
    const text = textArea.value;
    const charCount = text.length;

    const { line, col } = getCursorPosition(textArea);

    // Update the status bar with character count and cursor position
    statusBar.textContent = `Characters: ${charCount} | Position: Line ${line}, Col ${col}`;
}

function getCursorPosition(textarea) {
    const text = textarea.value;
    const cursorIndex = textarea.selectionStart;

    const lines = text.substr(0, cursorIndex).split("\n");
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1; // +1 because columns are 1-indexed

    return { line, col };
}

// Initial status update
updateStatus();

