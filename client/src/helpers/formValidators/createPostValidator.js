function validateForm(payload) {
	let errors = {};
	let isFormValid = true;
	let message = '';

	if (!payload || typeof payload.title !== 'string' || payload.title.trim().length < 5) {
		isFormValid = false;
		errors.title = 'Title field is mandatory (minimum 5 symbols).';
	}

	if (!payload || typeof payload.content !== 'string' || payload.content.trim().length < 50) {
		isFormValid = false;
		errors.content = 'Please fill out the content field (minimum 50 symbols).';
	}

	if (!payload ||
		typeof payload.imageUrl !== 'string' ||
		payload.imageUrl.trim().length === 0 ||
		!payload.imageUrl.match(`(https?://.*.(?:png|jpg|jpeg|gif))`)
		) {
		isFormValid = false;
		errors.imageUrl = 'Please provide a valid image URL.';
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