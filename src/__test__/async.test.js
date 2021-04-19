import { asyncWorker } from "./..";

it("Set timeout in worker", async () => {
  const result = await asyncWorker`(async function(timeout){
    console.log(new Date())
    return await setTimeout(() => {
      console.log(new Date())
      return new Date();
    }, timeout);
   })(1000)`;
  console.log(result);
});
