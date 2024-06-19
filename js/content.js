function saveFormData(event) {
  event.preventDefault(); // Prevent the default form submission

  const formElements = event.target.elements;
  const formData = {};

  for (let element of formElements) {
    if (element.name) {
      formData[element.name] = element.value;
    }
  }

  // Save form data to chrome.storage
  chrome.storage.local.set({ savedFormData: formData }, () => {
    console.log('Form data saved to chrome.storage');
    alert('Form data saved to localStorage');
  });
}

document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', saveFormData);
});
