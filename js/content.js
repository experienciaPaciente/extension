function saveFormData(event) {

  const formElements = event.target.elements;
  const formData = {};

  for (let element of formElements) {
    if (element.name) {
      formData[element.name] = element.value;
    }
  }

  // Save form data to chrome.storage
  if (chrome.storage.local.set({ savedFormData: formData }, () => {
    console.log(formData);
    document.getElementById('successMsg').style.display = 'block';
    alert('Datos guardados exitosamente');
  })); else {
    document.getElementById('errorMsg').style.display = 'block';
    alert('Error al guardar los datos');
  };
}

document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', saveFormData);
});
