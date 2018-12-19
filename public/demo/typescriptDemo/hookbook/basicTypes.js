//Boolean
var isDone = false;
//Number
var decimal = 6;
//String
var color = 'blue';
var sentenct = "hello , color is " + color + ", age is " + (decimal + 1);
//Array
var list = [1, 2, 3];
var list2 = [1, 2, 3];
//Tuple
var x;
x = [10, 'hehe'];
//Enum
var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Green"] = 1] = "Green";
    Color[Color["Blue"] = 2] = "Blue";
})(Color || (Color = {}));
var c = Color.Green;
//Any
var notSure = 4;
notSure = 'string';
notSure = false;
//Void
function warnUser() {
    console.log('message');
}
var unusable = undefined;
//Null and Undefined
var u = undefined;
var n = null;
//Never
// Function returning never must have unreachable end point
function error(message) {
    throw new Error(message);
}
// Inferred return type is never
function fail() {
    return error("Something failed");
}
// Function returning never must have unreachable end point
function infiniteLoop() {
    while (true) {
    }
}
create({ prop: 0 }); // OK
create(null); // OK
