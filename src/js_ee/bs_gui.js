/*
 * Big Search (大术专搜)
 *     https://github.com/garywill/BigSearch
 *     https://addons.mozilla.org/firefox/addon/big-search/
 *     https://chrome.google.com/webstore/detail/big-search/ojcnjeigmgjaiolalpapfnmmhdmpjhfb
 * 
 * Licensed under AGPL (GNU Affero General Public License)
 */

var bs_gui;
var bs_gui_app;

onrd.push(function() {
    bs_gui = Vue.createApp(bs_gui_app).mount("#bs_gui");
}); 

bs_gui_app = {
    data() {
        return {
            userJsonArr: [],
            sEngines: sEngines,
            templatesAdding: {
                "simple": {
                    keyhead: "e_",
                    gui_type: "engine_simple",
                    bsObj: {
                        dname: "New engine",
                        full_url: ""
                    }
                },
                "post": {
                    keyhead: "e_",
                    gui_type: "engine_expert",
                    bsObj: {
                        dname: "New POST engine",
                        action: "https://",
                        method: "post",
                        kw_key: "q",
                        params: [
                            {key:"catagory_id", val: "5"},
                            {key:"search_more", val: "yes"}
                        ]
                    }
                },
                "cross": {
                    keyhead: "e_",
                    gui_type: "engine_expert",
                    bsObj: {
                        dname: "New cross-engine",
                        kw_format: "{0} site:example.com/*",
                        use_other_engine: "google"
                    }
                },
                "many": {
                    keyhead: "e_",
                    gui_type: "engine_expert",
                    bsObj: {
                        dname: "New many engines",
                        use_other_engine: [
                            "google", "duckduckgo"
                        ]
                    }
                },
                "ajax": {
                    keyhead: "e_",
                    gui_type: "engine_expert",
                    bsObj: {
                        dname: "New ajax engine",
                        action: "https://",
                        "ajax": "#input-box-id"
                    }
                },
                "labelrow": {
                    keyhead: "l_",
                    gui_type: "labelrow",
                    bsObj: {
                        lstr: "New label"
                    }
                },
                "fav": {
                    keyhead: "f_",
                    gui_type: "fav_engine",
                    bsObj: {
                        fav: ""
                    }
                },
            },
            rindex2add: 0,
            
        }
    },
    methods: { 
        
    }
};





bs_gui_app.methods.refreshBuildin = function() {
    this.sEngines = sEngines;
}

bs_gui_app.methods.setRindex2add = function(n) {
    this.rindex2add = n;
}

bs_gui_app.methods.addUUID2GuiObj = function(guiObj) {
    var time ;
    var randomid ; 
    var c = 0 ;
    if ( ! guiObj['uuid'] ) 
    { 
        time = Date.now() ;
        randomid = genRandomInt(1, 999999) ;
    } 
    else
    { 
        time = guiObj['uuid'].split('_')[0];
        randomid = guiObj['uuid'].split('_')[1];
        c = Number( guiObj['uuid'].split('_')[2] ) +1 ;
    } 
    const uuid = time.toString() + "_" + randomid.toString() + "_" + c.toString()  ;
    guiObj['uuid'] = uuid ;
    return guiObj ;
}

bs_gui_app.methods.addRowByTemplate = function(index, template_name) {
    
    const _template = JSON.parse(JSON.stringify(this.templatesAdding[template_name]));  //TODO 改所有object.assign
    var template = {};
    Object.assign(template, _template);
    
    var guiObj = new Object();
    guiObj.key = template.keyhead + randKeyName(); 
    guiObj.gui_type = template.gui_type;
    guiObj.bsObj = {};
    Object.assign(guiObj.bsObj, template.bsObj);
    
    if (index<0) {
        this.userJsonArr.push(this.addUUID2GuiObj(guiObj));
        index = this.userJsonArr.length-1;
    }
    else
    {
        this.userJsonArr.splice(index, 0, guiObj);
    }
    
    this.bsObjBtns2Gui(index);
    this.bsObjExpertContent2Gui(index);
    this.emitAllTextareaChangeEvt();
}

bs_gui_app.methods.addFav = function(fav) {
    this.addRowByTemplate(-1, "fav");
    if(fav)
        this.userJsonArr [ this.userJsonArr.length - 1 ].bsObj['fav'] = fav
}

bs_gui_app.methods.parseUserJson = async function() {
    this.userJsonArr = [];
    await sleep(1);
    
    var parsedWholeObjectFromUserJson;
    try{
        parsedWholeObjectFromUserJson = JSON.parse($('#user_json_field').val());
    }catch(err) {
        alert(`❌Oops ! ❌\nCan't parse as strict JSON format! Please check your syntax. \n\n${err}`);
        return;
    }
    
    var keys = Array.from(Object.keys(parsedWholeObjectFromUserJson));
    for (var i=0 ; i< keys.length; i++) {
        const key = keys[i];
        const index = i;
        var fromUserJson_curObj = parsedWholeObjectFromUserJson[key];
        
        var newObj_curInd_gui = {};
        newObj_curInd_gui.key = key;
        newObj_curInd_gui.bsObj_old = {};
        Object.assign(newObj_curInd_gui.bsObj_old, fromUserJson_curObj);
        newObj_curInd_gui.bsObj = {};
        
        if ( typeof(fromUserJson_curObj) === "string") {
            // 处理baby simple GET，转换成dname+full_url
            newObj_curInd_gui['gui_type'] = "engine_simple";
            newObj_curInd_gui.bsObj['dname'] = key;
            newObj_curInd_gui.bsObj['full_url'] = fromUserJson_curObj;
        }
        else { // 原来的不是string而是object
            Object.assign(newObj_curInd_gui.bsObj, fromUserJson_curObj);
            
            if (newObj_curInd_gui.bsObj['lstr']) 
                newObj_curInd_gui['gui_type'] = "labelrow";
            else if (newObj_curInd_gui.bsObj['fav']) 
                newObj_curInd_gui['gui_type'] = "fav_engine";
            else {
                const row_keys = new Set(Object.keys(newObj_curInd_gui.bsObj));
                const max_keys = new Set(['dname', 'full_url']);
                if (isSuperset(max_keys, row_keys))
                    newObj_curInd_gui['gui_type'] = 'engine_simple';
                else 
                    newObj_curInd_gui['gui_type'] = 'engine_expert';
            }
        }
        
        
        this.userJsonArr.push(this.addUUID2GuiObj(newObj_curInd_gui));
        
        this.bsObjBtns2Gui(index);
        this.bsObjExpertContent2Gui(index);
    }
    this.emitAllTextareaChangeEvt();
    return true;
}

bs_gui_app.methods.bsObjBtns2Gui = function(i) {
    var expert_btns = {};
    if ( this.userJsonArr[i].bsObj['btns'] !== undefined ) {
        Object.assign(expert_btns, this.userJsonArr[i].bsObj['btns']);
        this.userJsonArr[i]['gui_json_expert_btns'] = JSON.stringify(expert_btns, null, 2);
    }else {
        expert_btns = undefined;
        this.userJsonArr[i]['gui_json_expert_btns'] = undefined;
    }
    this.emitAllTextareaChangeEvt();
}

bs_gui_app.methods.bsObjExpertContent2Gui = function(i) {
    var expert_content = {};
    Object.assign(expert_content, this.userJsonArr[i].bsObj);
    if (expert_content['dname'] !== undefined)
        delete expert_content['dname']
        if (expert_content['btns'] !== undefined)
            delete expert_content['btns']
            
            this.userJsonArr[i]['gui_json_expert_content'] = JSON.stringify(expert_content, null, 2);
    this.emitAllTextareaChangeEvt();
}

bs_gui_app.methods.delRow = function(i) {
    this.userJsonArr.splice(i,1);
    this.emitAllTextareaChangeEvt();
}

bs_gui_app.methods.simple2expert = function(i) {
    this.bsObjExpertContent2Gui(i);
    this.userJsonArr[i]['gui_type'] = "engine_expert";
    this.emitAllTextareaChangeEvt();
}

bs_gui_app.methods.createExampleBtn = function(i) {
    this.userJsonArr[i].bsObj['btns'] = {
        "sch1": {
            label: "Search"
        },
        "sch2": {
            label: "Search 2",
            params: [
                { key: "more", val: "yes" }
            ]
        }
    }
    this.userJsonArr[i]['gui_json_expert_btns'] = JSON.stringify(this.userJsonArr[i].bsObj['btns'], null, 2);
    this.emitAllTextareaChangeEvt();
}

bs_gui_app.methods.delBtns = function(i) {
    delete this.userJsonArr[i].bsObj['btns'];
    this.bsObjBtns2Gui(i);
    this.emitAllTextareaChangeEvt();
}

bs_gui_app.methods.rowMoveUp = function(i) {
    if (i>0) {
        var tmp = this.userJsonArr[i];
        this.userJsonArr.splice(i, 1);
        this.userJsonArr.splice(i-1, 0, tmp);
        
        this.addUUID2GuiObj(this.userJsonArr[i-1]);
        this.addUUID2GuiObj(this.userJsonArr[i]);
        // console.debug(this.userJsonArr[i-1].uuid);
        
        this.emitAllTextareaChangeEvt();
    }
}

bs_gui_app.methods.rowMoveDown = function(i) {
    if (i<this.userJsonArr.length-1) {
        this.rowMoveUp(i+1);
        // this.$forceUpdate();
    }
}


bs_gui_app.methods.rowMove = function(fromI, toI) {
    if (fromI == toI || fromI == toI-1) {
        //console.log("same");
        return;
    }
    
    if (toI == -1 && fromI == this.userJsonArr.length)
        return;
    
    var tmp = this.userJsonArr[fromI];
    this.userJsonArr.splice(fromI, 1);
    
    if (toI == -1) {
        this.userJsonArr.push(tmp);
    }
    else
    {
        var newToI = (fromI>toI) ? toI  : toI-1 ;
        this.userJsonArr.splice(newToI, 0, tmp);
    }
    
    this.addUUID2GuiObj(this.userJsonArr[fromI]);
    this.addUUID2GuiObj(this.userJsonArr[toI]);

    this.emitAllTextareaChangeEvt();
}

bs_gui_app.methods.refreshGui = async function(i) {
    this.userJsonArr[i].hide = true;
    await sleep(1);
    delete this.userJsonArr[i].hide ;
}

bs_gui_app.methods.emitTextareaChangeEvt = async function(i) {
    await sleep(1);
    var queryStr = `#gui_table tr.row-user[rindex=${i}] textarea`;
    $(queryStr).each(function(j, ele) {
        ele.dispatchEvent(new Event('input'));
    });
}

bs_gui_app.methods.emitAllTextareaChangeEvt = async function() {
    await sleep(1);
    var queryStr = `#gui_table textarea`;
    $(queryStr).each(function(j, ele) {
        ele.dispatchEvent(new Event('input'));
    });
}

bs_gui_app.methods.gui2json = function() {
    // trim <input> 
    // TODO type=text
    $("#gui_table input").each(function(i,ele){
        ele.value = ele.value.trim();
        ele.dispatchEvent(new Event('input'));
    });
    
    // trim <textarea>，空textarea用{}替换
    $("#gui_table textarea").each(function(i,ele){
        ele.value = ele.value.trim();
        if (ele.value == "")
            ele.value = "{}"; // TODO 只有在确定这个textarea是填json的之后才
            ele.dispatchEvent(new Event('input'));
    });
    
    // 检查key合法(不空) 
    for( var i=0; i<this.userJsonArr.length; i++) {
        if (!this.userJsonArr[i].key) {
            alert(`❌ Oops! Something in the table is wrong! ❌\n\nTable row ${i+1} \nKey is empty`);
            return;
        }
    }
    
    // key不重复
    for (var i=0; i<this.userJsonArr.length-1; i++) {
        for (var j=i+1; j<this.userJsonArr.length; j++) {
            if (this.userJsonArr[i].key == this.userJsonArr[j].key) {
                alert(`❌ Oops! Something in the table is wrong! ❌\n\nTable row ${i+1} and ${j+1} have duplicated key`);
                return;
            }
        }
    }
    
    
    // 检测json语法
    for( var i=0; i<this.userJsonArr.length; i++) {
        var guiObj = this.userJsonArr[i];
        
        if (guiObj['gui_type'] == "engine_expert") {
            var parsedExpertObj;
            var parsedBtnsObj;
            try {
                parsedExpertObj = JSON.parse(guiObj['gui_json_expert_content']);
            }catch(err) {
                alert(`❌ Oops! Something in the table is wrong! ❌\n\nTable row ${i+1} \nEngine content JSON field can't be parsed as strict JSON format\n\n ${err}`);
                return;
            }
            
            if (guiObj['gui_json_expert_btns'] !== undefined)
                try {
                    parsedBtnsObj = JSON.parse(guiObj['gui_json_expert_btns']);
                }catch(err) {
                    alert(`❌ Oops! Something in the table is wrong! ❌\n\nTable row ${i+1} \nButtons JSON field can't be parsed as strict JSON format\n\n ${err}`);
                    return;
                }
        }
        
    }
    // for:
    //   如果是expert，检查两个json是否可解析，解析出有内容则写入，无则设置undefined
    //   其他直接
    var resultBs = {};
    for( var i=0; i<this.userJsonArr.length; i++) {
        var guiObj = this.userJsonArr[i];
        if (guiObj['gui_type'] == "engine_expert") {
            var newBsObj = {
                dname: guiObj.bsObj.dname
            };
            
            var parsedExpertObj = JSON.parse(guiObj['gui_json_expert_content']);
            Object.assign(newBsObj, parsedExpertObj);
            
            if (guiObj['gui_json_expert_btns'] !== undefined) {
                var parsedBtnsObj = JSON.parse(guiObj['gui_json_expert_btns']);
                if ( Object.keys(parsedBtnsObj).length > 0) {
                    Object.assign(newBsObj, { btns: parsedBtnsObj } );
                    
                }
            }
            
            guiObj.bsObj = newBsObj;
        }
        
        resultBs[guiObj.key] = guiObj.bsObj;
    }
    
    var resultBsJson = JSON.stringify(resultBs , null, 2);
    $("#user_json_field").val(resultBsJson);
    $("#user_json_field")[0].dispatchEvent(new Event('input'));
    return true;
}