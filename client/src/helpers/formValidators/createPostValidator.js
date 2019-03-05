function validateForm(payload) {
	let errors = {};
	let isFormValid = true;
	let message = '';

	if (!payload || typeof payload.title !== 'string' || payload.title.trim().length === 0) {
		isFormValid = false;
		errors.password = 'Title field is mandatory.';
	}

	if (!payload || typeof payload.content !== 'string' || payload.content.trim().length === 0) {
		isFormValid = false;
		errors.name = 'Please fill the content field.';
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