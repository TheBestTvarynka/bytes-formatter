const fromDecimal = data => new Uint8Array(data.split(/\D/).filter(e => e === '').map(e => +e));

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

const fromBase64 = data => {
  let chars = window.atob(data);
  const bytes = new Uint8Array(chars.length);
  for (let i = 0; i < length; i++) {
    bytes[i] = chars.charCodeAt(i);
  }
  return bytes;
};

const parsers = {
  'decimal': fromDecimal,
  'hex': fromHex,
  'base64': fromBase64,
};

const toDecimal = data => { };

const toDecimalArray = data => { };

const toHex = data => { };

const toBase64 = data => { };

const toAscii = data => { };

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

  console.dir({ inType, outType, inData });
};
