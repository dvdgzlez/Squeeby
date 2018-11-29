(function () {
    $(document).ready(function () {
        M.updateTextFields();
        $(".datepicker").datepicker();

        $("#confirm").click(function () {
            if (!validate()) {
                return;
            }
            $("#confirm, #cancel").addClass("disable").attr("disabled", true);
            $S.Post("Account/Register", Request(), function (err, res) {
                if (err || !res) {
                    M.toast({ html: (err ? err.Message : "") || "Error al registrar el usuario" });
                    return;
                }
                M.toast({ html: "Usuario creado exitosamente" });
                setTimeout(function () {
                    $S.Redirect("Home/Index");
                }, 1000);
            });
        });

        $("#cancel").click(function () {
            $S.Redirect("Home/Index");
        });

        $("#password, #confirmPassword").keyup(function () {
            response = $S.ValidPassword(this.value);
            if (response.meter < 3) {
                $(this).addClass("invalid").removeClass("valid")
                    .siblings("span.helper-text").attr("data-error", response.message);
                return false;
            } else {
                $(this).removeClass("invalid").addClass("valid")
                    .siblings("span.helper-text").attr("data-success", response.message);
            }
        });

        $("#email").keyup(function () {
            if (!$S.ValidEmail(this.value)) {
                $(this).addClass("invalid")
                    .siblings("span.helper-text").attr("data-error", "Introduzca una dirección de correo válida");
                return false;
            }
        });

        function validate() {
            if ($(".invalid").length > 0) return false;
            let empty = false;
            $(".validate").each((index, v) => {
                if (!v.value) {
                    $(v).addClass("invalid")
                        .siblings("span.helper-text").attr("data-error", "This field is empty");
                    empty = true;
                }
            });
            if (empty) return false;
            if ($("#name").val().length < 2) {
                $("#name").addClass("invalid")
                    .siblings("span.helper-text").attr("data-error", "Introduzca su nombre");
                return false;
            }
            if ($("#lastName").val().length < 2) {
                $("#lastName").addClass("invalid")
                    .siblings("span.helper-text").attr("data-error", "Introduzca su apellido");
                return false;
            }
            if ($("#birthday").val().length === 0) {
                $("#birthday").addClass("invalid")
                    .siblings("span.helper-text").attr("data-error", "Introduzca su fecha de nacimiento");
                return false;
            }
            if (!$S.ValidEmail($("#email").val())) {
                $("#email").addClass("invalid")
                    .siblings("span.helper-text").attr("data-error", "Introduzca una dirección de correo válida");
                return false;
            }
            var response = $S.ValidPassword($("#password").val());
            if (response.meter < 3) {
                $("#password").addClass("invalid")
                    .siblings("span.helper-text").attr("data-error", response.message);
                return false;
            } else {
                $("#password").siblings("span.helper-text").attr("data-success", response.message);
            }
            response = $S.ValidPassword($("#confirmPassword").val());
            if (response.meter < 3) {
                $("#confirmPassword").addClass("invalid")
                    .siblings("span.helper-text").attr("data-error", response.message);
                return false;
            } else {
                $("#confirmPassword").siblings("span.helper-text").attr("data-success", response.message);
            }
            if ($("#password").val() !== $("#confirmPassword").val()) {
                $("#confirmPassword").addClass("invalid")
                    .siblings("span.helper-text").attr("data-error", "Las contraseñas no coindicen");
                return false;
            }
            return true;
        }

        function Request() {
            return {
                User: {
                    Name: $("#name").val(),
                    LastName: $("#lastName").val(),
                    Email: $("#email").val(),
                    Password: $("#password").val(),
                    Birthday: moment($("#birthday").val()).format("L")
                },
                ConfirmPassword: $("#confirmPassword").val(),
                RecaptchaResponse: $("#GoogleReCaptchaResponse").val()
            };
        }
    });
})();