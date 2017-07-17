var organizationData;//所有机构
var meetingRoomData = {};//所有会议室
var currentCount = 10;//每一页显示的条数
var admin_token; //全局token
var nowId;//全局会议室ID
//分页显示公用方法
function paging_mode(start, end) {
    document.getElementById("contentBox").innerHTML = "";
    for (var i = start; i < end; i++) {
        var new_meetingroom = new MeetingRoom(meetingRoomData[i]);
    }
}
function MeetingRoom(meetingroom_data) {
    //DATA
    this.id = meetingroom_data.id;
    this.roomName = meetingroom_data.name;
    this.roomNum = meetingroom_data.orgManagerName;
    this.capacity = meetingroom_data.orgManagerPassword;
    this.descriptions = meetingroom_data.remark;
    this.live = meetingroom_data.liveFlag
    this.record = meetingroom_data.recordFlag
    this.allow = meetingroom_data.allowStreams
    this.schemeName = meetingroom_data.schemeName;
    this.schemeId = meetingroom_data.schemeId;
    this.maxSimultaneous = meetingroom_data.maxSimultaneous;
    this.autoChangePasswd = meetingroom_data.autoChangePasswd;
    if (this.roomName == undefined) {
        this.roomName = ''
    }
    if (this.roomNum == undefined) {
        this.roomNum = ''
    }
    if (this.schemeName == undefined) {
        this.schemeNamegul = ''
    }
    if (this.capacity == undefined) {
        this.capacity = ''
    }
    if (this.orgName == undefined) {
        this.orgName = ''
    }
    //DOM
    this.ul_element = document.createElement("ul");
    this.ul_element.className = "li-head-orgs";
    this.li_name = document.createElement("li");
    if (this.roomName.length > 25) {
        this.li_name.innerHTML = this.roomName.substring(0, 25) + "...";
        this.li_name.title = this.roomName;
    } else {
        this.li_name.innerHTML = this.roomName;
    }
    this.li_cap2 = document.createElement("li");
    this.li_cap2.innerHTML = this.schemeName;
    this.li_cap2.className = "plan-list";

    this.li_name.className = "org-name";
    this.li_num = document.createElement("li");
    this.li_num.innerHTML = this.roomNum;
    this.li_num.className = "org-id";
    this.li_cap = document.createElement("li");
    this.li_cap.innerHTML = this.capacity;
    this.li_cap.className = "org-password";
    this.li_org = document.createElement("li");
    this.li_org.innerHTML = this.orgName;
    this.li_org.className = "org-time";
    this.li_option = document.createElement("li");
    this.li_option.className = "description1";
    this.img2 = document.createElement("img");
    this.img2.src = "image/description2.png";
    this.img2.title = "修改"
    this.img2.addEventListener("click", this.updateRoom.bind(this), false);
    this.img3 = document.createElement("img");
    this.img3.src = "image/description3.png";
    this.img3.title = "删除"
    this.img3.addEventListener("click", this.deleteRoom.bind(this), false);
    this.li_option.appendChild(this.img2);
    this.li_option.appendChild(this.img3);
    this.ul_element.appendChild(this.li_name);
    this.ul_element.appendChild(this.li_cap2);
    this.ul_element.appendChild(this.li_num);
    this.ul_element.appendChild(this.li_cap);
    this.ul_element.appendChild(this.li_option);
    document.getElementById("contentBox").appendChild(this.ul_element);
}
MeetingRoom.prototype.updateRoom = function () {
    // TODO: 获取数据后需要初始化“会议结束后是否更新密码”的选择框
    $("#datatime2").datetimepicker();

    $(".editor-org").show();
    $(".bcgs").show();
    var getList = function () {

        var url1 = url + 'cloudpServer/v1/charging/getDropDownList?token=' + admin_token;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", url1, false);
        // xmlhttp.setRequestHeader("token", this.token);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send();

        if (xmlhttp.status == 200) {
            var codes = JSON.parse(xmlhttp.responseText)
            if (codes.code == 0) {
                var str = '';
                var length = codes.data.length;
                for (var i = 0; i < length; i++) {
                    console.log(i);
                    str += '<option value="' + codes.data[i].id + '">' + codes.data[i].shemeName + '</option>';
                }
                $('.plan-list').html(str);


            }
            else {

            }
            return codes;
        } else {
            console.log(JSON.parse(xmlhttp.responseText));
        }
    };
    var result = getList();
    if (this.live == 0) {
        $("#radios8").attr("checked", true)
    }
    if (this.record == 0) {
        $("#radios6").attr("checked", true)
    }
    console.log('edit show:', this);
    $(".a11").val(this.roomName);
    $(".a22").val(this.roomNum);
    $(".a33").val(this.capacity);
    $("#a44 option[value='" + this.schemeId + "']").attr("selected", "selected");
    $("#live-counts1").val(this.allow)
    $("input[name='changePasswordAfterMeeting_edit']:checked").val();
    $("#maxSimultaneous_edit").val(this.maxSimultaneous);
    // $(".a44").val(this.orgName);
    if (this.autoChangePasswd == 0) {
        $("#changepass-no-edit").attr('checked', 'checked');
    } else {
        $("#changepass-yes-edit").attr('checked', 'checked');
    }
    $(".a55").val(this.descriptions);
    nowId = this.id;
}
MeetingRoom.prototype.deleteRoom = function () {
    var deleteID = this.id;
    var orgnames = $("#orgSelect").val()
    $(".alerts-delet").show()
    $(".bcgs").show()
    $(".delet-sure").click(function () {
        $.ajax({
            type: 'delete',
            url: url + 'cloudpServer/v1/orgs/' + deleteID + '/?token=' + admin_token,
            success: function (data) {
                console.log("删除成功");
                if (data.code == 0) {
                    $(".bcgs").show()
                    $(".alerts").show()
                    $(".alert-content").html("删除成功")
                    $(".alert-sure").click(function () {
                        $(".bcgs").hide()
                        $(".add-org").hide()
                        $(".title5").click()
                    })
                    for (var i = 0; i < meetingRoomData.length; i++) {
                        if (deleteID == meetingRoomData[i].id) {
                            meetingRoomData.splice($.inArray(meetingRoomData[i], meetingRoomData), 1);
                            var a = parseInt($(".current-page").html());
                            var b = $(".page-count").html();
                            var c = $(".content-totals").html();
                            var d = Math.ceil(meetingRoomData.length / currentCount);
                            if (a < d) {
                                paging_mode((a - 1) * currentCount, a * currentCount);
                            } else {
                                paging_mode((a - 1) * currentCount, meetingRoomData.length);
                                $(".page-count").html(d);
                            }
                            totals = meetingRoomData.length;
                            $(".content-totals").html(meetingRoomData.length);
                        }
                    }
                }
                else {
                    $(".bcgs").show()
                    $(".alerts").show()
                    $(".alert-content").html("删除失败")
                }

            },
            error: function (erro) {
                console.log(erro);
            }
        })
    })
}
$(document).ready(function () {
    function GetRequest() {
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }

    var Request = new Object();

    Request = GetRequest();
    admin_token = Request.token;
    var lefts = $(".box-left a")
    var a = lefts.length
    for (var i = 0; i < a; i++) {
        lefts.eq(i).click(function () {
            if ($(this).hasClass('a7')) {
                location.href = '../login.html';
            }
            else if ($(this).hasClass('a1')) {
                location.href = 'status.html?token=' + admin_token;
            }
            else if ($(this).hasClass('a2')) {
                location.href = 'org-management.html?token=' + admin_token;
            }
            else if ($(this).hasClass('a3')) {
                location.href = 'meetingroom-management.html?token=' + admin_token;
            }
            else if ($(this).hasClass('a4')) {
                location.href = 'user-management.html?token=' + admin_token;
            }
            else if ($(this).hasClass('a5')) {
                location.href = 'device-management.html?token=' + admin_token;
            }
        })
    }
    //移除事件 并重新绑定
    var _endArg = $('.a-end');
    _endArg.unbind('click');
    _endArg.on('click', 'div', function (event) {
        event.preventDefault;
        if ($(this).hasClass('charge-plan')) {
            // 计费方案页面
            location.href = 'angular.html?name=' + admin_token + '#!/main/charge-plan';
        }
        else if ($(this).hasClass('charge-combo')) {
            // 计费套餐页面
            location.href = 'angular.html?name=' + admin_token + '#!/main/charge-combo';
        }
        else if ($(this).hasClass('charge-account')) {
            // 计费账号页面
            location.href = 'angular.html?name=' + admin_token + '#!/main/charge-account';
        }
        else if ($(this).hasClass('count')) {

            var $useCount = $('.use-count');
            var $liveCount = $('.live-count');

            if ($useCount.hasClass('hide')) {
                $useCount.removeClass('hide');
            } else {
                $useCount.addClass('hide');
            }

            if ($liveCount.hasClass('hide')) {
                $liveCount.removeClass('hide');
            } else {
                $liveCount.addClass('hide');
            }
        }
        else if ($(this).hasClass('use-count')) {
            window.location.href = "./angular.html?name=" +admin_token + "#!/main/use-count";
        }
        else if ($(this).hasClass('statistics-concurrent')) {
            // 统计信息页面
            location.href = 'angular.html?name=' + admin_token + '#!/main/statistics-concurrent';
        }
    })

    function firstShowList(data) {
        meetingRoomData = data.data;
        totals = meetingRoomData.length;
        totalPage = Math.ceil(totals / currentCount);
        $(".current-page").html(1);
        $(".page-count").html(totalPage);
        $(".content-totals").html(totals);
        if (totals <= currentCount) {
            paging_mode(0, totals);
        } else {
            paging_mode(0, currentCount);
        }
    }

    $.ajax({
        type: "get",
        url: url + 'cloudpServer/v1/orgs/?token=' + admin_token,
        success: function (data) {
            firstShowList(data);
        },
        error: function (erro) {
            console.log(erro);
        }
    });
    //查询机构
    $(".title5").click(function () {
        var organId = encodeURI($("#orgSelect").val());
        console.log(organId)
        if ((organId == null) || (organId == '')) {
            location.reload()
            return false
        }
        else {


            var url1 = url + 'cloudpServer/v1/orgs/name/' + organId + '?token=' + admin_token;
            console.log(url1)
            $.ajax({
                type: "get",
                url: url1,
                success: function (data) {
                    if (data.code == 0) {
                        if (data.data.length == 0) {
                            $(".add-org").hide()
                            $(".alerts").show()
                            $(".bcgs").show()
                            $(".alert-content").html("没有符合条件的会议室")
                            $(".alert-sure").click(function () {
                                $(".add-org").hide()
                                location.reload()
                            })
                            return;
                        }
                    } else {
                        openAlertWin(data.mes);
                    }
                    firstShowList(data);

                },
                error: function (erro) {
                    console.log(erro);
                }
            })
        }
    });
    //会议室列表跳到首页
    $("#firstPage").click(function () {
        var currentPage = $(".current-page").html();//当前页码
        var pageCount = $(".page-count").html();//总页数
        var countTotal = $(".content-totals").html();//总条数
        if (currentPage == 1 || currentPage == null) {
            return;
        }
        paging_mode(0, currentCount);
        $(".current-page").html(1);
    });
    //前一页
    $("#prev").click(function () {
        var currentPage = $(".current-page").html();//当前页码
        var pageCount = $(".page-count").html();//总页数
        var countTotal = $(".content-totals").html();//总条数
        if (currentPage == 1) {
            $(".page").show()
            $(".alert-content").html("前面没有了")
            $(".bcgs").show()
            return;
        }
        paging_mode((currentPage - 2) * currentCount, (currentPage - 1) * currentCount);
        $(".current-page").html(parseInt(currentPage) - 1);//当前页码
    });
    //下一页
    $("#next").click(function () {
        var currentPage = $(".current-page").html();//当前页码
        var pageCount = $(".page-count").html();//总页数
        var countTotal = $(".content-totals").html();//总条数
        if (currentPage == totalPage) {
            $(".page").show()
            $(".alert-content").html("后面没有了")
            $(".bcgs").show()
            return;
        }
        if (pageCount - currentPage == 1) {
            paging_mode(currentPage * currentCount, totals);
        } else {
            paging_mode(currentPage * currentCount, (parseInt(currentPage) + 1) * currentCount);
        }
        $(".current-page").html(parseInt(currentPage) + 1);//当前页码
    });
    //会议室列表跳到尾页
    $("#lastPage").click(function () {
        var currentPage = $(".current-page").html();//当前页码
        var pageCount = $(".page-count").html();//总页数
        var countTotal = $(".content-totals").html();//总条数
        if (currentPage == pageCount) {
            console.log("已经是尾页");
            return;
        }
        paging_mode((pageCount - 1) * currentCount, totals);
        $(".current-page").html(pageCount);//当前页码
    });
    //按输入框值跳转页码
    $("#page-jump").click(function () {
        var currentPage = $(".current-page").html();//当前页码
        var pageCount = $(".page-count").html();//总页数
        var countTotal = $(".content-totals").html();//总条数
        var str = parseInt($(".page-num").val());
        if (str.length != 0) {
            var reg = /^[0-9]*$/;
            if (reg.test(str)) {
                if (str > 0 && str <= pageCount) {
                    if (str == pageCount) {
                        paging_mode((str - 1) * currentCount, countTotal);
                    } else {
                        paging_mode((str - 1) * currentCount, str * currentCount);
                    }
                    $(".current-page").html(str);
                    return;
                }
            }
        }
        $(".page-num").val("");
    });
    $(".title7").click(function () {
        var getList = function () {

            var url1 = url + 'cloudpServer/v1/charging/getDropDownList?token=' + admin_token;
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", url1, false);
            // xmlhttp.setRequestHeader("token", this.token);
            xmlhttp.setRequestHeader("Content-Type", "application/json");
            xmlhttp.send();

            if (xmlhttp.status == 200) {
                var codes = JSON.parse(xmlhttp.responseText)
                console.log(JSON.parse(xmlhttp.responseText))
                if (codes.code == 0) {
                    var str = '';
                    var length = codes.data.length;
                    for (var i = 0; i < length; i++) {
                        console.log(i);
                        str += '<option value="' + codes.data[i].id + '">' + codes.data[i].shemeName + '</option>';
                    }
                    $('.plan-list').html(str);


                }
                else {

                }
            } else {
                console.log(JSON.parse(xmlhttp.responseText));
            }
        };
        getList();
        $(".bcgs").show()
        $(".add-org").show()
        $("#datatime1").datetimepicker();
        // $(".meetingroomradio").change(function() {
        // 	var a=$("input[name='radiochooseCreat1']:checked").val()
        // 	var b=$("input[name='radiochooseCreat2']:checked").val()
        // 	if((a==1)&&(b==1)){}
        // }
        $(".true").click(function () {
            // TODO: 新建
            var a = $("#add-a11").val()
            var b = $("#add-a22").val()
            var c = $.trim($("#add-a33").val())
            var d0 = $('#a44 option:selected').val();
            var d1 = $("input[name='radiochooseCreat1']:checked").val()
            var d2 = $("input[name='radiochooseCreat2']:checked").val()
            var d3 = $("#live-counts").val()
            var e = $("#add-a55").val()
            var f = /^\d{6}$/;
            var maxSimultaneous = $("#maxSimultaneousCreate").val();
            var autoChangePasswd = $("input[name='changePasswordAfterMeeting']:checked").val();

            if ((a == '') || (b == '') || (c == '')) {
                $(".add-org").hide()
                $(".bcgs").show()
                $(".meetingroom-form").hide();
                $(".alerts").show();
                $(".alert-content").html('请完善信息')
                return false
            }
            else {

                var data = {
                    "name": a,
                    "remark": e,
                    "isActive": 0,
                    "schemeId": d0,
                    "liveFlag": d2,
                    "recordFlag": d1,
                    "allowStreams": d3,
                    "orgManagerName": b,
                    "orgManagerPassword": c,
                    maxSimultaneous: maxSimultaneous,
                    autoChangePasswd: autoChangePasswd,
                }
                var url1 = url + 'cloudpServer/v1/orgs/?token=' + admin_token;
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.open("POST", url1, false);
                // xmlhttp.setRequestHeader("token", this.token);
                xmlhttp.setRequestHeader("Content-Type", "application/json");
                // debugger;
                var aaaa = JSON.stringify(data);
                xmlhttp.send(JSON.stringify(data));

                if (xmlhttp.status == 200) {
                    var codes = JSON.parse(xmlhttp.responseText)
                    console.log(JSON.parse(xmlhttp.responseText))
                    if (codes.code == 0) {
                        $(".add-org").hide()
                        $(".alerts").show()
                        $(".bcgs").show()
                        $(".alert-content").html("创建成功")
                        $(".alert-sure").click(function () {
                            $(".add-org").hide()
                            location.reload()
                        })
                    }
                    else {
                        $(".add-org").hide()
                        $(".alerts").show()
                        $(".bcgs").show()
                        $(".alert-content").html(codes.mes)
                        $(".alert-sure").click(function () {
                            $(".add-org").hide()
                            location.reload()
                        })
                    }
                } else {
                    console.log("faile");
                    console.log(JSON.parse(xmlhttp.responseText));
                }
            }
        })
    })
    $(".trues").click(function () {
        // TODO: 编辑
        var nm = $.trim($("#org-a11").val());
        // var datas=$("#datatime2").val()+':00'
        var hP = $("#org-a22").val();
        var gP = $("#org-a33").val();
        var dP = $("#org-a55").val()
        var d0 = $('.plan-list option:selected').eq(1).val();
        var d1 = $("input[name='radiochooseCreat3']:checked").val()
        var d2 = $("input[name='radiochooseCreat4']:checked").val()
        var d3 = $("#live-counts1").val()
        var c = /^\d{6}$/;
        var d = /^[0-9]*$/;
        var autoChangePasswd = $("input[name='changePasswordAfterMeeting_edit']:checked").val();
        var maxSimultaneous = $("#maxSimultaneous_edit").val();

        if ((nm == '') || (hP == '') || (gP == '')) {
            $(".bcgs").show()
            $(".editor-org").hide();
            $(".alerts").show();
            $(".alert-content").html('请完善信息')
            $(".alert-sure").click(function () {
                $(".editor-org").show()
                $(".add-org").hide()
            })
            return false
        }
        else {
            var data = {
                id: nowId,
                name: nm,
                remark: dP,
                isActive: 0,
                liveFlag: d2,
                recordFlag: d1,
                schemeId: d0,

                allowStreams: d3,
                orgManagerName: hP,
                orgManagerPassword: gP,
                maxSimultaneous: maxSimultaneous,
                autoChangePasswd: autoChangePasswd
            }
            var url1 = url + 'cloudpServer/v1/orgs/?token=' + admin_token;
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("PUT", url1, false);
            // xmlhttp.setRequestHeader("token", this.token);
            xmlhttp.setRequestHeader("Content-Type", "application/json");
            xmlhttp.send(JSON.stringify(data));

            if (xmlhttp.status == 200) {
                var codes = JSON.parse(xmlhttp.responseText)
                console.log(JSON.parse(xmlhttp.responseText))
                if (codes.code == 0) {
                    $(".editor-org").hide()
                    $(".alerts").show()
                    $(".bcgs").show()
                    $(".alert-content").html("编辑成功")
                    $(".alert-sure").click(function () {
                        $(".editor-org").hide()
                        location.reload()
                    })
                }
                else {
                    $(".editor-org").hide()
                    $(".alerts").show()
                    $(".bcgs").show()
                    $(".alert-content").html("编辑失败")
                    $(".alert-sure").click(function () {
                        $(".editor-org").hide()
                        location.reload()
                    })
                }
            } else {
                console.log("faile");
                console.log(JSON.parse(xmlhttp.responseText));
            }
        }

    })
    $(".page-right").click(function () {
        $(".page").hide();
        $(".bcgs").hide();
    })
    $(".page-sure").click(function () {
        $(".page").hide();
        $(".bcgs").hide()
    })
    $(".alert-sure").click(function () {
        $(".alerts-delet").hide()
        $(".alerts").hide()
        $(".add-org").show()
        $(".bcgs").show()
    })
    $(".delet-cancel").click(function () {
        $(".alerts-delet").hide()
        $(".bcgs").hide()
    })
    $(".delet-right").click(function () {
        $(".alerts-delet").hide()
        $(".bcgs").hide()
    })
    $(".img-right").click(function () {
        location.reload()
    })
    $(".cancel").click(function () {
        location.reload();
    })
})