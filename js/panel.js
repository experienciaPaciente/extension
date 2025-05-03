// @ts-nocheck
document.addEventListener('DOMContentLoaded', () => {
  const boton = document.getElementById("resetData");
  const homeBtn = document.getElementById('navForm');
  const exitBtn = document.getElementById('exitBtn');
  let countdownInterval = null;
  let timeLeft = 120;
  
  const countdownElement = document.createElement('div');
  countdownElement.id = 'countdown';
  countdownElement.classList.add('panel__countdown');
  countdownElement.style.display = 'none';
  
  const timerElement = document.getElementById('timer');
  if (timerElement) {
    timerElement.appendChild(countdownElement);
  }
  
  const homeElement = document.getElementById('home');
  const formElement = document.getElementById('form');
  
  if (homeElement) {
    homeElement.style.display = 'flex';
  }
  
  if (formElement) {
    formElement.style.display = 'none';
  }
  
  const successMsg = document.getElementById('successMsg');
  const errorMsg = document.getElementById('errorMsg');
  
  if (successMsg) {
    successMsg.style.display = 'none';
  }
  
  if (errorMsg) {
    errorMsg.style.display = 'none';
  }

  function startCountdown() {
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }
    
    timeLeft = 60;
    countdownElement.style.display = 'block';
    updateCountdownDisplay();
    
    countdownInterval = setInterval(() => {
      timeLeft--;
      updateCountdownDisplay();
      
      if (timeLeft <= 0) {
        if (countdownInterval) {
          clearInterval(countdownInterval);
        }        
        chrome.storage.local.clear();
        window.close();
      }
    }, 1000);
  }
  
  function updateCountdownDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    countdownElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    
    if (timeLeft <= 30) {
      countdownElement.style.color = '#ff8c00';
    } else {
      countdownElement.style.color = '';
    }
  }

  chrome.storage.local.get('savedFormData', (result) => {
    const formData = result.savedFormData;
    const output = document.getElementById('outputContainer');
    
    if (formData && output) {
      output.innerHTML = '';
      
      for (const key in formData) {
        const label = document.createElement('label');
        label.textContent = key;
        const paragraph = document.createElement('p');
        paragraph.textContent = formData[key];
        output.appendChild(label);
        output.appendChild(paragraph);
      }

      const savedData = JSON.stringify(formData);
      const url = 'https://chart.googleapis.com/chart?cht=qr&chs=120x120&chl=' + encodeURIComponent(savedData);
      generateQRCode(url);
      
      if (successMsg) {
        successMsg.style.display = 'flex';
      }

      if (homeBtn) {
        homeBtn.removeAttribute('disabled');
      }
      
    } else {
      const dataContainer = document.getElementById('dataContainer');
      if (dataContainer) {
        dataContainer.textContent = 'No data saved.';
      }
      
      const downloadBtn = document.getElementById('download');
      if (downloadBtn) {
        downloadBtn.style.display = 'none';
      }
      
      if (errorMsg) {
        errorMsg.style.display = 'flex';
      }
    }
  });

  // Event listeners
  if (boton) {
    boton.addEventListener('click', () => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownElement.style.display = 'none';
      }
      chrome.storage.local.clear();
      window.close();
    });
  }

  if (homeBtn) {
    homeBtn.addEventListener('click', () => {
      if (formElement && homeElement) {
        formElement.style.display = 'flex';
        homeElement.style.display = 'none';
        startCountdown();
      }
    });
  }
  
  if (exitBtn) {
    exitBtn.addEventListener('click', () => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
      chrome.storage.local.clear();
      window.close();
    });    
  }
  
  const downloadData = document.getElementById('downloadData');
  if (downloadData) {
    downloadData.addEventListener('click', (e) => {
      e.preventDefault();
      
      chrome.storage.local.get('savedFormData', (result) => {
        if (!result.savedFormData) {
          alert('No hay datos para descargar');
          return;
        }

        const now = new Date();
        const dateStr = now.toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19);
        const filename = `Tu-Salud-${dateStr}.txt`;
        
        const enrichedData = {
          timestamp: now.toISOString(),
          exportDate: dateStr,
          data: result.savedFormData
        };
        
        const dataStr = JSON.stringify(enrichedData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'text/plain' });
        const url = URL.createObjectURL(dataBlob);
        
        downloadData.href = url;
        downloadData.setAttribute('download', filename);

        const tempLink = document.createElement('a');
        tempLink.href = url;
        tempLink.download = filename;
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
          
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 100);
      });
    });
  }
    
  const copyBtn = document.getElementById('copyData');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      chrome.storage.local.get('savedFormData', (result) => {
        if (!result.savedFormData) {
          alert('No hay datos para copiar');
          return;
        }
        
        const now = new Date();
        const dateStr = now.toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19);
        
        const enrichedData = {
          timestamp: now.toISOString(),
          exportDate: dateStr,
          data: result.savedFormData
        };
        
        const dataStr = JSON.stringify(enrichedData, null, 2);
        
        navigator.clipboard.writeText(dataStr)
          .then(() => {
            const originalImg = copyBtn.querySelector('img').src;
            copyBtn.innerHTML = `<span class="panel__badge--success">Copiado</span>`;
            
            setTimeout(() => {
              copyBtn.innerHTML = `<img class="icon__wrapper" src="${originalImg}" alt="">`;
            }, 2000);
          })
          .catch(err => {
            console.error('Error al copiar: ', err);
            alert('Error al copiar los datos');
          });
      });
    });
  }

  if (formElement && formElement.style.display === 'flex') {
    startCountdown();
  }
  
  const attachButton = document.getElementById('attachProfessionalData');
  if (attachButton) {
    attachButton.addEventListener('click', () => {
      const dniProfesional = document.getElementById('dniProfesional');
      const nombreInstitucion = document.getElementById('nombreInstitucion');
      
      if (!dniProfesional || !nombreInstitucion) return;
      
      if (!dniProfesional.value) {
        alert('Por favor ingrese un DNI válido');
        dniProfesional.focus();
        return;
      }
      
      if (!nombreInstitucion.value) {
        alert('Por favor ingrese el nombre de la institución');
        nombreInstitucion.focus();
        return;
      }
      
      chrome.storage.local.get('savedFormData', (result) => {
        let formData = result.savedFormData || {};
        
        formData['DNI del profesional'] = dniProfesional.value;
        formData['Nombre de la Institución'] = nombreInstitucion.value;
        formData['Validado'] = 'Sí';
        
        chrome.storage.local.set({ 'savedFormData': formData }, () => {
          alert('Datos profesionales adjuntados correctamente');
          updateDisplayedData(formData);
        });
      });
    });
  }
  
  // Validation toggle
  const validationToggle = document.getElementById('validationToggle');
  const professionalFields = document.getElementById('professionalFields');

  if (validationToggle && professionalFields) {
    professionalFields.style.display = validationToggle.checked ? 'block' : 'none';
    
    validationToggle.addEventListener('change', function() {
      professionalFields.style.display = this.checked ? 'block' : 'none';
    });
  }
});

function generateQRCode(url) {
  const qrcodeElement = document.getElementById('qrcode');
  if (qrcodeElement) {
    qrcodeElement.innerHTML = '';
    
    if (typeof QRCode === 'function') {
      new QRCode(qrcodeElement, {
        text: url,
        width: 150,
        height: 150
      });
    } else {
      console.error('QRCode library not loaded');
    }
  }
}

function updateDisplayedData(formData) {
  const output = document.getElementById('outputContainer');
  if (output) {
    output.innerHTML = '';
    
    for (const key in formData) {
      const label = document.createElement('label');
      label.textContent = key;
      const paragraph = document.createElement('p');
      paragraph.textContent = formData[key];
      output.appendChild(label);
      output.appendChild(paragraph);
    }
    
    const savedData = JSON.stringify(formData);
    const url = 'https://chart.googleapis.com/chart?cht=qr&chs=120x120&chl=' + encodeURIComponent(savedData);
    generateQRCode(url);
    
    const successMsg = document.getElementById('successMsg');
    if (successMsg) {
      successMsg.style.display = 'flex';
    }
  }
}