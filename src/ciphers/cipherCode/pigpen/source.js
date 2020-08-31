const fs = require('fs')
const path = require('path')
const config = JSON.parse(fs.readFileSync(path.resolve(__dirname,'config.json')))
function generateKey(Size) {
    var KeyArray = [];
    var Val = Math.floor(Math.random() * 3) + 1;
    KeyArray.push(Val);
    for (var I = 1; I < Size; I++) {
        Val = Math.floor(Math.random() * 3) + 1;
        while (KeyArray[I - 1] === Val) {
            Val = Math.floor(Math.random() * 3) + 1;
        }
        KeyArray.push(Val);
    }
    return KeyArray;
}
function crypt(Input, Start, End) {
    var Output = "";
    var Iterator;
    var Found;
    var Translations =
        [
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "anbocpdqerfsgthuivjwlymzkxANBOCPDQERFSGTHUIVJWLYMZKX",
            "ajbkcldmenfogphqirswuyvztxAJBKCLDMENFOGPHQIRSWUYVZTX"
        ];
    for (var I = 0; I < Input.length; I++) {
        Found = false;
        Iterator = 0;
        while (!Found && Iterator < Translations[Start - 1].length) {
            if (Translations[Start - 1].charAt(Iterator) === Input.charAt(I))
                Found = true;
            else
                Iterator++;
        }
        if (Found)
            Output += Translations[End - 1].charAt(Iterator);
        else
            Output += Input.charAt(I);
    }
    return Output;
}
function keyCrypt(Input, Key, CryptMode) {
    if (CryptMode === "encrypt") {
        for (var I = 0; I < Key.length - 1; I++) {
            Input = crypt(Input, Key[I], Key[I + 1]);
        }
    }
    else if (CryptMode === "decrypt") {
        for (var I = Key.length - 2; I >= 0; I--) {
            Input = crypt(Input, Key[I+1], Key[I]);
        }
    }
    return Input;
}
function encryptFunc(Text, Key) {
    var final = {
        "text": "",
        "key": ""
    }
    var KeyArr = [];
    if(Key.length!==0)
    {
        for (var I = 0; I < Key.length; I++) {
                var Int = parseInt(Key.charAt(I));
                KeyArr.push(Int);
        }
        final["key"] = Key
    }
    else
    {
        KeyArr = generateKey(10)
        final["key"] = KeyArr.join('')
    }
    final["text"] = keyCrypt(Text, KeyArr, "encrypt");
    return final
}
function decryptFunc(Text, Key) {
    var final = {
        "text": ""
    }
    var KeyArr = [];
    for (var I = 0; I < Key.length; I++) {
            var Int = parseInt(Key.charAt(I));
            KeyArr.push(Int);
    }
    final["text"] = keyCrypt(Text, KeyArr, "decrypt");
    return final
}
function processData(action, data)
{
    if(action === "encrypt")
    {
        return encryptFunc(data["text"], data["key"])
    }
    else if(action === "decrypt")
    {
        return decryptFunc(data["text"], data["key"])
    }
    else
    {
        return "Error"
    }
}
function validateInput(action, data)
{
    var validKey = false
    var validText = false
    const regExTest = new RegExp(/^[1-3]+$/)
    if(action === "encrypt")
    {
        validText = (data["text"].length !==0)
        if(data["key"].length !== 0)
        {
            validKey = (regExTest.test(data["key"]))
        }
        else
        {
            validKey = true
        }
    }
    else if(action === "decrypt")
    {
        validText = (data["text"].length !==0)
        validKey = (data["key"].length !== 0 && regExTest.test(data["key"]))
    }
    return (validText&&validKey) 
}
module.exports = {
    processData,
    validateInput,
    config
}