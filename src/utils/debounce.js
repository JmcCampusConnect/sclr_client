export function debounce(func, wait) {

    let timeout;
    let context;
    let args;

    const debounced = function (...args) {
        context = this;
        args = args;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };

    debounced.cancel = function () { clearTimeout(timeout) };
    return debounced;
}