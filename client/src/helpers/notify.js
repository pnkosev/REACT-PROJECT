import toastr from 'toastr';

toastr.options.newestOnTop = false;
toastr.options.closeButton = true;

function notify(type, message, errors) {
    if (type === 'success') {
        toastr.success(message);
    }

    if (type === 'error') {
        toastr.error(message);

        if (errors) {
            for (let err in errors) {
                toastr.error(errors[err]);
            }
        }
    }
}

export {notify};