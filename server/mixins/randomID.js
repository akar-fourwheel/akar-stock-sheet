function generateRandomId(username, phoneNumber, date, length = 8) {
    // Ensure the inputs are valid strings
    const validUsername = username.replace(/\s+/g, '').substring(0, 3); // Take first 3 characters of the username
    const validPhoneNumber = phoneNumber.replace(/\D/g, '').substring(0, 3); // Take first 3 digits of the phone number (remove non-digits)
    const validDate = date.replace(/-/g, '').substring(2, 8); // Extract a portion of the date (e.g., year and month)

    // Combine parts of the username, phone number, and date to create a base for the ID
    const base = validUsername + validPhoneNumber + validDate;

    // Now generate a random part to complete the ID if necessary
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomId = base;

    for (let i = base.length; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomId += characters[randomIndex]; // Add random characters to complete the ID
    }

    return randomId;
}

export default generateRandomId;