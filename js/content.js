function saveFormData(event) {
  event.preventDefault(); // Evita que la página se recargue

  const formElements = event.target.elements;
  const formData = {};

  for (let element of formElements) {
    if (element.name) {
      formData[element.name] = element.value;
    }
  }

  // Save form data to chrome.storage
  chrome.storage.local.set({ savedFormData: formData }, () => {
    if (chrome.runtime.lastError) {
      console.error('Error al guardar:', chrome.runtime.lastError);
      document.getElementById('errorMsg').style.display = 'block';
      alert('Error al guardar los datos');
    } else {
      console.log(formData);
      document.getElementById('successMsg').style.display = 'block';
      alert('Datos guardados exitosamente');
    }
  });
}

document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', saveFormData);
});