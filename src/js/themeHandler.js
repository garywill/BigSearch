/*
 * Big Search (大术专搜)
 *     https://github.com/garywill/BigSearch
 *     https://addons.mozilla.org/firefox/addon/big-search/
 *     https://chrome.google.com/webstore/detail/big-search/ojcnjeigmgjaiolalpapfnmmhdmpjhfb
 * 
 * Licensed under AGPL (GNU Affero General Public License)
 */

var themeHandler = {};

async function init_themeHandler() {
    
    themeHandler = await themeHandlerClass();
    
    async function themeHandlerClass () {
        this.div_choose_themes = document.getElementById("div_choose_themes");
        
        if (window.run_env != "http_web")
        {
            this.showasChoose = showas;
        } 
        
        this.themes = {
            "default" : {  },
            "Mac": {
                need_sty: ["bold"],
            },
            "Keyboard": {
                need_sty: ["bold"],
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
            "Foggy_Lake__Blue": {
                d_name: "Foggy Lake - Colorful Blue + Green",
                need_theme: "Foggy_Lake",
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
            { 
                if (showas == "stab")
                    this._defaultTheme =  "Light_and_Black";
                else if (showas == "popup")
                    this._defaultTheme =  "Light_and_Grey_2";
                else if (showas == "sidebar")
                    this._defaultTheme =  "Light_and_Grey_2";
            } 
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
                var theme = (await get_addon_setting_local('themeSave_'+showasChoose) ) ;
                return theme;
            }
        };
        this.resetUserTheme = async function () {
            if (window.run_env == "http_web" ) {
                delete localStorage['theme'];
            } else {
                await chrome.storage.local.remove('themeSave_'+showasChoose);
            }
        };
        this.setUserTheme = async function (theme) {
            if (window.run_env == "http_web" ) {
                localStorage['theme'] = theme;
            } else {
                var obj = {};
                obj[`themeSave_${showasChoose}`] = theme;
                await chrome.storage.local.set(obj);
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
        

        
        // ===============================
        // migrate from "theme" to "theme: { popup:... , sidebar: ...}"
        // NOTE delete in the future
        if (window.run_env != "http_web") {
            if ( typeof (await get_addon_setting_local('theme')) === "string" )
            {
                await chrome.storage.local.set( {'themeSave_popup': (await get_addon_setting_local('theme')) } );
                chrome.storage.local.remove("theme");
            }
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
                // last one is 'no'. first one is 'default'. exclude those two
                var N = getRandomInt( 
                    (tNames.length - 2 ) // the true length of wanted range
                    - 1 // true length -1 to be index (the function output range includes 0)
                    )
                    +1 // the first one is excluded. shift 1
                    ; 
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
