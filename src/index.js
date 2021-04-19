export const worker = (strings, ...args) => {
  let functionString = "";
  const strlen = strings.length;
  for (let i = 0; i < strlen; i++) {
    if (i === strlen - 1) {
      functionString = functionString.concat(strings[i]);
    } else {
      functionString = functionString.concat(
        strings[i],
        JSON.stringify(args[i])
      );
    }
  }
  const code = `
    (function(){
      const value = eval(\`${functionString}\`)
      postMessage(value)
    })()
  `;

  const blob = new Blob([code], { type: "application/javascript" });
  const worker = new Worker(URL.createObjectURL(blob));
  return new Promise((resolve) => {
    worker.onmessage = (value) => {
      return resolve(value.data);
    };
  });
};

export const asyncWorker = (strings, ...args) => {
  let functionString = "";
  const strlen = strings.length;
  for (let i = 0; i < strlen; i++) {
    if (i === strlen - 1) {
      functionString = functionString.concat(strings[i]);
    } else {
      functionString = functionString.concat(
        strings[i],
        JSON.stringify(args[i])
      );
    }
  }
  const code = `
  (async function(){
    const value = await eval(\`${functionString}\`)
    postMessage(value)
  })()
 `;

  const blob = new Blob([code], { type: "application/javascript" });
  const worker = new Worker(URL.createObjectURL(blob));
  return new Promise((resolve) => {
    worker.onmessage = (value) => {
      return resolve(value.data);
    };
  });
};
