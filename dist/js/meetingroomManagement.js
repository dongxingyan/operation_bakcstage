var organizationData;//所有机构
var meetingRoomData;//所有会议室
var currentCount = 10;//每一页显示的条数
var admin_token; //全局token
var nowId = 0;//全局会议室ID
var nowOrgId = 0;
var alias_roomNum = "";
var alias_alias = "";
var selectorgname;
var values;
var th1;
var th2;
var th3;
var pexipmiaoshu;

/**
 * 增强这个页面
 * @type {{hideAutoUpdatePassword: gsHelper.hideAutoUpdatePassword}}
 */
var gsHelper = {
    /**
     * 自动变更密码
     * @param selectedOrgid
     */
    hideAutoUpdatePassword: function (selectedOrgid) {
        var org = gsHelper.orgs.filter(function (org) {
            return org.id == selectedOrgid;
        })[0];
        console.log('org.autoChangePasswd', org.autoChangePasswd);
        if (org.autoChangePasswd == 1) {
            console.log('auto update password: show');
            $(".auto-update-password-container label").show();
        }
        else {
            console.log('auto update password: hide');
            $(".auto-update-password-container label").hide();
        }
    }
};

void function () {
    $.ajax({
        type: "get",
        url: url + 'cloudpServer/v1/orgs/?token=' + admin_token,
        dataType: "json",
        success: function (data) {
            gsHelper.orgs = data.data;
        },
        error: function (erro) {
            openAlertWin("查询所有机构失败", true);
        }
    });
}();

$(function () {
    $("[data-select-org]").change(function (event) {
        console.log('org selector value change:', event);
        var selectedId = $(event.currentTarget).val();
        gsHelper.hideAutoUpdatePassword(selectedId);
    });
});

//分页显示公用方法
function paging_mode(start, end) {
    document.getElementById("contentBox").innerHTML = "";
    for (var i = start; i < end; i++) {
        var new_meetingroom = new MeetingRoom(meetingRoomData[i]);
    }
}
function MeetingRoom(meetingroom_data) {
    if (meetingroom_data.orgName == undefined) {
        meetingroom_data.orgName = "";
    }
    if (meetingroom_data.name == undefined) {
        meetingroom_data.name = "";
    }
    if (meetingroom_data.meetingRoomNum == undefined) {
        meetingroom_data.meetingRoomNum = "";
    }
    if (meetingroom_data.hostPassword == undefined) {
        meetingroom_data.hostPassword = "";
    }
    if (meetingroom_data.guestPassword == undefined) {
        meetingroom_data.guestPassword = "";
    }
    if (meetingroom_data.expirationDate == undefined) {
        meetingroom_data.expirationDate = "";
    }
    if (meetingroom_data.pexipDescription == undefined) {
        meetingroom_data.pexipDescription = "";
    }
    if (meetingroom_data.hostView == undefined) {
        // alert(1)
    }
    //DATA
    this.id = meetingroom_data.id;
    this.organId = meetingroom_data.organId;
    this.roomName = meetingroom_data.name;
    this.roomNum = meetingroom_data.meetingRoomNum;
    this.capacity = meetingroom_data.capacity;
    this.orgName = meetingroom_data.orgName;
    this.moshi = meetingroom_data.hostView;
    this.thid = meetingroom_data.themeId;
    this.thuid = meetingroom_data.themeUuid;
    this.thname = meetingroom_data.themeName;
    this.miaoshu = meetingroom_data.pexipDescription;
    this.autoChangePasswd = !!meetingroom_data.autoChangePasswd;
    console.log('data/auto change password:', meetingroom_data.autoChangePasswd);
    if (meetingroom_data.expirationDate && meetingroom_data.expirationDate.length > 10) {
        this.expirationDate = meetingroom_data.expirationDate.substring(0, 10);
    }
    this.hostPwd = meetingroom_data.hostPassword;
    this.guestPwd = meetingroom_data.guestPassword;
    this.allowGuestFlag = meetingroom_data.allowGuestFlag;
    //DOM
    this.ul_element = document.createElement("ul");
    this.ul_element.className = "li-head-meetingrooms";
    this.li_name = document.createElement("li");
    if (this.roomName && this.roomName.length > 9) {
        this.li_name.innerHTML = this.roomName.substring(0, 8) + "...";
        this.li_name.title = this.roomName;
    } else {
        this.li_name.innerHTML = this.roomName;
    }
    this.li_name.id = "meetingroom-name";
    this.li_num = document.createElement("li");
    this.li_num.innerHTML = this.roomNum;
    this.li_num.className = "meetingroom-number";
    this.li_cap = document.createElement("li");
    this.li_cap.innerHTML = this.capacity;
    this.li_cap.className = "meetingroom-people";
    this.li_org = document.createElement("li");
    if (this.orgName && this.orgName.length > 25) {
        this.li_org.innerHTML = this.orgName.substring(0, 25) + "...";
        this.li_org.title = this.orgName;
    } else {
        this.li_org.innerHTML = this.orgName;
    }
    this.li_org.className = "meetingroom-org";
    this.li_date = document.createElement("li");
    this.li_date.innerHTML = this.expirationDate;
    this.li_date.className = "meetingroom-data";
    this.li_option = document.createElement("li");
    this.li_option.className = "description";
    this.img1 = document.createElement("img");
    this.img1.src = "image/description1.png";
    this.img1.title = "别名管理";
    this.img1.addEventListener("click", this.optionAlias.bind(this), false);
    this.img2 = document.createElement("img");
    this.img2.src = "image/description2.png";
    this.img2.title = "修改";
    this.img2.addEventListener("click", this.updateRoom.bind(this), false);
    this.img3 = document.createElement("img");
    this.img3.src = "image/description3.png";
    this.img3.title = "删除";
    this.img3.addEventListener("click", this.deleteRoom.bind(this), false);
    this.li_option.appendChild(this.img1);
    this.li_option.appendChild(this.img2);
    this.li_option.appendChild(this.img3);
    this.ul_element.appendChild(this.li_name);
    this.ul_element.appendChild(this.li_num);
    this.ul_element.appendChild(this.li_cap);
    this.ul_element.appendChild(this.li_org);
    this.ul_element.appendChild(this.li_date);
    this.ul_element.appendChild(this.li_option);
    document.getElementById("contentBox").appendChild(this.ul_element);
}

MeetingRoom.prototype.optionAlias = function () {
    $("#bcgs2").show();
    $(".other-name").show();
    $(".other-head").html(this.roomNum);
    alias_roomNum = this.roomNum;
    $(".name-box").remove();
    $(".othername-input input").val("");
    $(".othername-input textarea").val("");
    $.ajax({
        type: 'get',
        url: url + 'cloudpServer/v1/orgs/vmrs/alias/' + this.roomNum + '/?token=' + admin_token,
        success: function (data) {
            console.log(data);
            $.each(data.data, function (i, item) {
                var room_alias = new RoomAlias(item);
            });
        },
        error: function (erro) {
            openAlertWin("获取别名列表失败", true);
        }
    });
};
MeetingRoom.prototype.updateRoom = function () {
    console.log('update room', this);

    nowOrgId = this.organId;
    values = this.moshi;
    th1 = this.thid;
    th2 = this.thuid;
    th3 = this.thname;
    selectorgname = this.orgName;
    $("#theme3").html('');
    $("#updateOrgSelect").val("");
    $("#bcgs2").show();
    $(".editor-form").show();
    var host;
    if (values == 'one_main_zero_pips') {
        host = '全屏主要发言者（单个语音切换布局）'
    }
    else if (values == 'one_main_seven_pips') {
        host = '较大的主要发言者和最多 7 位其他与会者(1 + 7 布局)'
    }
    else if (values == 'one_main_twentyone_pips') {
        host = '较小的主要发言者和最多 21 位其他与会者(1 + 21 布局)'
    }
    $.getJSON(url + 'cloudpServer/v1/orgs/vmrs/getAllIvr_theme?token=' + admin_token, function (data) {
        console.log('get all ivr theme res:', data);
        var departmentcount = data.data.length;
        html = '';
        for (var i = 0; i < departmentcount; i++) {
            html += '<option id="' + data.data[i].id + '" value="' + data.data[i].uuid + '">' + data.data[i].name + '</option>'
        }

        $('#theme3').append(html);
        for (var i = 0; i < $("#theme3 option").length; i++) {
            if ($("#theme3 option").eq(i).val() == th2) {
                $("#theme3 option").eq(i).attr('selected', true);
                break;
            }
        }
    });
    // $("#updateOrgSelect").attr("disabled",true);
    $("#updateRoomName").val(this.roomName);
    $("#updateRoomNum").val(this.roomNum);
    $("#updateCap").val(this.capacity);
    $("#updateDate").val(this.expirationDate);
    $("#updateDate").datetimepicker();
    nowId = this.id;
    $("#updateHostPwd").val(this.hostPwd);
    $("#add-a88").val(this.miaoshu);
    if (this.autoChangePasswd) {
        $("#radio_isAutoChangeYesEdit").attr('checked', 'checked');
        console.log('set radio to yes');
    } else {
        $("#radio_isAutoChangeNoEdit").attr('checked', 'checked');
        console.log('set radio to no');
    }
    $("#updateGuestPwd").val(this.guestPwd);
    for (var i = 0; i < $("#meeting-room1 option").length; i++) {
        if ($("#meeting-room1 option").eq(i).val() == values) {
            $("#meeting-room1 option").eq(i).attr('selected', true);
            break;
        }
    }
    $.ajax({
        type: "get",
        url: url + 'cloudpServer/v1/orgs/?token=' + admin_token,
        dataType: "json",
        success: function (data) {
            console.log('get orgs:', data);
            var departmentcount = data.data.length;
            html = '';
            for (var i = 0; i < departmentcount; i++) {
                html += '<option value="' + data.data[i].id + '">' + data.data[i].name + '</option>'
            }
            $('#updateOrgSelect').append(html);
            for (var i = 0; i < $("#updateOrgSelect option").length; i++) {
                if ($("#updateOrgSelect option").eq(i).val() == nowOrgId) {
                    $("#updateOrgSelect option").eq(i).attr('selected', true);
                    break;
                }
            }
            gsHelper.orgs = data.data;
            gsHelper.hideAutoUpdatePassword(nowOrgId);

            // console.log('selected org is: ' + org);
            // if (!org.autoChangePasswd) {
            //     console.log('hide auto-change-password');
            //     $("#update-auto-change-password").css('display', 'none');
            // } else {
            //     console.log('show auto-change-password');
            //     $("#update-auto-change-password").css('display', '');
            // }
        },
        error: function (erro) {
            openAlertWin("查询所有机构失败", true);
        }
    });


};
MeetingRoom.prototype.deleteRoom = function () {
    var deleteID = this.id;
    var delRoomNum = this.roomNum;
    $(".alerts-delet").show();
    $("#bcgs1").show();
    $(".alert-content").html("确定删除会议室吗？");
    $(".delet-sure").click(function () {
        $(".delet-sure").attr("disabled", true);
        $.ajax({
            type: 'delete',
            url: url + 'cloudpServer/v1/orgs/vmrs/' + delRoomNum + '?token=' + admin_token,
            success: function (data) {
                $(".alert-content").html("删除成功");
                $(".delet-sure").click(function () {
                    $(".bcgs").hide();
                    $(".alerts-delet").hide();
                    $(".title5").click()
                });
            },
            error: function (erro) {
                openAlertWin("删除会议室失败", true);
            }
        });
    })

};
//会议室别名
function RoomAlias(room_alias) {
    this.id = room_alias.id;
    this.meetingRoomNum = room_alias.meetingRoomNum;
    this.alias = room_alias.alias;
    this.aliasDescription = room_alias.aliasDescription;
    this.aliasDiv = document.createElement("div");
    this.aliasDiv.className = "name-box";
    this.aliasUl = document.createElement("ul");
    this.roomNumLi = document.createElement("li");
    this.roomNumLi.innerHTML = this.alias;
    this.changeAlias = document.createElement("li");
    this.changeImg = document.createElement("img");
    this.changeImg.src = "image/description2.png";
    this.changeImg.className = "name-editorimg";
    this.changeImg.title = "修改别名";
    this.changeImg.addEventListener("click", this.updateAlias.bind(this), false);
    this.deleteImg = document.createElement("img");
    this.deleteImg.src = "image/description3.png";
    this.deleteImg.title = "删除别名";
    this.deleteImg.addEventListener("click", this.deleteAlias.bind(this), false);
    this.changeAlias.appendChild(this.changeImg);
    this.changeAlias.appendChild(this.deleteImg);
    this.aliasUl.appendChild(this.roomNumLi);
    this.aliasUl.appendChild(this.changeAlias);
    this.aliasDiv.appendChild(this.aliasUl);
    $(".other-box").append(this.aliasDiv);
}
RoomAlias.prototype.updateAlias = function () {
    if (alias_roomNum == this.alias || this.alias == this.meetingRoomNum) {
        openAlertWin("禁止修改此别名", false);
    }
    $("#updataAlias").show();
    $("#addAlias").hide();
    $(".othername-input input").val(this.alias);
    $(".othername-input textarea").val(this.aliasDescription);
    aliasId = this.id;

};
RoomAlias.prototype.deleteAlias = function () {
    var deleteID = this.id;
    if (alias_roomNum == this.alias || this.meetingRoomNum == this.alias) {
        openAlertWin("禁止删除此别名", false);
        return;
    }
    var aliasDiv = $(this.aliasDiv);
    $(".alerts-delet").show();
    $("#bcgs1").show();
    $(".delet-sure").click(function () {
        $.ajax({
            type: 'delete',
            url: url + 'cloudpServer/v1/orgs/vmrs/alias/' + deleteID + '/?token=' + admin_token,
            success: function (data) {
                if (data.code == 0) {
                    aliasDiv.remove();
                    $(".alerts-delet").hide();
                    $("#bcgs1").hide();
                } else {
                    openAlertWin(data.mes, false);
                }
            },
            error: function (erro) {
                console.log(erro);
                openAlertWin("删除会议室失败", true);
                return;
            }
        });

    })
};
//提示弹窗隐藏方法
function hideAlertWinRefrsh() {
    $("#bcgs2").hide();
    $(".alerts").hide();
    location.reload();
}
function hideAlertWin() {
    $("#bcgs2").hide();
    $(".alerts").hide();
}
//弹出提示窗体
function openAlertWin(alert_word, flash) {
    $("#bcgs2").show();
    $(".alerts").show();
    $(".alert-content").html(alert_word);
    if (flash) {
        setTimeout('hideAlertWinRefrsh()', 3000);
    } else {
        setTimeout('hideAlertWin()', 3000);
    }
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
    var lefts = $(".box-left a");
    var a = lefts.length;
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
            //计费方案页面
            location.href = 'angular.html?name=' + admin_token + '#!/main/charge-plan';
        }
        else if ($(this).hasClass('charge-combo')) {
            //计费套餐页面
            location.href = 'angular.html?name=' + admin_token + '#!/main/charge-combo';
        }
        else if ($(this).hasClass('charge-account')) {
            //计费账号页面
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
    });

    //页面加载完查询所有机构
    $.ajax({
        type: "get",
        url: url + 'cloudpServer/v1/orgs/?token=' + admin_token,
        dataType: "json",
        success: function (data) {
            organizationData = data.data;
            $.each(data.data, function (i, item) {
                var option = document.createElement("option");
                option.value = item.id;
                option.innerHTML = item.name;
                document.getElementById("orgSelect").appendChild(option);
            });
        },
        error: function (erro) {
            openAlertWin("查询所有机构失败", true);
        }
    });
    //首次加载会议室列表
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

    //获取所有会议室详细信息
    var meetingRoomNum = "";
    var displayName = "";
    $.ajax({
        type: "get",
        url: url + 'cloudpServer/v1/orgs/vmrs/?token=' + admin_token,
        success: function (data) {
            firstShowList(data);
        },
        error: function (erro) {
            openAlertWin("获取所有会议室失败", true);
        }
    });

    //提示弹窗的确认按钮
    $(".alert-sure").click(function () {
        hideAlertWin();
    });
    //按条件查询会议室
    $(".title5").click(function () {
        var organId = $("#orgSelect option:selected").val();
        var meetingRoomNum = $(".title2").val();
        var displayName = encodeURI($("#conferrenceName").val());
        var url2 = url + 'cloudpServer/v1/orgs/vmrs/?token=' + admin_token;
        if (organId != null && organId != undefined && organId != "") {
            url2 = url2 + '&organId=' + organId;
        }
        if (meetingRoomNum != null && meetingRoomNum != "") {
            url2 = url2 + '&meetingRoomNum=' + meetingRoomNum
        }
        if (displayName != null && displayName != "") {
            url2 = url2 + '&name=' + displayName;
        }
        $.ajax({
            type: "get",
            url: url2,
            success: function (data) {
                if (data.code == 0) {
                    if (data.data.length == 0) {
                        openAlertWin("没有符合条件的会议室", false);

                        return;
                    }
                } else {
                    openAlertWin(data.mes, true);
                }
                firstShowList(data);
            },
            error: function (erro) {
                openAlertWin("条件查询失败", true);
            }
        });
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
            openAlertWin("当前为第一页", false);
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
            openAlertWin("已经是最后一页", false);
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
                if (str <= pageCount) {
                    console.log(str);
                    console.log(pageCount);
                    if (str == pageCount) {
                        paging_mode((str - 1) * currentCount, countTotal);
                    } else {
                        paging_mode((str - 1) * currentCount, str * currentCount);
                    }
                    $(".current-page").html(str);

                }
            }
            $(".page-num").val("");
        }
    });

    $(".page-num").keyup(function (e) {
        if (e.keyCode == 13) {
            $("#page-jump").click();
        }
    });
    //新建会议室
    $(".title6").click(function () {
        $("#bcgs2").show();
        $(".meetingroom-form").show();
        $(".editor-left").click();
        $('#theme').html('');
        $("#creatExpDate").datetimepicker();
        $("#creatExpDate1").datetimepicker();
        $.each(organizationData, function (i, item) {
            var option = document.createElement("option");
            option.value = item.id;
            option.innerHTML = item.name;
            document.getElementById("orgCreatSelect").appendChild(option);
        });
        $.getJSON(url + 'cloudpServer/v1/orgs/vmrs/getAllIvr_theme?token=' + admin_token, function (data) {
            var departmentcount = data.data.length;
            html = '';
            for (var i = 0; i < departmentcount; i++) {

                html += '<option id="' + data.data[i].id + '"value="' + data.data[i].uuid + '">' + data.data[i].name + '</option>'
            }
            $('#theme').append(html)
        })
    });
    //批量创建会议室时获取可用号码
    $(".change-code").click(function () {
        var count_num = $("#countRoomNum").val();
        var haoma = $("input[name='radiochooseCreat2']:checked").val();
        var creat_radio = $("input[name ='radiochooseNum']:checked").val();
        var creat_flag;
        if (creat_radio == "yes") {
            creat_flag = 1;
        } else {
            creat_flag = 0;
        }
        if (count_num == '') {
            $(".meetingroom-form").hide();
            $(".alerts").show();
            $(".alert-content").html("请填写号码数量");
            $(".alert-sure").click(function () {
                $(".meetingroom-form").show();
                $("#bcgs2").show()
            });
            return false
        }
        else if (count_num < 2) {
            $(".meetingroom-form").hide();
            $(".alerts").show();
            $(".alert-content").html("号码数量最少为两个");
            $(".alert-sure").click(function () {
                $(".meetingroom-form").show();
                $("#bcgs2").show()
            });
            return false;
        }
        else {
            $.ajax({
                type: 'get',
                url: url + 'cloudpServer/v1/orgs/vrms/count/' + count_num + '/flag/' + creat_flag + '/roomNumType/' + haoma + '?token=' + admin_token,
                success: function (data) {
                    var numStr = "";
                    if (data.code != 0) {
                        $(".alerts").show();
                        $(".alert-content").html(data.mes);
                        return;
                    }
                    for (var i = data.data.length - 1; i >= 0; i--) {
                        numStr += data.data[i].meetingRoomNum + " ";
                    }
                    $("#numTextArea").val(numStr);
                    $("#creatOK").attr("disabled", false);
                },
                error: function (erro) {
                    openAlertWin("获取号码失败", false);
                }
            })
        }

    });

    //关闭新建会议室窗体清空内容
    function empty_creatWin() {
        $("#orgCreatSelect").empty();
        $("#creatRoomName").val("");
        $("#creatRoomNum").val("");
        $("#creatCap").val("");
        $("#creatExpDate").val("");
        $("#creatHostPwd").val("");
        $("#creatGuestPwd").val("");
    }

    //关闭新建会议室窗体
    $("#creatCancel").click(function () {
        empty_creatWin();
        $(".meetingroom-form").hide();
        $("#bcgs2").hide();
    });
    //新建会议室窗体-失焦事件校验
    $("#creatRoomName").blur(function () {
        if ($(this).val() == "") {
            $(this).css({"border": "1px solid red"});
        } else {
            $(this).css({"border": "1px solid #c4c4c4"});
        }
    });
    $("#creatRoomNum").blur(function () {
        if ($(this).val() == "") {
            $(this).css({"border": "1px solid red"});
        } else {
            $(this).css({"border": "1px solid #c4c4c4"});
        }
    });
    $("#creatCap").blur(function () {
        if ($(this).val() == "") {
            $(this).css({"border": "1px solid red"});
        } else {
            $(this).css({"border": "1px solid #c4c4c4"});
        }
    });
    $("#creatExpDate").blur(function () {
        if ($(this).val() == "") {
            $(this).css({"border": "1px solid red"});
        } else {
            $(this).css({"border": "1px solid #c4c4c4"});
        }
    });
    //新建会议室完成并提交
    $("#creatOK").click(function () {
        var org_id = $("#orgCreatSelect option:selected").val();
        var room_name = $("#creatRoomName").val();
        var room_num = $("#creatRoomNum").val();
        var room_cap = $("#creatCap").val();
        var start_date = $("#creatExpDate1").val();
        var pexipdescrip = $("#add-a55").val();
        var expiration_date = $("#creatExpDate").val();
        var host_pwd = $("#creatHostPwd").val();
        var guest_pwd = $("#creatGuestPwd").val();
        var valuesname = $("#meeting-room option:selected").val();
        var themeid = $("#theme option:selected").attr("id");
        var themename = $("#theme option:selected").text();
        var themeuuid = $("#theme option:selected").val();
        var autoChangePasswd = $("[name='isAutoChange_create']:checked").val() - 0;
        var guest_flag = 0;
        console.log(expiration_date);
        if ($("input[name='radiochooseCreat']:checked").val() == "no") {
            guest_flag = 1;
        }
        if (org_id == "" || org_id == null || org_id == undefined) {
            openAlertWin("没有选择机构", false);
            $(".meetingroom-form").hide();
            return;
        }
        if (room_name == "" || room_num == "" || room_cap == "" || expiration_date == "" || start_date == '') {
            openAlertWin("输入的信息不完整", false);
            $(".meetingroom-form").hide();
            return;
        }
        var reg = /^[0-9]{4,10}$/;
        if (reg.test(host_pwd) && reg.test(guest_pwd) && host_pwd.length == guest_pwd.length) {
            var meetingRoomArray = [];
            meetingRoomArray.push(room_num);
            var creat_data = {
                "meetingRoomArray": meetingRoomArray,
                "organId": org_id,
                "startTime": start_date,
                "name": room_name,
                "capacity": room_cap,
                "hostPassword": host_pwd,
                "guestPassword": guest_pwd,
                "expirationDate": expiration_date + ":00",
                "pexipDescription": pexipdescrip,
                "themeId": themeid,
                "themeName": themename,
                "themeUuid": themeuuid,
                "hostView": valuesname,
                "allowGuestFlag": guest_flag,
                "autoChangePasswd": autoChangePasswd
            };
            var url1 = url + 'cloudpServer/v1/orgs/' + org_id + '/vmrs?token=' + admin_token;
            var xmlhttp = new XMLHttpRequest();
            console.log(creat_data);
            xmlhttp.open("POST", url1, false);
            // xmlhttp.setRequestHeader("token", this.token);
            xmlhttp.setRequestHeader("Content-Type", "application/json");
            xmlhttp.send(JSON.stringify(creat_data));
            if (xmlhttp.status == 200) {
                console.log(xmlhttp);
                $(".meetingroom-form").hide();
                if (JSON.parse(xmlhttp.responseText).code == 0) {
                    $(".meetingroom-form").hide();
                    openAlertWin("新建会议室成功", true);
                    empty_creatWin();
                    $("#orgCreatSelect").empty();
                } else {
                    $(".meetingroom-form").hide();
                    openAlertWin(JSON.parse(xmlhttp.responseText).message, true);
                }
            } else {

                $(".meetingroom-form").hide();
                openAlertWin("新建会议室失败", true);
            }
        } else {
            $(".meetingroom-form").hide();
            openAlertWin("密码不规范，请重新填写密码", false);
            $("#bcgs2").show();
            return;
        }

    });
    //添加别名
    $(".othername-input input").blur(function () {
        if ($(this).val() == "") {
            $(this).css({"border": "1px solid red"});
        } else {
            $(this).css({"border": "1px solid #c4c4c4"});
        }
    });

    $("#addAlias").click(function () {
        var addAlias = $(".othername-input input").val();
        var addAliasDes = $(".othername-input textarea").val();

        if (addAlias == "" || addAlias == null) {
            return;
        }
        var addAliasData = {
            "meetingRoomNum": alias_roomNum,
            "alias": addAlias,
            "aliasDescription": addAliasDes
        };
        if (alias_roomNum == 0 || alias_roomNum == null || alias_roomNum == "") {
            return;
        }
        var url1 = url + 'cloudpServer/v1/orgs/vmrs/' + alias_roomNum + '/alias?token=' + admin_token;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", url1, false);
        // xmlhttp.setRequestHeader("token", this.token);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify(addAliasData));
        if (xmlhttp.status == 200) {
            console.log(xmlhttp);
            $(".othername-input input").val("");
            $(".othername-input textarea").val("");
            getAlias();
        } else {
            openAlertWin("添加会议室别名失败", true);
        }

    });
    //关闭添加别名窗体
    $("#cancels1").click(function () {
        $(".othername-input input").val("");
        $(".othername-input textarea").val("");
        $(".other-name").hide();
    });
    //修改别名
    $("#updataAlias").click(function () {
        var update_alias = {
            "id": aliasId,
            "meetingRoomNum": alias_roomNum,
            "alias": $(".othername-input input").val(),
            "aliasDescription": $(".othername-input textarea").val()
        };
        if ($(".othername-input input").val() == "" || $(".othername-input input").val() == null) {

            return;
        }
        if (alias_roomNum == "" || alias_roomNum == null || alias_roomNum == undefined) {

            return;
        }

        var url1 = url + 'cloudpServer/v1/orgs/vmrs/alias/' + aliasId + '/?token=' + admin_token;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("PUT", url1, false);
        // xmlhttp.setRequestHeader("token", this.token);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify(update_alias));
        console.log(JSON.parse(xmlhttp.responseText));
        if (xmlhttp.status == 200) {
            $(".othername-input input").val("");
            $(".othername-input textarea").val("");
            $("#addAlias").show();
            $("#updataAlias").hide();
            getAlias();
        } else {
            openAlertWin("修改别名失败", true);
        }
    });
    function getAlias() {
        $(".name-box").remove();
        $.ajax({
            type: 'get',
            url: url + 'cloudpServer/v1/orgs/vmrs/alias/' + alias_roomNum + '/?token=' + admin_token,
            success: function (data) {
                if (data.code == 0) {
                    $.each(data.data, function (i, item) {
                        var room_alias = new RoomAlias(item);
                    });
                } else {
                    openAlertWin(data.mes, true);
                }
            },
            error: function (erro) {
                openAlertWin("获取别名失败", true);
            }
        });
    }

    function empty_creatsWin() {
        $("#orgCreatSelect").empty();
        $("#creatsCap").val("");
        $("#numTextArea").val("");
        $("#countRoomNum").val("");
        $("#creatsExpDate").val("");
        $("#creatsHostPwd").val("");
        $("#creatsGuestPwd").val("");
    }

    //关闭新建会议室窗体(批量处理)
    $("#creatsCancel").click(function () {
        empty_creatsWin();
        $(".meetingroom-form").hide();
        $("#bcgs2").hide();
    });
    //批量创建窗体-失焦事件校验
    $("#creatExpDate").blur(function () {
        if ($(this).val() == "") {
            $(this).css({"border": "1px solid red"});
        } else {
            $(this).css({"border": "1px solid #c4c4c4"});
        }
    });
    $("#creatsCap").blur(function () {
        if ($(this).val() == "") {
            $(this).css({"border": "1px solid red"});
        } else {
            $(this).css({"border": "1px solid #c4c4c4"});
        }
    });
    $("#creatsExpDate").blur(function () {
        if ($(this).val() == "") {
            $(this).css({"border": "1px solid red"});
        } else {
            $(this).css({"border": "1px solid #c4c4c4"});
        }
    });
    //新建会议室完成并提交(批量处理)
    $("#creatsOK").click(function () {
        var numbers = $("#numTextArea").val();
        var numArr = numbers.split(" ");
        numArr.pop();
        var org_id = $("#creatsOrgSelect option:selected").val();
        var room_name = $("#creatsOrgSelect option:selected").html();
        var room_cap = $("#creatsCap").val();
        var pexipdescrip = $("#add-a66").val();
        var start_date = $("#creatsExpDate3").val() + ':00';
        var expiration_date = $("#creatsExpDate").val() + ':00';
        var host_pwd = $("#creatsHostPwd").val();
        var valuesname = $("#meeting-room option:selected").val();
        var themeid = $("#theme1 option:selected").attr("id");
        var themename = $("#theme1 option:selected").text();
        var themeuuid = $("#theme1 option:selected").val();
        var autoChangePasswd = $("[name='isAutoChangeMulti']:checked").val() - 0;

        var guest_flag = 0;
        if ($("input[name='radiochoose']:checked").val() == "no") {
            guest_flag = 1;
        }
        var guest_pwd = $("#creatsGuestPwd").val();
        if (org_id == "" || org_id == null || org_id == undefined) {
            console.log("没有选择机构");
            return;
        }
        if (room_cap == "" || expiration_date == "") {
            console.log("信息填写的不完整");
            return;
        }
        console.log(numArr);
        var creats_data = {
            "meetingRoomArray": numArr,
            "organId": org_id,
            "name": room_name,
            "startTime": start_date,
            "capacity": room_cap,
            "hostPassword": host_pwd,
            "guestPassword": guest_pwd,
            "expirationDate": expiration_date,
            "pexipDescription": pexipdescrip,
            "themeId": themeid,
            "themeName": themename,
            "themeUuid": themeuuid,
            "hostView": valuesname,
            "allowGuestFlag": guest_flag,
            autoChangePasswd: autoChangePasswd
        };
        var url1 = url + 'cloudpServer/v1/orgs/' + org_id + '/vmrs?token=' + admin_token;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", url1, false);
        // xmlhttp.setRequestHeader("token", this.token);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify(creats_data));
        if (xmlhttp.status == 200) {
            if (JSON.parse(xmlhttp.responseText).code == 0) {
                openAlertWin("新建会议室成功", true);
                empty_creatsWin();
            } else {
                openAlertWin(JSON.parse(xmlhttp.responseText).message, true);
            }
        } else {
            openAlertWin("新建会议室提交失败", true);
        }
        $("#creatsOrgSelect").empty();
        $(".meetingroom-form").hide();

    });
    //关闭修改会议室窗体
    $("#updateCancel").click(function () {
        $("#creatsOrgSelect").empty();
        $(".editor-form").hide();
        $("#bcgs2").hide();
    });
    //修改会议室窗体-失焦事件校验
    $("#updateRoomName").blur(function () {
        if ($(this).val() == "") {
            $(this).css({"border": "1px solid red"});
        } else {
            $(this).css({"border": "1px solid #c4c4c4"});
        }
    });
    $("#updateRoomNum").blur(function () {
        if ($(this).val() == "") {
            $(this).css({"border": "1px solid red"});
        } else {
            $(this).css({"border": "1px solid #c4c4c4"});
        }
    });
    $("#updateCap").blur(function () {
        if ($(this).val() == "") {
            $(this).css({"border": "1px solid red"});
        } else {
            $(this).css({"border": "1px solid #c4c4c4"});
        }
    });
    $("#updateDate").blur(function () {
        if ($(this).val() == "") {
            $(this).css({"border": "1px solid red"});
        } else {
            $(this).css({"border": "1px solid #c4c4c4"});
        }
    });
    //修改会议室完成并提交
    $("#updateOk").click(function () {
        if (nowId == 0 || nowId == null || nowId == "") {

            return;
        }
        if ($("#updateRoomName").val() == "" || $("#updateRoomNum").val() == "" || $("#updateCap").val() == "" || $("#updateDate").val() == "") {
            return;
        }
        $(".editor-form").hide();
        $("#bcgs2").hide();
        var orgids = $("#updateOrgSelect option:selected").val();
        var room_name = $("#updateRoomName").val();
        var room_num = $("#updateRoomNum").val();
        var descriptions = $("#add-a88").val();
        var room_cap = parseInt($("#updateCap").val());
        var expiration_date = $("#updateDate").val().substring(0, 10) + ' 00:00:00';
        var host_pwd = $("#updateHostPwd").val();
        var valuesname = $("#meeting-room1 option:selected").val();
        var themeid = $("#theme3 option:selected").attr("id");
        var themename = $("#theme3 option:selected").text();
        var themeuuid = $("#theme3 option:selected").val();
        var autoChangePasswd = $("[name='isAutoChangeEdit']:checked").val() - 0;
        var guest_flag = 1;
        if ($("input[name='radiochooseUp']:checked").val() == "yes") {
            guest_flag = 0;
        }
        var guest_pwd = $("#updateGuestPwd").val();
        var update_data = {
            "id": nowId,
            "meetingRoomNum": room_num,
            "organId": orgids,
            "name": room_name,
            "capacity": room_cap,
            "pexipDescription": descriptions,
            "hostPassword": host_pwd,
            "guestPassword": guest_pwd,
            "expirationDate": expiration_date,
            "themeId": themeid,
            "themeName": themename,
            "themeUuid": themeuuid,
            "hostView": valuesname,
            "allowGuestFlag": guest_flag,
            autoChangePasswd: autoChangePasswd
        };
        var url1 = url + 'cloudpServer/v1/orgs/' + nowOrgId + '/vmrs/' + nowId + '?token=' + admin_token;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("PUT", url1, false);
        // xmlhttp.setRequestHeader("token", this.token);
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify(update_data));
        if (xmlhttp.status == 200) {
            if (JSON.parse(xmlhttp.responseText).code == 0) {

                openAlertWin("编辑成功", true);
            } else {
                openAlertWin(JSON.parse(xmlhttp.responseText).message, true);
            }
        } else {
            openAlertWin("编辑失败", true);
        }
    });
    //tabe切换
    $(".editor-left").click(function () {
        $(this).addClass("change-click");
        $(".editor-right").removeClass("change-click");
        $(".form-box").show();
        $(".form-box2").hide();
        $.getJSON(url + 'cloudpServer/v1/orgs/vrms/count/1/flag/1/roomNumType/0?token=' + admin_token, function (data) {
            console.log(data);
            if (data.code == 0) {
                onecountroom = data.data[0].meetingRoomNum;
                $("#creatRoomName").val(onecountroom);
                $("#creatRoomNum").val(onecountroom)
            }

        })
    });
    $(".meetingroomradio").change(function () {
        var haoma = $("input[name='radiochooseCreat1']:checked").val();
        $.getJSON(url + 'cloudpServer/v1/orgs/vrms/count/1/flag/1/roomNumType/' + haoma + '?token=' + admin_token, function (data) {
            console.log(data);
            if (data.code == 0) {
                onecountroom = data.data[0].meetingRoomNum;
                $("#creatRoomName").val(onecountroom);
                $("#creatRoomNum").val(onecountroom)
            }

        })
    });
    //打开批量创建会议室
    $(".editor-right").click(function () {
        $('#theme1').html('');
        $(this).addClass("change-click");
        $(".editor-left").removeClass("change-click");
        $("#creatsExpDate3").datetimepicker();
        $("#creatsExpDate").datetimepicker();
        $(".form-box").hide();
        $(".form-box2").show();
        $.each(organizationData, function (i, item) {
            var option = document.createElement("option");
            option.value = item.id;
            option.innerHTML = item.name;
            document.getElementById("creatsOrgSelect").appendChild(option);
        });
        $.getJSON(url + 'cloudpServer/v1/orgs/vmrs/getAllIvr_theme?token=' + admin_token, function (data) {
            var departmentcount = data.data.length;
            html = '';
            for (var i = 0; i < departmentcount; i++) {

                html += '<option id="' + data.data[i].id + '" value="' + data.data[i].uuid + '">' + data.data[i].name + '</option>'
            }
            $('#theme1').append(html)
        })
    });
    //关闭会议室别名窗体
    function closeAliasWin() {
        $("#bcgs2").hide();
        $("#addAlias").show();
        $("#updataAlias").hide();
        $(".other-name").hide();
    }
    $(".cancels1").click(function () {
        closeAliasWin();
    });
    $(".delet-cancel").click(function () {
        $(".alerts-delet").hide();
        $("#bcgs1").hide();
    });
    $(".delet-right").click(function () {
        $(".alerts-delet").hide();
        $("#bcgs1").hide();
    })
});
