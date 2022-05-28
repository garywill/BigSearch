function inputbox_press( e ) {
	var evt = e || window.event
	// "e" is the standard behavior (FF, Chrome, Safari, Opera),
	// while "window.event" (or "event") is IE's behavior
	if ( evt.keyCode === 13 ) {
		inputbox_enter();

	}
	
	function inputbox_enter()
    {
        if(document.getElementById("lastp")) 
        {
            document.getElementById("lastp").click();
        }
        else
        {
            document.getElementById("engines_table").getElementsByClassName("gobutton")[0].click();
        }
    }
}


async function ebtn_onclick(obj) 
{
    document.getElementById("permis_toast_o").style.display = "none";
    
    const engine =obj.getAttribute("e");
    const btn = obj.getAttribute("b");
    const dbname = obj.getAttribute("dbname");
    
	var inputval = inputHandler.getValue();
	if (inputval=="")
	{
		alert(i18n(["搜索框内容为空！\n如要进行操作（如搜索），输入后，再点击表格右列对应的按钮", "The input field is empty!\nTo do an action (e.g. search), input text, then click a button on the right column of table"]))
	}
	else 
    {
        ebtn_onclick_gosearch();
    }
    
	async function ebtn_onclick_gosearch() {
        
        try{
            await goEngBtn( engine, btn, inputval , dbname);
        } catch(err) { console.error(`ERROR when trying to call ${engine}/${btn}`); console.error(err); }
    }
    
    if(!mobile) 
        setTimeout(inputHandler.setFocus,1);
    
    
    async function saveLastClick() {
        const table_element = document.getElementById("engines_table");
        const table_dbname = table_element.getAttribute("dbname")
        const table_cata = table_element.getAttribute("cata")
        lastuseHandler.saveLastClick(table_dbname, table_cata, engine, btn);
    };
	
	setTimeout( function() {
        add_hist2c(inputval);
        displayhist();
    },20);
    
    await saveLastClick();
    lastuseHandler.loadLastClick();
    
    stati_goclicked(obj); // async
}


async function cata_onclick(btnobj)
{
    const dbname=btnobj.getAttribute("dbname");
    const cata=btnobj.getAttribute("cata");
    
    const engines_cont = document.getElementById("engines_cont");
    
    //engines_cont.innerHTML = "";
    var oldTable = engines_cont.querySelector("#engines_table");
    if (oldTable)
        oldTable.parentNode.removeChild(oldTable);
    
    if (btnobj.getAttribute("dbname")=="user")
    {
        
        document.getElementById("div_custom_json").style.display="";
        document.getElementById("div_button_to_input_json").style.display="";
        document.getElementById("div_json_parse").style.display="none";
        
        try{
            await read_usercustom_engines();
        }catch(err) { console.error(err); }
        
    }else{
        document.getElementById("div_custom_json").style.display="none";
    }
    
    
    if (btnobj.getAttribute("dbname")=="browser")
    {
        document.getElementById("div_search_permi").style.display = "none";
        if ( ! await browser.permissions.contains( { permissions: ["search"] } ) )
            document.getElementById("div_search_permi").style.display = "";
            
        try {
            await fetch_browser_engines();
        }catch(err) { }
    }else{
        document.getElementById("div_search_permi").style.display = "none";
    }
    
    engines_cont.appendChild( createETableByCata( btnobj.getAttribute('name'), btnobj.getAttribute('dbname'), 'engines_table'));
    

    Array.from( document.getElementsByClassName("cata_btns") ).forEach(function(ele){
        ele.classList.remove("cata_btn_highlight");
    });
    btnobj.classList.add("cata_btn_highlight");
    
    lastuseHandler.loadLastClick(dbname, cata);

    scroll_to_lastp();
    
    if (!mobile)
        inputHandler.setFocus();
    
    //table_cont_style();
    
    lastuseHandler.saveLastBrowse(dbname, cata);
}


async function eng_link_onclick() {
}
