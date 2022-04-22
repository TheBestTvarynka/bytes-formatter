const fromDecimal = data => new Uint8Array(
  data
    .split(/\D/)
    .filter(e => e !== '')
    .map(e => +e)
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
  const chars = window.atob(data);
  const len = chars.length;
  const bytes = new Uint8Array(chars.length);

  for (let i = 0; i < len; i++) {
    bytes[i] = chars.charCodeAt(i);
  }

  return bytes;
};

const parsers = {
  'decimal': fromDecimal,
  'hex': fromHex,
  'base64': fromBase64,
  'ascii': fromAscii,
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

const formatters = {
  'decimal': toDecimal,
  'decimalArray': toDecimalArray,
  'hex': toHex,
  'base64': toBase64,
  'ascii': toAscii,
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

  outData.value = formatters[outType](parsers[inType](inData));

  saveInLocalStorage();
};

const copyOutputData = () => navigator.clipboard.writeText(document.getElementById('outData').value);

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
  outData.value = buf;

  toggleAsn1Button();
}

const decodeAsAsn1 = () => window.open(
  `https://lapo.it/asn1js/#${document.getElementById('outData').value}`,
  '_blank'
).focus();

const toggleAsn1Button = () => {
  const outType = document.getElementById('outType').value;

  if (outType === 'hex' || outType === 'base64') {
    document.getElementById('asn1Tool').classList.remove("hide");
  } else {
    document.getElementById('asn1Tool').classList.add('hide');
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

  console.dir(parameters);

  if (parameters.entries.length > 0) {
    if (parameters.get('in')) {
      document.getElementById('inType').value = parameters.get('in');
    }

    if (parameters.get('out')) {
      document.getElementById('outType').value = parameters.get('out');
    }

    if (parameters.get('data')) {
      document.getElementById('inData').value = decodeURIComponent(parameters.get('data'));
    }

    toggleAsn1Button();
    toggleAutoConvert();
  } else {
    loadFromLocalStorage();
  }
};

const share = () => {
  const inType = document.getElementById('inType').selectedOptions[0].value;
  const outType = document.getElementById('outType').selectedOptions[0].value;
  const data = document.getElementById('inData').value;

  const url = `?in=${inType}&out=${outType}&data=${encodeURIComponent(data)}`;

  window.history.pushState(url, url, url);
  navigator.clipboard.writeText(window.location.href);
};
