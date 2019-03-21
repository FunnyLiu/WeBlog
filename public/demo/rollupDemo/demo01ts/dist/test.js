(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
}(function () { 'use strict';

    //基本类型
    var list2 = [1, 2, 3];
    console.log(list2);
    //Tuple
    var x;
    x = [10, 'hehe'];
    console.log(x);
    //Enum
    var Color;
    (function (Color) {
        Color[Color["Red"] = 0] = "Red";
        Color[Color["Green"] = 1] = "Green";
        Color[Color["Blue"] = 2] = "Blue";
    })(Color || (Color = {}));
    var c = Color.Green;
    create({ prop: 0 }); // OK
    create(null); // OK

}));
