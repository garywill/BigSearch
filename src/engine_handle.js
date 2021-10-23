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


var usercustom_engines_list = [];
var usercustom_engines = {};

var got_browser_engines = [] ;

async function read_usercustom_engines() {
    if (window.run_env == "http_web")
    {
        if (getStor("usercustom_engines") ) {
            usercustom_engines = JSON.parse(getStor("usercustom_engines"));
            document.getElementById("textarea_json_saved").value = getStor("usercustom_engines");
        }
    }else{
        const read_addon_settings_usercuston_engines = await get_addon_setting("usercustom_engines");
        if (read_addon_settings_usercuston_engines ) {
            //usercustom_engines = JSON.parse(LZString.decompressFromUint8Array(await get_addon_setting("usercustom_engines")));
            
            usercustom_engines = JSON.parse( LZUTF8.decompress(read_addon_settings_usercuston_engines, {inputEncoding: "StorageBinaryString"}) );
            
            document.getElementById("textarea_json_saved").value = LZUTF8.decompress(read_addon_settings_usercuston_engines, {inputEncoding: "StorageBinaryString"});
        }
    }
    usercustom_engines_list = engines_object_tolist(usercustom_engines);
}
//read_usercustom_engines();

function db(source="bigsearch") {
    var catas_db = {};
    var engines_db = {};
    
    if ( !source || source == "bigsearch")
    {
        catas_db = catas;
        engines_db = sEngines
    }
    else if ( source == "user")
    {
        catas_db = {
            "user": {
                label: i18n([ "用户自定", "User Custom" ]),
                engines: usercustom_engines_list
            }
        };
        engines_db = usercustom_engines;
    }
    else if ( source == "browser" )
    {
        var browser_engines = {};
        var browser_engines_list = {};
        
        got_browser_engines.forEach( function(obj, i) {
            browser_engines[obj.name] = {};
            browser_engines[obj.name]['dname'] = obj.name;
        });
        
        browser_engines_list = engines_object_tolist(browser_engines);
        
        catas_db = {
            "browser": {
                label: i18n([ "浏览器带", "In-Browser" ]),
                engines: browser_engines_list
            }
        };
        engines_db = browser_engines;
    }
    
    return {
        catas: catas_db,
        sEngines: engines_db
    };
}

function engines_object_tolist(engines_obj) {
    var list = [];
    Object.entries(engines_obj).forEach( function(ele) {
        const name = ele[0];
        const e_obj = ele[1];
        
        if (e_obj['lstr'] !== undefined)
        {
            list.push({type:"label", lstr: e_obj['lstr']});
        }else{
            list.push({type:"engine", name: name});
        }
    });
    return list;
} 

// =================================================

const defaultBtn = {"search":{"label":i18n(["搜索", "Search"])}};

function createEngineTr(e_name,source=null){
    var tr = document.createElement("tr");
    tr.className = "engine_tr";
    tr.setAttribute("e",e_name);
    
    var td_dname = document.createElement("td");
    tr.appendChild(td_dname);
    td_dname.className = "enginename_td";
    td_dname.title = i18n(['要进行操作（如搜索），请输入后点击右列相应的按钮', 'To do an action (e.g. search), input text then click a button on the right column']);
    
    var span_in_td_dname = document.createElement("span");
    td_dname.appendChild(span_in_td_dname);
    span_in_td_dname.title = db(source).sEngines[e_name].tip ? db(source).sEngines[e_name].tip : i18n(["点此打开其首页。要进行操作（如搜索），请输入后点击右列相应的按钮", "Click to open its homepage. To do an action (e.g. search), input text then click a button on the right column"]);
    
    var engine_home_link = document.createElement("a");
    span_in_td_dname.appendChild(engine_home_link);
    span_in_td_dname.className = "engine_home_link";
    engine_home_link.target = "_blank";
    
    if ( db(source).sEngines[e_name].addr )
        engine_home_link.href = db(source).sEngines[e_name].addr;
    
    engine_home_link.setAttribute("name", e_name);
    
    if ( !source || source == "bigsearch")
        engine_home_link.addEventListener('click', eng_link_onclick );
        //engine_home_link.addEventListener('click', function() { stati_click_e(this) ; } );
    
    if ( typeof ( db(source).sEngines[e_name] ) === "string" )
        engine_home_link.textContent = e_name;
    else
        engine_home_link.textContent = db(source).sEngines[e_name].dname;
    
    if(db(source).sEngines[e_name].d_addi_html)
    {
        //engine_home_link.innerHTML = engine_home_link.innerHTML + "&nbsp;<span class='d_addi_html' style='font-size: 90%;' >" + db(source).sEngines[e_name].d_addi_html + "</span>";
        var span = document.createElement("span");
        span.className="d_addi_html";
        span.style="font-size: 90%; padding-left:5px;" ;
        
        
        switch ( typeof (db(source).sEngines[e_name].d_addi_html) ) {
            case "string":
                span.textContent = db(source).sEngines[e_name].d_addi_html;
                break;
            case "object":
                if (Array.isArray(db(source).sEngines[e_name].d_addi_html) )
                {
                    db(source).sEngines[e_name].d_addi_html.forEach( function(ele) {
                        var link = document.createElement("a");
                        link.textContent = ele['text'];
                        link.href = ele['href'];
                        link.target = "_blank";
                        link.title = ele['tip'];
                        
                        span.appendChild(link);
                    });
                }
                break;
        }
        
        engine_home_link.appendChild(span);
    }
    
    var td_enginebuttons = document.createElement("td");
    tr.appendChild(td_enginebuttons);
    td_enginebuttons.title = i18n(['要进行操作（如搜索），请输入后点击相应的按钮', 'To do an action (e.g. search), input text then click a button']);
    td_enginebuttons.className = "engbtns_td";
    
    if ( db(source).sEngines[e_name].btns === undefined )
    {
        createBtnsAndAppend(td_enginebuttons,defaultBtn);
    }else{
        createBtnsAndAppend(td_enginebuttons,db(source).sEngines[e_name].btns);
    }
    
    
    
    function createBtnsAndAppend(parent,btns)
    {
        Object.keys(btns).forEach( (key) => {
            if (isVisible(btns[key]))
            {
                var btn = document.createElement("button");
                btn.className = "gobutton";
                btn.setAttribute("e",e_name);
                btn.setAttribute("b",key);
                if (source) 
                    btn.setAttribute("source",source);
                else
                    btn.setAttribute("source", "bigsearch");
                btn.addEventListener('click', function () {ebtn_onclick(this);} );
                btn.title = btns[key].btn_tip ? btns[key].btn_tip : i18n(["在上面的输入框中输入后，点击进行相应操作", "Input text into above box, then click to do corresponding action"]);
                btn.textContent = btns[key].label;
                parent.appendChild(btn);
            }
        });
    }
    
    return tr;
}

function createLabelTr(l_str)
{
    var tr = document.createElement("tr");
    tr.className = "labelrow";
    
    var td = document.createElement("td");
    tr.appendChild(td);
    td.className = "labelrowtd";
    td.colSpan = 2;
    td.textContent = l_str;
    
    return tr;
}

function createETableByCata(cata, source=null, object_id=null, object_class=null, object_style=null)
{
    var table = document.createElement("table");
    table.name = cata;
    if (object_id) table.id = object_id;
    if (object_class) table.className = object_class;
    if (object_style) table.style = object_style;
    
    db(source).catas[cata].engines.forEach(function(ele){
        if (isVisible(ele))
        {
            if (ele.type == "label")
            {
                table.appendChild( createLabelTr(ele.lstr) );
            }else if(ele.type == "engine")
            {
                try{
                    table.appendChild( createEngineTr(ele.name, source) );
                }catch(err){console.error(err);}
            }
        }
    });
    
    return table;
}

function createCataBtn(cata, source=null)
{
    //var div = document.createElement("div");
    
    var button = document.createElement("button");
    //div.appendChild(button);
    button.className = "general_btn cata_btns";
    button.name = cata;
    if (source) button.setAttribute("source",source );
    button.id = "cata_btn_" + cata;
    if (source) button.id = button.id + "_source_" + source;
    
    button.addEventListener('click', function () {cata_onclick(this);});
        
    var span = document.createElement("span");
    button.appendChild(span);
    span.textContent = db(source).catas[cata].label;
    
    //return div;
    return button;
}

///////////////////////////////////////////////////////////

function getDataForGo(engine,btn,source=null)
{
    const data_btnOverEng = ["addr","dname","tip","action","method","charset","kw_key","kw_replace","kw_format","params","full_url","use_other_engine","allow_referer"];
    const data_btnOnly = ["label","btn_tip"];
    const data_engOnly = [];
    
    var engine = db(source).sEngines[engine];
    if (engine.btns === undefined)
        engine.btns = defaultBtn;
    
    var data = {};
    
    if ( typeof(engine) === "string" )
    {
        data['full_url'] = engine;
        return data;
    }
    
    data_btnOnly.forEach(function(ele){
        if (engine.btns[btn][ele]  !== undefined) {
            data[ele] = engine.btns[btn][ele];
        }
    });
    
    data_engOnly.forEach(function(ele){
        if (engine[ele]  !== undefined) {
            data[ele] = engine[ele];
        }
    });
    
    data_btnOverEng.forEach(function(ele){
        if (engine.btns[btn][ele]  !== undefined) {
            data[ele] = engine.btns[btn][ele];
        }else if (engine[ele]  !== undefined) {
            data[ele] = engine[ele];
        }
    });
    
    return data;
}
async function goEngBtn(engine,btn,keyword,source=null)
{
    var newTabIndex;
    var newTabBringFront;
    if (window.run_env != "http_web") {
        newTabIndex = 0;
        if (isFirefox)
            newTabBringFront = true;
        else
            newTabBringFront = false;
    }
    
    
    if ( source == "browser" ) {
        const newTab = ( await browser.tabs.create({url:"about:blank", active: newTabBringFront, index: newTabIndex}) );
        browser.search.search({
            query: keyword,
            engine: engine,
            tabId: newTab.id
        });

        return;
    }
    
    var data = getDataForGo(engine,btn, source);
    /*
     * replace
     * format
     * ( use_other_engine | (full_url+charset+urlencode) ) ?
     * "NO" from last step:
     *      params
     *      method+action+referer
     */

    if ( data.kw_replace !== undefined ) 
    {
        for ( var i=0; i<data.kw_replace.length; i++ )
        {
            keyword = keyword.replace( data.kw_replace[i][0], data.kw_replace[i][1]) ;
        }
    }

    if ( data.kw_format !== undefined  ) 
    {  
        keyword = data.kw_format.format(keyword);
    }
    
    if (data.use_other_engine !== undefined){
        goEngBtn( data.use_other_engine.engine, data.use_other_engine.btn , keyword);
        return;
    }
    
    var use_referer = data.allow_referer;
    
    if (data.full_url !== undefined){
        if (window.run_env == "http_web")
            go_full_url(keyword, data.full_url, data.charset,use_referer);
        else
        {
            const call_function_str = 
                "go_full_url("
                + JSON.stringify(keyword)
                + "," + JSON.stringify(data.full_url) 
                + "," + JSON.stringify(data.charset)
                + "," + JSON.stringify(use_referer)
                + ");"
            ;   
            
            await browser_newtab_go( go_full_url, call_function_str, set_string_format_prototype  );
        }
        return;
    }
    
    var fparams = [];
    fparams.push({key:data.kw_key, val:keyword});
    if(data.params !== undefined) {
        data.params.forEach(function(ele){
            fparams.push(ele);
        });
    }
    if (window.run_env == "http_web")
        form_submit(fparams,data.action,data.charset,data.method,use_referer);
    else{
        const call_function_str = 
            "form_submit(" 
            + JSON.stringify(fparams) 
            + "," + JSON.stringify(data.action) 
            + "," + JSON.stringify(data.charset)
            + "," + JSON.stringify(data.method)
            + "," + JSON.stringify(use_referer)
            + ");"
        ;
        await browser_newtab_go( form_submit, call_function_str, null);
        
    }
    
    async function browser_newtab_go(func, call_function_str,  prefunc=null, dname="", btnlabel="" ) 
    {
        var page_title = ""
        var body_text = ""
        if (dname)
        {
            page_title = dname + i18n([ " ..连接中.. - 大术专搜" , "..Connecting to.. - Big Search" ]) ;
            body_text = i18n([ "大术专搜 -- ..连接中.. --→  " , "Big Search -- ..Connecting to.. --→  " ]) + dname + "  " + btnlabel ;
        }else{
            page_title = i18n([ "目标站点连接中 - 大术专搜" , "Connecting to target website - Big Search" ]) ;
            body_text = i18n([ "大术专搜 -- ..连接目标站点中.." , "Big Search -- ..Connecting to target website.." ]) ;
        }
        
        
        
        if (isFirefox)
        {
            var inject_js_for_text = ""
            inject_js_for_text = `document.title="${page_title}"; document.body.textContent="${body_text}" ;`
            
            const newTab = ( await browser.tabs.create({url:"about:blank", active: newTabBringFront, index: newTabIndex}) );
            
            await chrome.tabs.executeScript( newTab.id, { 
                matchAboutBlank: true,
                code: inject_js_for_text
                    + parse_prefunc()
                    + func.toString()
                    + call_function_str
            } );
        } 
        else if (isChrome) 
        {
            
            chrome.tabs.create({
                url: 
                    "data:text/html," + 
                    encodeURIComponent(
                        "<!DOCTYPE html> <head><meta charset='utf-8'>" 
                        + "<title>" + page_title + "</title>"
                        + "<script>" 
                        + parse_prefunc()
                        + func.toString()
                        + "</script></head><body>" 
                        + "<script>" + call_function_str  + "</script>"
                        + body_text
                        + "</body></html>"
                    )
                , 
                active: newTabBringFront,
                index: newTabIndex
            });
        }
        function parse_prefunc(){
            if (prefunc)
                return prefunc.toString() + prefunc.name + "();" ;
            else 
                return "";
        }
    }
}

function go_full_url(keyword, full_url, charset="UTF-8",referer=false){
    var iconvd_keyword;
    
    iconvd_keyword = keyword; 
    if (charset != "UTF-8") console.warn("full_url doesn't support non UTF-8 yet!");
    
    var url2open;
    url2open = full_url.format(iconvd_keyword);
    
    var a = document.createElement("a");
    a.style = "display:none;";
    
    if (window.run_env == "http_web")
        a.target = "_blank";
    else
        a.target = "_top";
    
    a.rel = "noopener";
    a.href = url2open;
    if(referer)
    {
        ;
    }else{
        a.rel += " noreferrer";
    }
    
    a.click();
    //delete a;
}
function form_submit(fparams,action,charset="UTF-8",method="get",referer=false){
    var form=document.createElement("form");
    form.id="formsubmit";
    form.style="display:none;"
    form.action=action;
    if ( window.run_env == "http_web" )
        form.target="_blank";
    else
        form.target="_top";
    form.acceptCharset=charset;
    form.method=method;
    
    fparams.forEach(function(ele){
        var inp = document.createElement("input");
        inp.name = ele.key;
        inp.value = ele.val;
        form.appendChild(inp);
    });
    
    if(referer)
    {
        document.body.appendChild(form);
        form.submit();
        setTimeout(function() {
            form.parentNode.removeChild(form);
        }, 500);
    }else{
        var jumper=document.createElement("iframe");
        jumper.style="display:none;";
        document.body.appendChild(jumper);
        jumper.contentWindow.document.body.appendChild(form);
        var form = jumper.contentWindow.document.getElementById("formsubmit");
        form.submit();
        setTimeout(function() {
            jumper.parentNode.removeChild(jumper);
        }, 500);
    }
}

function isVisible(obj)
{
    if (!obj.visible_lang ) return true;
    
    if (typeof(obj.visible_lang) === "string")
    {
        if (window.lang == obj.visible_lang) return true;
        else return false;
    }
    else
    {
        obj.visible_lang.forEach( function(ele) {
            if (ele == window.lang) return true
        });
    }
    
    return false
}


