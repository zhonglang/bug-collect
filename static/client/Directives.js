app.directive('ztree', function () {
    return {
        require: '?ngModel',
        restrict: 'A',
        link: function (scope, element, attrs, ngModel) {
            //Tree 主要操作对象
            scope.treeObj = {};
            //选项
            var opts;
            var viewSetting;
            opts = angular.extend({
                onClick: function (event, treeId, treeNode) {
                },
                onAddClick: function (treeId, treeNode) {
                },
                onRemoveClick: function (treeId, treeNode) {
                },
                showRemoveBtn: false,
                showAddBtn: false,
                asyncUrl: '',
                check: {},
                autoParam: [],
                data: {
                    key: {
                        // name: "displayName"
                        name: "name"
                    }
                },
                onCheck: function (event, treeId, treeNode) {
                }
            }, scope.$eval(attrs.ztree));

            var addHoverDom = function (treeId, treeNode) {
                var aObj = $("#" + treeNode.tId + "_a");
                if ($("#diyBtn_" + treeNode.id).length > 0) return;
                var editStr = "<a class='treeAdd' style='width:18px;margin-left:3px;' id='diyBtn_" + treeNode.id
                    + "'onfocus='this.blur();'></a>";
                aObj.append(editStr);
                var btn = $("#diyBtn_" + treeNode.id);
                if (btn) btn.bind("click", function () {
                    opts.onAddClick(treeId, treeNode);
                });
            };

            var removeHoverDom = function (treeId, treeNode) {
                $("#diyBtn_" + treeNode.id).unbind().remove();
                $("#diyBtn_space_" + treeNode.id).unbind().remove();
            };
            if (opts.showAddBtn) {
                viewSetting = {
                    addHoverDom: addHoverDom,
                    removeHoverDom: removeHoverDom
                };
            }
            else {
                viewSetting = {
                    // showIcon: false
                };
            }
            //Tree 设置
            var setting = {
                callback: {
                    onClick: function (event, treeId, treeNode) {
                        scope.$apply(opts.onClick(event, treeId, treeNode));
                    },
                    beforeRemove: opts.onRemoveClick,
                    onCheck: opts.onCheck
                },
                async: {
                    enable: true,
                    type: "get",
                    url: opts.asyncUrl,
                    autoParam: opts.autoParam
                },
                edit: {
                    enable: true,
                    showRemoveBtn: opts.showRemoveBtn,
                    showRenameBtn: false,
                    removeTitle: "删除组织",
                    drag: {
                        isCopy: false,
                        isMove: false
                    }
                },
                data: opts.data,
                view: viewSetting,
                check: opts.check
            };
            scope.$watch(attrs.ngModel, function (v) {
                if (v) {
                    scope.treeObj = $.fn.zTree.init(element, setting, v);
                    var nodes = scope.treeObj.getNodes();
                    if (nodes.length > 0) {
                        scope.treeObj.expandNode(nodes[0], true, true, true);
                    }
                }
            });
        }
    };
});

app.directive('dragable', ["$modalStack", function ($modalStack) {
    return {
        restrict: 'EA',
        template: ' <div class=\"modal-header\" style=\"cursor:move;padding-top:10px;\" ng-mouseup=\"releaseMe()\" ng-mousedown=\"dragMe()\">\
                        <div style=\"float: left;padding-top:5px;font-size:18px;\"><span>{{dialogTitle}}</span></div>\
                        <div style=\"float:right;padding-top:10px;overflow:hidden\">\
                            <div style=\"cursor: pointer;\" ng-click=\"closeDialog();\">\
                               <span style="font-size:16px" class="fa fa-close"></span>\
                            </div>\
                        </div>\
                    </div>',
        scope: {dialogTitle: '@'},
        replace: true,
        transclude: true,
        link: function (scope, elem, attr) {
            scope.dragMe = function () {
                //scope.dialogTitle
                elem.parent().parent().draggable();
            }
            scope.releaseMe = function () {
                elem.parent().parent().draggable('destroy');
            }
            scope.closeDialog = function () {
                var modal = $modalStack.getTop();
                $modalStack.dismiss(modal.key, 'backdrop click');
            };

        }
    }
}]);

app.directive('dragable3', ["$modalStack", function ($modalStack) {
    return {
        restrict: 'EA',
        template: '<div style="width:100%;height:100%;" ng-mouseup=\"releaseMe()\" ng-mousedown=\"dragMe()\">\
            <span style="float: left; margin-left: 5px;">{{dialogTitle}}</span>\
            <span class="fa fa-lg fa-close fa-icon" style="float: right; margin-right: 5px; color: black" ng-click="closeDialog()"></span></div>',
        scope: {
            dialogTitle: '@',
            close: '&'
        },
        replace: true,
        transclude: true,
        link: function (scope, elem, attr) {
            scope.dragMe = function () {
                //scope.dialogTitle
                elem.parent().parent().draggable();
            }
            scope.releaseMe = function () {
                elem.parent().parent().draggable('destroy');
            }
            scope.closeDialog = function () {
                scope.close();
            };
        }
    }
}]);

app.directive('dragable2', ["$modalStack", function ($modalStack) {
    return {
        restrict: 'EA',
        template: ' <div class=\"modal-header\" style=\"cursor:move;padding-top:10px;\" ng-mouseup=\"releaseMe()\" ng-mousedown=\"dragMe()\">\
                        <div style=\"float: left;padding-top:10px;font-size:22px;\"><span>{{dialogTitle}}</span></div>\
                        <div style=\"float:right;padding-top:10px;overflow:hidden\">\
                            <div style=\"cursor: pointer;\" ng-click=\"closeDialog();\">\
                                <img src=\"' + static_url + 'img/delete.png\" />\
                            </div>\
                        </div>\
                    </div>',
        scope: {
            dialogTitle: '@',
            close: '&'
        },
        replace: true,
        transclude: true,
        link: function (scope, elem, attr) {
            scope.dragMe = function () {
                elem.parent().parent().draggable();
            }
            scope.releaseMe = function () {
                elem.parent().parent().draggable('destroy');
            }
            scope.closeDialog = function () {
                scope.close();
            };

        }
    }
}]);

app.directive('cwAdaptbody', function () {
    return {
        require: '?ngModel',
        restrict: 'A',
        replace: false,
        link: function (scope, element, attrs, ngModel) {

            var adaptHeight = function () {
                CWApp.InitSiteHeight();
                var v = scope.$eval(attrs.cwAdaptbody);
                var winHeight = 0;
                if (window.innerHeight)
                    winHeight = window.innerHeight;
                if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
                    winHeight = document.documentElement.clientHeight;
                }
                $(element).css("height", (winHeight - CWApp.HeaderHeight - CWApp.BodyTopBarHeight - CWApp.FooterHeight - v) + 'px');
                // $(element).css("overflowY", 'auto');
            };
            adaptHeight();
            window.onresize = adaptHeight;
        }
    }
});

app.directive('cwAdaptmaxbody', function () {
    return {
        require: '?ngModel',
        restrict: 'A',
        replace: false,
        link: function (scope, element, attrs, ngModel) {

            var adaptHeight = function () {
                CWApp.InitSiteHeight();
                var v = scope.$eval(attrs.cwAdaptmaxbody);
                var winHeight = 0;
                if (window.innerHeight)
                    winHeight = window.innerHeight;
                if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
                    winHeight = document.documentElement.clientHeight;
                }
                $(element).css("maxHeight", winHeight - CWApp.HeaderHeight - CWApp.BodyTopBarHeight - CWApp.FooterHeight - v + 'px');
                // $(element).css("overflowY", 'auto');
            };
            adaptHeight();
            window.onresize = adaptHeight;
        }
    }
});

app.directive('cwAdaptheight', function () {
    return {
        require: '?ngModel',
        restrict: 'A',
        replace: false,
        link: function (scope, element, attrs, ngModel) {
            var winHeight = 0;
            if (window.innerHeight)
                winHeight = window.innerHeight;
            if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
                winHeight = document.documentElement.clientHeight;
            }
            $(element).css("height", (winHeight - CWApp.HeaderHeight - CWApp.BodyTopBarHeight - CWApp.FooterHeight - 12) + 'px');
        }
    }
});

app.directive('cwDatepicker', function () {
    return {
        require: '?ngModel',
        restrict: 'A',
        replace: false,
        link: function (scope, element, attrs, ngModel) {
            var jqElement = $(element);
            $(element)[0].readOnly = true;
            jqElement.datepicker({
                dateFormat: "yy-mm-dd",
                //changeMonth: true,
                //changeYear: true,
                monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
                dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
                dayNamesMin: ['日', '一', '二', '三', '四', '五', '六']
            });

            jqElement.after('<span style="font-size: 16px;cursor: pointer;" onclick="$(this).prev(\'input\').focus();">\
                                </span>');
        }
    }
});

app.directive('cwUnderline', function () {
    return {
        require: '?ngModel',
        restrict: 'A',
        replace: true,
        link: function (scope, element, attrs, ngModel) {
            scope.$watch(attrs.cwUnderline, function (v) {
                if (v) {
                    $(element).css('textDecoration', 'underline');
                } else {
                    $(element).css('textDecoration', 'none');
                }
            });
        }
    }
});

app.directive('modalwindowsize', function () {
    return {
        restrict: 'EA',
        scope: {
            parentwidth: '=parentwidth',
            parentheight: '=parentheight',
            parentleft: '=parentleft'
        },
        link: function (scope, element, attrs) {
            if (scope.parentwidth) {
                element.parent().width(scope.parentwidth);
            }
            if (scope.height) {
                element.parent().height(scope.parentheight);
            }
            if (scope.parentleft) {
                element.parent().css('left', scope.parentleft)
            }
        }
    };
});

app.directive('inputHint', function () {
    return {
        require: '?ngModel',
        restrict: 'A',
        replace: false,
        scope: true,
        compile: function () {
            return {
                pre: function ($scope, element, attrs, ngModel) {
                    $scope.hint = attrs.inputHint;
                    var IType = $(element)[0].type;
                    var inputValue = $scope.$parent.$eval(attrs.ngModel);
                    $(element).on('focus', function () {
                        if ($(element)[0].value == $scope.hint) {
                            if (IType == "password")
                                $(element)[0].type = IType;
                            $(element)[0].value = '';
                        }
                        $(element)[0].style.color = 'black';
                    });

                    $(element).on('blur', function () {
                        if ($(element)[0].value == '') {
                            if (IType == "password")
                                $(element)[0].type = "text";
                            $(element)[0].style.color = '#aaa';
                            $(element)[0].value = $scope.hint;
                        }
                    });

                    $scope.$watch($(element)[0].value, function (a) {
                        if (a == undefined || a == null || a == "") {
                            if (inputValue == null || inputValue == "") {
                                if (IType == "password")
                                    $(element)[0].type = "text";
                                $(element)[0].value = $scope.hint;
                                $(element)[0].style.color = '#aaa';
                            }
                        }
                        else {
                            $(element)[0].style.color = 'black';
                        }
                    })
                }
            }
        }
    }
});

app.directive('cwSlider', function () {
    return {
        restrict: 'EA',
        link: function (scope, element, attrs) {
            $(element).nivoSlider();
        }
    }
});

app.directive('highcharts', function () {
    return {
        require: '?ngModel',
        restrict: 'EA',
        link: function (scope, element, attrs, ngModel) {
            //选项
            var opts = angular.extend({
                title: {text: '', enabled: false},
                chart: {type: 'column'},
                credits: {enabled: false},
                //显示打印
                exporting: {
                    enabled: false
                },
                xAxis: {
                    labels: {
                        y: -10,     //x轴标签位置
                        enabled: false
                    }
                },
                yAxis: {
                    allowDecimals: true,
                    title: {
                        text: ' '
                    }
                },
                series: [],
                tooltip: {}
            }, scope.$eval(attrs.highcharts));
            // var chartrsID = "#" + pagerID;

            var opt_data = opts.data;
            var new_opts = {
                title: opts.title,
                chart: opts.chart,
                credits: opts.credits,
                exporting: opts.exporting,
                xAxis: opts.xAxis,
                yAxis: opts.yAxis,
                series: [],
                tooltip: opts.tooltip
            };

            var initChart = function () {
                new_opts.plotOptions = {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    },
                    series: {
                        cursor: 'pointer',
                        point: {
                            events: {
                                click: function (opt) {
                                    if (new_opts.series[opt.point.series.index].url != undefined)
                                        location.href = new_opts.series[opt.point.series.index].url;
                                }
                            }
                        }
                    }
                };
                $(element).highcharts(new_opts)
            };

            scope.$watch(opts.data, function (a) {
                if (a != undefined && a.length != undefined) {
                    new_opts.series.splice(0, new_opts.series.length);
                    for (var i = 0; i < a.length; i++) {
                        new_opts.series.push(a[i]);
                        // new_opts.series[i].data = [a[i]];
                    }
                    initChart();
                }
            });

            // scope.$watch(opts.data + '.length', function (b) {
            //     if (b != undefined && b != 0) {
            //         new_opts.series.splice(0, new_opts.series.length);
            //         for (var i = 0; i < b; i++) {
            //             new_opts.series.push(opts.data[i]);
            //             // new_opts.series[i].data = [a[i]];
            //         }
            //         initChart();
            //     }
            // });


        }
    };
});

app.directive('highchartsgauge', function () {
    return {
        require: '?ngModel',
        restrict: 'EA',
        link: function (scope, element, attrs, ngModel) {
            var pagerID = Math.ceil(Math.random() * 1000000000);
            element.append("<div style='width:100%;height: 100%;' id=\"" + pagerID + "\" class=\"" + pagerID + "\">");
            //选项
            var char_id = "#" + pagerID;
            var gaugeOptions = angular.extend({
                chart: {
                    type: 'solidgauge'
                },
                title: null,
                pane: {
                    center: ['50%', '85%'],
                    size: '140%',
                    startAngle: -90,
                    endAngle: 90,
                    background: {
                        backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                        innerRadius: '60%',
                        outerRadius: '100%',
                        shape: 'arc'
                    }
                },
                tooltip: {
                    enabled: false
                },
                // the value axis
                yAxis: {},
                plotOptions: {
                    solidgauge: {
                        dataLabels: {
                            y: 5,
                            borderWidth: 0,
                            useHTML: true
                        }
                    }
                },
                credits: {
                    enabled: false
                },
                exporting: {
                    enabled: false
                },
                series_name: ""
            }, scope.$eval(attrs.highchartsgauge));

            var new_opts = {
                chart: gaugeOptions.chart,
                title: gaugeOptions.title,
                pane: gaugeOptions.pane,
                tooltip: gaugeOptions.tooltip,
                exporting: gaugeOptions.exporting,
                yAxis: {
                    stops: [
                        [0.1, '#55BF3B'], // green
                        [0.5, '#DDDF0D'], // yellow
                        [0.9, '#DF5353'] // red
                    ],
                    lineWidth: 0,
                    minorTickInterval: null,
                    tickAmount: 2,
                    title: {
                        y: -70
                    },
                    labels: {
                        y: 16
                    }
                }
            };

            // Bring life to the dials
            scope.$watch(gaugeOptions.data + '.length', function (b) {
                if (b != undefined && b != 0) {
                    scope.$watch(gaugeOptions.data, function (a) {
                        $(char_id).highcharts(Highcharts.merge(new_opts, {
                            yAxis: {
                                min: gaugeOptions.yAxis.min,
                                max: gaugeOptions.yAxis.max,
                                title: gaugeOptions.yAxis.title
                            },
                            credits: {
                                enabled: false
                            },
                            series: [{
                                name: gaugeOptions.series_name,
                                data: a,
                                dataLabels: {
                                    format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                                    '<span style="font-size:12px;color:silver">' + gaugeOptions.series_name + '</span></div>'
                                },
                                tooltip: {
                                    valueSuffix: ' ' + gaugeOptions.series_name
                                }
                            }]
                        }));
                    })
                }
            })
        }
    }

});

app.directive('selectTree', ["$timeout", function ($timeout) {
    return {
        require: '?ngModel',
        restrict: 'EA',
        template: '<div class="custom-select" ng-class="controlClass" ng-click="toggleOpen()">\
        <input type="text" ng-model="inputItemObj.name" style="color:#858585" ng-blur="toggleBlur()" ng-focus="toggleFocus()"/>\
        <span><i class="icon-sort-down"></i></span>\
        <div class="list" ng-show="dropItem.isOpen">\
            <ul>\
                <li  ng-class="{\'active\':inputItemObj.id === member.id}" ng-include="subLevelHtml" ng-repeat="member in collection track by member.id"></li>\
            </ul>\
        </div>\
    </div>',
        replace: true,
        scope: {
            options: '=?',
            collection: '=?'
        },
        transclude: true,
        link: function ($scope, elem, attr, ngModel) {
            $scope.subLevelHtml = static_url + 'client/views/sub_level.html';
            $scope.dropItem = {isOpen: false};
            $scope.inputItemObj = $scope.$parent.$eval(attr.ngModel);

            $scope.findNode = function (data) {
                for (var i in data) {
                    if (data[i].id == $scope.inputItemObj.id) {
                        $scope.inputItemObj.name = data[i].name;
                        return true;
                    }
                    if (data[i].children) {
                        if ($scope.findNode(data[i].children))
                            return true;
                    }
                }
            };

            if ($scope.inputItemObj.id) {
                $scope.findNode($scope.collection);
            }

            $scope.toggleOpen = function () {
                $scope.dropItem.isOpen = true;
            };

            $scope.toggleBlur = function () {
                $timeout(function () {
                    $scope.dropItem.isOpen = false;
                }, 200);
            };

            $scope.toggleFocus = function () {
                $scope.dropItem.isOpen = true;
            };

            $scope.selectValue = function (member) {
                $scope.inputItemObj.id = member.id;
                $scope.inputItemObj.name = member.name;
            }

            $scope.$watch("collection", function (a) {
                $scope.findNode(a);
            })
        }
    }
}]);

app.directive('cwPiechart', function () {
    return {
        require: '?ngModel',
        restrict: 'EA',
        replace: false,
        link: function (scope, element, attrs, ngModel) {
            var opts = angular.extend({
                exporting: {
                    enabled: false
                },
                title: {
                    text: "",
                    enabled: true
                },
                unit: "",
                size: "250px"
            }, scope.$eval(attrs.cwPiechart));
            scope.$watch(opts.data, function (v) {
                $(element).highcharts({
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'pie'
                    },
                    exporting: opts.exporting,
                    title: opts.title,
                    // tooltip: {
                    //     pointFormat: '<b>{point.y}</b>',
                    //     color: '#fcfcfc'
                    // },
                    tooltip: {
                        pointFormat: '{point.y}' + opts.unit
                    },
                    credits: {enabled: false},
                    plotOptions: {
                        pie: {
                            size: opts.size,
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                style: {
                                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                }
                            }
                        }
                    },
                    // dataLabels: {
                    //     enabled: true,
                    //     color: '#fcfcfc',
                    //     connectorColor: '#4572A7'
                    // },
                    series: [{
                        data: v
                    }]
                });
            }, true);
        }
    }
});

app.directive('cwDatetimepicker', function () {
    return {
        require: '?ngModel',
        restrict: 'EA',
        transclude: true,
        link: function ($scope, element, attr, ngModel) {
            $scope.inputItemObj = $scope.$eval(attr.ngModel);
            $(element).kendoDateTimePicker({
                value: $scope.inputItemObj,
                format: "yyyy-MM-dd HH:mm"
            });
            // $(element)[0].readOnly = true;

        }
    }
});


app.directive('cwServercheck', ['sysService', '$modal', "errorModal", 'loading', function (sysService, $modal, errorModal, loading) {
    return {
        require: '?ngModel',
        template: '<div><form ng-submit="cwAdusercheck_checkEmployee()">\
            <input type="text" ng-disabled="dialogDisabled" class="{{dialogClass}}" style="width:150px;" input-hint="{{dialogTitle}}" ng-change="cwAdusercheck_filterOnChange();" ng-model="cwAdusercheck_selectedEmployee.displayName" cw-underline="cwAdusercheck_selected" />\
            <button style="margin-top:-4px;" ng-disabled="dialogDisabled" ng-click="cwAdusercheck_checkEmployee();" type="button" class="btn btn-sm btn-info">\
                  检查姓名\
            </button></form></div>',
        scope: {dialogTitle: '@', dialogClass: "@", dialogDisabled: "@"},
        restrict: 'A',
        replace: true,
        link: function (scope, element, attrs, ngModel) {
            var opts;
            opts = angular.extend({
                onCallBack: function (selectedEmployee) {

                },
                userModel: ""
            }, scope.$parent.$eval(attrs.cwAdusercheck));
            scope.cwAdusercheck_selectedEmployee = scope.$parent.$eval(attrs.ngModel);
            scope.cwAdusercheck_selected = false;
            scope.cwAdusercheck_checkEmployee = function () {
                var filterText = scope.cwAdusercheck_selectedEmployee.displayName;
                if (filterText == '' || filterText == undefined) {
                    errorModal.open(['请输入查询条件！']);
                    return;
                }
                loading.open();
                userService.search_server({filterStr: filterText}, {}, function (res) {
                    loading.close();
                    if (!res.is_success) {
                        errorModal.open(res.message.split(";"));
                        return;
                    }
                    var data = res.data;
                    if (data.length == 0) {
                        errorModal.open(["找不到与" + filterText + "匹配的用户"]);
                    } else if (data.length == 1) {
                        scope.cwAdusercheck_selectedEmployee.displayName = data[0].displayName;
                        scope.cwAdusercheck_selectedEmployee.account = data[0].account;
                        scope.cwAdusercheck_selectedEmployee.mail = data[0].mail;
                        scope.cwAdusercheck_selected = true;
                        opts.onCallBack(scope.cwAdusercheck_selectedEmployee);
                    } else {
                        var modalInstance = $modal.open({
                            templateUrl: static_url + 'client/views/Utilities/serverSelect.html',
                            controller: 'serverSelectCtrl',
                            windowClass: 'dialogUserSelect',
                            backdrop: 'static',
                            resolve: {
                                employeeList: function () {
                                    data.title = '用户';
                                    return data;
                                }
                            }
                        });
                        modalInstance.result.then(
                            function (selected) {
                                scope.cwAdusercheck_selectedEmployee.displayName = selected.displayName;
                                scope.cwAdusercheck_selectedEmployee.account = selected.account;
                                scope.cwAdusercheck_selectedEmployee.mail = selected.mail;
                                scope.cwAdusercheck_selected = true;
                                opts.onCallBack(scope.cwAdusercheck_selectedEmployee);
                            });
                    }
                });
            };
            scope.cwAdusercheck_filterOnChange = function () {
                scope.cwAdusercheck_selected = false;
                scope.cwAdusercheck_selectedEmployee.account = '';
            };
            scope.$watch(opts.userModel, function (a) {
                if (a != undefined)
                    scope.cwAdusercheck_selectedEmployee = a;
            })
        }
    }
}])

app.directive('cwSelect2', ["$timeout", function ($timeout) {
    return {
        require: '?ngModel',
        restrict: 'EA',
        transclude: true,
        link: function ($scope, elem, attr, ngModel) {
            $scope.inputItemObj = $scope.$eval(attr.ngModel);
            $scope.opt = angular.extend({
                data: "",
                multiple: false,
                modelDate: ""
            }, $scope.$eval(attr.cwSelect2));
            var modelDate = $scope.opt.multiple ? $scope.inputItemObj.split(",") : $scope.inputItemObj
            $scope.newData = [];
            $scope.$watch("opt.data", function (a) {
                if (a != undefined) {
                    $scope.newData = a;
                    $(elem).select2({data: a, multiple: $scope.opt.multiple});
                    $(elem).select2("val", modelDate);
                }
            });

            $scope.$watch("opt.data" + ".length", function (a) {
                if (a != undefined && a != 0) {
                    $(elem).select2({data: $scope.newData, multiple: $scope.opt.multiple});
                    $(elem).select2("val", modelDate);
                }
            });

            $scope.$watch($scope.opt.modelDate, function (a) {
                if (a != undefined) {
                    if (a == "") {
                        var newDate = $scope.opt.multiple ? [] : "";
                        $(elem).select2("val", newDate);

                    }
                }
            })
        }
    }
}]);
app.directive('cwSelectstr2', ["$timeout", function ($timeout) {
    return {
        require: '?ngModel',
        restrict: 'EA',
        transclude: true,
        link: function ($scope, elem, attr, ngModel) {
            $scope.inputItemObj = $scope.$eval(attr.ngModel);
            var opt = angular.extend({
                data: "",
                multiple: false,
                modelData: "",
                modelText: ""
            }, $scope.$eval(attr.cwSelectstr2));
            $scope.newData = [];
            $scope.$watch(opt.data, function (a) {
                if (a != undefined) {
                    $scope.newData = a;
                    $(elem).select2({data: a, multiple: opt.multiple});
                    if ($scope.inputItemObj != undefined) {
                        var dataObj = opt.multiple ? $scope.inputItemObj.split(",") : $scope.inputItemObj;
                        $(elem).select2("val", dataObj);
                    }
                }
            });

            $scope.$watch(opt.modelData, function (a) {
                if (a != undefined) {
                    var newDate;
                    if (a == "") {
                        newDate = opt.multiple ? [] : "";
                    }
                    else {
                        newDate = opt.multiple ? a.split(",") : a;
                    }
                    $(elem).select2("val", newDate);
                }
            })
        }
    }
}]);

app.directive('rgtablehtml', ["$compile", function ($compile) {//自定义html代码的写入
    return {
        require: '?ngModel',
        restrict: 'EA',
        link: function ($scope, el, attr) {
            if (attr.rgtablehtml) {
                var uploadInfo = $scope.$eval(attr.rgtablehtml)
                var ele = $compile(uploadInfo)($scope);
                angular.element(el).append(ele);
            }
        }
    }
}]);
app.directive('rgtable', function () {
    return {
        //     {
        //     bottom:100, 距离底部的距离
        //     overflowop:'false',  数据过多隐藏
        //     data: [  数据
        //         {a: '1', b: 2,c:2,d:2},
        //     ], title: [
        // i.rgtable_index
        //         {'title': 'ceshi','titlergclass':'dsl', 'enname': 'a','rgclass':'test',rghtml,rgwidth},
        //         {'title': 'ceshi1', 'enname': 'b'},
        //         {'title': 'ceshi1', 'enname': 'c'},
        //         {'title': 'ceshi1', 'enname': 'd'},
        //     ]
        // }
        require: '?ngModel',
        template: '<div class="mytablebody">\
            <div class="table_box">\
            <table>\
                <thead>\
                <th ng-if="mytable_all.checkoption"><input type="checkbox" ng-model="checkall.op" ng-change="mytable_chooseall()"></th>\
                <th ng-repeat="o in mytable_title" title="{{ o.title }}" class="{{o.titlergclass}}" style="width:{{o.rgwidth}}">\
                <span ng-if="!o.thtml" title="{{o.title}}">{{o.title}}</span><div ng-if="o.thtml" rgtablehtml="o.thtml"></div>\
                </th>\
                </thead>\
                <tbody ng-repeat="c in mytable_data">\
                <tr ng-repeat="i in c ">\
                    <td ng-if="mytable_all.checkoption">\
                        <input type="checkbox" ng-model="choose_data[i.id]">\
                    </td>\
                    <td title="{{ i.remarks }}" style="cursor: default;width:{{x.rgwidth}}" ng-click="mytablecha($event)" ng-repeat="x in mytable_title" class="{{x.ngclass}}">\
                    <div ng-if="x.rghtml" rgtablehtml="x.rghtml"></div><span title="{{i[x.enname]}}" ng-if="!x.rghtml">{{i[x.enname]}}</span>\
                    </td>\
                </tr>\
                </tbody>\
            </table>\
            </div>\
            <div class="table_control">\
                <div style="float: left">条目总数：{{ mytable_option.mytable_count }}&nbsp;&nbsp;&nbsp;&nbsp;每页{{mytable_option.mytable_num}}</div>\
                <div style="float: right">当前第<input type="number" ng-keyup="entersearchbtn($event)" style="width: 35px;line-height: 1em;border: 1px solid #d7d7d7;margin: 0 5px" ng-model="mytable_option.mytable_show">页&nbsp;<a ng-click="reload()">跳转</a>&nbsp;&nbsp;&nbsp;共{{mytable_option.mytable_pagenum}}页</div>\
                 <div style="float: right;margin-left: 5px">\
                    <a ng-click="mytable_fir()">首页</a>\
                    <a ng-click="mytable_backnext()">上一页</a>\
                    <a ng-click="mytable_next()">下一页</a>\
                    <a ng-click="mytable_last()">尾页</a>\
                </div>\
             </div>\
        </div>',
        link: function ($scope, el, attr) {
            $scope.checkall = {op: false}
            $scope.mytable_option = {
                mytable_show: 1,//当前的页数
                mytable_num: 5, //一页显示的数据
                mytable_pagenum: 0,//共多少页
                mytable_count: 0, //数据总数
            }

            $scope.mytable_data = []
            $scope.mytable_title = []
            $scope.mytable_all = []
            $scope.mytable_data_back = []
            $scope.mytable_next = function () {//下一页
                $scope.mytable_option.mytable_show - 1 < $scope.mytable_option.mytable_pagenum - 1 ? $scope.mytable_option.mytable_show = angular.copy($scope.mytable_option.mytable_show) + 1 : $scope.mytable_option.mytable_show = angular.copy($scope.mytable_option.mytable_show);
                $scope.mytable_data = [$scope.mytable_data_back[$scope.mytable_option.mytable_show-1]]
            }
            $scope.mytable_last = function () {//最后一页
                $scope.mytable_option.mytable_show = angular.copy($scope.mytable_option.mytable_pagenum)
                $scope.mytable_data = [$scope.mytable_data_back[$scope.mytable_option.mytable_show-1]]
            }
            $scope.mytable_backnext = function () {//上一页
                $scope.mytable_option.mytable_show > 1 ? $scope.mytable_option.mytable_show = angular.copy($scope.mytable_option.mytable_show) - 1 : $scope.mytable_option.show = angular.copy($scope.mytable_option.mytable_show);
                $scope.mytable_data = [$scope.mytable_data_back[$scope.mytable_option.mytable_show-1]]
            }
            $scope.mytable_fir = function () {//第一页
                $scope.mytable_option.mytable_show = 1
                $scope.mytable_data = [$scope.mytable_data_back[$scope.mytable_option.mytable_show-1]]
            }
            $scope.mytable_change = function () {//计算table高度
                var bottom_len = 0
                if ($scope.mytable_all.bottom) {//自定也距离底部的距离
                    bottom_len = parseInt($scope.mytable_all.bottom)
                }
                var height = $('body').height() - $(el).offset().top - bottom_len - 30
                //30为控制区域的高度
                $('.table_box').css('height', height)
            }
            $scope.on = function (res) {//自适应的计算，先计算table高度，然后计算一页显示多少条数据
                $scope.mytable_change()
                var box = $('.mytablebody .table_box').height()
                var thfontsize = 14
                var tdfontsize = 12
                var bodyfontsize = parseInt($('body').css('font-size').split('px')[0])
                if (bodyfontsize > 12) {
                    tdfontsize = bodyfontsize
                }
                if (bodyfontsize > 14) {
                    thfontsize = bodyfontsize
                    tdfontsize = bodyfontsize
                }
                var th = thfontsize * 1.5 + 10 + 1
                var td = tdfontsize * 1.5 + 10 + 1 + 0.5
                var num = Math.floor((box - th) / td)
                if (num <= 0) {
                    num = 1
                }
                $scope.mytable_option.mytable_num = num
                $scope.mytable_data_change(res)
            }
            $scope.mytablecha = function (e) { //数据过多会隐藏显示省略号，点击后显示
                if ($scope.mytable_overop == 'true') {
                    var obj_tag = e.target
                    if ($(e.target)[0].tagName == 'SPAN') {
                        obj_tag = $(e.target).parent('td')
                    }
                    if ($(obj_tag).css('white-space') == 'nowrap') {
                        $(obj_tag).css('white-space', 'normal')
                    } else {
                        $(obj_tag).css('white-space', 'nowrap')
                    }
                }
            }
            $scope.mytable_chooseall = function () {
                var middata = $scope.mytable_data[0]
                if ($scope.checkall.op) {
                    for (i in middata) {
                        if (middata[i].id) {
                            $scope.choose_data[middata[i].id] = true
                        }
                    }
                } else {
                    for (i in middata) {
                        if (middata[i].id) {
                            $scope.choose_data[middata[i].id] = false
                        }
                    }
                }
            }
            $scope.choose_data = {}
            $scope.mytable_data_change = function (res) { //计算分页数据
                get_data = $scope.$eval(res.data) || []
                $scope.choose_data = $scope.$eval(res.checkdata) || {}
                // get_data = res.data || []
                if ($scope.$eval(attr.rgtable).rgindex) {
                    for (i in get_data) {
                        get_data[i].rgtable_index = parseInt(i)
                    }
                }
                var mid_data = []
                $scope.mytable_option.mytable_count = get_data.length
                $scope.mytable_option.mytable_pagenum = Math.ceil(get_data.length / $scope.mytable_option.mytable_num)
                if ($scope.mytable_option.mytable_show - 1 > $scope.mytable_option.mytable_pagenum) {
                    $scope.mytable_option.mytable_show = 1
                }
                for (var i = 0; i < Math.ceil(get_data.length / $scope.mytable_option.mytable_num); i++) {
                    mid_data.push(get_data.slice(i * $scope.mytable_option.mytable_num, (i + 1) * $scope.mytable_option.mytable_num))
                }
                $scope.mytable_data_back = mid_data
                $scope.mytable_data = [mid_data[$scope.mytable_option.mytable_show-1]]

            }
            var option_data = $scope.$eval(attr.rgtable).data
            $scope.$watch(option_data, function (a) {
                if ($scope.$eval(attr.rgtable)) {
                    $scope.mytable_title = $scope.$eval(attr.rgtable).title
                    $scope.mytable_all = $scope.$eval(attr.rgtable)
                    $scope.mytable_overop = $scope.$eval(attr.rgtable).overflowop || 'true'
                    $scope.on($scope.$eval(attr.rgtable))
                }
            }, true)
            window.onresize = function () {
                $scope.reload()
                $scope.$apply()
            }
            $scope.reload = function () { //改变页数时，进行重新计算
                if (CWApp.isNum($scope.mytable_option.mytable_show)) {
                    if (($scope.mytable_option.mytable_show - 1) < 0) {
                        $scope.mytable_option.mytable_show = 1
                    }
                    if ($scope.mytable_option.mytable_pagenum != 0) {
                        if ($scope.mytable_option.mytable_show > $scope.mytable_option.mytable_pagenum) {
                            $scope.mytable_option.mytable_show = angular.copy($scope.mytable_option.mytable_pagenum)
                        }
                    }
                } else {
                    return
                }
                $scope.on($scope.mytable_all)
            }
            $scope.entersearchbtn = function (e) {//回车搜索
                var keycode = window.event ? e.keyCode : e.which;
                if (keycode == 13) {
                    $scope.reload()
                }
            }

        }
    }
});