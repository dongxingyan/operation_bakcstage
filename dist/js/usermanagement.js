var organizationData;//所有机构
var meetingRoomData = {};//所有会议室
var currentCount = 10;//每一页显示的条数
var admin_token; //全局token
var nowId;//全局会议室ID
var nowId1
var onecountroom

	//分页显示公用方法
function paging_mode(start,end){
		document.getElementById("contentBox").innerHTML="";
		for(var i=start;i<end;i++){
		 	var new_meetingroom = new MeetingRoom(meetingRoomData[i]);
		}
	}
function MeetingRoom(meetingroom_data){
		//DATA
		this.id = meetingroom_data.id;
		this.organId = meetingroom_data.organId;
		this.roomName = meetingroom_data.orgName;

		this.roomNum = meetingroom_data.displayName;
		this.capacity = meetingroom_data.accountAlias;
		this.orgName = meetingroom_data.pexipName;
		this.sttime=meetingroom_data.startTime;
		if(meetingroom_data.startTime&& meetingroom_data.startTime.length>10){
			this.sttime = meetingroom_data.startTime.substring(0,10);
		}
		this.expirationDate = meetingroom_data.pexipPassword;
		this.descriptions=meetingroom_data.description
		this.descriptionss=meetingroom_data.pexipDescription
		this.jztime=meetingroom_data.expirationDate.substring(0,10)
		 	if(this.roomName==undefined){
            		this.roomName=''
            	}
            if(this.roomNum==undefined) {
                	this.roomNum=''
                } 
            if(this.capacity==undefined) {
                	this.capacity=''
                } 
            if(this.orgName==undefined) {
                	this.orgName=''
                } 
            if(this.descriptions==undefined){
            	descriptions=''
            }
		//DOM
		this.ul_element = document.createElement("ul");
		this.ul_element.className = "li-head-meetingrooms";
		this.li_name = document.createElement("li");
		if(this.roomName.length>25){
			this.li_name.innerHTML = this.roomName.substring(0,25)+"...";
			this.li_name.title = this.roomName;
		}else{
			this.li_name.innerHTML = this.roomName;
			this.li_name.title = this.roomName;
		}
		this.li_name.className = "meetingroom-name11";
		this.li_num = document.createElement("li");
		if(this.roomNum.length>25){
			this.li_num.innerHTML = this.roomNum.substring(0,25)+"...";
			this.li_num.title = this.roomNum;
		}else{
			this.li_num.innerHTML = this.roomNum;
		}
		this.li_num.className = "meetingroom-number11";
		this.li_cap = document.createElement("li");
		this.li_cap.innerHTML = this.capacity;
		this.li_cap.className = "meetingroom-people11";
		this.li_org = document.createElement("li");
		this.li_org.innerHTML = this.orgName;
		this.li_org.className = "meetingroom-org11";
		this.li_date = document.createElement("li");
		this.li_date.innerHTML = this.expirationDate;
		this.li_date.className = "meetingroom-data11";
		this.li_option = document.createElement("li");
		this.li_option.className = "description11";
		this.img2 = document.createElement("img");
		this.img2.src = "image/description2.png";
		this.img2.title = "修改"
		this.img2.addEventListener("click",this.updateRoom.bind(this),false);
		this.img3 = document.createElement("img");
		this.img3.src = "image/description3.png";
		this.img3.title = "删除"
		this.img3.addEventListener("click",this.deleteRoom.bind(this),false);
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
	MeetingRoom.prototype.updateRoom = function(){
		$(".editor-user").show();
		$(".bcgs").show();
		$("#datatime9").datetimepicker()
		$(".user-org").html(this.roomName);
        $("#user-a1").html(this.roomNum);
	    $("#user-a2").html(this.capacity);
	    $("#user-a3").html(this.orgName);
	    $("#user-a4").val(this.expirationDate);
	    // $(".a55").val(this.descriptions)
	    $("#user-start").html(this.sttime)
	    $(".a555").val(this.descriptionss)
	    $("#datatime9").val(this.jztime)
		nowId = this.id;
		nowId1=this.organId;
		selectorgname=this.roomName
		$.ajax({
		type:"get",
		url:url+'cloudpServer/v1/orgs/?token='+admin_token,
		dataType:"json",
    	success: function(data){            
				var departmentcount=data.data.length
       		     html='';
       		    for (var i = 0; i <departmentcount; i++) {
       			html+='<option value="'+data.data[i].id+'">'+data.data[i].name+'</option>'
       		      }
       		    $('#user-org').append(html)
       		   	   for(var i=0;i<$("#user-org option").length;i++) {  
				            			if($("#user-org option").eq(i).val() ==nowId1) {   	
				                		$("#user-org option").eq(i).attr('selected',true);  
				                		break;  
				            }  
				        }
		},
		error: function(erro){
			openAlertWin("查询所有机构失败",true);
		}
	});
	}
	MeetingRoom.prototype.deleteRoom = function(){
		var deleteID = this.id;
		$(".bcgs").show()
        $(".alerts-delet").show()         	
        $(".delet-sure").click(function(){
		$.ajax({
			type: 'delete',
			url:url+'cloudpServer/v1/orgs/accounts/'+deleteID+'/?token='+admin_token,
			success: function(data){
				if(data.code==0){
				$(".bcgs").show()
	          	$(".alerts").show()
	          	 $(".alert-content").html("删除成功")
	          	 $(".alert-sure").click(function(){
	          	 	$(".add-user").hide()
	          	 	$(".bcgs").hide()
	          	 	$(".title5").click()
	          	 })
				for(var i=0;i<meetingRoomData.length;i++){
					if(deleteID == meetingRoomData[i].id){
						meetingRoomData.splice($.inArray(meetingRoomData[i],meetingRoomData),1);
						var a = parseInt($(".current-page").html());
						var b = $(".page-count").html();
						var c = $(".content-totals").html();
						var d =  Math.ceil(meetingRoomData.length/currentCount);
						if(a<d){
							paging_mode((a-1)*currentCount,a*currentCount);
						}else{
							paging_mode((a-1)*currentCount,meetingRoomData.length);
							$(".page-count").html(d);
						}
						totals = meetingRoomData.length;
						$(".content-totals").html(meetingRoomData.length);
					}
				}
			}
			else{
				$(".bcgs").show()
	          	$(".alerts").show()
	          	$(".alert-content").html("删除失败")	
			}
			},
			error: function(erro){
				console.log(erro);
			}
		})
		})
		
	}
$(document).ready(function(){
	function GetRequest() {
		var url = location.search; //获取url中"?"符后的字串
		var theRequest = new Object();
		if (url.indexOf("?") != -1) {
			var str = url.substr(1);
			strs = str.split("&");
			for(var i = 0; i < strs.length; i ++) {
				theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
			}
		}
		return theRequest;
	}
	var Request = new Object();

	Request = GetRequest();
	admin_token=Request.token;
	var lefts=$(".box-left a")
	var a=lefts.length
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
    })
//页面加载完查询所有机构
	$.ajax({
		type:"get",
		url:url+'cloudpServer/v1/orgs/?token='+admin_token,
		dataType:"json",
    	success: function(data){            
			organizationData = data.data;
			$.each(data.data,function(i,item){
				var option = document.createElement("option");
				option.value = item.id;
				option.innerHTML = item.name;
				document.getElementById("orgSelect").appendChild(option);
			});
		},
		error: function(erro){
			console.log("erro");
		}
	});
function firstShowList(data){
		meetingRoomData = data.data;
		totals = meetingRoomData.length;
		totalPage = Math.ceil(totals/currentCount);
		$(".current-page").html(1);
		$(".page-count").html(totalPage);
		$(".content-totals").html(totals);
		if(totals<=currentCount){
			paging_mode(0,totals);
		}else{
			paging_mode(0,currentCount);
		}
	}
$.ajax({
		type: "get",
		url:url+'cloudpServer/v1/orgs/users?token='+admin_token,
		success: function(data){
			firstShowList(data);
		},
		error: function(erro){
			console.log(erro);
		}
	});
//查询机构
$(".title5").click(function(){
		var organId = $("#orgSelect option:selected").val();
		var meetingRoomNum = encodeURI($(".title22").val());
		var url2 = url+'cloudpServer/v1/orgs/accounts?token='+admin_token;

		if(organId != null && organId != undefined && organId != ""){
			url2 = url2+'&organId='+organId;
		}
		if(meetingRoomNum != null && meetingRoomNum != ""){
			url2 = url2+'&accountAlias='+meetingRoomNum
		}
		$.ajax({
			type:"get",
			url:url2,
			success: function(data){
				if(data.code==0){
					if(data.data.length==0){
							$(".editor-user").hide()
							$(".alerts").show()
							$(".bcgs").show()
				$(".alert-content").html("没有符合条件的用户账号")
						$(".alert-sure").click(function(){
							$(".editor-user").hide()
							$(".add-user").hide()
							location.reload()
						})
						return;
					}
				}else{
					openAlertWin(data.mes);
				}
				firstShowList(data);
			
			},
			error: function(erro){
				console.log(erro);
			}
		});
	});
//会议室列表跳到首页
	$("#firstPage").click(function(){
		var currentPage = $(".current-page").html();//当前页码
		var pageCount = $(".page-count").html();//总页数
		var countTotal = $(".content-totals").html();//总条数
		if(currentPage==1 || currentPage==null){
			return;
		}
		paging_mode(0,currentCount);
		$(".current-page").html(1);
	});
//前一页
	$("#prev").click(function(){
		var currentPage = $(".current-page").html();//当前页码
		var pageCount = $(".page-count").html();//总页数
		var countTotal = $(".content-totals").html();//总条数
		if(currentPage==1){
			    $(".page").show()
                $(".alert-content").html("前面没有了")
                $(".bcgs").show() 
			return;
		}
		paging_mode((currentPage-2)*currentCount,(currentPage-1)*currentCount);
		$(".current-page").html(parseInt(currentPage)-1);//当前页码	
	});
//下一页
	$("#next").click(function(){
		var currentPage = $(".current-page").html();//当前页码
		var pageCount = $(".page-count").html();//总页数
		var countTotal = $(".content-totals").html();//总条数
		if(currentPage == totalPage){
			    $(".page").show()
                $(".alert-content").html("后面没有了")
                $(".bcgs").show() 
			return ; 
		}
		if(pageCount-currentPage==1){
			paging_mode(currentPage*currentCount,totals);
		}else{
			paging_mode(currentPage*currentCount,(parseInt(currentPage)+1)*currentCount);
		}
		$(".current-page").html(parseInt(currentPage)+1);//当前页码
	});
//会议室列表跳到尾页
	$("#lastPage").click(function(){
		var currentPage = $(".current-page").html();//当前页码
		var pageCount = $(".page-count").html();//总页数
		var countTotal = $(".content-totals").html();//总条数
		if(currentPage == pageCount){
			console.log("已经是尾页");
			return;
		}
		paging_mode((pageCount-1)*currentCount,totals);
		$(".current-page").html(pageCount);//当前页码
	});
//按输入框值跳转页码
	$("#page-jump").click(function(){
		var currentPage = $(".current-page").html();//当前页码
		var pageCount = $(".page-count").html();//总页数
		var countTotal = $(".content-totals").html();//总条数
		var str = parseInt($(".page-num").val());    
        if(str.length!=0){    
        	var reg=/^[0-9]*$/;     
	        if(reg.test(str)){
	        	if( str>0 && str<=pageCount){
		        	if(str == pageCount){
		        		paging_mode((str-1)*currentCount,countTotal); 
		        	}else{
		        		paging_mode((str-1)*currentCount,str*currentCount);   
		        	}
		        	$(".current-page").html(str);
		        	return;
	        	}
	        }
    	}
    	$(".page-num").val("");
	});
//编辑用户提交
$(".true3").click(function(){
	var orgids=$("#user-org option:selected").val()
          	 	  // var des=$(".a55").val()
          	 	  var ps=$("#user-a4").val()
          	 	  var nm=$("#user-a3").html()
          	 	  var jztime=$("#datatime9").val().substring(0,10)+' 00:00:00';
          	 	  var pexipmiaoshu=$(".a555").val()
	          	 	var c=/^\d{6}$/;
	          	 	var d=/^[0-9]*$/;
	          	 	if(ps==''){
	          	 		$(".editor-user").hide();
          	 			$(".alerts").show();
          	 			$(".alert-content").html('请完善信息')
          	 			$(".alert-sure").click(function(){
          	 				$(".add-user").hide()
          	 				$(".editor-user").show()         	 				
          	 				$(".alerts").hide()
          	 			})
	          	 		return false
	          	 	}
	          	 	else{
	          	 		var data={
	          	 					  id:nowId,
									  organId:orgids,
									  pexipPassword:ps,
									  expirationDate:jztime,
									  pexipDescription:pexipmiaoshu,
									  pexipName:nm
									  // description:des
	          	 			}
	          	 		console.log(data)
	          	 						var url1 = url+'cloudpServer/v1/orgs/'+nowId1+'/users/'+nowId+'?token='+admin_token;
										var xmlhttp = new XMLHttpRequest();
								        xmlhttp.open("PUT", url1, false);           
								        // xmlhttp.setRequestHeader("token", this.token);
								        xmlhttp.setRequestHeader("Content-Type", "application/json");
								        xmlhttp.send(JSON.stringify(data));

								        if(xmlhttp.status==200){
								        	console.log(JSON.parse(xmlhttp.responseText))
								        	var codes=JSON.parse(xmlhttp.responseText)
								        	if(codes.code==0){
								        		$(".editor-user").hide()
									        	$(".alerts").show()
									        	$(".bcgs").show()
									        	$(".alert-content").html("编辑成功")
									        	$(".alert-sure").click(function(){
									        			$(".editor-user").hide()
									        			$(".add-user").hide()
									        		location.reload()
									        	})
									        	
								        	}
								        	else{								        		
								        		$(".editor-user").hide()
									        	$(".alerts").show()
									        	$(".bcgs").show()
									        	$(".alert-content").html("编辑失败")
									        	$(".alert-sure").click(function(){
									        		$(".editor-user").hide()
									        		$(".add-user").hide()
									        		location.reload()
									        	})
								        	}
								        	
								        }else{
											console.log("faile");
								            console.log(JSON.parse(xmlhttp.responseText));
								        }
									}

				
          				 })	
$(".page-right").click(function(){
	$(".page").hide();
	$(".bcgs").hide();
})
$(".page-sure").click(function(){
	$(".page").hide();
	$(".bcgs").hide()
})
$(".alert-sure").click(function(){
	$(".add-user").show()
	$(".alerts-delet").hide()
	$(".alerts").hide()
	$(".bcgs").show()
})
$(".delet-cancel").click(function(){
          	$(".alerts-delet").hide()
          	$(".bcgs").hide()
          })
$(".delet-right").click(function(){
          	$(".alerts-delet").hide()
          	$(".bcgs").hide()
          })
$(".img-right").click(function(){
	location.reload()
})
$(".cancel").click(function(){
	 		location.reload();
 	})
//tabe切换
$(".editor-left").click(function(){
	$(this).addClass("change-click")
	$(".editor-right").removeClass("change-click")
	$(".form-box").show()
	$(".form-box2").hide()
})
$(".editor-right").click(function(){
	$(this).addClass("change-click")
	$(".editor-left").removeClass("change-click")
	$(".form-box").hide()
	$(".form-box2").show()
})
$(".editor-left").click()
//新建账号
$(".title8").click(function(){
	$(".bcgs").show();
	$(".add-user").show()
	$.getJSON(url+'cloudpServer/v1/orgs/account/count/1/flag/1?token='+admin_token,function(data){
			console.log(data)
             if(data.code==0){
					onecountroom=data.data[0].accountNum
						$(".device-other").val(onecountroom+"@cloudp.cc")
						$(".pexip1").val(onecountroom)
						$(".pexip2").val(onecountroom)
				}
			})

	$(".editor-left").click(function(){
		$("#orgCreatSelect").html('')
		$("#orgCreatSelect1").html('')
		$("#datatime33").datetimepicker();
		$("#datatime3").datetimepicker();
		$.getJSON(url+'cloudpServer/v1/orgs/?token='+admin_token,function(data){
          	 						var departmentcount=data.data.length
       		                        html='';
       		                        for (var i = 0; i <departmentcount; i++) {
       			
       			                    html+='<option value="'+data.data[i].id+'">'+data.data[i].name+'</option>'
       		                            };
       		                        $('#orgCreatSelect').append(html)
       		                        var departorgid=$("#orgCreatSelect option:selected").val()
         $.getJSON(url+'cloudpServer/v1/orgs/'+departorgid+'/depts?token='+admin_token,function(data){
          	 						var departmentcount=data.data.length
       		                        html='';
       		                        for (var i = 0; i <departmentcount; i++) {
       			
       			                    html+='<option value="'+data.data[i].id+'">'+data.data[i].departName+'</option>'
       		                            };
       		                        $('#orgCreatSelect1').append(html)
       		                    })

          	 				})

	$("#orgCreatSelect").change(function(){
		$("#orgCreatSelect1").html('')
			                        var departorgid=$("#orgCreatSelect option:selected").val()
         $.getJSON(url+'cloudpServer/v1/orgs/'+departorgid+'/depts?token='+admin_token,function(data){
          	 						var departmentcount=data.data.length
       		                        html='';
       		                        for (var i = 0; i <departmentcount; i++) {
       			
       			                    html+='<option value="'+data.data[i].id+'">'+data.data[i].departName+'</option>'
       		                            };
       		                        $('#orgCreatSelect1').append(html)
       		                    })

	})

		
	})
	$(".editor-left").click()
	$(".true").click(function(){
		var a=$("#orgCreatSelect option:selected").val()
		var b=$("#orgCreatSelect1 option:selected").val()
		var c=$(".device-other").val()
		var d1=$("#datatime33").val()+':00'
		var d=$("#datatime3").val()+':00'
		var e=$(".pexip1").val()
		var f=$(".pexip2").val()
		var miaoshu=$(".a66").val()
		var g=e.substr(0,6)
		var numarry=[];
		numarry.push(g)
		if((a=='')||(c=='')||(d=='')||(e=='')||(f=='')){
			$(".add-user").hide();
			$(".bcgs").show()
			$(".alerts").show();
          	$(".alert-content").html('请完善信息')
	        return false

		}
		else{
		var data={
	          	 					  organId:a,
									  departId:b, 
									  accountArray:numarry,
									  accountAlias:c,
									  startTime:d1,
									  pexipDescription:miaoshu,
									  pexipName:g,
									  pexipPassword:f,
									  expirationDate:d									 									  
	          	 			}
	          	 			console.log(data)
	          	 						var url1 = url+'cloudpServer/v1/orgs/account?token='+admin_token;
										var xmlhttp = new XMLHttpRequest();
								        xmlhttp.open("post", url1, false);           
								        // xmlhttp.setRequestHeader("token", this.token);
								        xmlhttp.setRequestHeader("Content-Type", "application/json");
								        xmlhttp.send(JSON.stringify(data));

								        if(xmlhttp.status==200){
								        	console.log(JSON.parse(xmlhttp.responseText))
								        	var codes=JSON.parse(xmlhttp.responseText)
								        	if(codes.code==0){
									        	$(".add-user").hide()
									        	$(".alerts").show()
									        	$(".bcgs").show()
									        	$(".alert-content").html("创建成功")
									        	$(".alert-sure").click(function(){
									        			$(".editor-user").hide()
									        		$(".add-user").hide()
									        		location.reload()
									        	})
								        	}
								        	else{
								        		$(".add-user").hide()
									        	$(".alerts").show()
									        	$(".bcgs").show()
									        	$(".alert-content").html("创建失败")
									        	$(".alert-sure").click(function(){
									        			$(".editor-user").hide()
									        		$(".add-user").hide()
									        		location.reload()
									        	})
								        	}
								        }else{
											console.log("faile");
								            console.log(JSON.parse(xmlhttp.responseText));
								        }
								    }
	})
$(".editor-right").click(function(){
	$("#orgCreatSelect3").html('')
	$("#datatime44").datetimepicker();
	$("#datatime4").datetimepicker();
	$.getJSON(url+'cloudpServer/v1/orgs/?token='+admin_token,function(data){
          	 						var departmentcount=data.data.length
       		                        html='';
       		                        for (var i = 0; i <departmentcount; i++) {
       			
       			                    html+='<option value="'+data.data[i].id+'">'+data.data[i].name+'</option>'
       		                            };
       		                        $('#orgCreatSelect3').append(html)
       		                        var departorgid=$("#orgCreatSelect3 option:selected").val()
       		                    })
	$(".change-code").click(function(){
		$("#countarea").val('')
		// $(this).attr("disabled",true)
		// $(this).addClass("change-background")
		var counta=$(".user-count").val();
		var countb=$("input[name='radiochoose']:checked").val()
		var countc=$("#datatime4").val()+":00";
		var countd=$(".count-password").val()
		if(counta==''){
			$(".add-user").hide()
			$(".bcgs").show()
			$(".alerts").show()
			$(".alert-content").html("请填写号码数量")
			return false
		}
		else if(counta<2){
			$(".add-user").hide()
			$(".bcgs").show()
			$(".alerts").show()
			$(".alert-content").html("号码数量最少为两个")
			return false
		}
		else{
		$.getJSON(url+'cloudpServer/v1/orgs/account/count/'+counta+'/flag/'+countb+'?token='+admin_token,function(data){
			console.log(data)
				if(data.code==5){
					$(".add-user").hide()
					$(".bcgs").show()
					$(".alerts").show()
					$(".alert-content").html("因冲突导致错误")
				}
				else if(data.code==0){
					var departmentcount=data.data.length
       		                        html='';
       		                        for (var i = 0; i <departmentcount; i++) {
       			
       			                    html+=data.data[i].accountNum+" "
       		                            };
       		                        $('#countarea').val(html)
				}
			})
			
		}
	})
	$(".trues").click(function(){
		var a=$("#orgCreatSelect3 option:selected").val()
		var b=$("#datatime4").val()+":00";
		var b1=$("#datatime44").val()+":00";
		var miaoshu=$(".a666").val()
		// var c=$(".count-password").val()
		var numbers = $("#countarea").val();
		console.log(numbers)
		var numArr = numbers.split(" ");
		numArr.pop()
		if(numbers==''){
			$(".add-user").hide()
			$(".bcgs").show()
			$(".alerts").show()
			$(".alert-content").html("请生成号码")
			return false;
		}
		else if(b==''){
			$(".add-user").hide()
			$(".bcgs").show()
			$(".alerts").show()
			$(".alert-content").html("请完善信息")
			return false;
		}
		else{
		var data={
	          	 					  organId:a,
									  accountArray:numArr,
									  startTime:b1,
									  pexipDescription:miaoshu,
									  expirationDate:b									 									  
	          	 			}
	          	 			console.log(data)
	          	 						var url1 = url+'cloudpServer/v1/orgs/account?token='+admin_token;
										var xmlhttp = new XMLHttpRequest();
								        xmlhttp.open("post", url1, false);           
								        // xmlhttp.setRequestHeader("token", this.token);
								        xmlhttp.setRequestHeader("Content-Type", "application/json");
								        xmlhttp.send(JSON.stringify(data));

								        if(xmlhttp.status==200){
								        	console.log(JSON.parse(xmlhttp.responseText))
								        	var codes=JSON.parse(xmlhttp.responseText)
								        	if(codes.code==0){
									        	$(".add-user").hide()
									        	$(".alerts").show()
									        	$(".bcgs").show()
									        	$(".alert-content").html("创建成功")
									        	$(".alert-sure").click(function(){
									        			$(".editor-user").hide()
									        		$(".add-user").hide()
									        		location.reload()
									        	})	
								        	}
								        	else{
								        		$(".add-user").hide()
									        	$(".alerts").show()
									        	$(".bcgs").show()
									        	$(".alert-content").html("创建失败")
									        	$(".alert-sure").click(function(){
									        			$(".editor-user").hide()
									        		$(".add-user").hide()
									        		location.reload()
									        	})
								        	}
								        }else{
											console.log("faile");
								            console.log(JSON.parse(xmlhttp.responseText));
								        }
								        }

	})
})
})
$(".cancels").click(function(){
	location.reload();
})
})