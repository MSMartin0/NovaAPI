function notOp(Binary) {
    var NotBinary = [];
    for (var I = 0; I < Binary.length; I++) {
        if (Binary[I] === 1) {
            NotBinary.push(0);
        }
        else {
            NotBinary.push(1);
        }
    }
    return NotBinary;
}
function binaryToVal(Binary) {
    var Num = 0;
    var BitIter = 1;
    for (var I = 0; I < Binary.length; I++) {
        if (Binary[I] === 1) {
            Num += BitIter;
        }
        BitIter *= 2;
    }
    return Num;
}
function binaryLength(CharCode) {
    var Bits = 1;
    while (CharCode > 1) {
        Bits++;
        CharCode /= 2;
    }
    return Bits;
}
function ToBinary(CharCode, Length = binaryLength(CharCode)) {
    var Binary = [];
    for (var I = 0; I < Length; I++) {
        if (CharCode % 2 === 0) {
            Binary.push(0);
        }
        else if (CharCode % 2 === 1) {
            Binary.push(1);
        }
        CharCode /= 2;
        CharCode = Math.trunc(CharCode);
    }
    return Binary;
}
function stringToBinary(String) {
    var charCodeHold = String.charCodeAt(0);
    var BinaryWhole = ToBinary(charCodeHold, 8);
    var HoldBinary = [];
    for (var I = 1; I < String.length; I++) {
        HoldBinary.length = 0;
        charCodeHold = String.charCodeAt(I);
        HoldBinary = ToBinary(charCodeHold,8);
        BinaryWhole = BinaryWhole.concat(HoldBinary);
    }
    return BinaryWhole;
}
function binaryToString(Binary) {
    var Output = "";
    var Hold = [];
    var Iterations = Binary.length / 8
    for (var I = 0; I < Iterations; I++) {
        Hold.length = 0;
        Hold = Binary.splice(0, 8);
        Output += String.fromCharCode(binaryToVal(Hold));
    }
    return Output;
}
module.exports = {
    notOp,
    binaryToVal,
    binaryLength,
    ToBinary,
    stringToBinary,
    binaryToString
}