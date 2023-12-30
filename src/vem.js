/*
 * Big Search (大术专搜)
 *     https://github.com/garywill/BigSearch
 *     https://addons.mozilla.org/firefox/addon/big-search/
 *     https://chrome.google.com/webstore/detail/big-search/ojcnjeigmgjaiolalpapfnmmhdmpjhfb
 * 
 * Licensed under AGPL (GNU Affero General Public License)
 */



useVem = true ;

var vemHandler;
async function init_vemHandler() {
    
    vemHandler = await vemHandlerClass();
    
    async function vemHandlerClass() {
        var R = {};
        R.inOutStatus = false;
        R.curSeq = {
            N: 0,
            keys: [], 
        };
        
        R.resetSeq = function() {
            console.debug("resetSeq()");
            R.curSeq.N = 0;
            R.curSeq.keys = [];
        };
        
        R.styleTag_showBadges = document.getElementById("vem_styletag_showbadges");
        
        R.styleTag_windowFocus = document.createElement("style");
        R.styleTag_windowFocus.id = "vem_styletag_windowfocus";
        document.head.appendChild(R.styleTag_windowFocus);
        
        R.goKeysDb = {
            sdb: Array.from( "ABCDEGMNOPQSTUY" ), 
            mdb: Array.from( "XWVZ" ), 
        }
        R.cataKeysDb = {
            sdb: Array.from( "123456789" ), 
            mdb: Array.from( "R0" ), 
        }
        
        
        R.calcKeys = function (sdb, mdb, btnCount)
        {
            var keysArr = [];
            
            for (var i = 0; i<btnCount; i++)
            {
                if (i<sdb.length)
                {
                    keysArr.push( sdb [i] );
                }
                else
                {
                    var Nten = Math.floor(i / sdb.length);
                    if (Nten > mdb.length)
                        break;
                    
                    var iMdbChar = Nten - 1;
                    var iSdbChar = i % sdb.length;
                    
                    var key1 = mdb [iMdbChar];
                    var key2 = sdb [iSdbChar];
                    
                    keysArr.push( `${key1}${key2}` );
                }
            }
            
            return keysArr;
        }; 
        
        R.addKeysToElesArr = function(elesArr, keysDb, badgeClass)
        {
            const len_elesArr = elesArr.length;
            const keysArr = R.calcKeys( keysDb.sdb, keysDb.mdb, len_elesArr );
            
            if (typeof(badgeClass) === "string")
                badgeClass = [badgeClass];
            
            for (var i=0; i<len_elesArr; i++)
            {
                // console.debug("i=", i);
                const node = elesArr [i];
                
                var vemBadge = document.createElement("div");
                vemBadge.className = "vemBadge";
                for (clsn of badgeClass)
                    vemBadge.classList.add(clsn);
                
                const keyStr = keysArr[i];
                vemBadge.setAttribute("keyseqlen" ,  keyStr.length);
                for (var j=0; j<keyStr.length; j++)
                {
                    var keyLetter = document.createElement("span");
                    keyLetter.className = "keyBadgeLetter";
                    keyLetter.setAttribute("keyseq", j+1);
                    keyLetter.textContent = keyStr[j];
                    
                    vemBadge.appendChild(keyLetter);
                    
                    vemBadge.setAttribute("keyseq"+(j+1) ,  keyStr[j]);
                }
                
                node.appendChild(vemBadge);
                
                if (i+1 >= keysArr.length)
                    break;
            }            
        };
        
        R.catasVemInit = async function()
        {
            R.resetSeq();
            
            const cata_btns = document.getElementsByClassName("cata_btns");
            const keysArr = R.calcKeys( R.cataKeysDb.sdb, R.cataKeysDb.mdb, cata_btns.length );
            // console.debug(keysArr);
            
            R.addKeysToElesArr(cata_btns, R.cataKeysDb, "vemBadge_cataBtn");
        };
        
        R.tableVemInit = async function()
        {
            R.resetSeq();
            
            const gobuttons = document.querySelectorAll("#engines_table .gobutton");
            const keysArr = R.calcKeys( R.goKeysDb.sdb, R.goKeysDb.mdb, gobuttons.length );

            R.addKeysToElesArr(gobuttons, R.goKeysDb, "vemBadge_goBtn");
        };
        
        R.showVemBadges = async function() {
            R.styleTag_showBadges.textContent = "";
        }
        R.hideVemBadges = async function() {
            R.styleTag_showBadges.textContent = " .vemBadge {display: none;} ";
        }
        
        R.setOn = function() {
            R.resetSeq();
            R.inOutStatus = true;
            R.showVemBadges();
            document.getElementById("engines_o_cont").focus();
        }
        R.setOff = function() {
            R.resetSeq();
            R.inOutStatus = false;
            R.hideVemBadges();
        }
        
        
        R.toggleVemInOut = function()
        {
            // console.debug("toggleVemInOut()");
            if (R.inOutStatus === true)
                R.setOff();
            else
                R.setOn();
                
            R.resetSeq();
        }
        
        
        R.keyeventInit = function()
        {
            document.addEventListener("keydown", R.keydown_event_handler);
        } ;
        
        R.keydown_event_handler = function() {
            console.debug(event);
            
            if (event.key == "Enter" && event.shiftKey === true
                && !event.ctrlKey && !event.altKey && !event.metaKey
            )
            {
                event.preventDefault();
                event.stopPropagation();
                
                inputHandler.finishEditAndBlurAllInputBoxes();
                
                // document.getElementById("engines_o_cont").focus(); // will show unwanted box
                document.getElementById("engines_o_cont").blur();
                
                R.toggleVemInOut();
                if (R.inOutStatus == false)
                    inputHandler.setFocus();
            }
            else if (event.key == "Escape"
                && !event.ctrlKey && !event.altKey && !event.metaKey && !event.shiftKey
                && R.inOutStatus == true
            ) {
                event.preventDefault();
                event.stopPropagation();
                R.setOff();
            }
            else if ( event.key.toUpperCase && event.key.toUpperCase() == 'I' 
                && !event.ctrlKey && !event.altKey && !event.metaKey && !event.shiftKey
            ) {
                for (ele of [ event.explicitOriginalTarget, event.originalTarget, event.srcElement, event.target ]) {
                    if (ele 
                        && HTMLElement.prototype.isPrototypeOf(ele) 
                        && ['INPUT', 'TEXTAREA'].includes(ele.tagName) 
                    )
                        return;
                }
                event.preventDefault();
                event.stopPropagation();
                
                R.setOff();
                inputHandler.setFocus();
            }
            else if (!event.ctrlKey && !event.altKey && !event.metaKey && !event.shiftKey
                && event.key.length === 1
                && R.inOutStatus == true 
            )
            {
                const tKey = event.key.toUpperCase();
                console.debug(tKey);
                
//                     if (tKey == 'I')
//                     {
//                         event.preventDefault();
//                         event.stopPropagation();
//                         
//                         R.setOff();
//                         inputHandler.setFocus();
//                         
//                         return;
//                     }
                if (tKey == "J" || tKey == "K")
                {
                    var engines_o_cont = document.getElementById("engines_o_cont");
                    
                    var newY;
                    if (tKey == "J")
                        newY = engines_o_cont.scrollTop + engines_o_cont.clientHeight/2;
                    else if (tKey == "K")
                        newY = engines_o_cont.scrollTop - engines_o_cont.clientHeight/2;
                    
                    engines_o_cont.scrollTo({ top: newY, behavior:"smooth" })
                    
                    if (tKey == "J")
                        R.startBadgePressAni(document.getElementById("vem_badge_jk_j"));
                    else if (tKey == "K")
                        R.startBadgePressAni(document.getElementById("vem_badge_jk_k"));

                    
                    return;
                }
                
                
                R.curSeq.keys . push(tKey);
                R.curSeq.N ++ ;
                
                console.debug(R.curSeq);
                
                var matchBadges = [];
                var matchAttrSelector = "";
                
                for (var n=1; n <= R.curSeq.N; n++)
                {
                    matchAttrSelector += `[keyseq${n}='${R.curSeq.keys[n-1]}']` ;
                }
                
                console.debug(matchAttrSelector);
                
                matchBadges = document.querySelectorAll(`.vemBadge${matchAttrSelector}`) ;
                if (matchBadges.length > 0)
                {
                    if (matchBadges.length == 1
                        && parseInt(matchBadges[0].getAttribute('keyseqlen')) == R.curSeq.N
                    ) 
                    {
                        R.resetSeq();
                        matchBadges[0].parentNode.click();
                        R.startBadgePressAni(matchBadges[0]);
                    }
                    else if (matchBadges.length > 1)
                    {
                        
                    } 
                }
                else
                {
                    R.resetSeq();
                }
                console.debug(R.curSeq);
            }
            
            
            // if ( 
            //     ['INPUT', 'TEXTAREA'].includes (event.target.nodeName) 
            //     &&  !event.target.getAttribute("readonly")
            // )
            //     return;
            
            
            
        };
        
        R.windowOnFocus = async function() {
            R.styleTag_windowFocus.textContent = ` `;
        };
        R.windowOnBlur = async function() {
            R.styleTag_windowFocus.textContent = ` .vemBadge { transform: scale(0.5); } `;
        };
        
        R.startBadgePressAni = async function (badgeNode) {
            badgeNode.classList.add("vemBadge_large");
            setTimeout( function() { badgeNode.classList.remove("vemBadge_large") } , 250 );
        };
        
        R.keyeventInit();
        
        return R;
    }
}




