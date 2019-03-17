function validateForm(payload) {
	let errors = {};
	let isFormValid = true;
	let message = '';

	if (!payload || typeof payload.content !== 'string' || payload.content.trim().length < 10) {
		isFormValid = false;
		errors.content = 'Please fill out the content field (minimum 10 symbols).';
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