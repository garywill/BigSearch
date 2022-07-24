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


onrd.push(function() {
    if (getCookie_my('hl')) {
        window.lang = getCookie_my('hl');
    }else{
        window.lang = "en";
    }
        
});

onrd.push(function() {
    init_data();
});

async function copy_json() {
    $("#user_json_field").select();
    //document.execCommand('copy');
    navigator.clipboard.writeText( $("#user_json_field").val() )
}


onrd.push(function() {
    window.addEventListener("message", function(event) {
        if (event.source == window && 
            event.data.app && event.data.app == "bigsearch-edit" &&
            event.data.direction && event.data.direction == "content-to-page"
        ) 
        {
            if (event.data.bsAddonVersion) 
            {
                bsAddonVersion = event.data.bsAddonVersion
                $("#div_bsAddon_stat").text(`Big Search extension ${bsAddonVersion} installed ✅`);
            }
            
            if (event.data.addonUsercustom) {
                const addonUsercustom = JSON.stringify( JSON.parse(event.data.addonUsercustom) ,null, 2);
                $("#user_json_field").val(addonUsercustom);
                $("#json_2_gui").click();
            }
            
            if (event.data.message && event.data.message == "text") {
                var messageText = "Message from extension: \n\n"
                if (event.data.messageContent.status) {
                    switch (event.data.messageContent.status) {
                        case "success":
                            messageText += "✅\n";
                            break;
                        case "fail":
                            messageText += "❌\n";
                            break;
                    }
                }
                messageText += event.data.messageContent.text;
                alert(messageText);
            }
        }
    });
});

var bsAddonVersion ;
onrd.push(function() {
    
    $("#btn_detect").click(function() {
        bsAddonVersion = null;
        console.log("page: trying to fetch bs addon version..");
        $("#div_bsAddon_stat").text(`Detecting Big Search extension ... (requires Big Search extention >= 2.8.20)`);
        window.postMessage({
            direction: "page-to-content",
            app: "bigsearch-edit",
            message: "getVersion"
        }, document.location.href);
    });
    

    setTimeout( function() { $("#btn_detect").click(); } , 500);
});




var bs_gui;
var bs_gui_app;
onrd.push(function() {
    bs_gui_app = {
        data() {
            return {
                userJsonArr: [],
                sEngines: sEngines,
                templatesAdding: {
                    "simple": {
                        keyhead: "e_",
                        gui_type: "engine_simple",
                        bsObj: {
                            dname: "New engine",
                            full_url: ""
                        }
                    },
                    "post": {
                        keyhead: "e_",
                        gui_type: "engine_expert",
                        bsObj: {
                            dname: "New POST engine",
                            action: "https://",
                            method: "post",
                            kw_key: "q",
                            params: [
                                {key:"catagory_id", val: "5"},
                                {key:"search_more", val: "yes"}
                            ]
                        }
                    },
                    "cross": {
                        keyhead: "e_",
                        gui_type: "engine_expert",
                        bsObj: {
                            dname: "New cross-engine",
                            kw_format: "{0} site:example.com/*",
                            use_other_engine: "google"
                        }
                    },
                    "many": {
                        keyhead: "e_",
                        gui_type: "engine_expert",
                        bsObj: {
                            dname: "New many engines",
                            use_other_engine: [
                                "google", "duckduckgo"
                            ]
                        }
                    },
                    "ajax": {
                        keyhead: "e_",
                        gui_type: "engine_expert",
                        bsObj: {
                            dname: "New ajax engine",
                            action: "https://",
                            "ajax": "#input-box-id"
                        }
                    },
                    "labelrow": {
                        keyhead: "l_",
                        gui_type: "labelrow",
                        bsObj: {
                            lstr: "New label"
                        }
                    },
                    "fav": {
                        keyhead: "f_",
                        gui_type: "fav_engine",
                        bsObj: {
                            fav: ""
                        }
                    },
                },
                rindex2add: 0,

            }
        },
        methods: { // TODO UUID   TODO v-key
            refreshBuildin() {
                this.sEngines = sEngines;
            },
            setRindex2add(n) {
                this.rindex2add = n;
            },
            addRowByTemplate(index, template_name) {

                const _template = JSON.parse(JSON.stringify(this.templatesAdding[template_name]));  //TODO 改所有object.assign
                var template = {};
                Object.assign(template, _template);
                
                var guiObj = new Object();
                guiObj.key = template.keyhead + randKeyName(); 
                guiObj.gui_type = template.gui_type;
                guiObj.bsObj = {};
                Object.assign(guiObj.bsObj, template.bsObj);

                if (index<0) {
                    this.userJsonArr.push(guiObj);
                    index = this.userJsonArr.length-1;
                }
                else
                {
                    this.userJsonArr.splice(index, 0, guiObj);
                }
                
                this.bsObjBtns2Gui(index);
                this.bsObjExpertContent2Gui(index);

            },
            addFav(fav) {
                this.addRowByTemplate(-1, "fav");
                if(fav)
                    this.userJsonArr [ this.userJsonArr.length - 1 ].bsObj['fav'] = fav
            },
            parseUserJson() {
                this.userJsonArr = [];
                
                var parsedWholeObjectFromUserJson;
                try{
                    parsedWholeObjectFromUserJson = JSON.parse($('#user_json_field').val());
                }catch(err) {
                    alert(`❌Oops ! ❌\nCan't parse as strict JSON format! Please check your syntax. \n\n${err}`);
                    return;
                }

                var keys = Array.from(Object.keys(parsedWholeObjectFromUserJson));
                for (var i=0 ; i< keys.length; i++) {
                    const key = keys[i];
                    const index = i;
                    var fromUserJson_curObj = parsedWholeObjectFromUserJson[key];
                    
                    var newObj_curInd_gui = {};
                    newObj_curInd_gui.key = key;
                    newObj_curInd_gui.bsObj_old = {};
                    Object.assign(newObj_curInd_gui.bsObj_old, fromUserJson_curObj);
                    newObj_curInd_gui.bsObj = {};
                    
                    if ( typeof(fromUserJson_curObj) === "string") {
                        // 处理baby simple GET，转换成dname+full_url
                        newObj_curInd_gui['gui_type'] = "engine_simple";
                        newObj_curInd_gui.bsObj['dname'] = key;
                        newObj_curInd_gui.bsObj['full_url'] = fromUserJson_curObj;
                    }
                    else { // 原来的不是string而是object
                        Object.assign(newObj_curInd_gui.bsObj, fromUserJson_curObj);
                    
                        if (newObj_curInd_gui.bsObj['lstr']) 
                            newObj_curInd_gui['gui_type'] = "labelrow";
                        else if (newObj_curInd_gui.bsObj['fav']) 
                            newObj_curInd_gui['gui_type'] = "fav_engine";
                        else {
                            const row_keys = new Set(Object.keys(newObj_curInd_gui.bsObj));
                            const max_keys = new Set(['dname', 'full_url']);
                            if (isSuperset(max_keys, row_keys))
                                newObj_curInd_gui['gui_type'] = 'engine_simple';
                            else 
                                newObj_curInd_gui['gui_type'] = 'engine_expert';
                        }
                    }
                    
                    
                    this.userJsonArr.push(newObj_curInd_gui);
                    
                    this.bsObjBtns2Gui(index);
                    this.bsObjExpertContent2Gui(index);

                }
                return true;
            },
            bsObjBtns2Gui(i) {
                var expert_btns = {};
                if ( this.userJsonArr[i].bsObj['btns'] !== undefined ) {
                    Object.assign(expert_btns, this.userJsonArr[i].bsObj['btns']);
                    this.userJsonArr[i]['gui_json_expert_btns'] = JSON.stringify(expert_btns, null, 2);
                }else {
                    expert_btns = undefined;
                    this.userJsonArr[i]['gui_json_expert_btns'] = undefined;
                }
            },
            bsObjExpertContent2Gui(i) {
                var expert_content = {};
                Object.assign(expert_content, this.userJsonArr[i].bsObj);
                if (expert_content['dname'] !== undefined)
                    delete expert_content['dname']
                if (expert_content['btns'] !== undefined)
                    delete expert_content['btns']

                this.userJsonArr[i]['gui_json_except_content'] = JSON.stringify(expert_content, null, 2);
            },
            delRow(i) {
                this.userJsonArr.splice(i,1);
            },
            simple2expert(i) {
                this.bsObjExpertContent2Gui(i);
                this.userJsonArr[i]['gui_type'] = "engine_expert";
            },
            createExampleBtn(i) {
                this.userJsonArr[i].bsObj['btns'] = {
                    "sch1": {
                        label: "Search"
                    },
                    "sch2": {
                        label: "Search 2",
                        params: [
                            { key: "more", val: "yes" }
                        ]
                    }
                }
                this.userJsonArr[i]['gui_json_expert_btns'] = JSON.stringify(this.userJsonArr[i].bsObj['btns'], null, 2);
            },
            delBtns(i) {
                delete this.userJsonArr[i].bsObj['btns'];
                this.bsObjBtns2Gui(i);
            },
            rowMoveUp(i) {
                if (i>0) {
                    var tmp = this.userJsonArr[i];
                    this.userJsonArr.splice(i, 1);
                    this.userJsonArr.splice(i-1, 0, tmp);
                }
            },
            rowMoveDown(i) {
                if (i<this.userJsonArr.length-1)
                    this.rowMoveUp(i+1);
            },
            rowMove(fromI, toI) {
                if (fromI == toI || fromI == toI-1) {
                    //console.log("same");
                    return;
                }
                
                if (toI == -1 && fromI == this.userJsonArr.length)
                    return;
                
                var tmp = this.userJsonArr[fromI];
                this.userJsonArr.splice(fromI, 1);
                
                if (toI == -1) {
                    this.userJsonArr.push(tmp);
                }
                else
                {
                    var newToI = (fromI>toI) ? toI  : toI-1 ;
                    this.userJsonArr.splice(newToI, 0, tmp);
                }
            },
            gui2json() {
                // trim <input> 
                // TODO type=text
                $("#gui_table input").each(function(i,ele){
                    ele.value = ele.value.trim();
                    ele.dispatchEvent(new Event('input'));
                });
                
                // trim <textarea>，空textarea用{}替换
                $("#gui_table textarea").each(function(i,ele){
                    ele.value = ele.value.trim();
                    if (ele.value == "")
                        ele.value = "{}"; // TODO 只有在确定这个textarea是填json的之后才
                    ele.dispatchEvent(new Event('input'));
                });
                
                // 检查key合法(不空) 
                for( var i=0; i<this.userJsonArr.length; i++) {
                    if (!this.userJsonArr[i].key) {
                        alert(`❌ Oops! Something in the table is wrong! ❌\n\nTable row ${i+1} \nKey is empty`);
                        return;
                    }
                }
                
                // key不重复
                for (var i=0; i<this.userJsonArr.length-1; i++) {
                    for (var j=i+1; j<this.userJsonArr.length; j++) {
                        if (this.userJsonArr[i].key == this.userJsonArr[j].key) {
                            alert(`❌ Oops! Something in the table is wrong! ❌\n\nTable row ${i+1} and ${j+1} have duplicated key`);
                            return;
                        }
                    }
                }
                
                
                // 检测json语法
                for( var i=0; i<this.userJsonArr.length; i++) {
                    var guiObj = this.userJsonArr[i];
                
                    if (guiObj['gui_type'] == "engine_expert") {
                        var parsedExpertObj;
                        var parsedBtnsObj;
                        try {
                            parsedExpertObj = JSON.parse(guiObj['gui_json_except_content']);
                        }catch(err) {
                            alert(`❌ Oops! Something in the table is wrong! ❌\n\nTable row ${i+1} \nEngine content JSON field can't be parsed as strict JSON format\n\n ${err}`);
                            return;
                        }
                        
                        if (guiObj['gui_json_expert_btns'] !== undefined)
                            try {
                                parsedBtnsObj = JSON.parse(guiObj['gui_json_expert_btns']);
                            }catch(err) {
                                alert(`❌ Oops! Something in the table is wrong! ❌\n\nTable row ${i+1} \nButtons JSON field can't be parsed as strict JSON format\n\n ${err}`);
                                return;
                            }
                    }
                       
                }
                // for:
                //   如果是expert，检查两个json是否可解析，解析出有内容则写入，无则设置undefined
                //   其他直接
                var resultBs = {};
                for( var i=0; i<this.userJsonArr.length; i++) {
                    var guiObj = this.userJsonArr[i];
                    if (guiObj['gui_type'] == "engine_expert") {
                        var newBsObj = {
                            dname: guiObj.bsObj.dname
                        };
                        
                        var parsedExpertObj = JSON.parse(guiObj['gui_json_except_content']);
                        Object.assign(newBsObj, parsedExpertObj);
                        
                        if (guiObj['gui_json_expert_btns'] !== undefined) {
                            var parsedBtnsObj = JSON.parse(guiObj['gui_json_expert_btns']);
                            if ( Object.keys(parsedBtnsObj).length > 0) {
                                Object.assign(newBsObj, { btns: parsedBtnsObj } );
                                
                            }
                        }
                        
                        guiObj.bsObj = newBsObj;
                    }
                    
                    resultBs[guiObj.key] = guiObj.bsObj;
                }
                
                var resultBsJson = JSON.stringify(resultBs , null, 2);
                $("#user_json_field").val(resultBsJson);
                return true;
            }
        }
    };
    
    bs_gui = Vue.createApp(bs_gui_app).mount("#bs_gui");
});

function load_from_ext() {
    window.postMessage({
        direction: "page-to-content",
        app: "bigsearch-edit",
        message: "getAddonUsercustom"
    }, document.location.href);
}
function save_table_to_addon() {
    var res = false;
    res = bs_gui.gui2json()
    if (res) {
        window.postMessage({
            direction: "page-to-content",
            app: "bigsearch-edit",
            message: "setExtUsercustom",
            usercustomJson: $("#user_json_field").val()
        }, document.location.href);
    }else{
        
    }
}

function finish_n_copy() {
    var res = false;
    res = bs_gui.gui2json()
    if (res) {
        copy_json();
        alert("✅ Yes! ✅\nSuccessfully parsed your edit and copied JSON to clipboard.");
    }else{
        
    }
}
function btn_clk_parse_user_json() {
    var res;
    res = bs_gui.parseUserJson(); 
    if (res) {
        alert("✅ Successfully (loaded and) parsed JSON and put into the editing table.");
    }else{
        
    }
    return res;
}
function btn_clk_parse_user_json_n_save_to_addon() {
    var res;
    res = bs_gui.parseUserJson(); 
    if (res) {
        save_table_to_addon();
    }else{
        
    }
    return res;
}

function btn_clk_gui2json() {
    var res;
    res = bs_gui.gui2json();
    if (res) {
        alert("✅ Successfully converted your edit to JSON.");
    }else{
        
    }
}

// onrd.push(function() {
//    bs_gui.parseUserJson(); 
// });


var buildin_gui;
var buildin_gui_app;
onrd.push(function() {
    buildin_gui_app = {
        data() {
            return {
                catas: catas,
                sEngines: sEngines,
                lang: window.lang,
            }
        },
        methods: {
            isVisible(obj) {
                return isVisible(obj);
            },
            refreshBuildin() {
                this.sEngines = sEngines;
                this.catas = catas;
            },
            onclick_favbtn(engine_name) {
                bs_gui.addFav(engine_name);
            },
            onLangRadioChange() {
                window.lang = this.lang;
                init_data();
                this.refreshBuildin();
                bs_gui.refreshBuildin();
            },
        }
    };
    
    buildin_gui = Vue.createApp(buildin_gui_app).mount("#buildin_gui");
});

function tr_add_ondragenter(event, node){
    node.classList.add("tr_droppable");
    event.preventDefault();
} 
function tr_add_ondragleave(event, node){
    node.classList.remove("tr_droppable");
} 
function tr_add_ondragover(event, node){
    event.preventDefault()
} 
function tr_add_ondrop(event, node){
    node.classList.remove("tr_droppable");
    var fromI = event.dataTransfer.getData('text/plain');
    var toI = $(node).attr("rindex");
    
//     console.log(fromI, toI);
    bs_gui.rowMove(fromI, toI);
    
    event.preventDefault()
} ; 

function onGuiTrDragStart(event, node) {
    event.dataTransfer.effectAllowed = "none";
    event.dataTransfer.setData('text/plain', $(node).attr('rindex'))
}



function expand_all_buildin_catas(open) {
    if (open)
        $('.buildin-cata-details').collapse('show');
    else
        $('.buildin-cata-details').collapse('hide');
        
    //$(".buildin-cata-details").attr("open",bool);
}

function isSuperset(set, subset) {
    for (let elem of subset) {
        if (!set.has(elem)) {
            return false;
        }
    }
    return true;
}

function randKeyName() {
    return genRandomInt(1000,9999);
}

function genRandomInt(min,max) {
    const range = max-min;
    return Math.floor(Math.random() * range) + min;
}


function load_example(template) {
    const template_default = `
{
    "l_common" : { "lstr": "Favorite built-in engines" },
    "f_google": { "fav": "google" },
    "f_github": { "fav": "github" },
    "l_my" : { "lstr": "My Engines" },
    "e_my1": {
        "dname": "My Search Engine 1",
        "full_url": "https://example.com/search?q={0}"
    },
    "e_my2": {
        "dname": "My Search Engine 2",
        "full_url": "https://example.com/search?q={0}&all=1"
    }
}
    `;
    
    const template_chi = `
{
  "f_baidu": { "fav": "baidu" },
  "f_google": { "fav": "google" },
  "f_bing": { "fav": "bing" },
  "l_buy": { "lstr": "买买买" },
  "f_taobao": { "fav": "taobao" },
  "f_jd": { "fav": "jd" },
  "l_video": { "lstr": "听听 看看" },
  "f_bili": { "fav": "bilibili" },
  "f_163music": { "fav": "music163" },
  "l_translate": { "lstr": "译译译" },
  "f_youdao": { "fav": "youdao" },
  "f_baidufanyi": { "fav": "baidu_translate" },  
  "f_googletranslate": { "fav": "google_translate" },
  "f_deepl": { "fav": "deepl" }
}
    `;
    
    const template_en = `
{
  "f_google": { "fav": "google" },
  "f_duckduckgo": { "fav": "duckduckgo" },
  "l_video": { "lstr": "Video" },
  "f_youtube": { "fav": "youtube" },
  "f_netflix": { "fav": "netflix" },
  "l_mobile": { "lstr": "Mobile App" },
  "f_googleplay": { "fav": "google_play" },
  "f_fdroid": { "fav": "fdroid" },
  "l_translate": { "lstr": "Translate" },
  "f_googletranslate": { "fav": "google_translate" },
  "f_deepl": { "fav": "deepl" },
  "l_work": { "lstr": "Work" },
  "f_github": { "fav": "github" },
  "f_mdn": { "fav": "mdn" }
}
    `;
    
    const template_adv = `
{
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
}
    `;
    
    var use_template ;
    if (! template || template == "default")
        use_template = template_default;
    else if (template == "chi")
        use_template = template_chi;
    else if (template == "en")
        use_template = template_en;
    else if (template == "adv")
        use_template = template_adv;
    
    $("#user_json_field").val(use_template);
    bs_gui.parseUserJson();
}


// onrd.push( function() {
//     makeTemplateTable();
// });
function makeTemplateTable() {
    $("#addRow_templatesTable")[0].innerHTML = INTABLE_HTML;
}
        
const INTABLE_HTML = `
<tr><td colspan="2"><b>Simple</b></td><tr>
            <tr>
                <td><button class="btn btn-primary btn_adding_templ" data-bs-dismiss="modal" v-on:click="addRowByTemplate(rindex2add,'simple')">Engine (simple GET method)</button></td>
                <td>An HTTP GET method search engine. <br>E.g. <code>https://www.google.com/search?q={0}</code></td>
            </tr>
            <tr>
                <td><button class="btn btn-primary btn_adding_templ" data-bs-dismiss="modal" v-on:click="addRowByTemplate(rindex2add,'labelrow')">Label row</button></td>
                <td>A label row</td>
            </tr>
            <tr>
                <td><button class="btn btn-primary btn_adding_templ" data-bs-dismiss="modal" v-on:click="addRowByTemplate(rindex2add,'fav')">Link to build-in engine</button></td>
                <td>Add a Big Search build-in engine link.<br>Notice you don't have to add link from here.<br>Use the build-in engines listing table below.</td>
            </tr>
<tr><td colspan="2"><b>Full format templates</b> (this part's editting GUI is still in construction. User need to edit in JSON)</td><tr>
            <tr>
                <td><button class="btn btn-primary btn_adding_templ" data-bs-dismiss="modal" v-on:click="addRowByTemplate(rindex2add,'post')">Engine (POST method)</button></td>
                <td>
                    Engine in HTTP POST method. With additional form key-value pairs.<br>
                    E.g. :<br>
<pre><code class="fenced-code-block">"method": "post",
"action": "https://example.com/search",
"kw_key": "q",
"params": [
    {"key": "catagory_id", "val": "5"},
    {"key": "search_more", "val": "yes"}
]</code></pre>
 
                </td>
            </tr>
            <tr>
                <td><button class="btn btn-primary btn_adding_templ" data-bs-dismiss="modal" v-on:click="addRowByTemplate(rindex2add,'cross')">Cross-engine search</button></td>
                <td>
                    Use a universal search engine (e.g. google) to <br>search a website (e.g. iTunes) that doesn't provide search<br>
                    E.g. 1 :<br>
<pre><code class="fenced-code-block">"kw_format": "{0} site:apple.com/*app",
"use_other_engine": "google"</code></pre>
                    E.g. 2 :<br>
                    
                    
<pre><code class="fenced-code-block">"kw_format": "{0} site:apple.com/*app",
"use_other_engine": { "dbname": "bigsearch", "engine": "google", "btn": "search" }</code></pre>
                Default <code>dbname</code> is <code>bigsearch</code>. Otherwise value can be <code>user</code> / <code>browser</code>.<br>
                With or without specifying button. Defaultly uses the first button.<br>
                </td>
            </tr>
            <tr>
                <td><button class="btn btn-primary btn_adding_templ" data-bs-dismiss="modal" v-on:click="addRowByTemplate(rindex2add,'many')">Many engines at once</button></td>
                <td>
                    Search many engines at once<br>
                    E.g. 1 :<br>
<pre><code class="fenced-code-block">"use_other_engine": [ "google", "duckduckgo" ]</code></pre><br>
                    E.g. 2 :<br>
<pre><code class="fenced-code-block">"use_other_engine": [
    "yahoo",  
    { "dbname": "bigsearch", "engine": "google", "btn": "search" },
    { "dbname": "bigsearch", "engine": "duckduckgo" },
    { "dbname": "user", "engine": "my_engine_8" }
]</code></pre><br>
                <code>use_other_engine</code> can be an object/string (one engine) or an array (use many engines at once).<br>
                </td>
            </tr>
            <tr>
                <td><button class="btn btn-primary btn_adding_templ" data-bs-dismiss="modal" v-on:click="addRowByTemplate(rindex2add,'ajax')">Search Ajax-render website</button></td>
                <td>
                    Some websites doesn't accept GET or POST.<br>Visitor need to open their page and input, then they show search results on page via Ajax.<br>Big Search browser extension supports searching in such Ajax-render websites.<br>Use element(s) querySelector<br>
                    E.g. 1 :<br>
<pre><code class="fenced-code-block">"ajax": "#search-box-id"</code></pre><br>
                    E.g. 2 : Delay 2s -> Input -> Delay 1s -> Trigger clicking button event<br>
<pre><code class="fenced-code-block">"ajax": [2000, "#search-box-input", 1000, "#submit-button"]</code></pre><br>
                </td>
            </tr>
        
`;

