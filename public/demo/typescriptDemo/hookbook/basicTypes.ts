//Boolean
let isDone: boolean = false;

//Number
let decimal: number = 6;

//String
let color: string = 'blue';
let sentenct: string = `hello , color is ${color}, age is ${decimal + 1}`;

//Array
let list: number[] = [1,2,3];
let list2: Array<number> = [1,2,3];

//Tuple
let x: [number,string];
x = [10,'hehe'];

//Enum
enum Color {Red, Green, Blue}
let c: Color = Color.Green;

//Any
let notSure: any = 4;
notSure = 'string';
notSure = false;

//Void
function warnUser(): void {
    console.log('message');
}
let unusable: void = undefined;

//Null and Undefined
let u: undefined = undefined;
let n: null = null;

//Never
// Function returning never must have unreachable end point
function error(message: string): never {
    throw new Error(message);
}

// Inferred return type is never
function fail() {
    return error("Something failed");
}

// Function returning never must have unreachable end point
function infiniteLoop(): never {
    while (true) {
    }
}


//Object 
declare function create(o: object | null): void;

create({ prop: 0 }); // OK
create(null); // OK
