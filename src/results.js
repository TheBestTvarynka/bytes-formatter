
const createResultElement = text => {
  const id = +(new Date());

  const value = document.createElement('span');
  value.innerText = text;

  // copy
  const copyImg = document.createElement('img');
  copyImg.src = '../img/copy.png';

  const copy = document.createElement('div');
  copy.className = 'tool';
  copy.appendChild(copyImg);
  copy.addEventListener('click', async () => {
    await navigator.clipboard.writeText(text);
    showNotification({ text: 'Output copied', type: 'info' });
  });

  // take
  const takeImg = document.createElement('img');
  takeImg.src = '../img/grab.png';
  
  const take = document.createElement('div');
  take.className = 'tool';
  take.appendChild(takeImg);
  take.addEventListener('click', () => document.getElementById('inData').value = text);

  // delete
  const deleteImg = document.createElement('img');
  deleteImg.src = '../img/delete.png';

  const del = document.createElement('div');
  del.className = 'tool';
  del.appendChild(deleteImg);
  del.addEventListener('click', () => {
    const e = document.getElementById(id);
    e.remove();
  });

  const options = document.createElement('div');
  options.className = 'result-options';
  options.appendChild(copy);
  options.appendChild(take);
  options.appendChild(del);

  const element = document.createElement('div');
  element.className = 'result';
  element.id = id;
  element.appendChild(value);
  element.appendChild(options);

  return element;
};

const saveResultToLocalStorage = text => {
  const results = window.localStorage.getItem('results');

  if (results) {
    const parsedResults = JSON.parse(result);
    parsedResults.push(text);
    window.localStorage.setItem('result', JSON.stringify(results));
  } else {
    window.localStorage.setItem('result', JSON.stringify([text]));
  }
}

const saveToResults = () => {
  const value = document.getElementById('outData').value;

  if (!value) {
    return;
  }

  for (const result of document.getElementsByClassName('result')) {
    if (result.childNodes[0].innerText === value) {
      showNotification({ text: 'Already saved.', type: 'warn' });
      return;
    }
  }

  saveResultToLocalStorage(value);

  const resultsContainer = document.getElementById('resultsContainer');
  resultsContainer.appendChild(createResultElement(value));
};
