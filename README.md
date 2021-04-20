### Dedicated Webworker Util

This util helps in executing tasks on dedicated worker thread in runtime with ease. Utilizes the string template literals to accept a function in string format. A JS file is created using this function to initialize the Worker thread.

Every function spawns a new worker thread. Once the task is done the thread is destroyed.

## Examples

Process objects/arrays in worker thread to reduce load on render thread.

```js
const me = { name: "lokesh", lname: "pathrabe" };
const result = await worker`(function(person){
    return person.name.concat(person.lname)
   })(${me})`;
console.log(result); // logs lokeshpathrabe
```

make API calls in worker thread

```js
  const result = await worker`(async function(){
      const fetchData = new Promise((resolve) => {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          resolve(xhttp.responseText);
        }
      };
      xhttp.open("GET", "filename", true);
      xhttp.send();
    });
    const data = await fetchData;
    return data;
  })()`;
});
```

execute some code in setInterval. Since webworker threads are not affected by resource throttling done by browsers, they are perfect place to execute time sensitive operations

```js
const callback = jest.fn((v) => {
  console.log(v);
});
const intervalWorker = createIntervalWorker(callback, 1000);
const clearInterval = intervalWorker`(function(){
    return new Date();
    })()`;
await wait(100000); // execute for sometime
clearInterval(); // Dont forget to clear the interval
```
