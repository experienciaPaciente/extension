function generateqr() {
    var name = document-getElementById (' name').value;
    var email = document -getElementById('email').value;
    var subject = document-getElementById('subject') .value;
    var message = document-getElementById( 'message'). value;
    console. log('Name: ' + name + " " + email + " " + subject + " " + message);
    var url = "https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=Name:" +
    name + " Email:" + email + " Subject:" + subject + " Message: " + message;
    var ifr = '<iframe src="$(url)" height="200" width="200></iframe>';
}

document.getElementById('qrcode').innerHTML = ifr;

// document.addEventListener('DOMContentLoaded', () => {
//   chrome.storage.local.get('savedFormData', (result) => {
//     const formData = result.savedFormData;

//     if (formData) {
//       const dataContainer = document.getElementById('dataContainer');
//       dataContainer.textContent = `Saved Data: ${JSON.stringify(formData)}`;

//       const url = 'http://localhost:4200/';
//       generateQRCode(url);

//       // Prepare download link
//       const downloadLink = document.getElementById('download');
//       const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(formData));
//       downloadLink.setAttribute("href", dataStr);
//       downloadLink.style.display = "block";
//     } else {
//       const dataContainer = document.getElementById('dataContainer');
//       dataContainer.textContent = 'No data saved.';
//       document.getElementById('download').style.display = 'none';
//     }
//   });
// });

// Add the formData to Firestore
const pushBtn = document.getElementById('shareData');
pushBtn.setAttribute('href', url);

  db.collection("pregunta-collection").add(formData)
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });

