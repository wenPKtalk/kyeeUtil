/**
 * Created by Administrator on 2017/1/10 0010.
 */
$(document).ready(function(){

    var REQUEST_BASE_PATH = "";
    var requestType = $('select option:selected').val();
    var http={};
    //选择事件
    $("#select_k1").bind("change",function() {
        //获取被选中的option标签
        requestType = $('select option:selected').val();
        //根据选择显示输入框
        if ('renewInstance' === requestType) {
            //显示输入框
            for (var i = 1; i < 10; i++) {
                $("#li"+i).css({
                    display: 'none'
                });
            }
            $("#li10").css({
                display:'block'
            });
            $("#li11").css({
                display:'block'
            });
        } else if ('releaseInstance' === requestType) {
            //显示输入框
            for (var i = 1; i < 11; i++) {
                $("#li"+i).css({
                    display: 'none'
                });
            }

        } else {
            for (var i = 1; i < 11; i++){
                $('#li'+i).css({'display': 'block'});
            }
            $("#li11").css({
                display:'none'
            })
        }
    });

    /**
     * 提交事件
     * @param  {Object} ){                     var paramObj [description]
     * @return {[type]}     [description]
     */
    $("#btn").on("click",function(){
        var paramObj = {};
        paramObj.action = requestType;
        if(!$("#ip_ports").val()){
            alert("您这样我没办法给您发请求哦？选择或输入服务！");
        }
        REQUEST_BASE_PATH = "http://"+$("#ip_ports").val()+"/auth_server";
        if('createInstance' === requestType){//购买
            paramObj.accountQuantity = $("#inp_accountQuantity").val();
            paramObj.aliUid = $("#inp_aliUid").val();
            paramObj.corpId = $("#inp_corpId").val();
            paramObj.email = $("#inp_email").val();
            paramObj.expiredOn = $("#inp_expiredOn").val();
            paramObj.mobile = $("#inp_mobile").val();
            paramObj.orderBizId = $("#inp_orderBizId").val();
            paramObj.orderId = $("#inp_orderId").val();
            paramObj.skuId = $("#inp_skuId").val();
            paramObj.template = $("#inp_template").val();
            paramObj.token = getToken(paramObj);
        }else if('renewInstance' === requestType){
            paramObj.expiredOn = $("#inp_expiredOn").val();
            paramObj.instanceId = $("#inp_instanceId").val();
            paramObj.token = getToken(paramObj);
        }else{
            paramObj.instanceId = $("#inp_instanceId").val();
            paramObj.token = getToken(paramObj);
        }
        parchesRequest(paramObj);
        });
    /**
     * 获取token
     * @param  {[type]} paramObj [description]
     * @return {[type]}          [description]
     */
    function getToken(paramObj){
       const SECRET_KEY = '9Oewd110heIB3nRiAx5X1x2iybptZljaQP2YB34oQynBxCMAoeK94HugJqNSMA2V';
        var paramArr = [];
        $.each(paramObj, function(i, val) {
             paramArr.push(i);
        });
        paramArr.sort();
        var baseStringBuilder='';
        $.each(paramArr, function(i, key) {
            baseStringBuilder = baseStringBuilder+key+'='+paramObj[key]+'&';
        });
        baseStringBuilder = baseStringBuilder+'key'+'='+SECRET_KEY;
        var genToken = md5(baseStringBuilder).toString();
        console.log(baseStringBuilder);
        console.log(genToken);
        return genToken;
    }
    /**
     * 利用iframe 模拟ajax提交。解决不同源策略
     * @param  {[type]} paramObj [description]
     * @return {[type]}          [description]
     */
    function  parchesRequest(paramObj){
        var url = REQUEST_BASE_PATH + "/SysAccountController/purchaseConfirm.next";
        if('createInstance' === requestType){//购买
            var form = "<form action='"+url+"' method='post'>"
                +"<input type='hidden' name='accountQuantity' value='"+paramObj.accountQuantity+"'>"
                +"<input type='hidden' name='aliUid' value='"+paramObj.aliUid+"'>"
                +"<input type='hidden' name='corpId' value='"+paramObj.corpId+"'>"
                +"<input type='hidden' name='email' value='"+paramObj.email+"'>"
                +"<input type='hidden' name='expiredOn' value='"+paramObj.expiredOn+"'>"
                +"<input type='hidden' name='mobile' value='"+paramObj.mobile+"'>"
                +"<input type='hidden' name='orderBizId' value='"+paramObj.orderBizId+"'>"
                +"<input type='hidden' name='orderId' value='"+paramObj.orderId+"'>"
                +"<input type='hidden' name='skuId' value='"+paramObj.skuId+"'>"
                +"<input type='hidden' name='template' value='"+paramObj.template+"'>"
                +"<input type='hidden' name='action' value='"+paramObj.action+"'>"
                +"<input type='hidden' name='token' value='"+paramObj.token+"'>"
                +"</form>";
        }else if('renewInstance' === requestType){

            var form = "<form action='"+url+"' method='post'>"
                +"<input type='hidden' name='instanceId' value='"+paramObj.instanceId+"'>"
                +"<input type='hidden' name='action' value='"+paramObj.action+"'>"
                +"<input type='hidden' name='expiredOn' value='"+paramObj.expiredOn+"'>"
                +"<input type='hidden' name='token' value='"+paramObj.token+"'>"
                +"</form>";
        }else{
             var form = "<form action='"+url+"' method='post'>"
              +"<input type='hidden' name='instanceId' value='"+paramObj.instanceId+"'>"
              +"<input type='hidden' name='action' value='"+paramObj.action+"'>"
              +"</form>";
        }
        $("#isso").remove();
        $('body').append("<iframe id='isso' name='isso' style='display:none'></iframe>")
        //延迟执行
        setTimeout(function () {
            $("#isso").contents().find('body').html(form);//创建表单
            $("#isso").contents().find('form').submit();//提交表单
        }, 10);
       
    }
});