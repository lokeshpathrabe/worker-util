import { worker } from "./..";

it("Addition test", async () => {
  const result = await worker`(function(a, b){
    return a + b
   })(8, 16)`;
  expect(result).toEqual(24);
});
