function grecaptchaFn(siteKey, action) {
    grecaptcha.ready(function () {
        grecaptcha.execute(siteKey, { action: action })
            .then(function (token) {
                // Verify the token on the server.
                $("#GoogleReCaptchaResponse").val(token);
            });
    });
}