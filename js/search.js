var keyword = '';
var classify = '';
var gllb = 0;//0.全部、 1.I、 2.II、3.III
var yxzh = 0;//0全部    1是    2.否
var mlsx = 0;//0全部    1.标准目录  2.IVD子目录
var searchKey = '';
$(function(){
	var keyword_from_url = window.location.search;
	classify = keyword_from_url.substring(10,13)
	keyword = Base64.decode(keyword_from_url.substring(21));
	
	if(classify == "key"){
		sendAjax("http://localhost:9005/catalog/searchProductByKeyword",{"keyword":keyword},function(result){
			$("._choose").show();
			var json = JSON.parse(result);
            $(".key").html(keyword);
            $(".num").html(json.matchCount);
            $(".search_input").val(keyword);
            contentPro(json);
            $(".result_scan").show();
		});
        sendAjax("http://localhost:9005/catalog/insertSearchInfo",{"keyword":keyword,"searchtype":"key"},function(result){});
	}else if(classify == "num"){
		sendAjax("http://localhost:9005/catalog/searchProductByNum",{"number":keyword},function(result){
			$("._choose").hide();
			var json = JSON.parse(result);
            $(".key").html(keyword);
            $(".num").html(json.matchCount);
            $(".search_input_number").val(keyword);
            contentPro(json);
		});
        sendAjax("http://localhost:9005/catalog/insertSearchInfo",{"keyword":keyword,"searchtype":"number"},function(result){});
	}
    searchYXC(searchKey);
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
        window.location.href = "search.html?classify=key&keyword="+Base64.encode(val);

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
        window.location.href = "search.html?classify=num&keyword="+Base64.encode(val);
    });
    /**下拉菜单管理类别*/
    $(".gllb").change(function(){
    	gllb = $(this).val();
    	handlerSelect();
    });
    $(".checkboxML").change(function(){
        var chboxValue = [];
        var checkbox = $('input[name = checkboxML]');
        if(checkbox.length > 0){
            for(var i = 0;i < checkbox.length;i++){
                if(checkbox[i].checked){
                    chboxValue.push(checkbox[i].value);
                }
            }
        }
        if(chboxValue.length == 1){mlsx = chboxValue[0];}
            else if(chboxValue.length == 2){mlsx = 0;}
            else{mlsx = 3;}
        handlerSelect();
    });
    /**下拉菜单目录属性*/
    /*$(".mlsx").change(function(){
    	mlsx = $(this).val();
    	handlerSelect();
    });*/
    /**下拉菜单医械组合*/
    $(".yxzh").change(function(){
    	yxzh = $(this).val();
    	handlerSelect();
    });

    $(document).on('mouseover', '.product_example a', function(){
        var count = 0;
       sendAjax('http://localhost:9005/catalog/search_product_count',{"keyword":$(this).text(),"num":0},function(data){
            var json = JSON.parse(data);
            count = json.matchCount;
        });
       $(this).attr("title","查看全部"+count+"个品种");
       
    });
    $(".yixiecha_btn").click(function(){
        window.open("http://www.yixiecha.cn/search_pro.html?class=pro&keyword="+keyword);
    })
});
/*装配详情*/
function contentPro(data){
	$(".main_product").html("");
    var arr = data.datas;
    if(arr.length > 0){
    	for(var i = 0;i < arr.length;i++){
	    	$(".main_product").append($("#detail_template").html());
	    }
	    var data_list = $(".list-data");
	    for(var i = 0;i<arr.length;i++){
	    	var obj = arr[i];
	    	//$(data_list[i].getElementsByClassName("product_number")).append(obj.number);
            $(data_list[i].getElementsByClassName("dir_num")).html(obj.dir_num);//目录名编号
            $(data_list[i].getElementsByClassName("first_num")).html(obj.first_number);
            $(data_list[i].getElementsByClassName("second_num")).html(obj.second_number);
            if(obj.dir_num == "IVD"){
                $(data_list[i].getElementsByClassName("dir_num")).hide();
                $(data_list[i].getElementsByClassName("second_num")).hide();
            }
	    	$(data_list[i].getElementsByClassName("product_title")).append(gethtml(obj.name,keyword));
            if(classify == "key"){searchKey = keyword;}else if(classify == "num"){searchKey = obj.name;}
	    	//$(data_list[i].getElementsByClassName("product_destinction")).append(obj.first_name+"->"+obj.second_name);
            $(data_list[i].getElementsByClassName("first_name")).append(obj.first_name);
            $(data_list[i].getElementsByClassName("first_name")).attr("href",$(data_list[i].getElementsByClassName("first_name")).attr("href")+obj.dir_num);
            $(data_list[i].getElementsByClassName("second_name")).append(obj.second_name);
            $(data_list[i].getElementsByClassName("second_name")).attr("href",$(data_list[i].getElementsByClassName("second_name")).attr("href")+obj.dir_num+"&first_number="+obj.first_number);
	    	//var inner_list = $(".data-inner");
	    	for(var j = 0;j < obj.data.length;j++){
	    		var obj1 = obj.data[j];
                if($(data_list[i].getElementsByClassName("dir_num")).text() == "IVD"){
                    $(data_list[i].getElementsByClassName("data-main")).append($("#data_template_ivd").html());
                }else{
                    $(data_list[i].getElementsByClassName("data-main")).append($("#data_template").html());
                }
	    		var inner_list = $(data_list[i].getElementsByClassName("data-inner"));
	    		$(inner_list[j].getElementsByClassName("product_description")).html(gethtml(obj1.product_description,keyword));
	    		$(inner_list[j].getElementsByClassName("product_use")).html(gethtml(obj1.expected_use,keyword));
	    		$(inner_list[j].getElementsByClassName("product_example")).html(getExampleCount(gethtml(obj1.product_example,keyword)));
	    		$(inner_list[j].getElementsByClassName("product_classify")).html(obj1.management_category);
	    		//$(inner_list[j].getElementsByClassName("product_isZH")).html(obj1.composite_product);
                if(obj1.composite_product == "是"){
                    $(inner_list[j].getElementsByClassName("product_isZH")).html("药械组合");
                }else{
                    $(inner_list[j].getElementsByClassName("product_isZH")).remove();
                }
	    	}
	    }
    }else{
    	layer.alert('未查到相关信息！', {
          icon: 2,
          skin: 'layer-ext-moon'
        })
    }
   
}
/*关键词变色*/
function gethtml(str,key){
    //console.log(key.split(" ").length);
    var patt = /[a-zA-Z]/;
    var name_highlighted_html = '';
    var keyArr = $.trim(key).split(" ");
    if(keyArr.length > 1){
        name_highlighted_html = str;
        for(var i = 0;i < keyArr.length;i++){
            if(keyArr[i] != ""){
                var reg = new RegExp(keyArr[i],"g");
                name_highlighted_html = name_highlighted_html.replace(reg,"<em style='color:#f39800;font-style: normal;'>"+keyArr[i]+"</em>");
            }
        }
        
    }else{
        if(classify == "key"){
            if(patt.test(key)){
                var reg = new RegExp(key,"g");
                name_highlighted_html = str.replace(reg,"<em style='color:#f39800;font-style: normal;'>"+key+"</em>");
            }else{
                for(var j = 0;j < str.length;j++){
                    var val = str.substring(j,j+1);
                    if(key.indexOf(val) >= 0){
                        name_highlighted_html = name_highlighted_html + "<em style='color:#f39800;font-style: normal;'>" + val + "</em>";
                    }else{
                        name_highlighted_html = name_highlighted_html + val;
                    }
                }
            }
            
        }else if(classify == "num"){
            name_highlighted_html = str;
        }
    }

    
        
    return name_highlighted_html;
}
/*处理下拉框筛选*/
function handlerSelect(){
	var data = {
		"keyword":keyword,
		"gllb":getGLLBById(gllb),
		"yxzh":getYXZHById(yxzh),
		"mlsx":getMLSXById(mlsx)
	};
	sendAjax("http://localhost:9005/catalog/searchProductByKeyword",data,function(result){
		var json = JSON.parse(result);
        $(".num").html(json.matchCount);
        contentPro(json);
	})
}
/*调用医械查的接口*/
function searchYXC(key){
    /*if(classify == "key"){

    }else if(classify == "num"){}*/
    sendAjax("http://localhost:9005/catalog/search_product_name",{"keyword":key,"num":0},function(result){
        if(result != "fail"){
           var json = JSON.parse(result);
            $(".yixiecha_input").val(key);
            $(".yixiecha_number").html(json.matchCount);
            var arr = json.datas;
            var size = arr.length;
            if(size > 3){
                size = 3;
            }
            var _html = '';
            for(var i = 0;i < size;i++){
                _html +='<p>'+handleText(arr[i].product_name_ch,12)+'</p>';
            }
            if(arr.length > 3){
                _html += "<p>......</p>";
            }
            $(".yixiecha_result_content").html(_html); 
        }
        
    });
    $(".click_show").attr("href",$(".click_show").attr("href")+decodeURI(key));
}

function getGLLBById(id){
    var res = "";
    if(id == 1){
        res = "Ⅰ";
    }else if(id == 2){
        res = "Ⅱ";
    }else if(id == 3){
        res = "Ⅲ";
    }else if(id == 0){
    	res = "";
    }
    return res;
}
function getMLSXById(id){
    var res = "";
    if(id == 1){
        res = "BZ";
    }else if(id == 2){
        res = "IVD";
    }else if(id == 0){
    	res ="";
    }else if(id == 3){
        res = "NO";
    }
    return res;
}
function getYXZHById(id){
    var res = "";
    if(id == 1){
        res = "是";
    }else if(id == 2){
        res = "否";
    }else if(id == 0){
    	res = "";
    }
    return res;
}
/*控制文本长度*/
function handleText(text,size){
    if(text.length > size){
        text = text.substring(0,size)+"...";
    }
    return text;
}
/*不加载数字*/
function getExampleCount(str){
    var afterStr = str.replace(/<[\/\!]*[^<>]*>/ig,"")//正则去掉文本中的HTML标签
    var arr = afterStr.split("、")
    var _html = '';
    var count = '';
    if(arr.length > 0){
        if(arr[0] != ""){
            for(var i = 0;i < arr.length;i++){
                 _html += '<a target="_blank" href="http://www.yixiecha.cn/search_pro.html?class=pro&keyword='+decodeURI(arr[i])+'" title="">'
                        +gethtml(arr[i],keyword)
                    +'</a>';
               
                if(i != arr.length - 1){
                    _html += "、";
                }
            }
        }
    }
    return _html;
}

function getYXCKey(){
    if(event.keyCode==13){
        $(".yixiecha_btn").click();
    } 
}