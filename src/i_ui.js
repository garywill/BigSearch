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

async function layout_init()
{
    init_body_class();
    
    init_viewport();
    
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

function init_body_class() {
    if ( window.run_env == "http_web" )
        document.body.classList.add("http_web");
    else
        document.body.classList.add("addon");
    
    if (mobile)
        document.body.classList.add("mobile");
    else
        document.body.classList.add("desktop");
    
    document.body.classList.add(window.lang);
}


function init_viewport() {
    if ( window.run_env != "http_web" )
        return;
    
    var content; 
    if (mobile) {
        content = "width=device-width, initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0" ;
    }
    else if ( ! mobile ) {
        content = "width=1200px, height=700px" ;
    }
    document.getElementById("viewport_tag").setAttribute("content", content);
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
    /*
    window.onresize = null;
    setTimeout(function() {
        if (
            window.run_env == "http_web" ||
            (window.run_env != "http_web" && isFirefox)
        )
            window.onresize = onWindowResize;
        layout_refresh();
    }, 200);
    */
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

// =======================================
var themeHandler = {};
function init_themeHandler() {
    themeHandler = new function themeHandlerClass () {
        this.div_choose_themes = document.getElementById("div_choose_themes");
        
        this.themes = {
            "default" : {  },
            "Foggy_Lake__Blue": {
                d_name: "Foggy Lake - Colorful Blue + Green",
                need_theme: "Foggy_Lake",
            },
            "Foggy_Lake__Green": {
                need_theme: "Foggy_Lake",
                need_sty: [],
            },
            
            "Foggy_Lake": {
                d_name: "Foggy Lake (some blue)",
                need_sty: ["bold"],
            },
            "Foggy_Lake__Grey_3": {
                d_name: "Foggy Lake (some blue, faded head)",
                need_theme: "Foggy_Lake",
            },
            "Foggy_Lake__Grey": {
                d_name: "Foggy Lake (Grey: blue head, grey buttons, faded selection)",
                need_theme: "Foggy_Lake",
            },
            "Foggy_Lake__Grey_2": {
                d_name: "Foggy Lake (Grey + faded head)",
                need_theme: "Foggy_Lake__Grey",
            },
            
            "Light_and_Grey": {},
            "Light_and_Grey_2": {
                need_theme: "Light_and_Grey"
            },
            "Light_and_Black": {
                need_theme: "Light_and_Grey"
            },
            "Grey_Table": {
                d_name: "Focus (focus on the table)"
            },
            "no": {
                d_name: "No Theme (ugly)"
            },
            
        };
        this.getDefaultTheme = function() {
            if (window.run_env == "http_web")
                if ( ! mobile ) // desktop http
                    return "Foggy_Lake__Blue";
                else  // mobile http
                    return "Light_and_Grey";
            else  // addon 
                return "Foggy_Lake__Green";
        };
        this.getThemeDisplayName = function(theme) {
            var tmInfo = this.themes[theme]
            //console.log(theme, tmInfo);
            var label_text = "";
            
            if (theme == "default") {
                label_text = i18n(["默认" , "Default"]);
                label_text += `: [ ${this.getThemeDisplayName(this.getDefaultTheme())} ]`
                
            }
            else 
            {
                if (tmInfo['d_name'] !== undefined)
                    label_text = tmInfo['d_name'];
                else
                    label_text = theme.replaceAll("__", " - ").replaceAll("_", " ");
            }
            return label_text;
        };
        this.clean_theme = function() {
            var oldThemeCsses = document.getElementsByClassName("theme_css");
            for (var i=oldThemeCsses.length - 1 ; i>=0; i--) {
                var old = oldThemeCsses[i];
                //old.parentNode.removeChild(old);
                old.remove();
            }
        };
        this.setRadioChecked = async function (theme) {
            document.querySelector(`.radios_themes[value=${theme}`).checked = true;
        };
        this.init_theme = function(theme) {
            if (!theme || theme == "default" || this.themes[theme] === undefined) 
                theme = this.getDefaultTheme();
            
            this.clean_theme();
            
            if (theme == "no")
                return;
            
            var themeInfo = this.themes[theme];
            
            if (themeInfo['need_theme'] !== undefined)
                this.init_theme(themeInfo['need_theme'])
            
            if (themeInfo.need_sty !== undefined)
                for (var i=0; i<themeInfo.need_sty.length; i++) {
                    const sty = themeInfo.need_sty[i];
                    this.addCss(`sty_${sty}`);
                }
                
            this.addCss(theme);

        };
        this.addCss = function(file) {
            var csstag = document.createElement("link");
            csstag.setAttribute("class", "theme_css");
            csstag.setAttribute("rel", "stylesheet");
            csstag.setAttribute("type", "text/css");
            csstag.setAttribute("href", `themes/${file}.css`); // TODO file time
            document.head.appendChild(csstag);
        }
        this.onRadioChange = function () {
            themeHandler.init_theme(this.value);
            localStorage['theme'] = this.value;
            if (this.value == "default" )
                delete localStorage['theme'];
        }
        
        var themes_names = Object.keys(this.themes);
        for (var i=0; i<themes_names.length; i++)
        {
            var tm = themes_names[i];
            var tmInfo = this.themes[tm];
            
            var radio = document.createElement("input");
            radio.setAttribute("type", "radio");
            radio.setAttribute("name", "theme");
            radio.setAttribute("value", tm);
            radio.classList.add("radios_themes");
            
            var radio_id = `id_themeradio__${tm}`;
            radio.id = radio_id;
            
            if ( localStorage['theme'] === tm  )
                radio.checked = true;
            
            if ( tm == "default" && ( ! localStorage['theme'] || localStorage['theme'] == "default" ) )
                radio.checked = true;
            
            radio.onchange = this.onRadioChange;
            // ----
            
            var label = document.createElement("label");
            label.setAttribute("for", radio_id);
            label.textContent = this.getThemeDisplayName(tm); 
            
            var br = document.createElement("br");
            
            this.div_choose_themes.appendChild(radio);
            this.div_choose_themes.appendChild(label);
            this.div_choose_themes.appendChild(br);
            
        }
        
        this.init_theme(localStorage['theme']);
        
        document.getElementById("btn_randomtheme").onclick = function() {
            const oldName = localStorage['theme'];
            
            const tNames = Object.keys(themeHandler.themes);
            
            function getNewRandomTheme() {
                var N = getRandomInt(tNames.length -2) +1 ; // last one is 'no'. first one is default
                var name = tNames[N];
                return name;
            }
            
            var newName;
            do {
                newName = getNewRandomTheme();
            } while ( newName == oldName )
            
            themeHandler.init_theme(newName);
            themeHandler.setRadioChecked(newName);
            localStorage['theme'] = newName;
        }
    } ();
}


