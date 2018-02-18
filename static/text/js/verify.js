let name_input = document.getElementById('name_input');
let phone_input = document.getElementById('phone_input');
let message = document.getElementById('message');
let submit = document.getElementById('submit');

name_input.addEventListener('blur', name_verify);
name_input.addEventListener('keyup', name_verify);
phone_input.addEventListener('blur', phone_verify);
message.addEventListener('blur', message_verify);
message.addEventListener('keyup', message_verify);



function name_verify() {
  if (this.value) {
    mark_valid(this);
    this.placeholder = "Enter name:"
    check_all_valid();
  } else {
    mark_invalid(this);
    this.placeholder = "Please enter a name";
  }
}


function phone_verify() {
  let user_input = this.value;
  let input_array = user_input.split('');
  let cleaned = input_array.reduce( (output, char) => {
    if (isNaN(char)) {
      return output;
    } else {
      return output + char;
    }
  }, '');
  if (cleaned.length === 10) {
    let formatted = `(${cleaned.substring(0,3)})-${cleaned.substring(3,6)}-${cleaned.substring(6,10)}`;

    let url = `http://apilayer.net/api/validate?access_key=0e69a23f8a5cc1c8060b86f848276b8f&number=1${cleaned}`;

    fetch(url).then( function(response) {
      response.json().then( function(json) {
        let number = json;
        if (number.valid) {
          mark_valid(phone_input);
          phone_input.value = formatted;
          check_all_valid();
        }
      });
    });

  } else {
    mark_invalid(phone_input);
    phone_input.value = ''
    phone_input.placeholder = 'Please enter a valid number';
  }
}

function message_verify() {
  if (this.value) {
    mark_valid(this);
    this.placeholder = "Send yourself a message!"
    check_all_valid();
  } else {
    mark_invalid(this);
    this.placeholder = "Don't forget your message!";
  }
}

function check_all_valid() {
  let name_valid = name_input.classList.contains('valid') && name_input.value != '';
  let phone_valid = phone_input.classList.contains('valid') && phone_input.value.length === 14;
  let message_valid = message.classList.contains('valid') && message.value != '';

  if (name_valid && phone_valid && message_valid) {
    submit.classList.add('unlocked');
    console.log('all valid');
  } else {
    console.log('somethings not valid');
  }
}

function mark_valid(element) {
  element.classList.add('valid');
  element.classList.remove('invalid');
}

function mark_invalid(element) {
  element.classList.add('invalid');
  element.classList.remove('valid');
}

