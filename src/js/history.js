/*
 * By Big Search / 大术专搜
 * (addons.mozilla.org/firefox/addon/big-search/)
 * (acsearch.ga, acsearch.tk)
 * 
 * All Rights Reserved for This File
 * If want to use this code, welcome ask original author for FLOSS license
 * Before that, please DON'T use unauthorized code
 * 此文件 版权所有 保留所有权利
 * 若要使用代码，欢迎联系原作者获取 自由软件许可
 * 在取得许可前，请勿使用未授权的代码
 * 
 * Source code: https://github.com/garywill/BigSearch
 */
function displayhist()
{
    try{
        var operzone=document.getElementById("hist");

        var hists=splithists(gethiststr());
        operzone.innerHTML="";
        for (var i=0;i<hists.length;i++)
        {
            var txt2save=hists[i];
            
            var newDiv=document.createElement("div");
            newDiv.className = "hist_item";
            
            newDiv.appendChild(document.createTextNode(txt2save));
            
            newDiv.value=txt2save;
            newDiv.setAttribute("title",txt2save);
            if (!mobile)
            {
                newDiv.ondblclick=function()
                {
                    onHistItemDblClk(this.value);
                }
            }else{
                newDiv.onclick=function()
                {
                    onHistItemDblClk(this.value);
                }
            }
            
            span_buttons = document.createElement("span");
            span_buttons.className = "hist_entry_span_buttons";
            
            span_copyhist=document.createElement("span");
            span_copyhist.className = "hist_entry_button";
            span_copyhist.appendChild(document.createTextNode(i18n(["复制 ", "Copy "])));
            span_buttons.appendChild(span_copyhist);
            span_copyhist.onclick=function(event)
            {
                event.stopPropagation();
                navigator.clipboard.writeText( this.parentNode.parentNode.value );
                
            }
            
            span_delhist=document.createElement("span");
            span_delhist.className = "hist_entry_button";
            span_delhist.appendChild(document.createTextNode(i18n(["删除", "Del"])));
            span_buttons.appendChild(span_delhist);
            span_delhist.onclick=function(event)
            {
                event.stopPropagation();
                del_hist(this.parentNode.parentNode.value);
                displayhist();
            }
                    
            newDiv.appendChild(span_buttons);
            operzone.appendChild(newDiv);
                
        }
    }catch(err){}
}
function onHistItemDblClk(str) {
    if (inputHandler.ml_mode && ! inputHandler.ml_ui)
        //inputHandler.openMlView();
        return;
    
    if (inputHandler.ml_mode)
        inputHandler.setValueAtCursor( ' ' + str + ' ');
    else
        inputHandler.setValue(str);
    
    UIHandler.closeHistFloater();
    
    inputHandler.setFocus();
}
