function saveFormData(event) {
  // event.preventDefault();

  const formElements = event.target.elements;
  const formData = {};

  for (let element of formElements) {
    if (element.name) {
      formData[element.name] = element.value;
    }
  }

  // Save form data to chrome.storage
  chrome.storage.local.set({ savedFormData: formData }, () => {
    console.log(formData);
    alert('Datos guardados exitosamente');
  });
}

document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', saveFormData);
});
