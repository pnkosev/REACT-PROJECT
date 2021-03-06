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
            Object.keys(errors).forEach(e => {
                toastr.error(errors[e]);
            });
        }
    }
}

export default notify;