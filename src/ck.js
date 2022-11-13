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

let isFirefox = false;
let isChrome = false;
let mv = -1;

if (window.run_env != "http_web")
{
    isFirefox = chrome.runtime.getURL('').startsWith('moz-extension://');
    isChrome = chrome.runtime.getURL('').startsWith('chrome-extension://');
    mv = chrome.runtime.getManifest().manifest_version;
}

const realSidebarUrl = "addon-popup.html?showas=sidebar";

async function get_addon_setting_local(key) {
    return ( await get_addon_setting(key, true) ) ;
}

async function get_addon_setting(key, local=false) {
    var storageType;
    if (isFirefox) {
        if (local)
            storageType = browser.storage.local;
        else
            storageType = browser.storage.sync;
    }else if (isChrome) {
        if (local)
            storageType = chrome.storage.local;
        else
            storageType = chrome.storage.sync;
    }
    
    function getAllStorageSyncData() { // Chrome only
    // Immediately return a promise and start asynchronous work
        return new Promise((resolve, reject) => {
            // Asynchronously fetch all data from storage.sync.
            storageType.get(null, (items) => {
                // Pass any observed errors down the promise chain.
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }
                // Pass the data retrieved from storage down the promise chain.
                resolve(items);
            });
        });
    }
    
    if (isFirefox)
        if ( ! key)
            return (await storageType.get());
        else
            return (await storageType.get())[key];
    else if (isChrome)
    {
        if ( ! key)
            return ( await getAllStorageSyncData() ) ;
        else
            return ( await getAllStorageSyncData() ) [key];
    }
}


async function getInstallType(){
    if (isChrome)
        return (await chromiumGetInstalltype() ) ;

        
    if (isFirefox)
        return (await browser.management.getSelf())['installType']  ;

            
    async function chromiumGetInstalltype() { // Chrome only
        // Immediately return a promise and start asynchronous work
        return new Promise((resolve, reject) => {
            chrome.management.getSelf( (items) => {
                // Pass any observed errors down the promise chain.
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }
                // Pass the data retrieved down the promise chain.
                resolve(items['installType']);
            });
        });
    }
}

//========================
async function addon_read_usercustom_engines() { 
    const read_addon_settings_usercuston_engines = await get_addon_setting("usercustom_engines");
    if (read_addon_settings_usercuston_engines ) {
        // return uncompressed minified json
        return LZUTF8.decompress(read_addon_settings_usercuston_engines, {inputEncoding: "StorageBinaryString"}) ;
    }
}

async function addon_save_json_to_usercustom(json) {
    var parsedJsonObj;
        
    try{
        parsedJsonObj = JSON.parse(json);
    }catch(err){
        return false;
    }
    
    var stringifiedJson = JSON.stringify(parsedJsonObj); // stringify to make sure minified
    var compressed = LZUTF8.compress(stringifiedJson, {outputEncoding: "StorageBinaryString"});
    
    try{
        await chrome.storage.sync.set({"usercustom_engines": compressed });
    
        if ( ( await get_addon_setting("usercustom_engines") ) === compressed ) {
            return true;
        }
        else 
        {
            return false;
        }
    }catch(err) { 
        return false;
    }
    
}
//========================

function set_string_format_prototype() {
    
    String.prototype.format = function(replacements) {
        replacements = (typeof replacements === 'object') ? replacements : Array.prototype.slice.call(arguments, 0);
        return formatString(this, replacements);
    }
    var formatString = function (str, replacements) {
        replacements = (typeof replacements === 'object') ? replacements : Array.prototype.slice.call(arguments, 1);
        return str.replace(/\{\{|\}\}|\{(\w+)\}/g, function(m, n) {
            if (m == '{{') { return '{'; }
            if (m == '}}') { return '}'; }
            return replacements[n];
        });
    }
}


   


//////


function getStor(cname) 
{
   
    
    var got = false;

    try{
        got = localStorage.getItem(cname);
        if (got)
            return got;
        else 
            return "";
    }catch(e){ return false;} 
} 

function setStor(c_name,value)
{
   
    
	try{
        localStorage.setItem(c_name,value);
        return true;
    }catch(e){ return false;} 
}

function delStor(name)
{
   
    try{
        localStorage.removeItem(name);
        return true;
    }catch(e) {return false;}
}

function gethiststr()
{
//get cookie "hist" raw string
   
    
	return getStor("hist" );
}
function splithists(rawstr)
{
//from raw hist string ,split them and unescape them, return array
    if (! rawstr) return [];
	var hists= new Array();
	hists = rawstr.split("|");
	for( var i=0;i<hists.length;i++)
	{
		hists[i]=decodeURIComponent(hists[i]);
	}
	return hists;
}



const hist_num_max=45;
function add_hist2c(hist2a)
{
//parameter string hasn't been escaped
//check if repeated,escape
//if string is already added, bring it to first
//if reach upper limit delete the lowest one then add
//if not , just add
    
   
    
    function addhiststr2c(addstr)
    {
    //add escaped string to hist cookie, input should be escaped
        var histraw=gethiststr();
        //var hists=splithists(histraw);
        var str2inser="";
        
        if(histraw.length>=1) str2inser="|";
        
        str2inser=addstr+str2inser;
        
        
        setStor("hist" , str2inser + histraw );
        
    }
    
	if (hist2a=="") return -2;
	var hists=splithists(gethiststr());
	
	//if(hists.length>=30) return -3;
	var repeated=false
	for (var i=0;i<hists.length;i++)
	{
		if (hist2a==hists[i])
        {
            repeated=true;
            break;
        }
	}
	
	//ready to make a change to history cookie
	var escapedh=encodeURIComponent(hist2a);
    if (repeated==true)
    {
        del_hist(hist2a);
        addhiststr2c(escapedh);
    }
    else if(hists.length>=hist_num_max)
    {
        delStor("hist" );
        for (var i=hist_num_max-2;i>=0;i--)
        {
            addhiststr2c(encodeURIComponent(hists[i]));
        }
        addhiststr2c(escapedh);
        
    }
    else
    {
        addhiststr2c(escapedh);
    }

}

function del_hist(hist2d)
{
//parameter string hasn't been escaped
   
    
	var hists=splithists(gethiststr());
	delStor("hist" );
	for (var i=hists.length-1;i>=0;i--)
	{
		if(hist2d!=hists[i])
		{
			add_hist2c(hists[i]);
		}
	}
}


///////////////

function getCookie_my(cname) 
{
} 

function setCookie_my(c_name,value,expiredays)
{
}

function delCookie_my(name)
{
}

//------------------

function removeUrlParts(s) // 'http://example.com:8888/a/b/c' --> 'http://example.com:8888/'
{
    try{
        var arr = s.split("/");
        var result = arr[0] + "//" + arr[2] + "/";
        return result;
    }catch(err){
        console.error(err);
        return s;
    }
}
function getRandomInt(max) { // 0 to max
    return Math.floor(Math.random() * (max+1) );
}
