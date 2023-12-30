/*
 * Big Search (大术专搜)
 *     https://github.com/garywill/BigSearch
 *     https://addons.mozilla.org/firefox/addon/big-search/
 *     https://chrome.google.com/webstore/detail/big-search/ojcnjeigmgjaiolalpapfnmmhdmpjhfb
 * 
 * Licensed under AGPL (GNU Affero General Public License)
 */


var lastuseHandler;
async function init_lastuseHandler() {
    
    lastuseHandler = await lastuseHandlerClass();
    
    async function lastuseHandlerClass() {
        var R = {};
        R.storageObj = {
            lastBrowse: { target: [], time: null }, // NOTE only for addon
            lastClick: {}, // eg:   "bigsearch|general": ["baidu", "sch"]
            lastInput: {content: null, time: null}, // NOTE only for addon
        };
        R.save = function () {
            localStorage['lastuse'] = JSON.stringify(R.storageObj);
        };
        R.load = function () {
            var parsed = {};
            try{
                parsed = JSON.parse(localStorage['lastuse']);
            }catch(err) { }
            
            if (Object.keys(parsed).length>0) {
                //R.storageObj = parsed;
                Object.assign(R.storageObj, parsed);
            }
            
            return R.storageObj; // just for console output
        };
        R.saveLastClick = function(dbname, cata, engine, btn) {
            R.storageObj.lastClick[`${dbname}|${cata}`] = [engine, btn];
            R.save();
        };
        R.loadLastClick = async function(dbname, cata) {
            if ( ! (dbname && cata) ) {
                const table_element = document.getElementById("engines_table");
                if (!table_element)
                    return;
                const table_dbname = table_element.getAttribute("dbname")
                const table_cata = table_element.getAttribute("cata")
                dbname = table_dbname;
                cata = table_cata;
            }
            
            var got = R.storageObj.lastClick[`${dbname}|${cata}`];
            var engine;
            var btn;
            if (got)
                [engine, btn] = got;
            
            const table_element = document.getElementById("engines_table");
            
            var button_ele;
            
            button_ele = table_element.querySelector(`.gobutton[e='${engine}'][b='${btn}']`);
            if (!button_ele)
                button_ele = table_element.querySelector(`.gobutton[e='${engine}']`);
            
            if (!button_ele)
                button_ele = table_element.querySelector(`.gobutton`);
            
            if (button_ele) {
                var oldLastp = table_element.querySelector("#lastp");
                if (oldLastp)
                    oldLastp.id = null;
                
                button_ele.id = "lastp";
            }
                
//             return button_ele;
//             return [engine, btn];
        };
        R.saveLastBrowse = function(dbname, cata) {
            if (window.run_env == "http_web" )
                return false;
            
            R.storageObj.lastBrowse = { 
                target: [dbname, cata],
                time: Date.now(),
            };
            R.save();
        };
        R.loadLastBrowse = function() { // after load() executed
            var button;
            
            if (window.run_env == "http_web" ) {
                button = document.querySelector(`.cata_btns[dbname=bigsearch]`);
            }
            else
            {
                var [dbname, cata] = R.storageObj.lastBrowse.target;
                
                button = document.querySelector(`.cata_btns[dbname=${dbname}][cata='${cata}']`);
                if (!button)
                    button = document.querySelector(`.cata_btns[dbname='${dbname}']`);
                if (!button)
                    button = document.querySelector(`.cata_btns[dbname=bigsearch]`);
            }
            
            if (!button)
                button = document.querySelector(`.cata_btns`);
            
            if (button)
                button.click();
            
            //return [dbname, cata];
//             return button;
        };
        R.setLastClick = function(engine, btn) {
            
        };
        R.setLastInput = function(content) {
            
        };
        R.checkExpire = function() {
            
        };
        
        //--------------------
        
        R.load();
        //R.checkExpire();
        
        return R;
    }
}

async function scroll_to_lastp() {
    var div = document.getElementById("engines_o_cont");
    var engines_cont = document.getElementById("engines_cont");
    var lastp = document.getElementById("lastp");
    
    if ( ! lastp) {
        div.scrollTop = 0;
        return;
    }

    var distance = lastp.offsetTop  + engines_cont.offsetTop;
    div.scrollTop = distance - div.clientHeight + parseInt(getComputedStyle(lastp).height);
}
function setc_lastp(sete,setb)
{
	setStor("le",sete);
	setStor("lb",setb);
}

async function scroll_to_cata_highlight() {
    var cont = document.getElementById("catas_cont");
    var highlighted = cont.getElementsByClassName("cata_btn_highlight")[0];
    
    if (!highlighted)
        return;
    
    var distance = highlighted.offsetTop;
    cont.scrollTop = distance - cont.clientHeight + parseInt( getComputedStyle(highlighted).height);
}
