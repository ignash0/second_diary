export default function getCookieFromJSON(nameCookie){

    const cookie = document.cookie,
        decodedCookie = decodeURIComponent(cookie);
    let first, 
        last,
        result = undefined, 
        resultJson,
        dataCookie;
    
    for (var i= 0; i< decodedCookie.length;i++) {
        
        if (decodedCookie.charAt(i) === '{') {
            first = i
        };
        if (decodedCookie.charAt(i) === '}'){
            last = i
    };
    };
    if (first &&  last) {
        resultJson = decodedCookie.substring(first, last + 1);
        dataCookie = JSON.parse(resultJson);
        result = dataCookie[nameCookie];
    }
    return result
    
};

// function getCoockie(nameCookie){

//     const cookie = document.cookie,
//         decodedCookie = decodeURIComponent(cookie),
//         keyValue = decodedCookie.split('; ');
    
//     var result = {};
//     for (var i= 0; i< keyValue.length;i++) {
//         const cut = keyValue[i].split('='),
//             key = cut[0],
//             val = cut[1];
//             result[key] =val;
//     }
// return result[nameCookie];
// };