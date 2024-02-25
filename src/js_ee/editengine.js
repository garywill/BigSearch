/*
 * Big Search (大术专搜)
 *     https://github.com/garywill/BigSearch
 *     https://addons.mozilla.org/firefox/addon/big-search/
 *     https://chrome.google.com/webstore/detail/big-search/ojcnjeigmgjaiolalpapfnmmhdmpjhfb
 * 
 * Licensed under AGPL (GNU Affero General Public License)
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


onrd.push(function() {
    if (getCookie_my('hl')) {
        window.lang = getCookie_my('hl');
    }else{
        window.lang = "en";
    }
        
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
                onGotAddonVersion(event.data.bsAddonVersion);
            }
            
            if (event.data.addonUsercustom) {
                const addonUsercustom = JSON.stringify( JSON.parse(event.data.addonUsercustom) ,null, 2);
                $("#user_json_field").val(addonUsercustom);
                $("#user_json_field")[0].dispatchEvent(new Event('input'));
                $("#json_2_gui").click();
            }
            
            if (event.data.addonBuildin) {
                const addonBuildin = event.data.addonBuildin;
                const lang = event.data.lang;
                window.lang = lang;
                buildin_gui.refreshBuildin(addonBuildin);
                bs_gui.refreshBuildin(addonBuildin);
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


onrd.push(function() {
    
    
    $("#btn_detect").click(function() {
        fetchAddonVersion();
    });

    setTimeout( function() {
        resetAddonVerInfo();    
        fetchAddonVersion();
    } , 500);
    setInterval( fetchAddonVersion , 3500);
});

let bsAddonVersion = null ;
let timerId_addVerFetcher = null;

function resetAddonVerInfo() {
    bsAddonVersion = null;
    $("#div_bsAddon_stat").html(`<b style="color:#b47200;"><u>Not detected Big Search extension (need >= 3.6.2)... (If installed, please grant permission from toolbar or extension settings)</u></b> `);
    
    bs_gui.catas={};
    bs_gui.sEngines={};
    buildin_gui.catas={};
    buildin_gui.sEngines={};
}

function fetchAddonVersion() {
    timerId_addVerFetcher = setTimeout(function() {
        onGotAddonVersion(null);
    }, 700 );
    // console.log("page: trying to fetch bs addon version..");
    window.postMessage({
        direction: "page-to-content",
        app: "bigsearch-edit",
        message: "getVersion"
    }, document.location.href);    
    
    window.postMessage({
        direction: "page-to-content",
        app: "bigsearch-edit",
        message: "getAddonBuildin"
    }, document.location.href);  
}
function onGotAddonVersion(ver) {
    clearTimeout(timerId_addVerFetcher);
    if (ver) {
        bsAddonVersion = ver;
        if (compareVer(ver, '3.6.2')<0)
            $("#div_bsAddon_stat").text(`Big Search extension ${bsAddonVersion} installed ✅ ( ⚠️ time to upgrade) `);
        else 
            $("#div_bsAddon_stat").text(`Big Search extension ${bsAddonVersion} installed ✅ `);
    }else {
        resetAddonVerInfo();
    }
}


// https://stackoverflow.com/a/53387532/10617713
// Function returns:
// 0 : a = b
// 1 : a > b
// -1 : a < b
function compareVer(a, b)
{
    function prep(t)
    {
        return ("" + t)
        //treat non-numerical characters as lower version
        //replacing them with a negative number based on charcode of first character
        .replace(/[^0-9\.]+/g, function(c){return "." + ((c = c.replace(/[\W_]+/, "")) ? c.toLowerCase().charCodeAt(0) - 65536 : "") + "."})
        //remove trailing "." and "0" if followed by non-numerical characters (1.0.0b);
        .replace(/(?:\.0+)*(\.-[0-9]+)(\.[0-9]+)?\.*$/g, "$1$2")
        .split('.');
    }
    a = prep(a);
    b = prep(b);
    for (var i = 0; i < Math.max(a.length, b.length); i++)
    {
        //convert to integer the most efficient way
        a[i] = ~~a[i];
        b[i] = ~~b[i];
        if (a[i] > b[i])
            return 1;
        else if (a[i] < b[i])
            return -1;
    }
    return 0;
}


//----------------------------------------

function load_from_ext() {
    var con = false;
    if ( bs_gui.userJsonArr.length > 0 )
        con = confirm("Do you want to load saved custom engines from extension? \nThat will override what's currently in the table below.") ;
    else
        con = true;
    
    if (!con)
        return;    
    
    window.postMessage({
        direction: "page-to-content",
        app: "bigsearch-edit",
        message: "getAddonUsercustom"
    }, document.location.href);
}
function save_table_to_addon() {
    var con = false;
    con = confirm(`Do you want to save ${bs_gui.userJsonArr.length} custom engines to extension? \n \nThat will override your extension's current custom engines data. \n\nAre you sure to save and override?`) ;
    
    if (!con)
        return;
    
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
async function btn_clk_parse_user_json() {
    var res;
    res = await bs_gui.parseUserJson(); 
    if (res) {
        alert("✅ Successfully (loaded and) parsed JSON and put into the editing table.");
    }else{
        
    }
    return res;
}
async function btn_clk_parse_user_json_n_save_to_addon() {
    var res;
    res = await bs_gui.parseUserJson(); 
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
                catas: {},
                sEngines: {},
            }
        },
        methods: {
            isVisible(obj) {
                return isVisible(obj);
            },
            refreshBuildin(addonBuildin) {
                this.sEngines = addonBuildin.sEngines;
                this.catas = addonBuildin.catas;
            },
            onclick_favbtn(engine_name) {
                bs_gui.addFav(engine_name);
                toast_addFav.show();
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


function addTooltip(node, whichText) 
{
    // console.debug(node, whichText);
    var tooltip_text = '';
    if (whichText == 'expert') {
        tooltip_text = `
            <b>Engine (full format) : </b> <br>
            Here you write your custom engine's JSON object content. <br>
            Some key-vals pairs should NOT be written in this code area, 
            which are :<br>
            1. 'dname' (engine display name) is at the left column. <br>
            2. 'btns' (buttons) object is at below.
        `;
    } 
    else if (whichText == 'buttons')
    {
        tooltip_text = `
            <b>Button(s) : </b> <br>
            Here you write your 'btns' object content of your custom engine's JSON object. <br>
            If you leave it "Default", a common default button labeled "Search" will be shown.
        `;
    }
    else if (whichText == 'fav-unknown')
    {
        tooltip_text = `
            This row is a link to Big Search built-in engine, but currently it's "unknown".
            Reason can be: <br>
            1. You didn't enter a valid key of a built-in engine <br>
            2. Extension needs upgrading
        `;
    }
        
    node.parentNode . title = tooltip_text ;
    new bootstrap.Tooltip(node.parentNode) ;
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

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}








