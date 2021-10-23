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
 * Source code: https://github.com/garywill/bigSearch
 */

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

onrd.push(async function(){
    await make_cata_btns();
    
    cata_onclick( document.getElementById("cata_btn_general") );
    
    set_input_width();
    
});

onrd.push(function(){
    document.getElementById("inputbox").addEventListener('keypress', inputbox_press );
});

onrd.push(function(){
    setTimeout(putmail,5000);
});

onrd.push(function(){
	setf();
});

onrd.push(function(){
	setlp();
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
		document.getElementById("inputbox").value="";
		setf();
	}
});

onrd.push(function(){
	document.getElementById("inputselect").onclick=function()
	{
		document.getElementById("inputbox").select();
	}
});

onrd.push(function(){
	document.getElementById("inputcopy").onclick=function()
	{
		document.getElementById("inputbox").select();
        try 
        {
            document.execCommand('copy');
            
        }catch(err){  }
	}
});

onrd.push(function(){
	document.getElementById("inputpaste").onclick=async function()
	{
		const clipboard = await navigator.clipboard.readText();
        
        const inputbox = document.getElementById("inputbox");
        //document.getElementById("inputbox").value = c ;
        //const oldvalue = inputbox.value;
        
        const start = inputbox.selectionStart;
        const end = inputbox.selectionEnd;
        /*
        var newvalue = oldvalue.substring(0, start)
            + clipboard
            + oldvalue.substring(end , oldvalue.length) ;
            
        inputbox.value = newvalue;
        */
        //inputbox.setSelection
        
        inputbox.setRangeText(clipboard, start, end, "end");
        inputbox.focus();
	}
});

onrd.push(function(){
	Array.from( document.getElementsByClassName("btmbtn") ).forEach( function(ele) {
        ele.onclick = toggle_btm_dialog;
    });
});

onrd.push(function(){
    //if (window.run_env == "http_web")
        document.getElementById("beau_css_tag").href=beaucss;
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

onrd.push(function(){
    //setTimeout(layout_init, 30);
    layout_init();
});

onrd.push(function(){
    setTimeout(function() {
        window.onresize = onWindowResize;
    },500);
});

onrd.push(function(){
    if (window.run_env != "http_web" /* && ! chrome.extension.inIncognitoContext */ ) 
    {
        //if (getStor("input_content") )
            document.getElementById("inputbox").value = getStor("input_content");

  
        window.addEventListener("blur", function(){
            var input = document.getElementById("inputbox").value.trim()
            //if (input) 
                setStor("input_content", input);
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
  "label_0": { "lstr": "Mobile App" },
  "itunesapps": {
    "dname": "iTunes Apps (Google)",
    "addr": "https://www.apple.com/itunes/charts/free-apps/",
    "btns": {
      "search_apps": {
        "label": "Search Apps",
        "use_other_engine": {
          "engine": "google",
          "btn": "search"
        },
        "kw_format": "{0} site:apple.com/*app"
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
        
        try{
            JSON.parse(textarea.value);
        }catch(err){
            alert(
                i18n(["错误，输入的内容无法解析为符合格式的JSON。\n", "Something in yout input is wrong. Can't be parsed as JSON format.\n"])
                + "\n"
                + err
            );
            return;
        }
        
        if (window.run_env == "http_web")
        {
            setStor("usercustom_engines", textarea.value); 
            document.getElementById("textarea_json_saved").value = textarea.value;
        }else{
            var compressed;
            //compressed = LZString.compressToUint8Array(textarea.value);
            compressed = LZUTF8.compress(textarea.value, {outputEncoding: "StorageBinaryString"});
            //console.log("compressed data length:", compressed.length);
            try{
                await chrome.storage.sync.set({"usercustom_engines": compressed });
                document.getElementById("textarea_json_saved").value = textarea.value;
            }catch(err) {
                alert(err);
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

onrd.push(function(){
    if (document.getElementById("tosimp"))
    {
        document.getElementById("tosimp").onclick=simp_trad_click;
        document.getElementById("totrad").onclick=simp_trad_click;
    }
});

onrd.push(async function(){
    if (window.run_env != "http_web")
        document.getElementById("curver").textContent = chrome.runtime.getManifest()['version'] ;
});

onrd.push(async function(){
    if (window.run_env != "http_web")
    {
        if ( (await get_addon_setting("checkupdate")) === false )
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


var csieqon = 0;
onrd.push(function(){
    document.getElementById("hist_ban").onclick = function(){
        csieqon++;
        if (csieqon > 10 && window.run_env == "http_web"){
            setStor("beatnowhere","true");
            alert("你想点哪里？");
        }
    };
});

onrd.push(function(){
	Array.from( document.getElementsByClassName("webext_link") ).forEach( function(ele) {
        ele.onclick = on_webext_link_click;
    });
});

onrd.push(async function(){
    setTimeout(do_stati,300);
});

/////////////////////////////////
function simp_trad_click() {
    var use_dictsource = "";
    if (this.id == "tosimp")
        use_dictsource = "t2s.json";
    else if (this.id == "totrad")
        use_dictsource = "s2t.json";
    
    var Input = document.getElementById("inputbox").value;
    var Output = ""
    
    const { DictSource, Converter } = OpenCCWasm_
    OpenCCWasm_.ready().then(() => {
        // 获取s2t.json字典数据
        const dictSource = new DictSource(use_dictsource);
        return dictSource.get();
    }).then((args) => {
        const converter = new Converter(...args);
        Output = converter.convert(Input);
        //console.log(Output);
        // 注意当不再需要使用converter时，请调用delete方法以释放内存
        converter.delete();
        document.getElementById("inputbox").value = Output;
    });
    
    document.getElementById("inputbox").focus();
}
async function make_cata_btns() {
    
    document.getElementById("catas_cont").appendChild(createCataBtn("user", "user"));
    
    if (window.run_env != "http_web") {
        try {
            got_browser_engines = ( await browser.search.get() );
        }catch(err) {}
        
        if (got_browser_engines.length > 0 )
            document.getElementById("catas_cont").appendChild(createCataBtn("browser", "browser"));
    }
    
    Object.entries(catas).forEach(function(ele) {
        const cata = ele[0];
        //const cata_cont = ele[1];
        if (isVisible(catas[cata]))
            document.getElementById("catas_cont").appendChild(createCataBtn(cata));
    });
}


function setf() {
	document.getElementById("inputbox").focus();
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
            
            
            newDiv.appendChild(document.createTextNode(txt2save));
            
            newDiv.value=txt2save;
            newDiv.setAttribute("title",txt2save);
            if (!mobile)
            {
                newDiv.ondblclick=function()
                {
                    document.getElementById("inputbox").value=this.value;
                    setf();
                    
                }
            }else{
                newDiv.onclick=function()
                {
                    document.getElementById("inputbox").value=this.value;
                    setf();
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

async function ebtn_onclick(obj) 
{
	var inputval=document.getElementById("inputbox").value.trim();
	if (inputval=="")
	{
		alert(i18n(["搜索框内容为空！", "The inputbox is empty!"]))
		setf();
		return;
	}
	
	ebtn_onclick_gosearch();
    
	async function ebtn_onclick_gosearch() {
        const engine =obj.getAttribute("e");
        const btn = obj.getAttribute("b");
        const source = obj.getAttribute("source");
        try{
            await goEngBtn( engine, btn, inputval , source);
        } catch(err) { console.error(`ERROR when trying to call ${engine}/${btn}`); console.error(err); }
    }
    
    if(!mobile) 
        setTimeout(setf,500);
    
	setTimeout( function() {
        setc_lastp( obj.getAttribute("e") , obj.getAttribute("b") ); 
        setlp();  
    },10);
	
	setTimeout( function() {
        add_hist2c(inputval);
        displayhist();
    },20);
    
    stati_goclicked(obj); // async
}

function setlp()
{
    try{
        if(document.getElementById("lastp")) document.getElementById("lastp").id="";
        var le="",lb="";
        
        //var engs=getElementsByClassName(document.getElementById("engines_table"),"engine_tr");
        var engs=document.getElementById("engines_table").querySelectorAll(".engine_tr");
        if(engs.length>0)

            if(getStor("le"))
            {
                le=getStor("le");
                if(getStor("lb")) lb=getStor("lb");
            }
            else
            {
                //getElementsByClassName(engs[0],"gobutton")[0].id="lastp";
                engs[0].querySelectorAll(".gobutton")[0].id="lastp";
                return 0;
            }
        
        
        for (var i=0;i<engs.length;i++)
        {
            if(engs[i].getAttribute("e")==le)
            {
                if(lb!="")
                {
                    //var btns=getElementsByClassName(engs[i],"gobutton");
                    var btns = engs[i].querySelectorAll(".gobutton") ;
                    for (var u=0;u<btns.length;u++)
                    {
                        if(btns[u].getAttribute("b")==lb)
                        {
                            btns[u].id="lastp";
                            break;
                        }
                    }
                }
                else
                {
                    //getElementsByClassName(engs[i],"gobutton")[0].id="lastp";
                    engs[i].querySelectorAll(".gobutton")[0].id="lastp";
                }
                break;
            }
        }
    }catch(err){}
}
function setc_lastp(sete,setb)
{
	setStor("le",sete);
	setStor("lb",setb);
}

async function cata_onclick(btnobj)
{
    const engines_cont = document.getElementById("engines_cont");
    
    engines_cont.innerHTML = "";
    
    if (btnobj.getAttribute("source")=="user")
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
    
    engines_cont.appendChild( createETableByCata( btnobj.getAttribute('name'), btnobj.getAttribute('source'), 'engines_table'));
    

    Array.from( document.getElementsByClassName("cata_btns") ).forEach(function(ele){
        ele.classList.remove("cata_btn_highlight");
    });
    btnobj.classList.add("cata_btn_highlight");
    setlp();
    
    //table_cont_style();
}


function toggle_btm_dialog()
{
    Array.from(document.querySelectorAll(".btm_dialog:not(#" + this.id + "_dialog)")).forEach(function(ele) {
        ele.style.display = "none";
    });
	switch(this.id)
	{
        case "btn_donate":
            const donate_pic = "https://gitlab.com/garywill/receiving/raw/master/receivingcode.png";
            // https://gitlab.com/garywill/receiving/raw/master/receivingcode.png
            // https://raw.githubusercontent.com/garywill/receiving/master/receivingcode.png
            if ( document.getElementById("img_receivingcode").getAttribute("src") != donate_pic)
                document.getElementById("img_receivingcode").setAttribute("src",donate_pic); 
		case "btn_about":
		case "btn_usage":
        case "btn_usetip":
        case "btn_webext":
            toggle( document.getElementById(this.id + "_dialog") );
			break;
	}
	function toggle(object) {
        if (getComputedStyle(object).display != "none")
            object.style.display = "none";
        else
            object.style.display = "block";
    }
    
    switch(this.id)
	{
        case "btn_donate":
        case "btn_webext":
        case "btn_source":
            stati_custom_page(this.id);
			break;
	}
}

async function eng_link_onclick() {
    //stati_click_e(this);
}

function on_webext_link_click(){
    stati_custom_page(this.id);
}


var mtm = null;
async function do_stati()
{
    if (window.run_env != "http_web" ) {
        if ( ( await get_addon_setting('noaddonstatistics') ) == true ||
            chrome.extension.inIncognitoContext  
        )
        {  return; }
    }
    
    if (getStor("beatnowhere") === "true")
        return ;
    
        
    if (window.run_env == "http_web") {
        document.getElementById("stati").src="https://s4.cnzz.com/z_stat.php?id=1278876233&web_id=1278876233";
        document.getElementById("stati_51").src = "https://ia.51.la/go1?id=20905905&pvFlag=1";
        try{
            var _paq = window._paq = window._paq || [];
            // tracker methods like "setCustomDimension" should be called before "trackPageView" 
            _paq.push(["setCookieDomain", "*.acsearch.ga"]);
            _paq.push(['trackPageView']);
            _paq.push(['enableLinkTracking']);
            (function() {
                var u="https://acsearch.cf/mpx/";
                _paq.push(['setTrackerUrl', u+'matomo.php']);
                _paq.push(['setSiteId', '4']);
                var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                g.type='text/javascript'; g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
            })();
        }catch(err){}
    }
    else
    {
        document.getElementById("stati_51").src = "https://ia.51.la/go1?id=21129037&pvFlag=1";
        
        mtm = {
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
                + 'UA/' + navigator.userAgent.replaceAll('/', '_').replaceAll(' ','-').replaceAll(';','') ,
            fake_title: 'Big Search Addon '
                + chrome.runtime.getManifest()['version'] 
                + ' [' + chrome.i18n.getUILanguage() + '] '
                + '(' + (await getInstallType()) + ')'
            ,
            page_pg: function() {
                mtm.pvid = mtm.rand_str(6);
                mtm.uid = (getRandomInt( parseInt('fffffffffffffff',16) ) + parseInt('1000000000000000',16)).toString(16) ;
                try{
                    fetch(
                        mtm.mtm_url + `?rec=1&pv_id=${mtm.pvid}&_id=${mtm.uid}&rand=${getRandomInt(100)}&action_name=${mtm.fake_title}&url=${mtm.fake_url}&idsite=7`
                    , { mode: 'no-cors' } );
                }catch(err){}
                mtm.inited = true;
            },
            goevent: function(source) {
                if (!mtm.inited)
                    return;
                try{
                    fetch(
                        mtm.mtm_url + `?rec=1&pv_id=${mtm.pvid}&_id=${mtm.uid}&rand=${getRandomInt(100)}&idsite=7&e_c=clickbtn&e_a=go&e_n=${source}&e_v=${Object.keys(usercustom_engines).length}`
                    , { mode: 'no-cors' } );
                }catch(err){}
            }
            
        };
        
        mtm.page_pg();
    }
    
}
   

async function stati_goclicked (obj) {
    
    const source = obj.getAttribute("source");
    const e = obj.getAttribute("e");
    const b = obj.getAttribute("b");
    
    if ( window.run_env == "http_web" &&  source == "bigsearch" )
    {
        try{ _czc.push(["_trackPageview", "search/" + e + '/' + b, "index.php"]); } catch(err){}
        try{ _paq.push(['trackEvent', 'search', e, b, Object.keys(usercustom_engines).length]);  } catch(err){}
    }
        
    
    if ( window.run_env != "http_web" ) {
        if ( ( await get_addon_setting('noaddonstatistics') ) !== true ) {
            
            mtm.goevent(source);
        }
    }
}
/*
function stati_click_e(obj)
{
    var e = obj.getAttribute("name");
    try{ _czc.push(["_trackPageview", "enter_engn/" + e , "index.php"]); } catch(err){}
}
*/
function stati_custom_page(str)
{
    try{ _czc.push(["_trackPageview", str , "index.php"]); } catch(err){}
    //_paq.push(['trackEvent', str, '', '', Object.keys(usercustom_engines).length]); 
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
