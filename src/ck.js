/*
 * By Big Search / 大术专搜
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

var isFirefox = false;
var isChrome = false;
if (window.run_env != "http_web")
{
    isFirefox = chrome.runtime.getURL('').startsWith('moz-extension://');
    isChrome = chrome.runtime.getURL('').startsWith('chrome-extension://');
}

async function get_addon_setting(key) {
    
    
    function getAllStorageSyncData() { // Chrome only
    // Immediately return a promise and start asynchronous work
        return new Promise((resolve, reject) => {
            // Asynchronously fetch all data from storage.sync.
            chrome.storage.sync.get(null, (items) => {
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
            return (await browser.storage.sync.get());
        else
            return (await browser.storage.sync.get())[key];
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



var use_localstorage = false;

function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return false;
    }
}

if ( storageAvailable("localStorage")) use_localstorage = true;

//////


function getStor(cname) 
{
    if (!use_localstorage) return "";
    
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
    if (!use_localstorage) return false;
    
	try{
        localStorage.setItem(c_name,value);
        return true;
    }catch(e){ return false;} 
}

function delStor(name)
{
    if (!use_localstorage) return false;
    try{
        localStorage.removeItem(name);
        return true;
    }catch(e) {return false;}
}

function gethiststr()
{
//get cookie "hist" raw string
    if (!use_localstorage) return "";
    
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



const hist_num_max=35;
function add_hist2c(hist2a)
{
//parameter string hasn't been escaped
//check if repeated,escape
//if string is already added, bring it to first
//if reach upper limit delete the lowest one then add
//if not , just add
    
    if (!use_localstorage) return false;
    
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
    if (!use_localstorage) return false;
    
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
//this will NOT unescape cookie
//it returns raw string 
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) 
			return c.substring(name.length,c.length);
    }
    return "";
} 

function setCookie_my(c_name,value,expiredays)
{
//this will escape string
	var expireStr="";
	
	if(expiredays=="session") expireStr="";
	else
	{
		if(expiredays==null) expiredays=1000;
		
		var exdate=new Date();
		exdate.setDate(exdate.getDate()+expiredays);
		
		expireStr = ";expires="+exdate.toGMTString()
	}
	
	document.cookie=c_name+ "=" +escape(value)+ "; SameSite=Lax" + expireStr;
		//((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
}

function delCookie_my(name)
{
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	//var cval=getCookie_my(name);
	//if(cval!=null)
	document.cookie= name + "=" + ";expires="+exp.toGMTString();
}


