(function () {
    $S.extend({
        Grid: function () {
            var actual = {},
                response = {},
                searchTimeout = 0,
                divSearch = {},
                divSearchField = {},
                divPageSize = {},
                divPagination = {},
                divTable = {},
                divDateRange = {},
                customEvents = [],
                url = "",
                downloadURL = "",
                isInitialized = false,
                opt = {},
                ResponseDataEvent = function () { },
                ErrorEvent = function () { },
                sortDirection = {},
                cookiePath;

            return {
                CustomEvent: CustomEvent,
                Show: Show,
                Initialize: Initialize,
                GetObjectData: GetObjectData,
                Update: Update,
                GetCaptionsInHtml: GetCaptionsInHtml,
                Options: Options,
                ExtraFilter: ExtraFilter,
                SetCustomFilters: SetCustomFilters,
                GetCustomFilters: GetCustomFilters,
                GetResponseData: GetResponseData,
                ResponseData: ResponseData,
                OnError: OnError,
                GetData: GetCustomData,
                GetDateRange: GetActualDateRange,
                DownloadCSV: DownloadCSV,
                Unbind: Unbind
            };

            function Initialize(data) {
                url = data.URL;
                downloadURL = data.downloadURL;
                actual = new Reset();
                actual.Type = data.Type;
                actual.ExtraFilters = [];
                actual.CustomFilters = [];
                divSearch = data.divSearch || $("#SqueebySearch");
                divSearchField = data.divSearchField || $("#SqueebySearchField");
                divTable = data.divTable || $("#SqueebyTable");
                divPageSize = data.divPageSize || $("#SqueebyPageSize");
                divPagination = data.divPagination || $("#SqueebyPagination");
                divDateRange = data.divDateRange || $("#SqueebyDateRange");
                cookiePath = `squeeby-grid-${actual.Type.toString()}`;
                return this;
            }

            function CustomEvent(event) {
                customEvents.push(event);
                return this;
            }

            function Options(obj) {
                if (!obj) return this;
                opt.showFooter = obj.showFooter || false;
                opt.showCount = obj.showCount || false;
                opt.showTotal = obj.showTotal || false;
                opt.formatCell = obj.formatCell || false;
                opt.hideIdColumn = obj.hideIdColumn || false;
                opt.dateRange = obj.dateRange || false;
                opt.hideLoader = obj.hideLoader || false;
                opt.enableSort = obj.enableSort || false;
                opt.textFirstHeader = obj.textFirstHeader || "Id";
                opt.foreignKeyValue = obj.foreignKeyValue || "";
                return this;
            }

            function ExtraFilter(obj) {
                if (!actual.CustomFilters) {
                    actual.CustomFilters = [];
                }
                if (obj && obj[1]) {
                    var newValue = true;
                    actual.CustomFilters.forEach(e => {
                        if (e && e.Key === obj[0]) {
                            [e.Key, e.Value] = obj;
                            newValue = false;
                        }
                    });
                    if (newValue) {
                        if (actual.CustomFilters) {
                            actual.CustomFilters.push({
                                Key: obj[0],
                                Value: obj[1]
                            });
                        } else {
                            actual.CustomFilters = [
                                {
                                    Key: obj[0],
                                    Value: obj[1]
                                }
                            ];
                        }
                    }
                } else {
                    actual.CustomFilters = actual.CustomFilters.filter(f => f.Key !== obj[0]);
                }
                actual.Page = 1;
                actual.PageSize = $(divPageSize).val();
                actual.SearchField = $(divSearchField).val() || response.FieldList[0];
                actual.SearchCriteria = $(divSearch).val();
                UpdateData();
            }

            function SetCustomFilters(filters) {
                actual.CustomFilters = filters;
                actual.Page = 1;
                actual.PageSize = $(divPageSize).val();
                actual.SearchField = $(divSearchField).val() || response.FieldList[0];
                actual.SearchCriteria = $(divSearch).val();
                UpdateData();
            }

            function GetCustomFilters() {
                return actual.CustomFilters;
            }

            function GetResponseData() {
                return response;
            }

            function ResponseData(event) {
                ResponseDataEvent = event;
                return this;
            }

            function OnError(event) {
                ErrorEvent = event;
            }

            function Show() {
                isInitialized = false;

                divSearch.keyup(function () {
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(function () {
                        actual.Page = 1;
                        actual.PageSize = $(divPageSize).val();
                        actual.SearchCriteria = divSearch.val();
                        actual.SearchField = $(divSearchField).val() || response.FieldList[0];
                        actual.CustomFilters = [];
                        UpdateData();
                    }, 1000);
                });

                divPageSize.change(function () {
                    actual.Page = 1;
                    actual.PageSize = $(divPageSize).val();
                    actual.SearchField = $(divSearchField).val() || response.FieldList[0];
                    actual.SearchCriteria = $(divSearch).val();
                    UpdateData();
                });

                if (opt.dateRange) {
                    divDateRange.change(function () {
                        actual.Page = 1;
                        actual.PageSize = $(divPageSize).val();
                        actual.SearchField = $(divSearchField).val() || response.FieldList[0];
                        actual.SearchCriteria = $(divSearch).val();
                        if (GetDateRange()) {
                            UpdateData();
                        }
                    });
                    GetDateRange();
                }

                UpdateData();
            }

            function UpdateData() {
                GetData(function (err) {
                    if (err) {
                        return M.toast({ html: err });
                    }
                    let modelView = [];

                    // With this we will build the modelView with the "key" from the FieldList and the "value" from Data
                    if (response.Data) {
                        response.Data.forEach((a) => {
                            const row = {};
                            a.forEach((b, c) => {
                                row[response.FieldList[c]] = b;
                            });
                            modelView.push(row);
                        });
                    }
                    ResponseDataEvent(response, modelView);

                    divTable.html("");
                    UpdateTableHeader(divTable);
                    UpdateTableBody(divTable);
                    UpdateTableFooter(divTable);
                    UpdatePagination(divPagination, actual.Page, response.TotalRecords, actual.PageSize);
                    DivShowCount(divPagination);
                    UpdateSelect(divSearchField, response);
                    InitializeByCookie();
                    SetEvents();
                    if (!divSearchField.val()) {
                        divSearchField.val($("#" + divSearchField.attr("id") + " option:first").val());
                        divSearchField.formSelect();
                    }
                    isInitialized = true;
                    if (response.Data.length === 0) {
                        if (actual.Page > 1) {
                            actual.Page--;
                            return UpdateData();
                        }
                    }
                    return true;
                });
            }

            function DivShowCount(div) {
                if (!opt.showCount) return;
                div.append($("<li>").addClass("left").text(opt.showCount + response.TotalRecords));
            }

            function DivSearchFieldEvent() {
                actual.Page = 1;
                actual.SearchField = $(divSearchField).val();
                actual.PageSize = $(divPageSize).val();
                actual.SearchCriteria = $(divSearch).val();
                if (actual.SearchCriteria) {
                    UpdateData();
                }
            }

            function SetEvents() {
                customEvents.forEach(function (event) {
                    event();
                });

                $("a[data-lookup]").click(function (evt) {
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(function () {
                        const search = evt.currentTarget.dataset.lookup;

                        if (search === "previous") {
                            if (actual.Page > 1) {
                                actual.Page--;
                            } else {
                                actual.Page = 1;
                            }
                        } else if (search === "next") {
                            const totalPages = Math.ceil(response.TotalRecords / parseInt(actual.PageSize));
                            if (actual.Page < totalPages) {
                                actual.Page++;
                            } else {
                                actual.Page = totalPages;
                            }
                        } else if (search === "first") {
                            actual.Page = 1;
                        } else if (search === "last") {
                            actual.Page = Math.ceil(response.TotalRecords / parseInt(actual.PageSize));
                        } else {
                            actual.Page = parseInt(search);
                        }

                        UpdateData();
                    },
                        500);
                });

                $("#SqueebyTable thead tr th").click(function (evt) {
                    if (!opt.enableSort) return;
                    try {
                        const elements = $($(evt.currentTarget).html()).data("elements").split(","),
                            direction = sortDirection[`dir${this.cellIndex}`] || "ASC";
                        actual.Sort = {
                            Elements: elements,
                            Direction: direction
                        };
                        actual.Page = 1;
                        actual.PageSize = $(divPageSize).val();
                        actual.SearchField = $(divSearchField).val() || response.FieldList[0];
                        actual.SearchCriteria = $(divSearch).val();
                        sortDirection[`dir${this.cellIndex}`] = direction === "ASC" ? "DESC" : "ASC";
                        UpdateData();
                    } catch (e) {
                        // :D
                    }
                })
                    .each(function (a, b) {
                        if ($($(b).html()).data("elements")) {
                            $(b).addClass("pointer");
                        }
                    });

                $S.Tooltipped();
            }

            function GetCustomData(callback) {
                GetData((err) => {
                    callback(err, response);
                });
            }

            function GetActualDateRange() {
                const { DateFrom, DateTo } = actual;
                return { DateFrom: DateFrom, DateTo: DateTo };
            }

            function DownloadCSV() {
                if (!downloadURL) return;
                const { data } = PrepareData();
                $S.DownloadFile(downloadURL, data)
                    .then(function (res) {
                        const { result, response } = res;
                        $S.HideLoader();
                        var header = response.getResponseHeader("Content-Disposition");
                        const filename = header.match(/filename=(.+)/)[1];
                        var blob = new Blob([`\ufeff${result}`], { type: response.getResponseHeader("Content-Type") });
                        var link = document.createElement('a');
                        link.href = window.URL.createObjectURL(blob);
                        link.download = filename;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }).catch(function (err) {
                        console.error(err);
                        $S.HideLoader();
                    });
            }

            function Unbind() {
                divSearch = null;
                divSearchField = null;
                divTable = null;
                divPageSize = null;
                divPagination = null;
                divDateRange = null;
            }

            function GetData(callback) {
                const { path, data } = PrepareData();
                $S.Post(url, data)
                    .then(function (res) {
                        $S.HideLoader();
                        if (res.Success) {
                            $.cookie(path, JSON.stringify({ Data: data, Actual: actual }), { expires: new Date(moment().local().add(1, "days").format()) }, { path: "/" });
                            response = res.Results;
                            if (!response) {
                                callback(res.Message || "No data");
                            } else {
                                callback();
                            }
                        } else {
                            callback(res.Message);
                        }
                    }).catch(function (err) {
                        console.error(err);
                        $S.HideLoader();
                        callback(err);
                        ErrorEvent();
                    });
            }

            function PrepareData() {
                var data = new Request();
                if (opt.dateRange) {
                    data.DateFrom = actual.DateFrom;
                    data.DateTo = actual.DateTo;
                }
                if (!opt.hideLoader || !isInitialized) {
                    $S.ShowLoader();
                }
                if (opt.foreignKeyValue) {
                    data.ForeignKeyFilter = {
                        Value: opt.foreignKeyValue,
                        Operator: 0,
                        AndOr: "AND",
                        ValueTo: ""
                    };
                }
                if ($.cookie(cookiePath) && !isInitialized) {
                    data = JSON.parse($.cookie(path)).Data;
                    actual = JSON.parse($.cookie(path)).Actual;
                }
                data.PageSize = data.PageSize <= 0 ? 1 : data.PageSize;
                $.removeCookie(path, { path: "/" });
                return { data: data, path: path };
            }

            function InitializeByCookie() {
                if ($.cookie(cookiePath) && !isInitialized) {
                    var data = JSON.parse($.cookie(path)).Actual;
                    divPageSize.val(data.PageSize);
                    divSearch.val(data.SearchCriteria);
                    divSearchField.val(data.SearchField);
                    divDateRange.val(data.DateRangeSelect);
                    M.updateTextFields();
                    $("select").formSelect();
                }
            }

            function GetObjectData(id) {
                return {
                    CaptionList: response.CaptionList,
                    Data: response.Data.find(function (d) { return d[0] === parseInt(id); })
                };
            }

            function Update() {
                UpdateData();
            }

            function GetCaptionsInHtml(html) {
                return UpdateTableHeader(html);
            }

            function UpdateSelect(select, array) {
                if (!isInitialized) {
                    var obj;
                    if (response.CaptionListBackup) {
                        obj = response.CaptionListBackup.map(a => {
                            return {
                                key: a,
                                value: a.replaceAll(" ", "")
                            };
                        });
                    } else {
                        obj = array.FieldList.map((a, b) => {
                            return {
                                value: a,
                                key: b === 0 ? "Id" : array.CaptionList[b - 1]
                            };
                        });
                    }

                    select.html("").change(DivSearchFieldEvent);
                    obj.forEach(function (f) {
                        select.append($("<option>").attr("value", f.value).text(f.key));
                    });
                    select.val(actual.SearchField);
                    select.formSelect();
                }
                return;
            }

            function UpdateTableHeader(html) {
                const thead = html.children("thead").length === 0 ? $("<thead>") : html.children("thead");
                var row = $("<tr>");
                if (!opt.hideIdColumn) {
                    row.append($("<th>").html(opt.textFirstHeader));
                }
                response.CaptionList.forEach(function (data) {
                    row.append($("<th>").html(data));
                });
                return html.append(thead.append(row));
            }

            function UpdateTableBody(html) {
                if (html.children("tbody").length === 0) {
                    html.append($("<tbody>"));
                }
                var dateFormat = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/;
                response.Data.forEach(function (data) {
                    var row = $("<tr>").addClass("squeeby-row").attr("data-keyid", data[0]);
                    data.forEach(function (d) {
                        if (dateFormat.test(d)) {
                            row.append($("<td>").html(moment(d).local().format("L")).data("value", new Date(d)));
                        } else {
                            row.append($("<td>").html(d).data("value", d));
                        }
                    });
                    html.append(row);
                });
                return html;
            }

            function UpdateTableFooter(html) {
                if (!opt.showFooter) return;

                const tfoot = $("<tfoot>").addClass("light-blue lighten-1");
                const row = $("<tr>");
                divPagination = $("<ul>").attr("id", "SqueebyPagination").attr("unselectable", "on")
                    .addClass("pagination center");
                row.append($("<th>").attr("colspan", "3").append(divPagination));
                response.DataFooter.forEach(function (d) {
                    row.append($("<th>").addClass("center").text($S.FormatCurrency(d)));
                });
                row.append($("<th>"));
                tfoot.append(row);
                html.append(tfoot);
                return;
            }

            function GetDateRange() {
                switch (divDateRange.val()) {
                    case "1": // Today
                        actual.DateFrom = moment().local().startOf("day").format();
                        actual.DateTo = moment().local().endOf("day").format();
                        break;
                    case "2": // Last 30 days
                        actual.DateFrom = moment().local().add(-30, "days").startOf("day").format();
                        actual.DateTo = moment().local().endOf("day").format();
                        break;
                    case "3": // Week to date
                        actual.DateFrom = moment().local().add(-7, "days").startOf("day").format();
                        actual.DateTo = moment().local().endOf("day").format();
                        break;
                    case "5": // Year to date
                        actual.DateFrom = moment().local().startOf("year").format();
                        actual.DateTo = moment().local().endOf("day").format();
                        break;
                    case "6": // Custom date
                        CreateModal();
                        divDateRange.val("0");
                        $("#DateRangeModal").FloatingCard({ width: 650 }).OpenCard();
                        $("#DateRangeButton").click(function () {
                            if (!$("#RangeDateFrom").val() || !$("#RangeDateTo").val() || !validRange()) {
                                return;
                            }
                            actual.DateFrom = moment($("#RangeDateFrom").val()).local().startOf("day").format();
                            actual.DateTo = moment($("#RangeDateTo").val()).local().endOf("day").format();
                            UpdateData();
                            $("#DateRangeModal").CloseCard();
                        });
                        $("#DateRangeCancel").click(function () {
                            $("#DateRangeModal").CloseCard();
                        });
                        return false;
                }
                actual.DateRangeSelect = divDateRange.val();
                return true;
            }

            function CreateModal() {
                if ($("#DateRangeModal").html()) return;
                $("body").append(`<div id="DateRangeModal" class="card floating-card top-card hide">
                    <div class="card-content">
                        <h5>Rango de fecha personalizado</h5>
                        <div class="row">
                            <div class="col s12 m6 l6">
                                <label for="RangeDateFrom">Desde:</label>
                                <input type="text" id="RangeDateFrom" class="datepicker" />
                            </div>
                            <div class="col s12 m6 l6">
                                <label for="RangeDateTo">Hasta:</label>
                                <input type="text" id="RangeDateTo" class="datepicker" />
                            </div>
                        </div>
                    </div>
                    <div class="card-action">
                        <a id="DateRangeButton" class="card-action mc-card-action pointer">Aceptar</a>
                        <a id="DateRangeCancel" class="card-action mc-card-cancel pointer">Cancelar</a>
                    </div>
                </div>`);
                $S.Draggable();
                $(".datepicker").datepicker({
                    onClose: function () {
                        if (!validRange()) {
                            //$(this).data('datepicker').inline = false;
                        }
                    }
                }).on("change", function (evt) {
                    if (evt.currentTarget.getAttribute("class").indexOf("picker__input--target") !== -1) {
                        if (!validRange()) {
                            return evt.preventDefault();
                        }
                        $(".picker__close").click();
                    }
                    return true;
                });
            }

            function validRange() {
                if ($("#RangeDateFrom").val() && $("#RangeDateTo").val()) {
                    const a = moment($("#RangeDateFrom").val());
                    const b = moment($("#RangeDateTo").val());
                    return a.diff(b) <= 0;
                }
                return true;
            }

            function Request() {
                return {
                    LookUpObjectType: actual.Type,
                    SearchField: actual.SearchField ? `[${actual.SearchField}]` : "",
                    SearchCriteria: actual.SearchCriteria.sanitize().trim(),
                    PageNumber: actual.Page,
                    PageSize: actual.PageSize,
                    Sort: actual.Sort,
                    CustomFilters: actual.CustomFilters,
                    ClientTimeZone: new Date().getTimezoneOffset()
                };
            }

            function UpdatePagination(div, page, totalRecords, pageSize) {
                const totalPageRecords = Math.ceil(totalRecords / pageSize);
                const total = totalPageRecords <= 10 ? totalPageRecords : totalPageRecords - page <= 5 ? totalPageRecords : Math.max(page + 4, 10);
                const init = total <= 10 ? 1 : total - 9;
                const previousValue = $("<a>").append($("<i>").addClass("material-icons").text("chevron_left"));
                const previous = $("<li>");
                div.html("");
                if (init !== 1) {
                    div.append($("<li>").addClass("pointer").append($("<a>").addClass("tooltipped").attr("data-position", "top").attr("data-tooltip", "Primera página").attr("data-lookup", "first").append($("<i>").addClass("material-icons").text("first_page"))));
                }
                if (page === 1) {
                    previous.addClass("disabled").append(previousValue);
                } else {
                    previousValue.attr("data-lookup", "previous");
                    previous.addClass("pointer tooltipped").attr("data-position", "top").attr("data-tooltip", "Anterior").append(previousValue);
                }
                div.append(previous);

                for (let i = init; i <= total; i++) {
                    div.append($("<li>").addClass(i === page ? "active pointer" : "pointer")
                        .append($("<a>").attr("data-lookup", i).text(i)));
                }

                const nextValue = $("<a>").addClass("tooltipped").attr("data-position", "top").attr("data-tooltip", "Siguiente").append($("<i>").addClass("material-icons").text("chevron_right"));
                const next = $("<li>");
                if (page === total) {
                    next.addClass("disabled").append(nextValue);
                } else {
                    nextValue.attr("data-lookup", "next").addClass("pointer");
                    next.addClass("pointer").append(nextValue);
                }
                div.append(next);
                if (totalPageRecords > 10 && totalPageRecords - page > 5) {
                    div.append($("<li>").addClass("pointer").append($("<a>").addClass("tooltipped").attr("data-position", "top").attr("data-tooltip", "Última página").attr("data-lookup", "last").append($("<i>").addClass("material-icons").text("last_page"))));
                }
                if (totalPageRecords > 10) {
                    div.append($("<li>").append($("<a>").addClass("tooltipped").attr("data-position", "top")
                        .attr("data-tooltip",
                            `Hay más de ${pageSize * 10} resultados que coinciden con la búsqueda, por favor considere refinar los criterios de búsqueda.`)
                        .append($("<i>").addClass("material-icons icon-yellow").text("warning"))));
                }
                return div;
            }

            function Reset() {
                return {
                    Page: 1,
                    PageSize: 10,
                    SearchCriteria: "",
                    SearchField: ""
                };
            }
        }
    });
})();