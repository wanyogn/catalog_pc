$(function(){
    $(".xcx").hover(function(){
        $(".xcx_code").show();
    },function(){
        $(".xcx_code").hide();
    });
    /*微信*/
    $(".wx").mouseover(function(){
        $($(this).find("img")).attr("src","image/wx_hover.png");
        $($(this).find("p")).css("color","#0084ff");
        $(".wxcontent").show();
    }).mouseout(function(){
        $($(this).find("img")).attr("src","image/wx_03.png");
        $($(this).find("p")).css("color","#7d8292");
        $(".wxcontent").hide();
    });
    /*反馈*/
    $(".fk").mouseover(function(){
        $($(this).find("img")).attr("src","image/fankui_hover.png");
        $($(this).find("p")).css("color","#0084ff");
    }).mouseout(function(){
        $($(this).find("img")).attr("src","image/fankui_07.png");
        $($(this).find("p")).css("color","#7d8292");
    });
    /*$(".fk").click(function(){
        layer.alert('该功能建设中，敬请期待。。。', {
                icon: 6,
                skin: 'layer-ext-moon'
        })
    });*/
    /*置顶*/
    $(".zd").mouseover(function(){
        $($(this).find("img")).attr("src","image/zhiding_hover.png");
        $($(this).find("p")).css("color","#0084ff");
    }).mouseout(function(){
        $($(this).find("img")).attr("src","image/zhiding_07.png");
        $($(this).find("p")).css("color","#7d8292");
    });
    $(".zd").click(function(){
        document.documentElement.scrollTop = document.body.scrollTop = 0;
    });

	
    $(".footer_tip").hover(function(){
    	$(this).css("background","#00c4c6");
    	$(this).find(".footer_tip_title").css({"color":"#fff","border-bottom":"1px solid #fff"});
    	$(this).find(".footer_tip_time").css("color","#fff");
    },function(){
    	$(this).css("background","#fff");
    	$(this).find(".footer_tip_title").css({"color":"#b8b8b8","border-bottom":"1px solid #b8b8b8"});
    	$(this).find(".footer_tip_time").css("color","#b8b8b8");
    });

    /*点击首页的说明*/
    $(".introduction .btn").click(function(){
        $(".introduction_content").hide();
    })
    var lr_systembtn = $("#introduction_main");
    var lr_menu = $(".introduction_content");
    lr_systembtn.mouseenter(function(){
            lr_menu.fadeIn();
    });
    lr_systembtn.mouseleave(function(){

        lr_menu.fadeOut();
    });

});
/*ajax发送*/
function sendAjax(url,data,callback){
    $.ajax({
        type: 'post',
        url: url,
        data: data,
        async: false,
        success: function (result) {
            callback(result);
        },
        error:function(error){
           layer.alert('系统繁忙。。', {
              icon: 2,
              skin: 'layer-ext-moon'
            })
        }
    });
}
/**编号回车键*/
function getNumKey(){
    if(event.keyCode==13){
        $(".search_number_btn").click();
    } 
}
/**关键词回车键*/
function getWordKey(){
    if(event.keyCode==13){
        $(".search_btn").click();
    } 
}


