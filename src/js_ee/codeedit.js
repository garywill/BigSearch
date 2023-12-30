/*
 * Big Search (大术专搜)
 *     https://github.com/garywill/BigSearch
 *     https://addons.mozilla.org/firefox/addon/big-search/
 *     https://chrome.google.com/webstore/detail/big-search/ojcnjeigmgjaiolalpapfnmmhdmpjhfb
 * 
 * Licensed under AGPL (GNU Affero General Public License)
 */

var codeedit_user_json_field;
onrd.push(function() {
    CodeMirror.defaults = {
        mode: "application/ld+json",  // 接受的类型，json xml....
        smartIndent: true, // 是否智能缩进
        styleActiveLine: true, // 当前行高亮
        lineNumbers: true, // 是否显示行数
        indentUnit: 2, // 缩进单位，默认2
        gutters: [
            "CodeMirror-linenumbers",
            "CodeMirror-lint-markers",      // CodeMirror-lint-markers是实现语法报错功能
        ],
        lint: true,
        //lineWrapping: true, // 自动换行
        matchBrackets: true, // 括号匹配显示
        // autoCloseBrackets: true, // 输入和退格时成对
        // readOnly: this.readonly, // 只读
        autoRefresh: true, 
        pollInterval: 200, 
    };
    codeedit_user_json_field = setTextareaAsCodeedit($("#user_json_field")[0]) ;
    $("#detailsTag_jsonarea")[0].addEventListener("toggle" , function() {
        codeedit_user_json_field.refresh();
    });
});
function setTextareaAsCodeedit(textareaEle)
{
    var cmObj = CodeMirror.fromTextArea( textareaEle , CodeMirror.defaults);
    cmResize(cmObj, {
        resizableWidth:  false,        
        resizableHeight: true,
    } ) ;
    cmObj.setValue(textareaEle.value);
    cmObj.setSize(null, "150px");
    cmObj.refresh();
    
    cmObj.on("change", function(instance, changeObj) { 
        // console.debug("change"); 
        // setTimeout(function() {
            if (cmObj.getValue() !== textareaEle.value )
            { 
                cmObj.save();
                textareaEle.dispatchEvent(new Event('input'));
            } 
        // }  , 50 );
    } );
    // cmObj.on("changes", function(instance, changes) {  console.debug("changes");} );
    // cmObj.on("inputRead", function(instance, changeObj) { } );
    
    textareaEle.addEventListener("input", onTextareaValueChange);
    textareaEle.addEventListener("change", onTextareaValueChange);
    function onTextareaValueChange() {
        // setTimeout(function() {
            if (cmObj.getValue() !== textareaEle.value )
                cmObj.setValue( textareaEle.value );
        // }  , 50 );
    }
    
    // var textareaValueObserver = new MutationObserver(function() {
    //     if (cmObj.getValue() !== textareaEle.value )
    //         cmObj.setValue( textareaEle.value );
    // 
    // });
    // textareaValueObserver.observe(textareaEle, {attributes: true/*, attributeFilter: ["value"] */} );
    
    // textareaEle.style.display=""; // DEBUG 
    
    return cmObj;
}


bs_gui_app.methods ['expert_json_textarea_to_codeedit'] = function (i, textareaType) {
    var queryStr = `#gui_table tr.row-user[rindex=${i}] textarea`;
    if (textareaType == "expert_content")
        queryStr += ".textarea_engine_expert_content";
    else if (textareaType == "btns_content")
        queryStr += ".textarea_engine_btns_content";
    else
    {    
        console.warn("textareaType error");
        return;
    }
    
    textareaEle = $(queryStr)[0];
    setTextareaAsCodeedit(textareaEle);
};


