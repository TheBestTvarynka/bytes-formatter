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

const decode = () => {
  const inType = document.getElementById('inType').selectedOptions[0].value;
  const outType = document.getElementById('outType').selectedOptions[0].value;

  const inData = document.getElementById('inData').value;
  const outData = document.getElementById('outData');

  console.dir({ inType, outType, inData });

  const bytes = parsers[inType](inData);
  const value = formatters[outType](bytes);

  console.log({ bytes, value });

  outData.value = value;
};
