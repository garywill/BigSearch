/*
 * Big Search (大术专搜)
 *     https://github.com/garywill/BigSearch
 *     https://addons.mozilla.org/firefox/addon/big-search/
 *     https://chrome.google.com/webstore/detail/big-search/ojcnjeigmgjaiolalpapfnmmhdmpjhfb
 * 
 * Licensed under AGPL (GNU Affero General Public License)
 */



var usercustom_engines_list = [];
var usercustom_engines = {};

var got_browser_engines = [] ;


async function read_usercustom_engines() {
    if (window.run_env == "http_web")
    {
    }else{ // addon
        var ext_json = await addon_read_usercustom_engines();
        if (ext_json ) {
            ext_json = JSON.parse(ext_json);
            usercustom_engines = ext_json;
            if (window.run_page != "connecting")
                document.getElementById("textarea_json_saved").value = JSON.stringify(usercustom_engines, null,2);
        }
    }
    usercustom_engines_list = engines_object_tolist(usercustom_engines);
}
//read_usercustom_engines();

function db(dbname="bigsearch") {
    var catas_db = {};
    var engines_db = {};
    
    if ( !dbname || dbname == "bigsearch")
    {
        catas_db = catas;
        engines_db = sEngines
    }
    else if ( dbname == "user")
    {
        catas_db = {
            "user": {
                label: '🏡' + i18n([ "用户自定", "User Custom" ]),
                engines: usercustom_engines_list
            }
        };
        engines_db = usercustom_engines;
    }
    else if ( dbname == "browser" )
    {
        var browser_engines = {};
        var browser_engines_list = {};
            
        if (isFirefox)
        {
            got_browser_engines.forEach( function(obj, i) {
                browser_engines[obj.name] = {};
                browser_engines[obj.name]['dname'] = obj.name;
            });
        }else if (isChrome)
        {
            browser_engines['chrome_default_search'] = {};
            browser_engines['chrome_default_search'] ['dname'] = i18n( [ "浏览器默认搜索引擎", "Browser default search engine" ] );
        }
        
        browser_engines_list = engines_object_tolist(browser_engines);
        
        catas_db = {
            "browser": {
                label: '⚓' + i18n([ "浏览器带", "In-Browser" ]),
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
        }else if (e_obj['fav'] !== undefined) {
            list.push({type:"fav", name: e_obj['fav']});
        }else{
            list.push({type:"engine", name: name});
        }
    });
    return list;
} 

// =================================================

const defaultBtn = {"search":{"label":i18n(["搜索", "Search"])}};

function createEngineTr(e_name,dbname=null, egnTrNum=null){
    var tr = document.createElement("tr");
    tr.className = "engine_tr";
    tr.setAttribute("e",e_name);
    
    var td_dname = document.createElement("td");
    tr.appendChild(td_dname);
    td_dname.className = "enginename_td";
    td_dname.title = i18n(['要进行操作（如搜索），请输入后点击右列相应的按钮\n\n如果想要将大术专搜内置的引擎“设为常用”或“重新排序”，请使用“用户自定”功能。使用其中的在线GUI编辑器可以轻松操作', 'To do an action (e.g. search), input text then click a button on the right column\n\nIf want to "set as favorite" or "re-order" Big Search build-in engines, use "User Custom". Use its online editing-engine GUI to easily do it']);
    
    if (typeof(egnTrNum) === "number")
    { 
        var span_egnTrNum = document.createElement("span");
        span_egnTrNum.className = "span_egnTrNum";
        span_egnTrNum.textContent = egnTrNum;
        td_dname.appendChild(span_egnTrNum);
    } 
    
    
    var span_in_td_dname = document.createElement("span");
    td_dname.appendChild(span_in_td_dname);
    span_in_td_dname.title = db(dbname).sEngines[e_name].tip ? db(dbname).sEngines[e_name].tip : i18n(["点此打开其首页。\n要进行操作（如搜索），请输入后点击右列相应的按钮\n\n如果想要将大术专搜内置的引擎“设为常用”或“重新排序”，请使用“用户自定”功能。使用其中的在线GUI编辑器可以轻松操作", 'Click to open its homepage.\n To do an action (e.g. search), input text then click a button on the right column\n\nIf want to "set as favorite" or "re-order" Big Search build-in engines, use "User Custom". Use its online editing-engine GUI to easily do it']);
    
    var engine_home_link = document.createElement("a");
    span_in_td_dname.appendChild(engine_home_link);
    span_in_td_dname.className = "engine_home_link";
    engine_home_link.target = "_blank";
    
    if ( db(dbname).sEngines[e_name].addr )
        engine_home_link.href = db(dbname).sEngines[e_name].addr;
    
    engine_home_link.setAttribute("name", e_name);
    
    if ( !dbname || dbname == "bigsearch")
        engine_home_link.addEventListener('click', eng_link_onclick );
    
    if ( typeof ( db(dbname).sEngines[e_name] ) === "string" )
        engine_home_link.textContent = e_name;
    else
        engine_home_link.textContent = db(dbname).sEngines[e_name].dname;
    
    if(db(dbname).sEngines[e_name].d_addi_html)
    {
        //engine_home_link.innerHTML = engine_home_link.innerHTML + "&nbsp;<span class='d_addi_html' style='font-size: 90%;' >" + db(dbname).sEngines[e_name].d_addi_html + "</span>";
        var span = document.createElement("span");
        span.className="d_addi_html";
        span.style="font-size: 90%; padding-left:5px;" ;
        
        
        switch ( typeof (db(dbname).sEngines[e_name].d_addi_html) ) {
            case "string":
                span.textContent = db(dbname).sEngines[e_name].d_addi_html;
                break;
            case "object":
                if (Array.isArray(db(dbname).sEngines[e_name].d_addi_html) )
                {
                    db(dbname).sEngines[e_name].d_addi_html.forEach( function(ele) {
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
    
    if (window.run_env == "http_web")
        td_enginebuttons.title = i18n(['要进行操作（如搜索），请输入后点击相应的按钮', 'To do an action (e.g. search), input text then click a button']);
    
    td_enginebuttons.className = "engbtns_td";
    
    if ( db(dbname).sEngines[e_name].btns === undefined )
    {
        createBtnsAndAppend(td_enginebuttons,defaultBtn);
    }else{
        createBtnsAndAppend(td_enginebuttons,db(dbname).sEngines[e_name].btns);
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
                if (dbname) 
                    btn.setAttribute("dbname",dbname);
                else
                    btn.setAttribute("dbname", "bigsearch");
                btn.addEventListener('click', function () {ebtn_onclick(this);} );
                
                if (btns[key].btn_tip)
                    btn.title = btns[key].btn_tip 
                else if (window.run_env == "http_web")
                    btn.title = i18n(["在上面的输入框中输入后，点击进行相应操作", "Input text into above box, then click to do corresponding action"]);
                
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

function createETableByCata(cata, dbname=null, object_id=null, object_class=null, object_style=null)
{
    var table = document.createElement("table");
//     table.name = cata; 
    table.setAttribute("dbname", dbname);
    table.setAttribute("cata", cata);
    table.setAttribute("name", cata); //NOTE don't use this
    
    if (object_id) table.id = object_id;
    if (object_class) table.className = object_class;
    if (object_style) table.style = object_style;
    
    var trNum = 0;
    db(dbname).catas[cata].engines.forEach(function(ele){
        if (isVisible(ele))
        {
            if (ele.type == "label")
            {
                table.appendChild( createLabelTr(ele.lstr) );
            }else if(ele.type == "engine")
            {
                trNum ++;
                try{
                    table.appendChild( createEngineTr(ele.name, dbname, trNum) );
                }catch(err){console.error(err);}
            }
            else if(ele.type == "fav")
            {
                trNum ++;
                try{
                    table.appendChild( createEngineTr(ele.name, "bigsearch", trNum) );
                }catch(err){console.error(err);}
            }
        }
    });
    
    return table;
}

function createCataBtn(cata, dbname=null)
{
    //var div = document.createElement("div");
    
    if (!dbname) 
        dbname="bigsearch";
    
    var button = document.createElement("button");
    //div.appendChild(button);
    button.className = "cata_btns";
    button.setAttribute("cata",cata);
    button.setAttribute("name",cata);  // NOTE don't use this 
    
    if (dbname) 
        button.setAttribute("dbname",dbname );
    button.id = "cata_btn_" + cata;
    if (dbname) 
        button.id = button.id + "_dbname_" + dbname;
    
    button.addEventListener('click',async function () { await cata_onclick(this); cata_onclick_ui(this); });
        
    var span = document.createElement("span");
    button.appendChild(span);
    span.textContent = db(dbname).catas[cata].label;
    
    //return div;
    return button;
}

///////////////////////////////////////////////////////////

function getDataForGo(engine,btn,dbname=null)
{
    const data_btnOverEng = ["addr","dname","tip","action","method","charset","kw_key","kw_replace","kw_format","params","full_url","use_other_engine","allow_referer","ajax"];
    const data_btnOnly = ["label","btn_tip"];
    const data_engOnly = [];
    
    var engine = db(dbname).sEngines[engine];
    if (engine.btns === undefined)
        engine.btns = defaultBtn;
    
    var data = {};
    
    if ( typeof(engine) === "string" )
    {
        data['full_url'] = engine;
        return data;
    }
    
    if ( ! btn )
        btn = Object.keys(engine.btns)[0];

    
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


async function calcNewTabIndex() {
    var newTabIndex = -1;
    var setting_newTabPos = await get_addon_setting_local('newTabPos');
    switch (setting_newTabPos){
        case 'left-all': newTabIndex = 0 ;  break;
        case 'right-all': newTabIndex = 99999999 ;  break;
        case 'left-current': 
        case 'right-current': 
            await chrome.tabs.query( 
            { currentWindow: true , active: true},
            async function(r) {
                console.log(r);
                newTabIndex = r[0].index ;  
                if (setting_newTabPos == 'right-current')
                    newTabIndex = r[0].index+1;
            }
            ) ;
            break;
            
        default: newTabIndex = 0;
    }
    
    
    //-----------------------------
    for ( var zz=0; zz<1000; zz++) {
        if (newTabIndex != -1)
            break;
        else if (zz==999)
        {
            console.error('Waiting for newTabIndex, but timeout !');
            break;
        }
        await sleep(5);
    }
    //------------------------------
    return newTabIndex;
}

var newTabBringFront = false;
var newTabIndex = -1 ;
async function goEngBtn(engine,btn,keyword,dbname=null)
{
    
    
    if ( dbname == "browser" ) {
        newTabIndex = await calcNewTabIndex();
        const newTab =  await chrome.tabs.create({url:"about:blank", active: newTabBringFront, index: newTabIndex}) ;
        if (isFirefox) {
            browser.search.search({
                query: keyword,
                engine: engine,
                tabId: newTab.id
            });
        }else if (isChrome) {
            chrome.search.query({ text: keyword , tabId: newTab.id});
        }
        
        return;
    }
    
    var data = getDataForGo(engine,btn, dbname);
    /*
     * replace
     * format
     * JUDGE UOEF : ( use_other_engine | (full_url+charset+urlencode) ) ?
     * "NO" from UOEF:
     *      JUDGE AJAX: ajax ? 
     *          "YES" from AJAX: (addon only. alert if on web app.)
     *              ajax+action+referer
     *          "NO" from AJAX:
     *              params
     *              method+action+referer
     */

    // replace
    if ( data.kw_replace !== undefined ) 
    {
        for ( var i=0; i<data.kw_replace.length; i++ )
        {
            keyword = keyword.replaceAll( data.kw_replace[i][0], data.kw_replace[i][1]) ;
        }
    }
    
    // format
    if ( data.kw_format !== undefined  ) 
    {  
        keyword = data.kw_format.format(keyword);
    }
    
    // ====JUDGE UOEF===begin===
    if (data.use_other_engine !== undefined){
        if (Array.isArray(data.use_other_engine)  ) {
            data.use_other_engine.forEach( function(ele) {
                go_parse_use_other_engine(ele, keyword);
            });
        } else {
            go_parse_use_other_engine(data.use_other_engine, keyword)
        }
        
        
        return;
    }
    // ====JUDGE UOEF===finish===
    
    var use_referer = data.allow_referer;
    
    if (data.full_url !== undefined){
        if (window.run_env == "http_web")
            go_full_url(keyword, data.full_url, data.charset,use_referer);
        else
        {
            newTabIndex = await calcNewTabIndex();
            await open_connecting_page(dbname, engine, btn, keyword, newTabIndex);
        }
        return;
    }
    
    
    
    // ====JUDGE AJAX===begin===
    if (data.ajax !== undefined)
    {
        
        if (window.run_env == "http_web") {
        }
        
        

        var permis_have = await chrome.permissions.getAll();
        var host_permis_needed = removeUrlParts(data.action) + '*';
        console.log("host_permis_needed:" , host_permis_needed);
        console.log("permis_have: ", permis_have);
        if ( ! ( permis_have['origins'].includes('*://*/*') || permis_have['origins'].includes(host_permis_needed) ) ) {
            const permis_toast_o = document.getElementById("permis_toast_o");
            const permis_toast_url = document.getElementById("permis_toast_url");
            permis_toast_url.setAttribute("data", host_permis_needed);
            permis_toast_url.textContent = host_permis_needed;
            permis_toast_o.style.display = "";
            console.log("returning cause waiting for host permission");
            return;
        }
        console.log("permission check ok");
        
        
        
        newTabIndex = await calcNewTabIndex();
        await open_connecting_page(dbname, engine, btn, keyword, newTabIndex);
        
        return;
    }
    // ====JUDGE AJAX===finish===
    
    var fparams = [];
    fparams.push( { key: data.kw_key, val: keyword } );
    if(data.params !== undefined) {
        data.params.forEach(function(ele){
            fparams.push(ele);
        });
    }
    if (window.run_env == "http_web")
        form_submit(fparams, data.action, data.charset, data.method, use_referer);
    else{
        newTabIndex = await calcNewTabIndex();
        await open_connecting_page(dbname, engine, btn, keyword, newTabIndex);
    }
}


async function open_connecting_page(dbname, engine, btn, kw, newTabIndex=0)
{
    var connectingPageUrl = chrome.runtime.getURL("connecting.html")
    
    var urlEncoder = new URL(connectingPageUrl);
    
    urlEncoder.searchParams.set("e_name", engine);
    
    if (btn)
        urlEncoder.searchParams.set("b_name", btn);
    
    if (dbname)
        urlEncoder.searchParams.set("dbname", dbname);
    
    urlEncoder.searchParams.set("kw", kw);
    
    var url = urlEncoder.href;

        
    var newtab =  await chrome.tabs.create({url: url, active: newTabBringFront, index: newTabIndex}) ;
}


function go_parse_use_other_engine(element, keyword) {
    if ( typeof(element) === "string" ) 
    {
        element = { "engine" : element };
    }
    goEngBtn( element.engine, element.btn , keyword, element.dbname);
}

function go_full_url(keyword, full_url, charset="UTF-8",referer=false){ // called from connecting.html in addon, or from above in web
    var iconvd_keyword;
    
    iconvd_keyword = keyword; 
    if (charset != "UTF-8")
        console.warn("full_url doesn't support non UTF-8 yet!");
    
    iconvd_keyword = encodeURIComponent(iconvd_keyword);
    
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
function form_submit(fparams,action,charset="UTF-8",method="get",referer=false){  // called from connecting.html in addon, or from above in web
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
        var inp = document.createElement("textarea");
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

async function ajax_set_go(keyword, action, ajax, referer=false ) // called from connecting.html
{
    var m = await chrome.runtime.sendMessage ( { 
        from: "home.html", 
        to : "background",
        command: "add_ajax_inject_prepare",
        ajax: ajax, 
        keyword: keyword, 
    });
    
    if (!m || m?.r != 'yes') {
        console.warn("background respose not right:", m);
        await (500);
        // return;
    } 
    // await sleep(1);
    
    var a = document.createElement("a");
    a.style = "display:none;";
    
    if (window.run_env == "http_web")
        a.target = "_blank";
    else
        a.target = "_top";
    
    a.rel = "noopener";
    a.href = action;
    if(referer)
    {
        ;
    }else{
        a.rel += " noreferrer";
    }
    
    a.click();       
}

function isVisible(obj)
{
    if (!obj.visible_lang ) 
        return true;
    
    if (typeof(obj.visible_lang) === "string")
    {
        if (window.lang == obj.visible_lang) 
            return true;
        else 
            return false;
    }
    /*
    else // is array
    {
        obj.visible_lang.forEach( function(ele) { 
            if (ele == window.lang) return true //TODO bug, shouldn't use return here
        });
    }
    */
    return false
}
