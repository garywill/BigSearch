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
var showas = "";

async function pre_layout() {
    const urlParams = new URLSearchParams(window.location.search);
    showas = urlParams.get("showas");
    
    if (window.run_env != "http_web") 
    {
        if (showas != "sidebar") {
            document.body.style.width = "800px";
            document.body.style.minHeight = "600px";
        }
    }
}

async function layout_init()
{
    init_body_class();
    
    init_viewport();
    
    await init_UIHandler();
    
    if(mobile) 
    {
        document.getElementById("btn_mobile").style.display = "none";
        document.getElementById("mobile_css_tag").setAttribute("href",mobilecss);
    
        
        UIHandler.unsetHistAlwaysShow();
        UIHandler.setCatasMobile();
        
        //layout_refresh();
        
        //set_table_observer();

        
    }else{
        document.getElementById("btn_desktop").style.display = "none";
    }
    
    if (showas == "sidebar" ) 
        document.getElementById("sidebar_css_tag").setAttribute("href", "addon_sidebar.css");
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
    
    if (showas == "sidebar")
        document.body.classList.add("sidebar");
    
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

var UIHandler = {};
async function init_UIHandler() {
    
    UIHandler = await UIHandlerClass();
    
    async function UIHandlerClass() {
        var R = {};
        
        R.ele_content = document.getElementById("content");
     
        R.init_histOpenClose = function() {
            
            //R.histAlwaysShow = true; 
            
            R.ele_openhist = document.getElementById("openhist"); // open history btn
            R.ele_hist = document.getElementById("hist");
            R.ele_hist_cont = document.getElementById("hist_cont");
            R.ele_histTd = document.getElementById("hist_td");
            R.ele_histFloaterTd = document.getElementById("floater_td");
            R.ele_histFloater = document.getElementById("floater");
            
            R.setHistAlwaysShow = function() {
                R.histAlwaysShow = true;
                R.ele_content.classList.remove("content_hide_hist");
                R.ele_hist.classList.remove("hist_hidemode");
                R.ele_hist_cont.classList.remove("hist_cont_hidemode");
                R.ele_openhist.classList.add("openhist_hide");
                
                R.ele_histTd.appendChild( R.ele_hist_cont  );
            };
            
            R.unsetHistAlwaysShow = function() {
                R.histAlwaysShow = false;
                R.ele_content.classList.add("content_hide_hist");
                R.ele_hist.classList.add("hist_hidemode");
                R.ele_hist_cont.classList.add("hist_cont_hidemode");
                R.ele_openhist.classList.remove("openhist_hide");
                
                R.ele_histFloaterTd.appendChild( R.ele_hist_cont );
            };
            
            R.openHistFloater = function() {
                R.ele_histFloater.style.display="block";
            }
            R.closeHistFloater = function() {
                R.ele_histFloater.style.display="none";
            }
            
            R.ele_hist_cont.onclick = function(){
                event.stopPropagation();
            };
            
            R.ele_openhist.onclick = function(){
                if (! R.histAlwaysShow)
                    R.openHistFloater();
            };
            R.ele_histFloater.onclick = function(){
                R.closeHistFloater();
            };
            
            R.setHistAlwaysShow();
        }
        
        R.init_catasOpenClose = function() {
            R.catasStatus = "normal";  // normal | sidebar | mobile
            R.ele_cata_td = document.getElementById("cata_td");
            R.ele_catas_cont = document.getElementById("catas_cont");
            R.ele_mobile_catasbtn_pos = document.getElementById("mobile_catasbtn_pos");
            
            R.setCatasNormal = function() {
                if (R.catasStatus == "sidebar")
                    R.ele_cata_td.classList.remove("cata_td_collapse");
                else if (R.catasStatus == "mobile")
                    R.ele_cata_td.appendChild( R.ele_catas_cont );
                
                R.catasStatus = "normal";
            }
            R.setCatasSidebar = function() {
                if (R.catasStatus == "normal")
                    R.ele_cata_td.classList.add("cata_td_collapse");
                
                R.catasStatus = "sidebar";
            }
            R.setCatasMobile = function() {
                if (R.catasStatus == "normal")
                    R.ele_mobile_catasbtn_pos.appendChild( R.ele_catas_cont );

                R.catasStatus = "mobile";
            }
        }
     
        R.init_histOpenClose();
        R.init_catasOpenClose();

        if (showas == "sidebar") {
            R.unsetHistAlwaysShow();
            R.setCatasSidebar();
            
        }
        
        return R;
    }
    
}

// =======================================
var themeHandler = {};

async function init_themeHandler() {
    
    themeHandler = await themeHandlerClass();
    
    async function themeHandlerClass () {
        this.div_choose_themes = document.getElementById("div_choose_themes");
        
        this.themes = {
            "default" : {  },
            "Mac": {
                need_sty: ["bold"],
            },
            "Keyboard": {
                need_sty: ["bold"],
            },
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
            "Light_and_Grey_3": {
                need_theme: "Light_and_Grey_2"
            },
            "Light_and_Black": {
                need_theme: "Light_and_Grey"
            },
            "Grey_Table": {
                d_name: "Focus (focus on the table)"
            },
            "Dark": {
                need_sty: ["bold"],
            },
            "no": {
                d_name: "No Theme (ugly)"
            },
            
        };
        
        this._defaultTheme = "no";
        this.decideDefaultTheme = function() {
            if (window.run_env == "http_web") {
            } else  // addon 
                this._defaultTheme =  "Foggy_Lake__Green";
        };
        this.getDefaultTheme = function() {
            return this._defaultTheme;
        };
        this.getThemeDisplayName = function(theme) {
            var tmInfo = this.themes[theme]
            //console.log(theme, tmInfo);
            var label_text = "";
            
            if (theme == "default") {
                label_text = i18n(["默认" , "Default"]);
                label_text += " [ " 
                    + i18n(["此次为： " , "This time: "])
                    + `${this.getThemeDisplayName(this.getDefaultTheme())} ]` ;
                
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
        
        this.getUserTheme = async function () {
            if (window.run_env == "http_web" ) {
                return localStorage['theme'];
            } else {
                var theme = (await get_addon_setting_local('theme') ) ;
                return theme;
            }
        };
        this.resetUserTheme = async function () {
            if (window.run_env == "http_web" ) {
                delete localStorage['theme'];
            } else {
                await chrome.storage.local.remove('theme');
                delete localStorage['theme'];
            }
        };
        this.setUserTheme = async function (theme) {
            if (window.run_env == "http_web" ) {
                localStorage['theme'] = theme;
            } else {
                await chrome.storage.local.set( { 'theme': theme } );
                localStorage['theme'] = theme;
            }
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
        this.onRadioChange = async function () {
            themeHandler.init_theme(this.value);
            
            if (this.value == "default" )
                await themeHandler.resetUserTheme();
            else 
                await themeHandler.setUserTheme(this.value);
        }
        
        // ===================================================
        
        
        if (window.run_env != "http_web") {
            // migrate theme from localStorage to storage.local
            // NOTE delete in the future
            if (! (await get_addon_setting_local('theme') ) && localStorage['theme'] )
                chrome.storage.local.set( {'theme': localStorage['theme'] } );
            
            if (await get_addon_setting_local('theme'))
                localStorage['theme'] = (await get_addon_setting_local('theme'));
        }
        
        // ===================================================
        
        if (window.run_env != "http_web") {
            delete this.themes['Mac'];
            delete this.themes['Keyboard'];
        }
        
        this.decideDefaultTheme();
        
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
            
            if ( (await this.getUserTheme() ) === tm  )
                radio.checked = true;
            
            if ( tm == "default" && 
                ( ! (await this.getUserTheme()) || (await this.getUserTheme()) == "default" )
            )
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
        
        this.init_theme( await this.getUserTheme() );
        
        document.getElementById("btn_randomtheme").onclick = async function() {
            const oldName = await themeHandler.getUserTheme();
            
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
            await themeHandler.setUserTheme(newName);
        }
        
        return this;
    
    }
    
    
    
}


