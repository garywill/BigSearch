/*
 * By Big Search / 大术专搜
 * (addons.mozilla.org/firefox/addon/big-search/)
 * (acsearch.tk)
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
        this.read_stored_inputcontent_to_inputele = async function () {
            const stored_inputcontent = await get_stored_input_content() ;
            if ( stored_inputcontent !==  inputHandler.getValue() )
                inputHandler.init_mode(stored_inputcontent);
        };
        this.init_messageReceiver = function () {
            chrome.runtime.onMessage.addListener( async function (request, sender, sendResponse) {
                console.debug("receive message ", showas, request, sender);
                if ( chrome.runtime.id === sender.id && request['to'] == "home.html")
                {
                    if (request['command'] == "setInputBoxToText" && typeof(request['text']) === "string" )
                        inputHandler.init_mode( request['text'] );
                }
                
                setTimeout(async function() {
                    var setting_autoSelectInputText = await get_addon_setting_local('autoSelectInputText') ;
                    
                    if (setting_autoSelectInputText !== false)
                        inputHandler.getInputFieldEle().select(); 
                }, 50);

            });
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
            
            if (useVem && vemHandler.inOutStatus)
                return;
            
            inputHandler.getInputFieldEle().focus();
        };
        this.onGetFocus = function() {
            if (useVem) {
                vemHandler.setOff();
            }
        }
        
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
                        
                        if (useVem)
                            vemHandler.setOff();
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

            if (this.ml_mode && ! this.ml_ui) {
                document.getElementById("openhist").classList.add("openhist_hide_duetoM");
            }
            else
            {
                document.getElementById("openhist").classList.remove("openhist_hide_duetoM");
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
            
            this.broadcastText_onUserInput();
        }
        
        this.inputbox.addEventListener("change", function() {
            inputHandler.syncS2M();
            if (useVem)
                vemHandler.setOff();
        });
        this.input_ml.addEventListener("change", function() {
            inputHandler.syncM2S();
            if (useVem)
                vemHandler.setOff();
        });
        

        this.broadcastText_onUserInput = async function() {
            console.debug(showas, "broadcastText_onUserInput()");
            if (window.run_env != "http_web") {
                await set_stored_input_content( inputHandler.getValue() );
                chrome.runtime.sendMessage( {
                    from : "home.html",
                    to: "home.html", 
                    from_showas: showas, 
                    evt: "broadcastText_onUserInput", 
                    command: "setInputBoxToText",
                    text: inputHandler.getValue()
                } );
            } 
        };
        this.inputbox.addEventListener("input", this.broadcastText_onUserInput);
        this.input_ml.addEventListener("input", this.broadcastText_onUserInput);
        // addListenerNDelay(this.inputbox, "change", 300, this.broadcastText_onUserInput);
        // addListenerNDelay(this.input_ml, "change", 300, this.broadcastText_onUserInput);
        
        
        
        this.inputbox.addEventListener("focus", function() {
            inputHandler.onGetFocus();
        }); 
        this.input_ml.addEventListener("focus", function() {
            inputHandler.onGetFocus();
        }); 
        
        
        this.finishEditAndBlurAllInputBoxes = function() {
             if (this.ml_ui) {
                 inputHandler.saveMl();
             } 
             inputHandler.getInputFieldEle().blur();
        };
    } ();
}

