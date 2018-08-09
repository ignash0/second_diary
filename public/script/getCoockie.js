
function getCoockie(nameCookie){

    const cookie = document.cookie,
        decodedCookie = decodeURIComponent(cookie),
        keyValue = decodedCookie.split('; ');
    
    var result = {};
    for (var i= 0; i< keyValue.length;i++) {
        const cut = keyValue[i].split('='),
            key = cut[0],
            val = cut[1];
            result[key] =val;
    }
return result[nameCookie];
};

function getCoockieJSON(nameCookie){

    const cookie = document.cookie,
        decodedCookie = decodeURIComponent(cookie);
    let first, 
        last,
        result, 
        resultJson;

    for (var i= 0; i< decodedCookie.length;i++) {
        
        if (decodedCookie.charAt(i) === '{') {
            first = i
        };
        if (decodedCookie.charAt(i) === '}'){
            last = i
        };
    }

resultJson = decodedCookie.substring(first, last + 1);
result = JSON.parse(resultJson);

return result[nameCookie];
}

