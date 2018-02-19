// Grab form elements needed for verification
let name_input = document.getElementById('name_input');
let phone_input = document.getElementById('phone_input');
let message = document.getElementById('message');
let form = document.getElementById('text_signup');

// Set up listeners for verification
name_input.addEventListener('blur', name_verify);
name_input.addEventListener('keyup', name_verify);
phone_input.addEventListener('blur', phone_verify);
message.addEventListener('blur', message_verify);
message.addEventListener('keyup', message_verify);
form.addEventListener('submit', finalize);


// Simple verification for non null names
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

// Removes non number characters and appends the country code 1 for US
function clean_phone(phone_number) {
  let input_array = phone_number.split('');

  let cleaned = input_array.reduce( (output, char) => {
    if (isNaN(char)) {
      return output;
    } else {
      return output + char;
    }
  }, '1');

  return cleaned
}

// Three step verification proccess
// 1) Checks that number is 11 digits in length
// 2) checks that all chars in string are numbers
// 3) checks that number is a valid US number
// This process is repeated on the server
function phone_verify() {
  let cleaned = clean_phone(this.value);
  if (cleaned.length === 11) {
    // formats phone numbers in the following style
    // (###)-###-####
    let formatted = `(${cleaned.substring(1,4)})-${cleaned.substring(4,7)}-${cleaned.substring(7,11)}`;

    // Builds url for number verification
    let url = `http://apilayer.net/api/validate?access_key=0e69a23f8a5cc1c8060b86f848276b8f&number=${cleaned}`;

    // Checks number is valid US number
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

// Simple verification for non null message
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

// Simple check to see that all fields have been entered before unlocking the submit button
function check_all_valid() {
  let name_valid = name_input.classList.contains('valid') && name_input.value != '';
  let phone_valid = phone_input.classList.contains('valid') && phone_input.value.length === 14;
  let message_valid = message.classList.contains('valid') && message.value != '';

  if (name_valid && phone_valid && message_valid) {
    submit.classList.add('unlocked');
  }
}

// Styles form elements to indicate valid data
function mark_valid(element) {
  element.classList.add('valid');
  element.classList.remove('invalid');
}

// Styles form elements to indicate invalid data
function mark_invalid(element) {
  element.classList.add('invalid');
  element.classList.remove('valid');
}

// Removes formatting prior to sending to server
function finalize(e) {
  phone_input.value = clean_phone(phone_input.value);
}

