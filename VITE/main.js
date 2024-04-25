import './style.css';

const form = document.querySelector('form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
    showSpinner();
    const data = new FormData(form);

    const response = await fetch(import.meta.env.VITE_API + '/dream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: data.get('prompt') }),
    });
    
    if (response.ok) {
      const base64Data = await response.text();
      const binaryData = atob(base64Data);
      const bytes = new Uint8Array(binaryData.length);
    
      for (let i = 0; i < binaryData.length; i++) {
        bytes[i] = binaryData.charCodeAt(i);
      }
    
      const blob = new Blob([bytes], { type: 'image/webp' });
      const blobUrl = URL.createObjectURL(blob);
    
      const result = document.querySelector('#result');
      result.innerHTML = `<img src="${blobUrl}" width="512" />`;
    } else {
      const err = await response.text();
      alert(err);
      console.error(err);
    }

    hideSpinner();

});

function showSpinner() {
  const button = document.querySelector('button');
  button.disabled = true;
  button.innerHTML = 'Dreaming... <span class="spinner">🧠</span>';
}

function hideSpinner() {
  const button = document.querySelector('button');
  button.disabled = false;
  button.innerHTML = 'Dream';
}
