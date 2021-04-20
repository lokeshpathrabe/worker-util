import { worker } from "./..";

it("Addition test", async () => {
  const result = await worker`(function(a, b){
    return a + b
   })(8, 16)`;
  expect(result).toEqual(24);
});

it("Object is parced in input", async () => {
  const me = { name: "lokesh", lname: "pathrabe" };
  const result = await worker`(function(person){
    return person.name.concat(person.lname)
   })(${me})`;
  expect(result).toEqual(me.name.concat(me.lname));
});

it("Object is parced in ouput", async () => {
  const me = { name: "lokesh", lname: "pathrabe" };
  const result = await worker`(function(name, lname){
    return {name, lname}
   })('lokesh', 'pathrabe')`;
  expect(result).toEqual(me);
});

it("Nested object is parced in input and ouput", async () => {
  const input = {
    india: { population: 12500000, time: new Date() },
    pakistan: { population: 6500000, time: new Date() }
  };
  const expected = [
    ["india", 12500000],
    ["pakistan", 6500000]
  ];
  const result = await worker`(function(data){
    return Object.keys(data).map(k => [k, data[k].population])
   })(${input})`;
  expect(result).toEqual(expected);
});
