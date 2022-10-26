
document.onselectionchange = () => {
  const selection = window.getSelection().toString();

  if (!selection) {
    document.getElementById('selectedBytesCounter').innerText = 0;
    return;
  }

  const element = document.activeElement;

  let count = 0;

  if (element.id === 'inData') {
    const inType = document.getElementById('inType').selectedOptions[0].value;
    const data = parsers[inType](selection);
    count = data.length;
  } else if (element.id === 'outData') {
    const outType = document.getElementById('outType').selectedOptions[0].value;
    const data = parsers[outType](selection);
    count = data.length;
  } else {
    return;
  }

  document.getElementById('selectedBytesCounter').innerText = count;
};
