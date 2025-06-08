
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
    
    
    chrome.storage.local.get(['timerStartTime', 'timerDuration'], (result) => {
      const now = Date.now();
      const startTime = result.timerStartTime;
      const duration = result.timerDuration || 90;
      
      if (startTime) {
        
        const elapsed = Math.floor((now - startTime) / 1000);
        timeLeft = Math.max(0, duration - elapsed);
        
        if (timeLeft <= 0) {
          
          chrome.storage.local.clear();
          window.close();
          return;
        }
      } else {
        
        timeLeft = 90;
        chrome.storage.local.set({
          timerStartTime: now,
          timerDuration: 90
        });
      }
      
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
    });
  }
  
  function stopCountdown() {
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
    
    chrome.storage.local.remove(['timerStartTime', 'timerDuration']);
    countdownElement.style.display = 'none';
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

      const savedData = formData; 
      generateQRCode(savedData);
      
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

  
  chrome.storage.local.get(['timerStartTime', 'timerDuration'], (result) => {
    if (result.timerStartTime && formElement && formElement.style.display === 'flex') {
      startCountdown();
    }
  });

  
  if (boton) {
    boton.addEventListener('click', () => {
      stopCountdown();
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
      stopCountdown();
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
        const filename = `Tus-Datos-de-Salud-${dateStr}.txt`;
        
        
        const formatData = (data, level = 0) => {
          const indent = '  '.repeat(level);
          let output = '';
          
          if (typeof data === 'object' && data !== null) {
            if (Array.isArray(data)) {
              data.forEach((item, index) => {
                output += `${indent}${index + 1}. ${formatData(item, level + 1)}\n`;
              });
            } else {
              Object.entries(data).forEach(([key, value]) => {
                const friendlyKey = key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, str => str.toUpperCase())
                  .replace(/_/g, ' ');
                
                if (typeof value === 'object' && value !== null) {
                  output += `${indent}${friendlyKey}:\n`;
                  output += formatData(value, level + 1);
                } else {
                  output += `${indent}${friendlyKey}: ${value || 'No especificado'}\n`;
                }
              });
            }
          } else {
            output += `${data || 'No especificado'}`;
          }
          
          return output;
        };
        
        
        let content = `TUS DATOS DE SALUD - ${now.toLocaleString('es-ES')}\n\n`;
        content += `REGISTROS:\n`;
        content += `${formatData(result.savedFormData)}\n\n`;
        content += `www.experienciaPaciente.org - Tu salud, fuera del círculo\n`;
        
        const dataBlob = new Blob([content], { type: 'text/plain;charset=utf-8' });
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
        
        const formattedText = formatDataText(result.savedFormData) + '\n'; 

        navigator.clipboard.writeText(formattedText)
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
    
  const validationToggle = document.getElementById('validationToggle');
  const professionalFields = document.getElementById('professionalFields');

  if (validationToggle && professionalFields) {
    professionalFields.style.display = validationToggle.checked ? 'block' : 'none';
    
    validationToggle.addEventListener('change', function() {
      professionalFields.style.display = this.checked ? 'block' : 'none';
      attachButton.disabled = !this.checked;

    });
  }
});

function formatDataText(formData) {
  const now = new Date();
  const formattedDate = now.toLocaleDateString('es-AR') + ' ' + now.toLocaleTimeString('es-AR');
  
  let formattedText = `TUS DATOS DE SALUD - ${formattedDate}\n\n`;
  for (const [key, value] of Object.entries(formData)) {
    formattedText += `${key}: ${value}\n`;
  }
  formattedText += `\nwww.experienciaPaciente.org - Tu salud, fuera del círculo`;
  
  return formattedText;
}

function fallbackQRGeneration(qrcodeElement, qrText) {
  const img = document.createElement('img');
  img.src = `https://chart.googleapis.com/chart?cht=qr&chs=160x160&chl=${encodeURIComponent(qrText)}&choe=UTF-8&chld=H|4`;
  img.alt = 'Código QR';
  img.style.maxWidth = '160px';
  img.style.maxHeight = '160px';
  img.onerror = () => {
    qrcodeElement.innerHTML = '<p>Error generando código QR</p>';
  };
  
  qrcodeElement.appendChild(img);
}

function generateQRCode(formData) {
  const qrcodeElement = document.getElementById('qrcode');
  if (!qrcodeElement) return;
  qrcodeElement.innerHTML = '';
  
  const qrText = formatDataText(formData);
  
  if (typeof QRCode === 'function') {
    try {
      setTimeout(() => {
        new QRCode(qrcodeElement, {
          text: qrText,
          width: 160,
          height: 160,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H
        });
      }, 50);
    } catch (error) {
      fallbackQRGeneration(qrcodeElement, qrText);
    }
  } else {
    fallbackQRGeneration(qrcodeElement, qrText);
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

    const successMsg = document.getElementById('successMsg');
    if (successMsg) {
      successMsg.style.display = 'flex';
    }
  }
}