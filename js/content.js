// @ts-nocheck
function saveFormData(event) {
  event.preventDefault(); // Prevent form submission

  const formElements = event.target.elements;
  const formData = {};

  for (let element of formElements) {
    if (element.name) {
      formData[element.name] = element.value;
    }
  }

  chrome.storage.local.set({ savedFormData: formData }, () => {
    if (chrome.runtime.lastError) {
      document.getElementById('errorMsg').style.display = 'block';
      console.error('Error saving data:', chrome.runtime.lastError);
    } else {
      console.log('Data saved successfully:', formData);
      document.getElementById('successMsg').style.display = 'block';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', saveFormData);
  });
});