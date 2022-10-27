
document.onselectionchange = () => {
  const element = document.activeElement;

  let count = 0;

  if (element.id === 'inData') {
    const selection = element.value.substring(element.selectionStart, element.selectionEnd);
    if (!selection) {
      document.getElementById('selectedBytesCounter').innerText = 0;
      return;
    }

    const inType = document.getElementById('inType').selectedOptions[0].value;
    const data = parsers[inType](selection);
    count = data.length;
  } else if (element.id === 'outData') {
    const selection = element.value.substring(element.selectionStart, element.selectionEnd);
    if (!selection) {
      document.getElementById('selectedBytesCounter').innerText = 0;
      return;
    }

    const outType = document.getElementById('outType').selectedOptions[0].value;
    const data = parsers[outType](selection);
    count = data.length;
  } else {
    return;
  }

  document.getElementById('selectedBytesCounter').innerText = count;
};
