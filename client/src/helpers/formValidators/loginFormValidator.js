function validateForm(payload) {
	let errors = {};
	let isFormValid = true;
	let message = '';

	if (!payload || typeof payload.password !== 'string' || payload.password.trim().length === 0) {
		isFormValid = false;
		errors.password = 'Please provide your password.';
	}

	if (!payload || typeof payload.username !== 'string' || payload.username.trim().length === 0) {
		isFormValid = false;
		errors.name = 'Please provide your name.';
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