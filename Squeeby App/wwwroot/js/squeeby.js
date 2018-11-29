(function (global, $) {
    const ajaxTimeout = 120000;

    var squeeby = function () {
        return new squeeby.init();
    };

    squeeby.prototype = {};

    squeeby.init = function () { };

    squeeby.init.prototype = squeeby.prototype;

    squeeby.extend = squeeby.init.extend = $.extend;

    squeeby.extend({
        Get: Get,
        Post: Post,
        Put: Put,
        Delete: Delete,
        GetWithConfirmation: GetWithConfirmation,
        PostWithConfirmation: PostWithConfirmation,
        PutWithConfirmation: PutWithConfirmation,
        DeleteWithConfirmation: DeleteWithConfirmation,
        IsDateTimeEmpty: IsDateTimeEmpty,
        IsAuthenticationError: IsAuthenticationError,
        AuthValidator: AuthValidator,
        Redirect: Redirect,
        FormatShortDate: FormatShortDate,
        GetLang: GetLang,
        GetURL: GetURL,
        GetScrollBarWidth: GetScrollBarWidth,
        ShowLoader: ShowLoader,
        HideLoader: HideLoader,
        Draggable: Draggable,
        Tooltipped: Tooltipped,
        TruncateWord: TruncateWord
    });

    // Functions
    function Get(method, callback) {
        $.ajaxSetup({
            url: GetURL() + method,
            global: false,
            type: 'GET',
            timeout: ajaxTimeout
        });
        $.get(GetURL() + method)
            .done(AjaxSuccessEvent(callback))
            .fail(AjaxFailEvent(method))
            .catch(AjaxCatchEvent(callback));
    }

    function Post(method, data, callback) {
        $.ajaxSetup({
            url: GetURL() + method,
            global: false,
            type: 'POST',
            timeout: ajaxTimeout,
            error: function (xhr) {
                console.log(xhr);
            }
        });
        $.post(GetURL() + method, data)
            .done(AjaxSuccessEvent(callback))
            .fail(AjaxFailEvent(method))
            .catch(AjaxCatchEvent(callback));
    }

    function Put(method, data, callback) {
        $.ajaxSetup({
            url: GetURL() + method,
            global: false,
            type: 'PUT',
            timeout: ajaxTimeout,
            error: function (xhr) {
                console.log(xhr);
            }
        });
        $.put(GetURL() + method, data)
            .done(AjaxSuccessEvent(callback))
            .fail(AjaxFailEvent(method))
            .catch(AjaxCatchEvent(callback));
    }

    function Delete(method, data, callback) {
        $.ajaxSetup({
            url: GetURL() + method,
            global: false,
            type: 'DELETE',
            timeout: ajaxTimeout,
            error: function (xhr) {
                console.log(xhr);
            }
        });
        $.delete(GetURL() + method, data)
            .done(AjaxSuccessEvent(callback))
            .fail(AjaxFailEvent(method))
            .catch(AjaxCatchEvent(callback));
    }

    function AjaxSuccessEvent(callback) {
        return function (result, success, response) {
            callback(null, result, success, response);
        };
    }

    function AjaxCatchEvent(callback) {
        return function (err) {
            callback(err.statusText || "Error desconocido");
        };
    }

    function AjaxFailEvent(method) {
        return function (failData) {
            $S.AuthValidator(failData, method);
        };
    }

    function GetWithConfirmation(data) {
        Confirmation(data, function () {
            $S.Get(data.method, function (err, res) {
                if (err) {
                    data.onError(err);
                }
                else {
                    data.onSuccess(res);
                }
            });
        });
    }

    function PostWithConfirmation(data) {
        Confirmation(data, function () {
            $S.Post(data.method, data.model, function (err, res) {
                if (err) {
                    data.onError(err);
                }
                else {
                    data.onSuccess(res);
                }
            });
        });
    }

    function PutWithConfirmation(data) {
        Confirmation(data, function () {
            $S.Put(data.method, data.model, function (err, res) {
                if (err) {
                    data.onError(err);
                }
                else {
                    data.onSuccess(res);
                }
            });
        });
    }

    function DeleteWithConfirmation(data) {
        Confirmation(data, function () {
            $S.Delete(data.method, data.model, function (err, res) {
                if (err) {
                    data.onError(err);
                }
                else {
                    data.onSuccess(res);
                }
            });
        });
    }

    function Confirmation(data, action) {
        swal({
            text: data.text,
            title: "¿Desea continuar?",
            icon: "warning",
            buttons: true,
            dangerMode: true
        }).then((willSave) => {
            if (willSave) {
                action();
            }
        });
    }

    function IsDateTimeEmpty(value) {
        return value === null || value.getTime() === new Date("0001-01-01T00:00:00").getTime();
    }

    function IsAuthenticationError(data) {
        if (data.status !== null && (data.status === 403 || data.status === 401)) {
            return true;
        } else {
            return false;
        }
    }

    function AuthValidator(data, method) {
        if ($S.IsAuthenticationError(data)) {
            M.toast({ html: `Usted no puede acceder al siguiente método ${method}` });
        }
        return data;
    }

    function Redirect(method, newPage) {
        if (newPage) {
            window.open(GetURL() + method, "_blank");
        } else {
            window.location = GetURL() + method;
        }
    }

    function FormatShortDate(value) {
        return moment(value).lang(getLang()).local().format("L");
    }

    function GetLang() {
        if (navigator.languages !== undefined)
            return navigator.languages[0];
        else
            return navigator.language;
    }

    function GetScrollBarWidth() {
        const scrollDiv = document.createElement("div");
        scrollDiv.className = "scrollbar-measure";
        document.body.appendChild(scrollDiv);

        // Get the scrollbar width
        const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

        // Delete the DIV 
        document.body.removeChild(scrollDiv);
        return scrollbarWidth;
    }

    function ShowLoader() {
        $("#main-loader").show();
    }

    function HideLoader() {
        $("#main-loader").hide();
    }

    function Draggable() {
        var draggableDiv = $(".modal,.floating-card").draggable();
        $('.row', draggableDiv).mousedown(function () {
            draggableDiv.draggable('disable');
        }).mouseup(function () {
            draggableDiv.draggable('enable');
        });
    }

    function Tooltipped() {
        $(".material-tooltip").remove();
        $(".tooltipped").tooltip();
    }

    function TruncateWord(text, length) {
        return text.split(" ").length > length ? text.split(" ").splice(0, length).join(" ") + "..." : text;
    }

    // Prototypes
    String.prototype.replaceAll = function (search, replacement) {
        return this.replace(new RegExp(search, "g"), replacement);
    };

    String.prototype.sanitize = function () {
        var str = this.replaceAll("&#34;", "*");
        str = str.replaceAll("&#39;", "*");
        str = str.replaceAll("&#44;", ",");
        return str;
    };

    $.fn.overflown = function () {
        const e = this[0];
        return e.scrollHeight > e.clientHeight || e.scrollWidth > e.clientWidth;
    };

    Number.prototype.prependZeroTwoDigits = function () {
        return `0${this}`.slice(-2);
    };

    function GetURL() {
        return window.location.protocol + "//" + window.location.host + "/";
    }

    // provide a shorthand '$S' for ease our poor fingers
    global.$S = squeeby;
})(typeof window !== "undefined" ? window : this, jQuery);