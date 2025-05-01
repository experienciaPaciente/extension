document.addEventListener('DOMContentLoaded', () => {
  // Get element references
  const boton = document.getElementById("resetData");
  const mensaje = document.querySelector('div.panel__container');
  const homeBtn = document.getElementById('navForm');
  const shareBtn = document.getElementById('shareData');
  const exitBtn = document.getElementById('exitBtn');
  
  // Set initial visibility
  document.getElementById('home').style.display = 'flex';
  document.getElementById('form').style.display = 'none';
  
  // Hide messages initially
  if (document.getElementById('successMsg')) {
    document.getElementById('successMsg').style.display = 'none';
  }
  if (document.getElementById('errorMsg')) {
    document.getElementById('errorMsg').style.display = 'none';
  }

  // Load saved data
  chrome.storage.local.get('savedFormData', (result) => {
    const formData = result.savedFormData;

    if (formData) {
      const savedData = JSON.stringify(formData);
      const parsedData = JSON.parse(savedData);
      const output = document.getElementById('outputContainer');
      
      // Clear existing content
      output.innerHTML = '';
      
      for (const key in parsedData) {
        const label = document.createElement('label');
        label.textContent = key;
        const paragraph = document.createElement('p');
        paragraph.textContent = parsedData[key];
        output.appendChild(label);
        output.appendChild(paragraph);
      }

      const url = 'https://chart.googleapis.com/chart?cht=qr&chs=120x120&chl=' + encodeURIComponent(savedData);
      generateQRCode(url);
      
      if (document.getElementById('successMsg')) {
        document.getElementById('successMsg').style.display = 'flex';
      }

      const navFormBtn = document.getElementById('navForm');
      navFormBtn.removeAttribute('disabled');
      
    } else {
      const dataContainer = document.getElementById('dataContainer');
      if (dataContainer) {
        dataContainer.textContent = 'No data saved.';
      }
      
      const downloadBtn = document.getElementById('download');
      if (downloadBtn) {
        downloadBtn.style.display = 'none';
      }
      
      if (document.getElementById('errorMsg')) {
        document.getElementById('errorMsg').style.display = 'flex';
      }
    }
  });

  // Event listeners
  if (boton) {
    boton.addEventListener('click', () => {
      chrome.storage.local.clear();
      document.getElementById('home').style.display = 'flex';
      document.getElementById('form').style.display = 'none';
      alert("Registro eliminado");
    });
  }

  if (homeBtn) {
    homeBtn.addEventListener('click', () => {
      document.getElementById('form').style.display = 'flex';
      document.getElementById('home').style.display = 'none';
    });
  }
  
  if (exitBtn) {
    document.getElementById('exitBtn').addEventListener('click', () => {
      chrome.storage.local.clear();
      window.close();
    });    
  }

  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      var message = "Este es el registro de tu consulta";
      var url = "http://www.experienciapaciente.org";
      var whatsappUrl = "https://wa.me/?text=" + encodeURIComponent(message + " " + url);
      window.open(whatsappUrl, "_blank");
    });
  }
});

function generateQRCode(url) {
  const qrcodeElement = document.getElementById('qrcode');
  if (qrcodeElement) {
    // Clear previous QR code if any
    qrcodeElement.innerHTML = '';
    
    new QRCode(qrcodeElement, {
      text: url,
      width: 150,
      height: 150
    });
  }
}