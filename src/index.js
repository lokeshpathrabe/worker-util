export const worker = (strings, ...args) => {
  if (typeof Worker !== "undefined") {
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
      let AsyncFunction = Object.getPrototypeOf(async function(){}).constructor
      let inputFunction = new AsyncFunction(\`return ${functionString}\`);
      const value = await inputFunction();
      postMessage(value)
    })()
  `;

    const blob = new Blob([code], { type: "application/javascript" });
    const worker = new Worker(URL.createObjectURL(blob));
    return new Promise((resolve) => {
      worker.onmessage = (value) => {
        worker.terminate();
        return resolve(value.data);
      };
    });
  } else {
    throw new Error("WebWorker not suppported!");
  }
};

export const createIntervalWorker = (callback, interval) => {
  return (strings, ...args) => {
    if (typeof Worker !== "undefined") {
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
      let AsyncFunction = Object.getPrototypeOf(async function(){}).constructor
      let inputFunction = new AsyncFunction(\`return ${functionString}\`);
      const intervalRef = setInterval(async () => {
        const value = await inputFunction();
        postMessage(value)
      }, ${interval});

      onmessage = () => {
        clearInterval(intervalRef);
      }
    })()
  `;

      const blob = new Blob([code], { type: "application/javascript" });
      const worker = new Worker(URL.createObjectURL(blob));
      worker.onmessage = (e) => {
        callback(e.data);
      };

      return () => worker.postMessage(0);
    } else {
      throw new Error("WebWorker not suppported!");
    }
  };
};
