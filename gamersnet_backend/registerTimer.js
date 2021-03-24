// callback: function
// timeout: repeat time in seconds
async function registerTimer(callback, timeout = 60) {
    while (1) {
        await new Promise((resolve) => {
            setTimeout(() => {
                callback();

                resolve();
            }, timeout * 1000);
        })
    }
}

module.exports = registerTimer;