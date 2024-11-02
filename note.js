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
