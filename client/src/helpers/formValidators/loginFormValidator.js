function validateForm(payload) {
	let errors = {};
	let isFormValid = true;
	let message = '';

	if (payload.username.trim().length < 4) {
		isFormValid = false;
		errors.username = 'Username must be atleast 4 letters/digits.';
	}

	if (!payload || typeof payload.username !== 'string' || payload.username.trim().length === 0) {
		isFormValid = false;
		errors.username = 'Please provide your username.';
	}

	if (payload.password.trim().length < 3) {
		isFormValid = false;
		errors.password = 'Please must be atleast 3 letters/digits.';
	}

	if (!payload || typeof payload.password !== 'string' || payload.password.trim().length === 0) {
		isFormValid = false;
		errors.password = 'Please provide your password.';
	}

	if (!isFormValid) {
		message = 'Form Validation Failed!';
	}

	return {
		success: isFormValid,
		message: message,
		errors: errors
	};
}

export default validateForm;