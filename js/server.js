function generateqr() {
    var name = document-getElementById ('name').value;
    var email = document -getElementById('email').value;
    var subject = document-getElementById('subject') .value;
    var message = document-getElementById( 'message'). value;
    console. log('Name: ' + name + " " + email + " " + subject + " " + message);
    var url = "https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=Name:" +
    name + " Email:" + email + " Subject:" + subject + " Message: " + message;
    var ifr = '<iframe src="$(url)" height="200" width="200></iframe>';
}

document.getElementById('qrcode').innerHTML = ifr;

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

