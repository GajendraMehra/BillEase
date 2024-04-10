const fruits = ["Apple", "Banana", "Orange"];

console.log([...fruits]);
const about = {
  name: "Rahul",
  age: 34
};
const [, b] = fruits;
console.log();
const {name: lore} = about;
console.log({...about, name: b, age: lore});
// {
//     name:"Rahul",
//     age:"Rahul"
// }
