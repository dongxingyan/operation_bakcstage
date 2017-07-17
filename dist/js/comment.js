$(function(){


  $(".box-left div").hover(
  function (){
  	$(".box-left div span").hide();
  	$(".show").show();
    $(this).children("span").show();

  },
  function () {
     $(".box-left div span").hide();
     $(".show").show();
  }
)

})
