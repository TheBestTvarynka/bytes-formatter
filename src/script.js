const fromBinary = data => {
  const bits = data
    .split('')
    .filter(c => c === '1' || c === '0')
    .map(n => parseInt(n, 2));
  let bytes = [];

  for (let i = 0; i < bits.length; i += 8) {
    const rawByte = bits.slice(i, i + 8).join('').padStart(8, '0');
    bytes.push(parseInt(rawByte, 2));
  }

  return new Uint8Array(bytes);
};

const fromDecimal = data => new Uint8Array(
  data
    .split(/\D/)
    .filter(e => e !== '')
    .map(e => {
      const n = +e;
      if (n > 255) {
        showNotification({ text: `Warn: too large byte value: ${n}`, type: 'warn' });
      }
      return n;
    })
);

const isHexChar = c => ('0' <= c && c <= '9') || ('a' <= c && c <= 'f');

const fromHex = data => new Uint8Array(
  data
    .toLowerCase()
    .split('')
    .filter(isHexChar)
    .join('')
    .match(/.{1,2}/g)
    .map(byte => parseInt(byte, 16))
);

const fromAscii = data => new Uint8Array(
  data.split('').map(c => c.charCodeAt(0))
);

const fromBase64 = data => {
  try {
    if (data.includes('_') || data.includes('-')) {
      showNotification({ text: 'Warning: invalid base64. Trying decode as url encoded base64', type: 'warn' });

      data = data.replaceAll('_', '/').replaceAll('-', '+');

      while (data.length % 4 != 0) {
        data += '=';
      }
    }
    const chars = window.atob(data);
    const len = chars.length;
    const bytes = new Uint8Array(chars.length);

    for (let i = 0; i < len; i++) {
      bytes[i] = chars.charCodeAt(i);
    }

    return bytes;
  } catch (e) {
    showNotification({ text: 'Error: invalid base64 input', type: 'error' });
    return new Uint8Array([]);
  }
};

const fromUtf8 = data => new TextEncoder().encode(data);

const fromUtf16 = data => {
  const toUtf16Bytes = c => {
    const hex = parseInt(c, 10).toString(16).padStart(4, '0');
    return [parseInt(hex.substring(0, 2), 16), parseInt(hex.substring(2), 16)];
  };

  let bytes = [];

  for (let i = 0, len = data.length; i < len; i++) {
    bytes = bytes.concat(toUtf16Bytes(data.charCodeAt(i)));
  }

  return new Uint8Array(bytes);
};

const parsers = {
  'binary': fromBinary,
  'decimal': fromDecimal,
  'hex': fromHex,
  'base64': fromBase64,
  'ascii': fromAscii,
  'utf-8': fromUtf8,
  'utf-16': fromUtf16,
};

const toBinary = data => {
  const binary = [];

  for (const byte of data) {
    binary.push(byte.toString(2).padStart(8, '0'));
  }

  return binary.join(' ');
};

const toDecimal = data => data.join(' ');

const toDecimalArray = data => '[' + data.join(', ') + ']';

const toHex = data => {
  const hex = [];

  for (const byte of data) {
    hex.push(byte.toString(16).padStart(2, '0'));
  }

  return hex.join('');
}

const toBase64 = data => window.btoa(String.fromCharCode(...data));

const toAscii = data => {
  const result = [];

  for (const byte of data) {
    result.push(String.fromCharCode(byte));
  }

  return result.join('');
};

const toUtf8 = data => (new TextDecoder().decode(data)).toString();

const toUtf16 = data => (new TextDecoder('utf-16').decode(data)).toString();

const formatters = {
  'binary': toBinary,
  'decimal': toDecimalArray,
  'hex': toHex,
  'base64': toBase64,
  'ascii': toAscii,
  'utf-8': toUtf8,
  'utf-16': toUtf16,
};

const saveInLocalStorage = () => {
  const inType = document.getElementById('inType').selectedOptions[0].value;
  const outType = document.getElementById('outType').selectedOptions[0].value;
  const inData = document.getElementById('inData').value;
  const autoConvert = document.getElementById('autoConvert').checked;

  window.localStorage.setItem('params', JSON.stringify({ inType, outType, inData, autoConvert }));
};

const loadFromLocalStorage = () => {
  const parameters = JSON.parse(window.localStorage.getItem('params'));

  if (!parameters) {
    return;
  }

  if (parameters['inType']) {
    document.getElementById('inType').value = parameters['inType'];
  }

  if (parameters['outType']) {
    document.getElementById('outType').value = parameters['outType'];
  }

  if (parameters['inData']) {
    document.getElementById('inData').value = decodeURIComponent(parameters['inData']);
  }

  if (parameters['autoConvert']) {
    document.getElementById('autoConvert').checked = parameters['autoConvert'];
  }

  toggleAsn1Button();
  toggleAutoConvert();
};

const convert = () => {
  const inType = document.getElementById('inType').selectedOptions[0].value;
  const outType = document.getElementById('outType').selectedOptions[0].value;

  const inData = document.getElementById('inData').value;
  const outData = document.getElementById('outData');

  const data = parsers[inType](inData);

  updateBytesCounter(data.length);
  outData.value = formatters[outType](data);

  saveInLocalStorage();
};

const copyOutputData = async () => {
  await navigator.clipboard.writeText(document.getElementById('outData').value);
  showNotification({ text: 'Output copied', type: 'info' });
};

const swap = () => {
  const inType = document.getElementById('inType');
  const outType = document.getElementById('outType');

  let buf = inType.selectedOptions[0].value;

  inType.value = outType.selectedOptions[0].value;
  outType.value = buf;

  const inData = document.getElementById('inData');
  const outData = document.getElementById('outData');

  buf = inData.value;

  inData.value = outData.value;

  toggleAsn1Button();
  convert();
}

const decodeAsAsn1 = () => {
  const value = document.getElementById('outData').value;

  if (!value) {
    return;
  }

  window.open(
    `https://asn1.qkation.com/#${value}`,
    '_blank'
  ).focus();
}

const toggleAsn1Button = () => {
  const outType = document.getElementById('outType').value;

  if (outType === 'hex' || outType === 'base64') {
    document.getElementById('asn1Tool').classList.remove('hide');
  } else {
    document.getElementById('asn1Tool').classList.add('hide');
  }
};

const toggleExamples = () => {
  const examples = document.getElementById('examples');

  if (examples.classList.contains('hide')) {
    examples.classList.remove('hide');
  } else {
    examples.classList.add('hide');
  }

  const show = document.getElementById('show');
  
  if (show.innerText === 'Show') {
    show.innerText = 'Hide';
  } else {
    show.innerHTML = 'Show';
  }
};

const toggleAutoConvert = () => {
  if (document.getElementById('autoConvert').checked) {
    document.getElementById('inData').addEventListener('change', convert);
    document.getElementById('inData').addEventListener('input', convert);
  } else {
    document.getElementById('inData').removeEventListener('change', convert);
    document.getElementById('inData').removeEventListener('input', convert);
  }
};

const onBodyLoad = () => {
  let parameters = new URLSearchParams(window.location.search);

  let flag = true;

  if (parameters.get('in') != null) {
    flag = true;
    document.getElementById('inType').value = parameters.get('in');
  }

  if (parameters.get('out') != null) {
    flag = true;
    document.getElementById('outType').value = parameters.get('out');
  }

  if (parameters.get('data')) {
    flag = true;
    document.getElementById('inData').value = decodeURIComponent(parameters.get('data'));
  }

  if (parameters.get('autoconvert')) {
    flag = true;
    document.getElementById('autoConvert').checked = decodeURIComponent(parameters.get('autoconvert'));
  }

  if (flag) {
    toggleAsn1Button();
    toggleAutoConvert();
  } else {
    loadFromLocalStorage();
  }

  const results = window.localStorage.getItem('results');
  if (results) {
    const resultsContainer = document.getElementById('resultsContainer');
    for (const result of results) {
      resultsContainer.appendChild(createResultElement(result));
    }
  }
};

const onFormatChange = () => {
  convert();
}

const share = async () => {
  const inType = document.getElementById('inType').selectedOptions[0].value;
  const outType = document.getElementById('outType').selectedOptions[0].value;
  const data = document.getElementById('inData').value;
  const autoConvert = document.getElementById('autoConvert').value;

  const url = `?in=${inType}&out=${outType}&data=${encodeURIComponent(data)}&autoconvert=${autoConvert}`;

  window.history.pushState(url, url, url);
  await navigator.clipboard.writeText(window.location.href);

  showNotification({ text: 'Link copied. You can share it now', type: 'info' });
};

const updateBytesCounter = amount => {
  const counter = document.getElementById("bytesCounter");
  counter.innerText = amount;
};
