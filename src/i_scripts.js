/*
 * Big Search (大术专搜)
 *     https://github.com/garywill/BigSearch
 *     https://addons.mozilla.org/firefox/addon/big-search/
 *     https://chrome.google.com/webstore/detail/big-search/ojcnjeigmgjaiolalpapfnmmhdmpjhfb
 * 
 * Licensed under AGPL (GNU Affero General Public License)
 */


function addListenerNDelay(eventOwner, eventName, msDelay, callbackFunction) 
{
    var triggerIgnoringTime = 0;                                            

    var callbackWrapper =  async function () {
        triggerIgnoringTime ++;
        if ( triggerIgnoringTime > 1)
        {
//             console.log("Ignoring time ~");
            return;
        }
        
        await callbackFunction();
        setTimeout(async function() { 
            if ( triggerIgnoringTime > 1)
            {
                await callbackFunction();
            }
            triggerIgnoringTime = 0; 
        }, msDelay);
    }
    eventOwner.addEventListener(eventName, callbackWrapper);
}

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
          
    var got_addon_lang = await get_addon_setting("hl");
    if (got_addon_lang) 
        window.lang = got_addon_lang;
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



onrd.push(async  function() {
    await pre_layout();
});


onrd.push( function() {
    init_inputHandler();
});

onrd.push(async function() {
    await init_lastuseHandler();
});

var useVem;
onrd.push(async function() {
    if (useVem === true)
        await init_vemHandler();
}); 



onrd.push(async function(){
    await make_cata_btns();
    
    if (useVem === true)    
        vemHandler.catasVemInit();
    
//     cata_onclick( document.getElementById("cata_btn_general_dbname_bigsearch") );
    lastuseHandler.loadLastBrowse();
});

onrd.push(function(){
    document.getElementById("inputbox").addEventListener('keypress', inputbox_press );
});



onrd.push(function(){
	inputHandler.setFocus();
});

onrd.push(function(){
    const btn_ml_input = document.getElementById("btn_ml_input");
    const btn_save_ml = document.getElementById("btn_save_ml");
    const btn_save_ml_sl = document.getElementById("btn_save_ml_sl");
    
    if (window.run_env == "http_web")
        inputHandler.init_mode();
    inputHandler.setMlView(false);
    
    btn_ml_input.onclick = function() {
        inputHandler.openMlView();
        
        if (useVem)
            vemHandler.setOff();
    }
    btn_save_ml.onclick = function() {
        inputHandler.saveMl();
    }
    btn_save_ml_sl.onclick = function() {
        inputHandler.saveMlAsSl();
    }

});

onrd.push(async function(){ 
    if (window.run_env != "http_web" /* && ! chrome.extension.inIncognitoContext */ ) 
        await inputHandler.read_stored_inputcontent_to_inputele();
});
onrd.push(function(){ 
    if (window.run_env != "http_web" /* && ! chrome.extension.inIncognitoContext */ ) 
    {
        window.addEventListener("focus", async function(){
            await inputHandler.read_stored_inputcontent_to_inputele();
        });
        // window.addEventListener("blur", async function(){
        //     await set_stored_input_content( inputHandler.getValue());
        // });
    }
});
onrd.push(function(){ 
    if (window.run_env != 'http_web')
        inputHandler.init_messageReceiver();
}); 

onrd.push(function(){ 
    if (window.run_env != 'http_web') {
        setTimeout(async function() {
            var setting_autoSelectInputText = await get_addon_setting_local('autoSelectInputText') ;
        
            if (setting_autoSelectInputText !== false)
                inputHandler.getInputFieldEle().select(); 
        }, 50);
    } 
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
        }catch(err){ console.warn(err); }
	}
});

onrd.push(function(){
	document.getElementById("inputpaste").onclick=function()
	{
        if (window.run_env != "http_web") {
            // NOTE !!!! NOTICE !!  ` permissions.request ` not allow above have ` await ` 
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










onrd.push(function(){
    if (window.run_env != "http_web") {
        document.getElementById("btn_askpermis_ajax").onclick = async function() {
            const url = document.getElementById("permis_toast_url").getAttribute("data");
            
            // NOTE !!!! NOTICE !!  ` permissions.request ` not allow above have ` await ` 
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

onrd.push(function() {
    document.getElementById("cornerbtn_openintab").onclick =async  function() {
        await chrome.tabs.query({
                url:chrome.runtime.getURL('home.html'), 
                currentWindow: true
            }, 
            function(result)
            {
                if (!result.length>0)
                {
                    chrome.tabs.create( { url: chrome.runtime.getURL('home.html'), active: true, index: 0  } ) ;
                }
                else
                {
                    const tabAlready = result[0];
                    chrome.tabs.update(tabAlready.id, { active: true }) ;
                } 
            }
        ) ;
    };
});
onrd.push(function() {
    document.getElementById("cornerbtn_setashome").onclick = function() {
        const url = chrome.runtime.getURL("home.html");
        var copyask = confirm( i18n( [ `您可以前往浏览器的设置，将主页设置为\n\n${url}\n\n点击确定复制该URL`, `You can go to browser's settings and set the homepage to\n\n${url}\n\nClick OK to copy that URL` ] ) );
        if (copyask)
        {
            var fakeele =document.createElement("input");
            fakeele.value = url;
            fakeele.style = "max-height: 1px; max-width: 1px; position: absolute; top: -999px; left: -999px;"
            document.getElementById("wrapper").appendChild(fakeele);
            fakeele.focus();
            fakeele.select();
            try{
                document.execCommand('copy');
            }catch(err) { console.warn(err) } 
            setTimeout(function() {fakeele.parentNode.removeChild(fakeele);}, 1000);
        }
    };
});
onrd.push(async function() {
    if (isFirefox){
        document.getElementById("cornerbtn_opensidebar").onclick = function() {
           // NOTE !!!! NOTICE !!   not allow above have ` await `  
            browser.sidebarAction.open();
        };
    }else if (isChrome) { 
        document.getElementById("cornerbtn_opensidebar").classList.add('display-none');
        
        var tab = ( await chrome.tabs.query({currentWindow:true, active: true}) )[0];
        var wid = tab.windowId;
        if (wid) {
            document.getElementById("cornerbtn_opensidebar").onclick = function() {
            // NOTE !!!! NOTICE !!   not allow above have ` await `  
                chrome.sidePanel.open({windowId: wid});
            };
            document.getElementById("cornerbtn_opensidebar").classList.remove('display-none');
        }
    } 
});
onrd.push(function() {
    document.getElementById("cornerbtn_openpopup").onclick = async function() {
        // NOTE !!!! NOTICE !!  ` openPopup ` not allow above have ` await ` 
        chrome.action.openPopup() ; 
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
    addListenerNDelay(window, "focus", 1000, function() {
        displayhist();
    });
});

onrd.push(async function(){
    //setTimeout(layout_init, 30);
    await layout_init();
});

onrd.push(function(){
    setTimeout(function() {
        addListenerNDelay(window, "resize", 200, onWindowResize);
    },500);
});



onrd.push(function(){ 
    if (useVem) 
    {
        window.addEventListener("focus", function(){
            vemHandler.windowOnFocus();
        });
        window.addEventListener("blur", function(){
            vemHandler.windowOnBlur();
        });
    }
});

onrd.push(async function(){ 
    if (window.run_env != 'http_web' && showas == 'stab') {
        chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
            if ( chrome.runtime.id === sender.id 
                && request['to'] == "home.html" 
                && request['to_showas'] == 'stab' 
                && request['command'] == 'stabs_report_yourselfs' 
            )
            {
                chrome.runtime.sendMessage( {
                    from: "home.html", 
                    from_showas: "stab", 
                });
            }
        } );
    }
}); 

onrd.push(async function(){
    const open_edit_gui_btns = document.getElementsByClassName("btn_open_edit_gui");
    for (var ele of open_edit_gui_btns) {
        ele.addEventListener('click', async function (event) {
            console.log(event.currentTarget);
            var edit_page_url = event.currentTarget.getAttribute('href');
            
            if (isFirefox) {
                var urls_arr = chrome.runtime.getManifest()['host_permissions'];
                for (var i=0; i<urls_arr.length; i++) {
                    spl = urls_arr[i] .split('/');
                    urls_arr[i] = [ spl[0], spl[1], spl[2] ].join('/') + "/*" ;
                }
                console.log(urls_arr);
                
                // NOTE !!!! NOTICE !!  ` permissions.request ` not allow above have ` await ` 
                console.log(
                    await chrome.permissions.request({ origins: urls_arr  })
                ); 
            } 
            
            console.log(edit_page_url);
            await chrome.tabs.create({url: edit_page_url  });
        });
    }
}); 

onrd.push(function(){
    document.getElementById("btn_input_json").addEventListener('click', function () {
        document.getElementById("div_json_parse").style.display="";
        document.getElementById("div_button_to_input_json").style.display="none";
    });
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
        // NOTE !!!! NOTICE !!  ` permissions.request ` not allow above have ` await ` 
        await chrome.permissions.request({ permissions: ["search"] });
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
    setTimeout(scroll_to_cata_highlight,500);
});

onrd.push(async function(){
    if (window.run_env != "http_web")
        document.getElementById("curver").textContent = chrome.runtime.getManifest()['version'] ;
});

onrd.push(async function(){
    if (window.run_env != "http_web")
    {
        if (chrome.extension.inIncognitoContext)
            return;
        
        if ( (await get_addon_setting("checkupdate")) !== true 
            && ! (
                (await get_addon_setting("checkupdate")) === undefined
                && (   isFromStore(".opera.com")  ) 
            )
        )
            return;
        
        
        show_news_text();
            
        setTimeout(maybe_checkupdate, 10 *1000);
    }
});

onrd.push(function(){
    setTimeout(putmail,5000);
});

onrd.push(function() {
    const eles_selector = ["#bottom", "#bottom-place", "#header", "#intitle", ".labelrow", "#hist"];
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


/////////////////////////////////
function simp_trad_click() {
    
}
async function make_cata_btns() {
    
    document.getElementById("catas_cont").appendChild(createCataBtn("user", "user"));
    
    if (window.run_env != "http_web") {
            document.getElementById("catas_cont").appendChild(createCataBtn("browser", "browser"));
    }
    
    Object.entries(catas).forEach(function(ele) {
        const cata = ele[0];
        //const cata_cont = ele[1];
        if (isVisible(catas[cata]))
            document.getElementById("catas_cont").appendChild(createCataBtn(cata));
    });
}




async function fetch_browser_engines() {
    got_browser_engines = ( await browser.search.get() );
}


 
