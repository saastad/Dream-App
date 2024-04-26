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
  const jsonData = await response.json()
  const arrayBuffer = toArrayBuffer(jsonData.data)

  // Step 1: Convert buffer data into Uint8Array
  const uint8Array = new Uint8Array(arrayBuffer);
      
  console.log("uint8Array", uint8Array)

  // Step 2: Create a Blob from the Uint8Array
  const blob = new Blob([uint8Array], { type: 'image/webp' });
      
  // Step 3: Create a URL for the blob
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

function toArrayBuffer(buffer) {
  // Convert buffer to arrayBuffer
  const arrayBuffer = new ArrayBuffer(buffer.length);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return arrayBuffer;
}

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
