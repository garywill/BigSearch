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

var inputHandler;

var onrd = new Array(); //on document ready
document.addEventListener('DOMContentLoaded', async (event) => {

    for (var i=0; i<onrd.length; ++i)
    {
        try{
            await Promise.resolve( onrd[i]() );
        }catch(err){
            console.error(err);
        }
    }
});

////// on document ready /////////////////	
onrd.push(async function(){
    if (window.run_env == "http_web") 
        return;
          
    if (await get_addon_setting("hl")) 
        window.lang = await get_addon_setting("hl");
    else
        window.lang = "en";
    
    //console.log("set user lang:", window.lang);

});

onrd.push( function(){
    init_data();
});

onrd.push( function(){
    //console.log(window.lang);
    rm_not_userlang();
});

onrd.push(function(){
    set_string_format_prototype();
});

function set_string_format_prototype() {
    
    String.prototype.format = function(replacements) {
        replacements = (typeof replacements === 'object') ? replacements : Array.prototype.slice.call(arguments, 0);
        return formatString(this, replacements);
    }
    var formatString = function (str, replacements) {
        replacements = (typeof replacements === 'object') ? replacements : Array.prototype.slice.call(arguments, 1);
        return str.replace(/\{\{|\}\}|\{(\w+)\}/g, function(m, n) {
            if (m == '{{') { return '{'; }
            if (m == '}}') { return '}'; }
            return replacements[n];
        });
    }
}

onrd.push( function() {
    init_inputHandler();
});

onrd.push(async function() {
    await init_lastuseHandler();
});

onrd.push(async function(){
    await make_cata_btns();
    
//     cata_onclick( document.getElementById("cata_btn_general_dbname_bigsearch") );
    lastuseHandler.loadLastBrowse();
});

onrd.push(function(){
    document.getElementById("inputbox").addEventListener('keypress', inputbox_press );
});

onrd.push(function(){
    setTimeout(putmail,5000);
});

onrd.push(function(){
	inputHandler.setFocus();
});

onrd.push(function(){
    lastuseHandler.loadLastClick();
    scroll_to_lastp();
});

onrd.push(function(){
	displayhist();
});


onrd.push(function(){
	document.getElementById("clearhist").onclick=function()
	{
		delStor("hist" );
		document.getElementById("hist").innerHTML="";
	}
});

onrd.push(function(){
	document.getElementById("inputclear").onclick=function()
	{
        inputHandler.inputbox.value="";
        inputHandler.input_ml.value="";
        
        if (inputHandler.ml_ui === false)
            inputHandler.setMlMode(false);
        inputHandler.setMlView();
		inputHandler.setFocus();
	}
});

onrd.push(function(){
	document.getElementById("inputselect").onclick=function()
	{
		inputHandler.getInputFieldEle().select();
	}
});

onrd.push(function(){
	document.getElementById("inputcopy").onclick=function()
	{
		inputHandler.getInputFieldEle().select();
        try 
        {
            document.execCommand('copy');
        }catch(err){  }
	}
});

onrd.push(function(){
	document.getElementById("inputpaste").onclick=function()
	{
        if (window.run_env != "http_web") {
            chrome.permissions.request({
                permissions: ["clipboardRead"]
            });
        }
        
		onPasteClick();
	}
	async function onPasteClick() {
        
        if (isFirefox) {
            const clipboard = await navigator.clipboard.readText();
            
            inputHandler.setValueAtCursor(clipboard);
            inputHandler.setFocus();
        }else if (isChrome) {
            inputHandler.setFocus();
            document.execCommand('paste');
        }
    }
});



function init_inputHandler() {
    inputHandler = new function InputHandlerClass() {

        this.btn_ml_input = document.getElementById("btn_ml_input");
        this.btn_save_ml = document.getElementById("btn_save_ml");
        this.btn_save_ml_sl = document.getElementById("btn_save_ml_sl");
        
        this.input_ml = document.getElementById("input_ml");
        this.inputbox = document.getElementById("inputbox");
        this.inputbox_shell = document.getElementById("inputbox_shell");
        this.engines_o_cont = document.getElementById("engines_o_cont");
        this.inputselect = document.getElementById("inputselect");
        this.inputcopy = document.getElementById("inputcopy");
        this.inputpaste = document.getElementById("inputpaste");
        
        
        this.ml_mode = false; // the var that records the current ml/sl status !
        this.ml_ui = false; // the var that records the current UI status 
        
        this.init_mode = function (s) { 
            // when web refreshed (s=undefined)
            // when addon popup inits input field value(s has value)
            var str;
            
            if (s === undefined) {
                str = this.input_ml.value;  // directly get val from the multi-line textarea
            }
            else 
            {
                str = s;
            }
            str = str.trim();
            
            this.setMlMode( this.isValueMl(str) ? true : false );
            this.setValue(str);
            this.syncMS();
            this.setMlView();
        };
        this.isValueMl = function (val) {  // judge a string is ml or sl
            val = val.trim();
            return (
                val.includes("\r") 
                || 
                val.includes("\n") 
            ) ? true : false;
        };
        
        this.convMl2Sl = function(s) { // convert string from whatever (ml/sl) to sl
            s = s.trim();
            return s.replaceAll("\r\n", "  ").replaceAll("\n", "  ").replaceAll("\r", "  ") ;
        };

        this.getInputFieldEle = function() {  // get the current used field element object
            return document.getElementsByClassName("cur_inputbox")[0];
        };
        this.getValue = function() {  // get from the current used field 
            return this.getInputFieldEle().value.trim();
        };
        this.setValue = function(str) {  // set the current used field value
            this.getInputFieldEle().value = str.trim();
        };
        this.setValueAtCursor = function(str) { // used by paste, history reusing 
            const start = this.getInputFieldEle().selectionStart;
            const end = this.getInputFieldEle().selectionEnd;

            if ( ! this.ml_mode )
                str = this.convMl2Sl(str);
            
            inputHandler.getInputFieldEle().setRangeText(str, start, end, "end");
            
            this.syncMS();
        };
        this.setFocus = async function() { // set focus to current used field
            if (mobile)
                return;
            
            inputHandler.getInputFieldEle().focus();
        };
        
        this.syncM2S = function() {  // sync the two input fields only . doesn't change the mode
            this.inputbox.value = this.convMl2Sl( this.input_ml.value );
        };
        this.syncS2M = function() {  // sync the two input fields only . doesn't change the mode
            this.input_ml.value = this.inputbox.value;
        };
        this.syncMS = function() {  // sync the two input fields only, according to mode . doesn't change the mode. Shonld't be used as saving 
            if (this.ml_mode)
                this.syncM2S();
            else
                this.syncS2M();
        };
        
        this.trim = function() {
            this.inputbox.value = this.inputbox.value.trim();
            this.input_ml.value = this.input_ml.value.trim();
        }
        
        // this changes the mode status , not UI status
        this.setMlMode = function(boolVal = this.ml_mode) {
            this.ml_mode = boolVal;
            
            if (boolVal) {
                this.inputbox.classList.remove('cur_inputbox');
                this.input_ml.classList.add('cur_inputbox');
                
                this.inputbox.setAttribute("readonly", "true");
                this.inputbox_shell.classList.add('inputbox_in_ml');
                
                if ( ! mobile ) {
                    this.inputbox.ondblclick = function () { 
                        btn_ml_input.click();
                    }
                }
                else
                {
                    this.inputbox.onclick = function () {
                        btn_ml_input.click();
                    }
                }
            }
            else
            {
                this.input_ml.classList.remove('cur_inputbox');
                this.inputbox.classList.add('cur_inputbox');
                
                this.inputbox.removeAttribute("readonly");
                this.inputbox_shell.classList.remove('inputbox_in_ml');
                
                this.inputbox.ondblclick = null;
                this.inputbox.onclick = null;
            }
        };
        
        // this changes the UI status, not mode status
        this.setMlView = function (boolVal = this.ml_ui) {
            this.ml_ui = boolVal;
            if (boolVal) {  // to open multi-line view
                this.input_ml.style.display = "";
                this.inputbox.style.display = "none";
                
                this.btn_ml_input.style.display = "none";
                this.engines_o_cont.style.display = "none";
                this.btn_save_ml.style.display = "";
                this.btn_save_ml_sl.style.display = "";
                
                // always show 'copy' and 'select' btns in ml UI view
                this.inputselect.style.visibility = "";
                this.inputcopy.style.visibility = "";
                this.inputpaste.style.visibility = "";
                
                this.updateUI();
            }
            else // to close multi-line view
            {
                this.input_ml.style.display = "none";
                this.inputbox.style.display = "";
                
                this.btn_ml_input.style.display = ""
                this.engines_o_cont.style.display = "";
                
                this.btn_save_ml.style.display = "none";
                this.btn_save_ml_sl.style.display = "none";
                
                if (this.ml_mode)
                {
                    this.inputselect.style.visibility = "hidden";
                    this.inputcopy.style.visibility = "hidden";
                    this.inputpaste.style.visibility = "hidden";
                }
                else
                {
                    // only show 'copy' and 'select' btns in sl mode
                    this.inputselect.style.visibility = "";
                    this.inputcopy.style.visibility = "";
                    this.inputpaste.style.visibility = "";
                }
                
                this.updateUI();
            }
        };
        this.updateUI = function() { // mobile history btn
            if ( ! mobile) // desktop
                document.getElementById("openhist").style.display = "none";
            else  // mobile
            {
                if (this.ml_mode && ! this.ml_ui)
                    document.getElementById("openhist").style.display = "none";
                else
                    document.getElementById("openhist").style.display = "block";
            }
        }
        
        // when open ml UI btn clicked
        this.openMlView = function() {
            if (this.ml_mode) { // already in ml mode before trigger open ml view action
                // no need to sync
            }
            else  // not in ml mode when open ml view action triggered
            {
                this.syncS2M();
            }
            
            this.setMlMode(true) ;
            this.setMlView(true) ;
        }
        
        // when save ml btn clicked
        this.saveMl = function() {
            this.trim();
            
            if ( this.isValueMl( this.input_ml.value ) )
                this.setMlMode(true);
            else
                this.setMlMode(false);
            
            this.syncM2S();
            this.setMlView(false);
        }
        
        // when save ml to be sl btn clicked
        this.saveMlAsSl = function() {
            this.trim();
            
            this.setMlMode(false);
            this.syncM2S();
            this.setMlView(false);
        }
        
        this.inputbox.addEventListener("change", function() {
            inputHandler.syncS2M();
        });
        this.input_ml.addEventListener("change", function() {
            inputHandler.syncM2S();
        });
    } ();
}

onrd.push(function(){
    const btn_ml_input = document.getElementById("btn_ml_input");
    const btn_save_ml = document.getElementById("btn_save_ml");
    const btn_save_ml_sl = document.getElementById("btn_save_ml_sl");
    
    if (window.run_env == "http_web")
        inputHandler.init_mode();
    inputHandler.setMlView(false);
    
    btn_ml_input.onclick = function() {
        inputHandler.openMlView();
    }
    btn_save_ml.onclick = function() {
        inputHandler.saveMl();
    }
    btn_save_ml_sl.onclick = function() {
        inputHandler.saveMlAsSl();
    }

});




onrd.push(function(){
    if (window.run_env != "http_web") {
        document.getElementById("btn_askpermis_ajax").onclick = async function() {
            const url = document.getElementById("permis_toast_url").getAttribute("data");
            await chrome.permissions.request({ origins: [url]  });
            
            document.getElementById("permis_toast_o").style.display = "none";
        };
    }
});
onrd.push(function(){
    if (window.run_env != "http_web") {
        document.getElementById("btn_cancel_ajax").onclick = async function() {
            document.getElementById("permis_toast_o").style.display = "none";
        };
    }
});

onrd.push(function(){
    init_btmDialogToggler();
    
	Array.from( document.getElementsByClassName("btmbtn") ).forEach( function(ele) {
        ele.onclick = btmDialogToggler.onBtnClick;
    });
});

onrd.push(function(){
    window.setTimeout(function() {
        Array.from( document.getElementsByClassName("btm_dialog") ).forEach( function(ele) {
            var close_btn = document.createElement("img");
            close_btn.className = "btm_dialog_close_btn";
            close_btn.setAttribute("src", "icon/multiply.svg");
            
            close_btn.onclick = function() {
                btmDialogToggler.close(this.parentNode);
                
            }
            
            ele.appendChild(close_btn);
            
        });
    }, 2000);
});

onrd.push(function(){
    document.getElementById("btn_mobile").onclick = function(){
        setStor("mobile","true");
        location.reload();
    };
});
onrd.push(function(){
    document.getElementById("btn_desktop").onclick = function(){
        delStor("mobile");
        location.reload();
    };
});

onrd.push(function(){
    document.getElementById("btn_zh").onclick = function(){
        setCookie_my("hl","zh");
        //location.reload();
    };
});
onrd.push(function(){
    document.getElementById("btn_en").onclick = function(){
        setCookie_my("hl","en");
        //location.reload();
    };
});

onrd.push(function(){
	window.onfocus=windowonfocus;
});

onrd.push(async function(){
    //setTimeout(layout_init, 30);
    await layout_init();
});

onrd.push(function(){
    setTimeout(function() {
        window.onresize = onWindowResize;
    },500);
});

onrd.push(function(){ 
    // in addon, when popup open and close, read and save temperary input
    // NOTE this must be after inputHandler inited
    if (window.run_env != "http_web" /* && ! chrome.extension.inIncognitoContext */ ) 
    {
        inputHandler.init_mode( getStor("input_content") );
  
        window.addEventListener("blur", function(){
            setStor("input_content", inputHandler.getValue());
        });
    }
});

onrd.push(function(){
    document.getElementById("btn_input_json").addEventListener('click', function () {
        document.getElementById("div_json_parse").style.display="";
        document.getElementById("div_button_to_input_json").style.display="none";
    });
});

onrd.push( function() {
const example = `{
  "Google": "https://www.google.com/search?q={0}",
  "Yahoo Search": "https://search.yahoo.com/search?q={0}"
}`;
const example_adv = `{
  "google": {
    "dname": "Google",
    "addr": "https://www.google.com",
    "action": "https://www.google.com/search",
    "kw_key": "q",
    "btns": {
      "search": {
        "label": "Google Search"
      },
      "lucky": {
        "label": "I'm Feeling Lucky",
        "params": [
          {"key":"btnI", "val": "1"}
        ]
      }
    }
  },
  "label_mbap": { "lstr": "Cross-engine" },
  "itunesapps": {
    "dname": "iTunes Apps (Google)",
    "addr": "https://www.apple.com/itunes/charts/free-apps/",
    "btns": {
      "search_apps": {
        "label": "Search Apps",
        "kw_format": "{0} site:apple.com/*app",
        "use_other_engine": {
          "engine": "google",
          "btn": "search"
        }
      }
    }
  },
  "label_usaj": { "lstr": "Search Ajax-render web" },
  "chrome_ext_dev": {
    "dname": "Chrome Ext Dev Doc",
    "addr": "https://developer.chrome.com/docs/extensions/reference/",
    "action": "https://developer.chrome.com/docs/extensions/reference/",
    "ajax": ".search-box__input"
  },
  "label_many": { "lstr": "Many Engines at once" },
  "many_once" : {
    "dname": "Many Engines",
    "btns": {
      "gg_ddg": {
        "label": "Google + DDG",
        "use_other_engine": ["google", "duckduckgo"]
      }
    }
  }
}`;

    document.getElementById("btn_use_examples").addEventListener('click', add_example_to_text);
    document.getElementById("btn_use_examples_adv").addEventListener('click', add_example_to_text);
                                                                 
    function add_example_to_text() {
        var str_add = "";
        if (this.id == "btn_use_examples")
            str_add = example;
        if (this.id == "btn_use_examples_adv")
            str_add = example_adv;
        
        const textarea_json = document.getElementById("textarea_json");
        textarea_json.value += "\n" + str_add;
    }
});
    
onrd.push(function(){
    document.getElementById("btn_parse_json").addEventListener('click', async function () {
        
        const textarea = document.getElementById("textarea_json");
        var parsedJsonObj;
        
        try{
            parsedJsonObj = JSON.parse(textarea.value);
        }catch(err){
            alert(
                i18n(["❌ 好像有一点什么错误！！！ ❌\n输入的内容无法解析为符合严格格式的JSON。\n", "❌ Ooops !!! ❌\nSomething in yout input is wrong. Can't be parsed as strict JSON format.\n"])
                + "\n"
                + err
            );
            return;
        }
        
        var stringifiedJson = JSON.stringify(parsedJsonObj);
        var formattedJson = JSON.stringify(parsedJsonObj, null, 2);
        if (window.run_env == "http_web") // http web
        {
        }else{ // addon
            var compressed;
            //compressed = LZString.compressToUint8Array(textarea.value);
            compressed = LZUTF8.compress(stringifiedJson, {outputEncoding: "StorageBinaryString"});
            //console.log("compressed data length:", compressed.length);
            try{
                await chrome.storage.sync.set({"usercustom_engines": compressed });
                document.getElementById("textarea_json_saved").value = formattedJson;
                
                if ( ( await get_addon_setting("usercustom_engines") ) === compressed )
                    alert(i18n([ "✅ OK！ ✅\n解析并保存成功", "✅ OK! ✅\nSucessfully parsed and saved"]));
                else
                    alert("❌ Oh no! Error! ❌\n\nFailed to save your data\n\nWere you trying to save a too large data? The limitation is about 20-30 kB.\n\nContact developer if you still have problems.");
            }catch(err) {
                alert("❌ " + err + " ❌");
                return;
            }
        }
        
        await read_usercustom_engines();
        
        const engines_cont = document.getElementById("engines_cont");
        
        //engines_cont.innerHTML = "";
        if (document.getElementById("engines_table")) 
            document.getElementById("engines_table").parentNode.removeChild(document.getElementById("engines_table"));
        
        engines_cont.appendChild( createETableByCata( "user", "user", 'engines_table'));
    });
});

onrd.push(function(){
    document.getElementById("btn_load_json").addEventListener('click', function () {
        document.getElementById("textarea_json").value = document.getElementById("textarea_json_saved").value
    });
});
onrd.push(function() {
    document.getElementById("btn_search_permi").onclick = async function() {
        await browser.permissions.request({ permissions: ["search"] });
        document.getElementsByClassName("cata_btn_highlight")[0].click();
    };
});
// onrd.push(function(){
//     if (document.getElementById("tosimp"))
//     {
//         document.getElementById("tosimp").onclick=simp_trad_click;
//         document.getElementById("totrad").onclick=simp_trad_click;
//     }
// });
onrd.push(async function(){
    await init_themeHandler();
    setTimeout(scroll_to_lastp,500);
});

onrd.push(async function(){
    if (window.run_env != "http_web")
        document.getElementById("curver").textContent = chrome.runtime.getManifest()['version'] ;
});

onrd.push(async function(){
    if (window.run_env != "http_web")
    {
        if ( (await get_addon_setting("checkupdate")) !== true )
            return;
        
        if (getStor("news_text"))
        {
            document.getElementById("newver_link").textContent = getStor("news_text");
            
            if ( getStor("news_link") )
                document.getElementById("newver_link").href = getStor("news_link");
            
            document.getElementById("newver").style.display = "unset";
        }
    }
});

onrd.push(function() {
    const eles_selector = ["#bottom", "#bottom-place", "#header", "#intitle", ".labelrow", "#btn_use_examples_adv", "#hist"];
    eles_selector.forEach(function(selStr) {
        const got = document.querySelectorAll(selStr);
        //console.log(got);
        if ( HTMLCollection.prototype.isPrototypeOf(got) || NodeList.prototype.isPrototypeOf(got) ) {
            got.forEach(function(ele) {
                addTitle(ele);
            });
        } else if (got instanceof Element) {
            addTitle(got);
        }
    });
    
    function addTitle(ele) {
        const tiptext = i18n(["大术专搜 不只是 一个简单的搜索请求发送器。可以访问源代码页面以了解其一些“独门特技”。", "Big Search is more than a simple web search request sender. Visit the source code page to know what's special about it."]);
        if (ele.getAttribute("title") === null)
            ele.setAttribute("title", tiptext);
            
    }
});


onrd.push(async function(){
    setTimeout(do_stati,300);
});

/////////////////////////////////
function simp_trad_click() {
    
}
async function make_cata_btns() {
    
    document.getElementById("catas_cont").appendChild(createCataBtn("user", "user"));
    
    if (window.run_env != "http_web") {
        if (isFirefox )
            document.getElementById("catas_cont").appendChild(createCataBtn("browser", "browser"));
    }
    
    Object.entries(catas).forEach(function(ele) {
        const cata = ele[0];
        //const cata_cont = ele[1];
        if (isVisible(catas[cata]))
            document.getElementById("catas_cont").appendChild(createCataBtn(cata));
    });
}


function inputbox_press( e ) {
	var evt = e || window.event
	// "e" is the standard behavior (FF, Chrome, Safari, Opera),
	// while "window.event" (or "event") is IE's behavior
	if ( evt.keyCode === 13 ) {
		inputbox_enter();

	}
	
	function inputbox_enter()
    {
        if(document.getElementById("lastp")) 
        {
            document.getElementById("lastp").click();
        }
        else
        {
            document.getElementById("engines_table").getElementsByClassName("gobutton")[0].click();
        }
    }
}



function putmail()
{
    str1 = "garywill";
    str2 = "disroot";
    str3 = "org";
    mail = str1 + "@" + str2 + "." + str3;
    
    var ourmail=document.getElementById("ourmail");
    ourmail.href="mailto:" + mail;
    ourmail.appendChild(document.createTextNode(mail));
    
}

function window_set_onfocus()
{
	window.onfocus=windowonfocus;
}
function windowonfocus()
{
	window.onfocus=null;
	
	displayhist();
	setTimeout(window_set_onfocus,3000);
}


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
                    
                    document.getElementById("floater").style.display="none";
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
    
    inputHandler.setFocus();
}
async function ebtn_onclick(obj) 
{
    document.getElementById("permis_toast_o").style.display = "none";
    
    const engine =obj.getAttribute("e");
    const btn = obj.getAttribute("b");
    const dbname = obj.getAttribute("dbname");
    
	var inputval = inputHandler.getValue();
	if (inputval=="")
	{
		alert(i18n(["搜索框内容为空！\n如要进行操作（如搜索），输入后，再点击表格右列对应的按钮", "The input field is empty!\nTo do an action (e.g. search), input text, then click a button on the right column of table"]))
	}
	else 
    {
        ebtn_onclick_gosearch();
    }
    
	async function ebtn_onclick_gosearch() {
        
        try{
            await goEngBtn( engine, btn, inputval , dbname);
        } catch(err) { console.error(`ERROR when trying to call ${engine}/${btn}`); console.error(err); }
    }
    
    if(!mobile) 
        setTimeout(inputHandler.setFocus,1);
    
    
    async function saveLastClick() {
        const table_element = document.getElementById("engines_table");
        const table_dbname = table_element.getAttribute("dbname")
        const table_cata = table_element.getAttribute("cata")
        lastuseHandler.saveLastClick(table_dbname, table_cata, engine, btn);
    };
	
	setTimeout( function() {
        add_hist2c(inputval);
        displayhist();
    },20);
    
    await saveLastClick();
    lastuseHandler.loadLastClick();
    
    stati_goclicked(obj); // async
}

var lastuseHandler;
async function init_lastuseHandler() {
    
    lastuseHandler = await lastuseHandlerClass();
    
    async function lastuseHandlerClass() {
        var R = {};
        R.storageObj = {
            lastBrowse: { target: [], time: null }, // NOTE only for addon
            lastClick: {}, // eg:   "bigsearch|general": ["baidu", "sch"]
            lastInput: {content: null, time: null}, // NOTE only for addon
        };
        R.save = function () {
            localStorage['lastuse'] = JSON.stringify(R.storageObj);
        };
        R.load = function () {
            var parsed = {};
            try{
                parsed = JSON.parse(localStorage['lastuse']);
            }catch(err) { }
            
            if (Object.keys(parsed).length>0) {
                //R.storageObj = parsed;
                Object.assign(R.storageObj, parsed);
            }
            
            return R.storageObj; // just for console output
        };
        R.saveLastClick = function(dbname, cata, engine, btn) {
            R.storageObj.lastClick[`${dbname}|${cata}`] = [engine, btn];
            R.save();
        };
        R.loadLastClick = async function(dbname, cata) {
            if ( ! (dbname && cata) ) {
                const table_element = document.getElementById("engines_table");
                const table_dbname = table_element.getAttribute("dbname")
                const table_cata = table_element.getAttribute("cata")
                dbname = table_dbname;
                cata = table_cata;
            }
            
            var got = R.storageObj.lastClick[`${dbname}|${cata}`];
            var engine;
            var btn;
            if (got)
                [engine, btn] = got;
            
            const table_element = document.getElementById("engines_table");
            
            var button_ele;
            
            button_ele = table_element.querySelector(`.gobutton[e='${engine}'][b='${btn}']`);
            if (!button_ele)
                button_ele = table_element.querySelector(`.gobutton[e='${engine}']`);
            
            if (!button_ele)
                button_ele = table_element.querySelector(`.gobutton`);
            
            if (button_ele) {
                var oldLastp = table_element.querySelector("#lastp");
                if (oldLastp)
                    oldLastp.id = null;
                
                button_ele.id = "lastp";
            }
                
//             return button_ele;
//             return [engine, btn];
        };
        R.saveLastBrowse = function(dbname, cata) {
            if (window.run_env == "http_web" )
                return false;
            
            R.storageObj.lastBrowse = { 
                target: [dbname, cata],
                time: Date.now(),
            };
            R.save();
        };
        R.loadLastBrowse = function() { // after load() executed
            var button;
            
            if (window.run_env == "http_web" ) {
                button = document.querySelector(`.cata_btns[dbname=bigsearch]`);
            }
            else
            {
                var [dbname, cata] = R.storageObj.lastBrowse.target;
                
                button = document.querySelector(`.cata_btns[dbname=${dbname}][cata='${cata}']`);
                if (!button)
                    button = document.querySelector(`.cata_btns[dbname='${dbname}']`);
                if (!button)
                    button = document.querySelector(`.cata_btns[dbname=bigsearch]`);
            }
            
            if (!button)
                button = document.querySelector(`.cata_btns`);
            
            if (button)
                button.click();
            
            //return [dbname, cata];
//             return button;
        };
        R.setLastClick = function(engine, btn) {
            
        };
        R.setLastInput = function(content) {
            
        };
        R.checkExpire = function() {
            
        };
        
        //--------------------
        
        R.load();
        //R.checkExpire();
        
        return R;
    }
}

async function scroll_to_lastp() {
    var div = document.getElementById("engines_o_cont");
    var lastp = document.getElementById("lastp");
    
    if ( ! lastp) {
        div.scrollTop = 0;
        return;
    }

    var distance = lastp.offsetTop + lastp.parentNode.offsetTop;
    div.scrollTop = distance - div.clientHeight + parseInt(getComputedStyle(lastp).height);
}
function setc_lastp(sete,setb)
{
	setStor("le",sete);
	setStor("lb",setb);
}

async function cata_onclick(btnobj)
{
    const dbname=btnobj.getAttribute("dbname");
    const cata=btnobj.getAttribute("cata");
    
    const engines_cont = document.getElementById("engines_cont");
    
    //engines_cont.innerHTML = "";
    var oldTable = engines_cont.querySelector("#engines_table");
    if (oldTable)
        oldTable.parentNode.removeChild(oldTable);
    
    if (btnobj.getAttribute("dbname")=="user")
    {
        
        document.getElementById("div_custom_json").style.display="";
        document.getElementById("div_button_to_input_json").style.display="";
        document.getElementById("div_json_parse").style.display="none";
        
        try{
            await read_usercustom_engines();
        }catch(err) { console.error(err); }
        
    }else{
        document.getElementById("div_custom_json").style.display="none";
    }
    
    
    if (btnobj.getAttribute("dbname")=="browser")
    {
        document.getElementById("div_search_permi").style.display = "none";
        if ( ! await browser.permissions.contains( { permissions: ["search"] } ) )
            document.getElementById("div_search_permi").style.display = "";
            
        try {
            await fetch_browser_engines();
        }catch(err) { }
    }else{
        document.getElementById("div_search_permi").style.display = "none";
    }
    
    engines_cont.appendChild( createETableByCata( btnobj.getAttribute('name'), btnobj.getAttribute('dbname'), 'engines_table'));
    

    Array.from( document.getElementsByClassName("cata_btns") ).forEach(function(ele){
        ele.classList.remove("cata_btn_highlight");
    });
    btnobj.classList.add("cata_btn_highlight");
    
    lastuseHandler.loadLastClick(dbname, cata);

    scroll_to_lastp();
    
    if (!mobile)
        inputHandler.setFocus();
    
    //table_cont_style();
    
    lastuseHandler.saveLastBrowse(dbname, cata);
}
async function fetch_browser_engines() {
    got_browser_engines = ( await browser.search.get() );
}

var btmDialogToggler;
function init_btmDialogToggler() {
    
    btmDialogToggler = new function btmDialogTogglerClass() {
        
        this.onBtnClick = function() {
            var btn_id = this.id;
            if (btn_id == "btn_donate") {
                const donate_pic = "https://gitlab.com/garywill/receiving/raw/master/receivingcode.png";
                // https://gitlab.com/garywill/receiving/raw/master/receivingcode.png
                // https://raw.githubusercontent.com/garywill/receiving/master/receivingcode.png
                if ( document.getElementById("img_receivingcode").getAttribute("src") != donate_pic)
                    document.getElementById("img_receivingcode").setAttribute("src",donate_pic); 
            }
            
            if (btn_id == (window.run_env == "http_web" ? "btn_webext" : "btn_about")  ) {
                var imgs = document.getElementById("div_addon_badges").querySelectorAll("img");
                Array.from(imgs).forEach(function(ele) {
                    if (ele.getAttribute("src") != ele.getAttribute("nsrc") )
                        ele.setAttribute("src", ele.getAttribute("nsrc"));
                });
            }
            switch(btn_id)
            {
                case "btn_donate":
                case "btn_about":
                case "btn_usage":
                case "btn_usetip":
                case "btn_theme":
                case "btn_source":
                case "btn_webext":
                    btmDialogToggler.toggle( document.getElementById(btn_id + "_dialog") );
                    Array.from(document.querySelectorAll(".btm_dialog:not(#" + btn_id + "_dialog)")).forEach(function(ele) {
                        ele.style.display = "none";
                    });
                    break;
            }
            
        };
        this.toggle = function(object) {
            
            
            
            if ( !object || getComputedStyle(object).display != "none") {
                this.close(object);
            } else {
                this.open(object);
            }
        };
        this.open = function(object) {
            object.style.display = "block";
            document.body.classList.add("when-btm-open");
        };
        this.close = function(object) {
            document.body.classList.remove("when-btm-open");
            object.style.display = "none";
        };
    }();

	
    
}

async function eng_link_onclick() {
}



var mtm = null;
async function do_stati()
{
    if (window.run_env != "http_web" ) { // browser addon
        if ( ( await get_addon_setting('noaddonstatistics') ) == true ||  // user disable stati
            chrome.extension.inIncognitoContext   // user in private mode
        )
        {  
            return; 
        }
    }
    
    if (getStor("beatnowhere") === "true")  // user disable stati
        return ;
    
        
    if (window.run_env == "http_web") {
    }
    else
    {
        document.querySelector("img#stati_51").src = "https://ia.51.la/go1?id=21129037&pvFlag=1";
        
        mtm = {
            // generate random string everytime
            chardb: '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
            rand_str: function(n) {  
                var s = [];
                for (var i=0; i<n; i++) {
                    s.push( Array.from(mtm.chardb) [ getRandomInt(mtm.chardb.length) ] );
                }
                return s.join('');
            },
            mtm_url: 'https://acsearch.cf/mpx/matomo.php' ,
            fake_url: 'https://acsearch.cf/BigSearch.addon/'
                + 'UA/' + navigator.userAgent.replaceAll('/', '_').replaceAll(' ','-').replaceAll(';','') , // browser type
            fake_title: 'Big Search Addon '
                + chrome.runtime.getManifest()['version']   // adddon version
                + ' [' + chrome.i18n.getUILanguage() + '] '  // language
                + `${localStorage['theme'] ? ' [' + localStorage['theme'] + '] ': ''}` // in-addon theme
                + '(' + (await getInstallType()) + ')' // install from web store or not
            ,
            page_pg: function() {
                mtm.pvid = mtm.rand_str(6); // generate random string everytime
                mtm.uid = (getRandomInt( parseInt('fffffffffffffff',16) ) + parseInt('1000000000000000',16)).toString(16) ; // generate random string everytime
                try{
                    fetch(
                        mtm.mtm_url + `?rec=1&pv_id=${mtm.pvid}&_id=${mtm.uid}&rand=${getRandomInt(100)}&action_name=${mtm.fake_title}&url=${mtm.fake_url}&idsite=7`
                    , { mode: 'no-cors' } );
                }catch(err){}
                mtm.inited = true;  // wouldn't reach here if user disable stati
            },
            goevent: function(dbname) {
                if (!mtm.inited)
                    return;  // user disable stati
                try{
                    fetch(
                        mtm.mtm_url + `?rec=1&pv_id=${mtm.pvid}&_id=${mtm.uid}&rand=${getRandomInt(100)}&idsite=7&e_c=clickbtn&e_a=go&e_n=${dbname}&e_v=${Object.keys(usercustom_engines).length}` // user using build-in, browser-in, or custom ?
                    , { mode: 'no-cors' } );
                }catch(err){}
            }
            
        };
        
        mtm.page_pg(); // wouldn't reach here if user disable stati
    }
    
}
   

async function stati_goclicked (obj) {
    
    const dbname = obj.getAttribute("dbname");
    const e = obj.getAttribute("e");
    const b = obj.getAttribute("b");
    
    if ( window.run_env == "http_web" &&  dbname == "bigsearch" )
    {
    }
        
    
    if ( window.run_env != "http_web" ) {
        if ( ( await get_addon_setting('noaddonstatistics') ) !== true ) { // user disable or not
            
            mtm.goevent(dbname);
        }
    }
}


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
