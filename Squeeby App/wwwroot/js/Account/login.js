(function () {
    $(document).ready(function () {
        $("#register").click(function () {
            $S.Redirect("Account/Register");
        });

        $("#login").click(function () {
            if (!$S.ValidEmail($("#email").val())) {
                $("#email").addClass("invalid").removeClass("valid")
                    .siblings("span.helper-text").attr("data-error", "Introduzca un correo válido");
                return;
            }
            $("#email").addClass("valid").removeClass("invalid")
                .siblings("span.helper-text").attr("data-error", "");
            const data = {
                model: {
                    Email: $("#email").val(),
                    Password: $("#password").val()
                }
            };
            $S.Post("Account/Login", data, function (err, result) {
                if (err) {
                    console.log(err);
                    return M.toast({ html: "Could not login" });
                }
                M.toast({ html: "Login successful" });
            });
        });

        $("#forgot").click(function () {
            $S.Redirect("Account/Forgot");
        });
    });
})();