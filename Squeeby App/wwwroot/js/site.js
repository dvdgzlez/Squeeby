(function () {
    $(document).ready(function () {
        $("#cookieConsent button[data-cookie-string]").click(function () {
            document.cookie = $(this).data("cookie-string");
            $("#cookieConsent").addClass("hide");
        });
    });
})();