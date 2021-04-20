import { worker, createIntervalWorker } from "./..";

const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), timeout);
  });
};

it("Async task in worker", async () => {
  const result = await worker`(async function(timeout){
    const fetchData = new Promise((resolve) => {
      setTimeout(() => {
        resolve(100);
      }, timeout);
    });
    const data = await fetchData;
    return data;
   })(200)`;
  expect(result).toEqual(100);
});

it("Set interval in worker", async () => {
  let result;
  const callback = jest.fn((v) => {
    result = v;
  });
  const intervalWorker = createIntervalWorker(callback, 1000);
  const clearInterval = intervalWorker`(function(){
      return new Date();
     })()`;
  await wait(4000);
  clearInterval();
  expect(result instanceof Date).toEqual(true);
  expect(callback).toBeCalledTimes(3);
});
