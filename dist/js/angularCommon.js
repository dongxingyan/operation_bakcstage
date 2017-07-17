
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

var Request = GetRequest();
// (Request.id && Request.name) ? '' : window.location.href = "../login.html";
// var admin_id = Request.id;
var admin_token = Request.name;
var hash = window.location.hash;
var page;
 if(/charge-combo/.test(hash)){
    page = "charge-combo";
 }else if(/charge-plan/.test(hash)){
     page = "charge-plan";
 }else if(/charge-account/.test(hash)){
    page = "charge-account";
 };


var _selectorPage = '.' + page + '>span'

/*
*charge-plan //计费方案页面
* charge-combo //计费套餐页面
* charge-account //计费账号页面
*
* */
$(_selectorPage).css('display', 'block').addClass('show');



//页面跳转功能  56-94
var lefts = $(".box-left a")
var a = lefts.length
for (var i = 0; i<a; i++) {
    lefts.eq(i).click(function(){
        if($(this).hasClass('a7')){
            location.href='../login.html';
        }
        else if($(this).hasClass('a1')){
            location.href='status.html?token='+admin_token;
        }
        else if($(this).hasClass('a2')){
            location.href='org-management.html?token='+admin_token;
        }
        else if($(this).hasClass('a3')){
            location.href='meetingroom-management.html?token='+admin_token;
        }
        else if($(this).hasClass('a4')){
            location.href='user-management.html?token='+admin_token;
        }
        else if($(this).hasClass('a5')){
            location.href='device-management.html?token='+admin_token;
        }
    })
}


//移除事件 并重新绑定  页面内部切换
var _endArg = $('.a-end');
_endArg.unbind('click');

_endArg.on('click', 'div', function (event) {
    event.preventDefault;

    if ($(this).hasClass('charge-plan')) {
        //计费方案页面
        _endArg.find('span').removeClass('show').css('display', 'none');
        $(this).children('span').addClass('show').css('display','block');

        window.location.href = "./angular.html?name=" +admin_token+ "#!/main/charge-plan";
    }
    else if ($(this).hasClass('charge-combo')) {
        //计费套餐页面
        _endArg.find('span').removeClass('show').css('display', 'none');
        $(this).children('span').addClass('show').css('display','block');
        window.location.href = "./angular.html?name=" +admin_token + "#!/main/charge-combo";
    }
    else if ($(this).hasClass('charge-account')) {
        //计费账号页面
        _endArg.find('span').removeClass('show').css('display', 'none');
        $(this).children('span').addClass('show').css('display','block');
        window.location.href = "./angular.html?name=" +admin_token + "#!/main/charge-account";
    }
    else if ($(this).hasClass('statistics-concurrent')) {
        //计费账号页面
        _endArg.find('span').removeClass('show').css('display', 'none');
        $(this).children('span').addClass('show').css('display','block');
        window.location.href = "./angular.html?name=" +admin_token + "#!/main/statistics-concurrent";
    }
    else if ($(this).hasClass('count')) {
        _endArg.find('span').removeClass('show').css('display', 'none');
        $(this).children('span').addClass('show').css('display','block');

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
        //计费账号页面
        _endArg.find('span').removeClass('show').css('display', 'none');
        $(this).children('span').addClass('show').css('display','block');
        window.location.href = "./angular.html?name=" +admin_token + "#!/main/use-count";
    }
})
