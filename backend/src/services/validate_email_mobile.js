export function isValidMobileNumber(number) {
    const regex = /^(\+?\d{1,3}[- ]?)?\d{10}$/;
    return regex.test(number);
}

export function isValidGmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return regex.test(email);
}