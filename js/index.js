$(function(){

    sendAjax('http://localhost:9005/catalog/queryFirst_Product',{},function(result){//一级菜单
        contentProduct(result);
    });
    //搜索页跳转过来
   var dir_num = getQueryVariable("currentDir");
   var first_num = decodeURI(getQueryVariable("first_number"));
   if(dir_num != false){
        document.documentElement.scrollTop = document.body.scrollTop = $("#"+dir_num).offset().top-187;
        if(first_num != false){
            var that = this;
            sendAjax('http://localhost:9005/catalog/queryProduct',{"dir_num":dir_num,"first_num":first_num},function(result){
                contentSecondPro(result,$("#"+dir_num).find(".main_product"));
            });
           var data_list = $("#"+dir_num).find(".list-group-item");
           for(var i = 0;i <data_list.length;i++){
             var obj = data_list[i];
             if($(obj).find("span").text() == first_num){
                $(obj).attr("style","color:#fff;background-color:#11d07f");
             }
           }
        }
   }
    /*搜索*/
    $(".search_btn").click(function(){//关键词搜索
        var val = $(".search_input").val();
        if($.trim(val) == ''){
            top.layer.alert('请输入分类名称关键词！', {
                icon: 3,
                skin: 'layer-ext-moon'
            })
            return;
        }
        window.open("search.html?classify=key&keyword="+Base64.encode(val));

    });

    $(".search_number_btn").click(function(){//编号搜索
        var val = $(".search_input_number").val();
        if($.trim(val).length != 6){
            top.layer.alert('请输入6位编号！', {
                icon: 3,
                skin: 'layer-ext-moon'
            })
            return;
        }
        window.open("search.html?classify=num&keyword="+Base64.encode(val));
    });

    /*点击数字*/
    $("#dir_header button").click(function(){
	    var id = $(this).text();
	    document.documentElement.scrollTop = document.body.scrollTop = $("#"+id).offset().top-187;
    });
    /**点击一级目录展开*/
    $(".content_main_container_left a").click(function(){
       $(this).css("color","#fff");
       $(this).css("background-color","#11d07f");
       $(this).siblings().css("color","#808080");
       $(this).siblings().css("background-color","#fff");
       var first_num = $(this).find("span").text();
       var dir_num = $(this).parents(".content_dir").find(".title_number").text();
       var that = this;
        sendAjax('http://localhost:9005/catalog/queryProduct',{"dir_num":dir_num,"first_num":first_num},function(result){
            contentSecondPro(result,$(that).parents(".content_main_container").find(".main_product"));
        });
       // document.documentElement.scrollTop = document.body.scrollTop = $("#"+dir_num).offset().top-187;
    });

    /*点击展开产品详细*/
    $(document).on('click', '.product_show', function(){
        var dir_num = $(this).siblings(".product_number").find(".dir_num").text();
        var first_num = $(this).siblings(".product_number").find(".first_num").text();
        var second_num = $(this).siblings(".product_number").find(".second_num").text();
        var dom = $(this).parents(".list-data").find(".data-main");
        var size = dom.children(".data-inner").length;//
        if(size > 0){//已经加载过产品信息
            dom.toggleClass("in");
        }else{
            sendAjax('http://localhost:9005/catalog/queryProductDetail',{"dir_num":dir_num,"first_num":first_num,"second_num":second_num},function(result){
                contentDetail(result,dom)
            });
        }
    });
    $(document).on('click', '.product_destinction_content', function(){
        var dir_num = $(this).parents(".content_dir").find(".title_number").text();
        document.documentElement.scrollTop = document.body.scrollTop = $("#"+dir_num).offset().top-187;
    });
});

/*装配一级目录*/
function contentProduct(data){
    var arr = JSON.parse(data);
    for(var i = 0;i < arr.length;i++){
        $(".product_content").append($("#product_template").html());
    }
    var data_list = $(".content_dir");
    for(var i = 0;i < arr.length;i++){
        var obj = arr[i];
        $(data_list[i].getElementsByClassName("title_number")).html(obj.number);//目录名编号
        $(data_list[i].getElementsByClassName("title_name")).html(obj.name);//目录名称
        $(data_list[i]).attr("id",obj.number);
        var productArr = obj.second;//二级目录的数组
        var _html = '';
        for(var j = 0;j < productArr.length;j++){
            _html +=  '<a class="list-group-item"><span>'+productArr[j].code+"</span> "+productArr[j].name+'</a>'

        }
        $(data_list[i].getElementsByClassName("content_main_container_left")).append(_html);
        $(data_list[i].getElementsByClassName("main_product ")).append(obj.content);
    }
}
//二级目录的切换
function contentSecondPro(data,dom){
	var count = 0;
    dom.html("");
    var json = JSON.parse(data); 
    var arr = json.datas;
    for(var i = 0;i < arr.length;i++){
        if(arr[i].catalog_property == "BZ"){
            dom.append($("#detail_template").html());
        }else{
            dom.append($("#detail_template_ivd").html());
        }
    	
    }
    var data_list = dom.find(".list-data");

    for(var i = 0;i<arr.length;i++){
    	var obj = arr[i];
    	//$(data_list[i].getElementsByClassName("product_number")).append(obj.number);
        $(data_list[i].getElementsByClassName("dir_num")).html(obj.dir_num);//目录名编号
        $(data_list[i].getElementsByClassName("first_num")).html(obj.first_num);
        $(data_list[i].getElementsByClassName("second_num")).html(obj.second_num);
        if(obj.dir_num == "IVD"){
            $(data_list[i].getElementsByClassName("dir_num")).hide();
            $(data_list[i].getElementsByClassName("second_num")).hide();
        }

    	$(data_list[i].getElementsByClassName("product_title")).append(obj.name);
    	//$(data_list[i].getElementsByClassName("product_show")).attr("href",$(data_list[i].getElementsByClassName("product_show")).attr("href")+obj.number);
    	$(data_list[i].getElementsByClassName("data-main")).attr("id",$(data_list[i].getElementsByClassName("data-main")).attr("id")+obj.number);
    	$(data_list[i].getElementsByClassName("product_destinction_content")).append(obj.first_name);   
    }
}
//点击显示详细信息
function contentDetail(data,dom){
    dom.html("");
    var json = JSON.parse(data);
    var arr = json.datas;
    for(var i = 0;i < arr.length;i++){
        if(arr[i].directory_number == "IVD"){
            dom.append($("#data_template_ivd").html());
        }else{
            dom.append($("#data_template").html());
        }
        
    }
    var inner_list = dom.children(".data-inner");
    for(var j = 0;j < arr.length;j++){
        var obj1 = arr[j];
        $(inner_list[j].getElementsByClassName("product_description")).html(obj1.product_description);
        $(inner_list[j].getElementsByClassName("product_use")).html(obj1.expected_use);
        $(inner_list[j].getElementsByClassName("product_example")).html(getExampleCount(obj1.product_example));
        $(inner_list[j].getElementsByClassName("product_classify")).html(obj1.management_category);
        if(obj1.composite_product == "是"){
            $(inner_list[j].getElementsByClassName("product_isZH")).html("药械组合");
        }else{
            $(inner_list[j].getElementsByClassName("product_isZH")).remove();
        }
        
    }
    dom.toggleClass("in");
}

/*品名举例的数量计算*/
function getExampleCount(str){
    var arr = str.split("、")
    var _html = '';
    var count = '';
    if(arr.length > 0){
        if(arr[0] != ""){
            for(var i = 0;i < arr.length;i++){
                sendAjax('http://localhost:9005/catalog/search_product_count',{"keyword":arr[i],"num":0},function(data){
                    var json = JSON.parse(data);
                    count = json.matchCount;
                });
                if(count == 0){
                    _html += arr[i]
                }else{
                     _html += '<a target="_blank" href="http://www.yixiecha.cn/search_pro.html?class=pro&keyword='+arr[i]+'">'
                            +arr[i]
                            +'<span class="badge">'+count+'</span>'
                        +'</a>';
                }
               
                if(i != arr.length - 1){
                    _html += "、";
                }
            }
        }
    	
    }
    
    return _html;
}

function getQueryVariable(variable)
{
   var query = window.location.search.substring(1);
   var vars = query.split("&");
   for (var i=0;i<vars.length;i++) {
           var pair = vars[i].split("=");
           if(pair[0] == variable){return pair[1];}
   }
   return(false);
}