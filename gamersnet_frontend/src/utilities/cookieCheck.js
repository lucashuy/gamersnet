export default function cookieCheck() {
    for (let cookie of document.cookie.split('; ')) {
        if (cookie.split('=')[0] === 'token') {
            return true;
        }
    }

    return false;
}