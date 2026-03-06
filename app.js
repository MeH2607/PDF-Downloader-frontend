

document.querySelector('.upload').addEventListener('submit', function (e) {
    e.preventDefault();

    const fileInput = e.target.uploadFile;
    const file = fileInput.files[0];

    var submitBtn = document.getElementById('submitBtn');
    var table = document.getElementById('resultTable');
    var spinner = document.querySelector('.loader');


    if (table.style.display != "block") {
        table.style.display = "none"; // hide the table by default and when pressing the button
    }


    
        spinner.style.display = "block";
    


    if (!file) {
        alert("Please select a file.");
        return;
    }



    const formData = new FormData();
    formData.append('file', file);   // Must match @RequestParam("file")

    submitBtn.textContent = "processing...";
    submitBtn.disabled = true;

    fetch('http://localhost:8081/pdf/upload-excel', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.errors) {
                spinner.style.display = "none";
                submitBtn.textContent = "Submit";
                submitBtn.disabled = false;



                alert(data.errors);
            } else {
                console.log("Success:", data);

                spinner.style.display = "none";

                submitBtn.textContent = "Submit"; // or whatever your original text is
                submitBtn.disabled = false;

                getDownloadStatus();
            }
        })

        .catch(error => {
            submitBtn.textContent = "Submit";
            submitBtn.disabled = false;
            console.error("Error:", error);
        });
});


function getDownloadStatus() {

    const table = document.getElementById('resultTable');
    const tableBody = document.getElementById('tableBody');

    fetch('http://localhost:8081/pdf/getCache')
        .then(response => response.json())
        .then(data => {

            console.log("Success:", data);

            if (!Array.isArray(data)) {
                console.error("Unexpected response:", data);
                return;
            }

           

            tableBody.innerHTML = "";

            let html = '';
            let titleSet = false;
            data.forEach(item => {

                if(data.filePath != null && !titleSet) {
                    document.getElementById('tableTitle').innerHTML = `Files saved on: ${getFolderPath(item.filePath)}`;
                    titleSet = true;
                } //TODO fix

                html += `
                    <tr>
                        <td>${item.fileName}</td>
                        <td>${item.isDownloaded ? "Yes" : "No"}</td>
                    </tr>
                `;
            });

            tableBody.innerHTML = html;

                        document.getElementById('tableTitle').innerHTML = `Files saved on: ${getFolderPath(data[0]?.filePath)}`;


            if (table.style.display === "none") {
                table.style.display = "block";
            }

        })
        .catch(error => {
            console.error("Error:", error);
            alert("Failed to fetch download status.");
        });
}

function getFolderPath(fullPath) {
    if (!fullPath) return "";

    // Normalize slashes for Windows and Unix
    const normalizedPath = fullPath.replace(/\\/g, '/');

    // Find the index of the folder you want to keep (e.g., /Downloads/Reports)
    const folderIndex = normalizedPath.toLowerCase().indexOf("/downloads/reports");

    let folderPath;
    if (folderIndex !== -1) {
        // Take from /Downloads/Reports onward
        folderPath = normalizedPath.substring(folderIndex);
    } else {
        // fallback: take parent folder
        const lastSlash = normalizedPath.lastIndexOf('/');
        folderPath = lastSlash !== -1 ? normalizedPath.substring(0, lastSlash) : normalizedPath;
    }

    // Ensure filename is removed: remove everything after the last slash
    const lastSlash = folderPath.lastIndexOf('/');
    if (lastSlash !== -1) {
        folderPath = folderPath.substring(0, lastSlash);
    }

    return folderPath;
}