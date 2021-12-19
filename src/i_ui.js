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

const mobile = getStor("mobile") === "true"?true:false;

function layout_init()
{
    
    if(mobile) 
    {
        document.getElementById("btn_mobile").style.display = "none";
        document.getElementById("mobile_css_tag").setAttribute("href",mobilecss);
    
        document.getElementById("mobile_catasbtn_pos").appendChild( document.getElementById("catas_cont") );
        
        document.getElementById("floater_td").appendChild(  document.getElementById("hist_cont") );
        
        
        //layout_refresh();
        
        //set_table_observer();
        
        document.getElementById("openhist").onclick = function(){
            document.getElementById("floater").style.display="block";
        };
        document.getElementById("floater").onclick = function(){
            document.getElementById("floater").style.display="none";
        };
        document.getElementById("hist_cont").onclick = function(){
            event.stopPropagation();
        };
        
        
        
        
    }else{
        document.getElementById("btn_desktop").style.display = "none";
    }
}

var table_observer = null;
function set_table_observer() {
    table_observer = new MutationObserver(table_observer_callback);
    
    table_observer.observe(
        document.getElementById("engines_cont"), 
        { attributes: false, childList: true, subtree: true }
    );
}
function table_observer_callback() {
    //table_observer.disconnect();
    //setTimeout(set_table_observer,200);

    layout_refresh();
}


function layout_refresh()
{
   
}


function onWindowResize()
{
    return; // !!!!!!!!!!
    
    window.onresize = null;
    setTimeout(function() {
        if (
            window.run_env == "http_web" ||
            (window.run_env != "http_web" && isFirefox)
        )
            window.onresize = onWindowResize;
        layout_refresh();
    }, 200);
}


////////////////////////

function i18n(arr)
{
    //console.log("P2 ", window.lang);
    if ( Array.isArray(arr) )
    {
        if ( window.lang == "zh" && arr[0] !== undefined )
            return arr[0];
        else if ( window.lang == "en" && arr[1] !== undefined )
            return arr[1];
        else if ( typeof(arr[1]) === "string" )
            return arr[1];
        else if ( typeof(arr[0]) === "string" )
            return arr[0];
    }
    else if (typeof(arr) === "object")
    {
        if (arr[window.lang] !== undefined)
            return arr[window.lang];
        else if (arr.en !== undefined)
            return arr.en;
        else (arr.zh !== undefined)
            return arr.zh
    }
    else if (typeof(arr) === "string"){
        return arr;
    }
     
    return "i18n_no";
}


function rm_not_userlang(){
    if (window.lang){
        Array.from(document.getElementsByClassName("lang")).forEach(function (item, index) {
            if ( ! item.classList.contains("lang-" + window.lang) )
                item.parentNode.removeChild(item);
        })
    }
};


