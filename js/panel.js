document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get('savedFormData', (result) => {
    const formData = result.savedFormData;

    if (formData) {
      // const dataContainer = document.getElementById('dataContainer');
      // dataContainer.textContent = `Saved Data: ${JSON.stringify(formData)}`;
      const savedData = JSON.stringify(formData);

      const parsedData = JSON.parse(savedData);
      for (const key in parsedData) {
        const output = document.getElementById('outputContainer')
        const label = document.createElement('label');
        label.textContent = key;
        const paragraph = document.createElement('p');
        paragraph.textContent = parsedData[key];
        output.appendChild(label);
        output.appendChild(paragraph);
      }

      const url = 'https://chart.googleapis.com/chart?cht=qr&chs=120x120&chl=' + savedData;
      generateQRCode(url);

      const badgeHolder = document.getElementById('badgeHolder');
      const badgeElement = document.createElement('small');
      badgeElement.classList.add('panel__badge--success');
      badgeContent.textContent = 'Registro creado';
      badgeHolder.appendChild(badgeElement);


      } else {
          const dataContainer = document.getElementById('dataContainer');
          dataContainer.textContent = 'No data saved.';
          document.getElementById('download').style.display = 'none';
        }
    })
  });

function generateQRCode(url) {
  const qrcode = new QRCode(document.getElementById('qrcode'), {
    text: url,
    width: 150,
    height: 150
  });
}

// Funciones secundarias
const shareBtn = document.getElementById('shareData');

shareBtn.addEventListener('click', () => {
  var message = "Este es el registro de tu consulta";
  var url = "http://www.experienciapaciente.org";
  var whatsappUrl = "https://wa.me/?text=" + encodeURIComponent(message + " " + url);
  window.open(whatsappUrl, "_blank");
});

// shareBtn.onclick = shareData();


const boton = document.getElementById("resetData");
const mensaje = document.querySelector('div.panel__container')

boton.addEventListener("click", () => {
  mensaje.textContent = 'Registro eliminado exitosamente';
  chrome.storage.local.clear();
  alert("Registro eliminado")
});
