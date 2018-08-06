
window.onload = () => {

    const submit = document.querySelector('[name="checkin"]');
    
    
    submit.addEventListener('submit', (event) => {
        event.preventDefault();
    
        const firstName = document.querySelector('[name="checkin_firstName"]'),
        secondName = document.querySelector('[name="checkin_secondName"]'),
        fatherName = document.querySelector('[name="checkin_fatherdName"]'),
        password1 = document.querySelector('[name="checkin_password1"]'),
        password2 = document.querySelector('[name="checkin_password2"]');
    
    
    let user = {'firstName':firstName.value,
        'secondName':secondName.value,
        'fatherName':fatherName.value,
        'password1':password1.value,
        'password2':password2.value
    }
    var myJSON = JSON.stringify(user);
    
    
    
        var fs = require('fs');
        fs.appendFile('user.json', myJSON, function (err) {
          if (err) throw err;
          console.log('Updated!');
        });
    })
}
