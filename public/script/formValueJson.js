export default function formValueJson(formName) {
    const formValid = document.querySelector(`[name=${formName}]`),
        formElements = formValid.elements,
        result = {};
    let resultJson;
    
    formValid.addEventListener('submit', event => {
        event.preventDefault();
    });
    
    for (let i = 0; i < formElements.length ; i++) {
    let input = formElements[i];

        if ((input.type === 'radio' && !input.checked) || input.value ==='') {
            continue
        }
        const key = input.name,
            value = input.value;
        result[key] = value;
    };
    console.log('result=' + result)
    resultJson = JSON.stringify(result);

    return  resultJson;
};

