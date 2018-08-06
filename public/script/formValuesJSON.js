export function formValueJson(formName) {
    const formValid = document.querySelector(`[name=${formName}]`),
        formElements = formValid.elements,
        result = {},
        resultJson;
    
    formValid.addEventListener('submit', event => {
        event.preventDefault();
    });
    
    for (let i = 0; i < formElements.length ; i++) {
    let input = formElements[i];

        if ((input.type === 'radio' && !input.checked) && input.value === '') {
            continueinput
        }
        const key = input.name,
            value = input.value;
        result[key] = value
    };

    resultJson = JSON.stringify(result);

    return  resultJson;
}