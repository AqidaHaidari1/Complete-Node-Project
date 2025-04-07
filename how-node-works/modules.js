// console.log(arguments)

// module.exports
import Calculator from "./test-module-1.js";

const calc1 = new Calculator()

console.log(calc1.add(3, 7));

//
import { add, multipy, devide } from "./test-module-2.js";
console.log(add(10, 30))

//caching
import caching from './test-module-3.js'
caching()
caching() // loading the data from cach instead of loding the module
caching(); // loading the data from cach instead of loding the module