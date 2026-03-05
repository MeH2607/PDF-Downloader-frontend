
  
document.querySelector('.upload').addEventListener('submit', function(e) {
    e.preventDefault();

    const fileInput = e.target.uploadFile;
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file.");
        return;
    }

    const formData = new FormData();
    formData.append('file', file);   // Must match @RequestParam("file")

    fetch('http://localhost:8080/pdf/upload-excel', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.errors) {
            alert(data.errors);
        } else {
            console.log("Success:", data);
            getDownloadStatus();
        }
    })
    
    .catch(error => {
        console.error("Error:", error);
    });
});


function getDownloadStatus(){
    fetch('http://localhost:8081/pdf/getStatusList', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if (data.errors) {
            alert(data.errors);
        } else {
            console.log("Success:", data);
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
}
  
