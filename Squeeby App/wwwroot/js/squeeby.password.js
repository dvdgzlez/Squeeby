(function () {
    $S.extend({
        ValidPassword: ValidPassword
    });

    function ValidPassword(pwd) {
        "use strict";
        const strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
        const mediumRegex = new RegExp("^(?=.{6,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
        const enoughRegex = new RegExp("(?=.{4,}).*", "g");
        var meter,
            message;
        if (pwd.length === 0) {
            meter = 0;
            message = "Introduzca una contraseña";
        } else if (false === enoughRegex.test(pwd)) {
            meter = 1;
            message = "Introduzca mas caracteres";
        } else if (strongRegex.test(pwd)) {
            meter = 4;
            message = "Fuerte";
        } else if (mediumRegex.test(pwd)) {
            meter = 3;
            message = "Media";
        } else {
            meter = 2;
            message = "Débil";
        }
        return {
            meter: meter,
            message: message
        };
    }
})();