// Names export - Has a name. Have as many as needed.
// Default export - Has no name. You can only have one.

const message = 'Some message from myModule.js';
const name = 'Dobrin';
const location = 'Skopje';

const getGreeting = (name) => {
    return `Welcome to the course ${name}`;
};

const add = (a,b) => a + b;
const subtract = (a,b) => a - b;

export { 
    message as default,
    name,
    location ,
    getGreeting,
    add,
    subtract,
}; 
