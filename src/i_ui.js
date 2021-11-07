/*
 * By Big Search / 大术专搜
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
        
        //$("#content_mobile").html( $("#center_td").html() ); // lose events
        //$("#center_td").html("");
        
        layout_refresh();
        //$(".cata_btns").click(layout_refresh);
        
        set_table_observer();
        
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
    set_input_width();
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

const mintw = 650; // min table width if screen wide
const gap = 25; // gap if screen slim
const maxiw = 700;  // max input width

function layout_refresh()
{
    if(mobile)
    {

        if( window.innerWidth < mintw + 2*gap )
        {
            document.getElementById("engines_table").style.minWidth = 'unset';
            document.getElementById("engines_table").style.width = window.innerWidth - 2*gap + "px" ;
        }else{
            document.getElementById("engines_table").style.minWidth = mintw+'px';
        }
        
        document.getElementById("floater").style.width = window.innerWidth + "px";
        document.getElementById("floater").style.height = window.innerHeight + "px";
        document.getElementById("floater_td").style.width = window.innerWidth + "px";
        document.getElementById("floater_td").style.height = window.innerHeight + "px";
        document.getElementById("hist").style.width = window.innerWidth - 2*gap + "px";
        document.getElementById("hist").style.height = window.innerHeight - 100 + "px";

        set_input_width();
        
        table_cont_style();
    }
    set_input_width();
}


function onWindowResize()
{
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

function set_input_width()
{
    if (window.run_env != "http_web")
        return;
    
    if(!mobile) //desktop
    {
        //console.log(" engines-table width: ", document.getElementById("engines_table").offsetWidth );
        document.getElementById("inputbox").style.width=document.getElementById("engines_table").offsetWidth.toString()+"px";
        
    }else{  //mobile
        
        
        if ( window.innerWidth > maxiw + 2*gap )
        {
            document.getElementById("input_cont").style.width = window.innerWidth - 2*gap + "px" ;
            document.getElementById("inputbox").style.width = window.innerWidth - 2*gap + "px"  ;
        }else{
            document.getElementById("input_cont").style.width = window.innerWidth - 2*gap + "px" ;
            document.getElementById("inputbox").style.width = window.innerWidth - 2*gap - 20 + "px";
        }
    }
}

function table_cont_style()
{
    const engines_table_height = document.getElementById("engines_table").offsetHeight;
    const engines_table_width = document.getElementById("engines_table").offsetWidth;
    /*
    if (!engines_table_height || !engines_table_height){
        setTimeout(table_cont_style,30);
        return;
    }
    */
    
    var engines_cont_max_height;
    if(mobile){
        engines_cont_max_height = window.innerHeight - 100 ;
    }else{
        engines_cont_max_height = 400;
    }

    const engines_cont = document.getElementById("engines_cont");

    engines_cont.style.overflowY="";
    engines_cont.style.width = "";
    

    if( engines_table_height <= engines_cont_max_height )
    {
        //console.log("a" + engines_table_height);
        
        engines_cont.style.overflowY="";
        engines_cont.style.height = engines_table_height.toString() + "px";
        engines_cont.style.width = engines_table_width.toString() + "px";
    }else
    {
        //console.log("b");
        engines_cont.style.height = engines_cont_max_height.toString() + "px" ;
        engines_cont.style.overflowY="scroll";
        engines_cont.style.width = ((engines_cont.offsetWidth - engines_cont.clientWidth) + engines_table_width ).toString() + "px";

        
    }
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


