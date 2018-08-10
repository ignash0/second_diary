export default function formSubmitPostJson(url,data, callback){
    let response;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(data);
    xhr.addEventListener('load', () => {
        response = xhr.responseText;
        callback(response);
    })
};