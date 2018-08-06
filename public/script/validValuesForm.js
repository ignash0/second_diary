class ValidValuesForm {
    constructor(formName){
        this.formName = formName;

        this.valuesTest = {
            testValueName: /[A-Za-z0-9-]+/,
            testValueDateBirth: /\d{1,2}.\d{1,2}.\d{4}/,
            testValueEmail: /\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6}/,
            testValuePassword: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}/,
        }

        this.resultsTests = [];

    }

    getformTest() {
        this.formTest = document.querySelector(`[name=${this.formName}]`)
    }

    test() {
        for (let i = 0; i < formElements.length ; i++) {           formElements[i].addEventListener('focus', event => {
            const previousElement = event.target.previousElementSibling;
              });
              formElements[i].addEventListener('change', event => {
            const value = event.target.value;
                  switch (formElements[i].name) {
                      case 'surname':
                    resultTest[i] = testValueName.test(value);
                    errorValue(formElements, i, resultTest, testValueName);
                    break;
                      case 'name':
                    // resultTest[i] = testValueName.test(value);
                    errorValue(formElements, i, resultTest, testValueName);
                    break;
                      case 'fatherName':
                    // resultTest[i] = testValueName.test(value);
                    errorValue(formElements, i, resultTest, testValueName);
                    break;
                            case 'dateBirth':
                    // resultTest[i] = testValueDateBirth.test(value);
                    errorValue(formElements, i, resultTest, testValueDateBirth);
                    break;
             
                case 'email':
                    // resultTest[i] = testValueEmail.test(value);
                    errorValue(formElements, i, resultTest, testValueEmail);
                    break;
                      case 'password':
                    // resultTest[i] = testValuePassword.test(value);
                    errorValue(formElements, i, resultTest, testValuePassword);
                    break;
            }
        });
            };

    }

    
}

























// valudationTest('registration');


// function valudationTest (formName) {
//     const testValueName = /[A-Za-z0-9-]+/,
//         testValueDateBirth = /\d{1,2}.\d{1,2}.\d{4}/,
//         testValueEmail = /\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6}/,
//         testValuePassword = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}/,
//         formValid = document.querySelector(`[name=${formName}]`),
//         formElements = formValid.elements,
//         resultTest = [];

//     for (let i = 0; i < formElements.length ; i++) {

//         formElements[i].addEventListener('focus', event => {
//             const previousElement = event.target.previousElementSibling;

//         });

//         formElements[i].addEventListener('change', event => {
//             const value = event.target.value;

//             switch (formElements[i].name) {

//                 case 'surname':
//                     // resultTest[i] = testValueName.test(value);
//                     errorValue(formElements, i, resultTest, testValueName);
//                     break;

//                 case 'name':
//                     // resultTest[i] = testValueName.test(value);
//                     errorValue(formElements, i, resultTest, testValueName);
//                     break;

//                 case 'fatherName':
//                     // resultTest[i] = testValueName.test(value);
//                     errorValue(formElements, i, resultTest, testValueName);
//                     break;


//                 case 'dateBirth':
//                     // resultTest[i] = testValueDateBirth.test(value);
//                     errorValue(formElements, i, resultTest, testValueDateBirth);
//                     break;
                
//                 case 'email':
//                     // resultTest[i] = testValueEmail.test(value);
//                     errorValue(formElements, i, resultTest, testValueEmail);
//                     break;

//                 case 'password':
//                     // resultTest[i] = testValuePassword.test(value);
//                     errorValue(formElements, i, resultTest, testValuePassword);
//                     break;
//             }
//         });
//     };

//     formValid.addEventListener('submit', event => {
//         const allValuesInput = [];
//         let trueAllValuesInput,
//             trueAllResultValidation;

//         for (let i = 0; i < formElements.length-1; i++) {
//             allValuesInput.push(formElements[i].value)
//         }

//         trueAllValuesInput = allValuesInput.every(elem => elem !== '');
//         trueAllResultValidation = resultTest.every(elem => elem === true);
    
//         if (!trueAllValuesInput || !trueAllResultValidation) {
//                 event.preventDefault();
//                 console.log(allValuesInput + '    '+'ок '+ trueAllValuesInput+ '   ' + trueAllResultValidation)

//         } 
//     });
// }

//     function errorValue(elem, index, result, test){
        
//         const element = elem[index],
//             error = document.querySelector([name=element.name] + span),
//             value = element.value;
        
//         result[index] = test(value);

//         if (!result[index]) {

//           error.innerText = 'Введенные данные не соответствуют условию';
//           error.style.color = 'red';
//         }


//     //     result[i] = testValuePassword.test(value);

//     //     let error,
//     //     elem;

//     //     elem = formElements[index]

//     //     error = document.createElement('span');
//     //     error.innerText = 'Введенные данных не соответствуют заявленным требованиям';
//     //     error.style.color = 'red';

//     //     if (!result[index]) {
//     //         formValid.insertBefore(error, elem);
//     //     }
//     //     return result[index] = testValuePassword.test(value);
//     // }

// }


