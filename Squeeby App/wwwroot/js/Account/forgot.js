(function () {
    $("#send").click(function () {
        const email = $("#email").val();
        if (!$S.ValidEmail(email)) {
            $("#email").addClass("invalid").removeClass("valid")
                    .siblings("span.helper-text").attr("data-error", "Por favor introduzca una dirección de correo válida");
            return;
        }
        $S.Post("Account/Forgot", { email: email }, function (err, result) {
            if (err) {
                console.log(err);
                return M.toast({ html: "Error inesperado, por favor intente más tarde." });
            }
            M.toast({ html: `Hemos enviado un correo a ${email}` });
            setTimeout(function () {
                $S.Redirect("Home/");
            }, 3000);
        });
    });
})();