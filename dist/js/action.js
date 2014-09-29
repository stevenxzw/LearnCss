/**
 * Created by zhiwen on 14-9-15.
 */
(function(){

    function cursorControl(a){
        this.element=a;
    };
    cursorControl.prototype={
        getType:function(){
            return Object.prototype.toString.call(this.element).match(/^\[object\s(.*)\]$/)[1];
        },
        getStart:function(){
            var start;
            if (this.element.selectionStart || this.element.selectionStart == '0'){
                start = this.element.selectionStart;
            }
            else if (window.getSelection){
                var rng = window.getSelection().getRangeAt(0).cloneRange();
                rng.setStart(this.element, 0);
                start = rng.toString().length;
            };
            return start;
        },
        insertText:function(text){
            this.element.focus();
            if (document.all){
                var c = document.selection.createRange();
                document.selection.empty();
                c.text = text;
                c.collapse();
                c.select();
            }
            else{
                var start=this.getStart();
                if(this.getType()=='HTMLDivElement'){
                    this.element.innerHTML=this.element.innerHTML.substr(0,start)+text+this.element.innerHTML.substr(start);
                }else{
                    this.element.value=this.element.value.substr(0,start)+text+this.element.value.substr(start);
                }
            }
        }
    };


    function AutoInput(opt){
         var config = $.extend(this, {
             view : '',
             uri : '',
             input : '',
             delay : 500,
             timer : null,
             temp : '<span rel="{.id}">{.text}</span>'
         }, opt);
         this.init();
    }

    AutoInput.prototype = {

        couser : null,
        cache : {},

        init : function(){

            var that = this;
            this.input = this.input || this.view;
            this.couser = new cursorControl(this.input[0]);
            $(this.input).on('keyup', function(e){
                //console.log(this.selectionStart);
                clearTimeout(that.timer);
                that.timer = setTimeout(function(){that.get.call(that,e)}, that.delay);
            })
        },

        getVal : function(){
          return this.input.val();
        },

        get : function(e){
            console.log(this.getVal());
            this.input.focus();
            console.log(this.couser.getStart());
            //debugger;
        },

        getByAjax : function(str){
            var data = this.cache[str];
            if(!data) //ajax
                data = this.cache[str] = [{'id':'1',text:"小学"}, {'id':2,text:'中学'}, {'id':3,text:'大学'}];
            this.reader(data);
        },

        reader : function(){


        }

    }
    var isIE = false;
    $(function(){

        console.log('init');
       // new AutoInput({view : $('#ableDiv')});

        tinymce.init({selector:'textarea',
            invalid_styles: {
                '*': 'color font-size', // Global invalid styles
                'a': '' // Link specific invalid styles
            },
            autosave_interval: "1s",
            setup : function(ed){
                console.log('text');
                ed.on('click', function(e) {
                   // console.log('Editor was clicked');
                });
                ed.on('paste', function(e){
                    var d =  pasteClipboardData('ifb_ifr',e);
                    console.log(d);
                return "--";
                })
            },
            init_instance_callback : function(editor) {
                console.log("Editor: " + editor.id + " is now initialized.");
            }
        });


        function getSel(w)
        {
            return w.getSelection ? w.getSelection() : w.document.selection;
        }
        function setRange(sel,r)
        {
            sel.removeAllRanges();
            sel.addRange(r);
        }
        function filterPasteData(originalText)
        {
            return 'wwwwwwwwwwwwww';
            var newText=originalText;
//do something to filter unnecessary data
            return newText;
        }
        function block(e)
        {
            e.preventDefault();
        }
        var w,or,divTemp,originText;
        var newData;
        function pasteClipboardData(editorId,e)
        {
            var objEditor = document.getElementById(editorId);
            var edDoc=objEditor.contentWindow.document;
            if(isIE)
            {

            }else
            {
                enableKeyDown=false;
//create the temporary html editor
                var divTemp=edDoc.createElement("DIV");
                divTemp.id='htmleditor_tempdiv';
                divTemp.innerHTML='\uFEFF';
                divTemp.style.left="-10000px"; //hide the div
                divTemp.style.height="1px";
                divTemp.style.width="1px";
                divTemp.style.position="absolute";
                divTemp.style.overflow="hidden";
                edDoc.body.appendChild(divTemp);
//disable keyup,keypress, mousedown and keydown
                objEditor.contentWindow.document.addEventListener("mousedown",block,false);
                objEditor.contentWindow.document.addEventListener("keydown",block,false);
                enableKeyDown=false;
//get current selection;
                w=objEditor.contentWindow;
                or=getSel(w).getRangeAt(0);
//move the cursor to into the div
                var docBody=divTemp.firstChild;
                rng = edDoc.createRange();
                rng.setStart(docBody, 0);
                rng.setEnd(docBody, 1);
                setRange(getSel(w),rng);
                originText=objEditor.contentWindow.document.body.textContent;
                if(originText==='\uFEFF')
                {
                    originText="+++++";
                }
                window.setTimeout(function()
                {
//get and filter the data after onpaste is done
                    if(divTemp.innerHTML==='\uFEFF')
                    {
                        newData="-----------------------";
                        edDoc.body.removeChild(divTemp);
                        return;
                    }
                    newData=divTemp.innerHTML;
// Restore the old selection
                    if (or)
                    {
                        setRange(getSel(w),or);
                    }
                    newData=filterPasteData(newData);
                    divTemp.innerHTML=newData;
//paste the new data to the editor
                    objEditor.contentWindow.document.execCommand('inserthtml', false, newData );
                    //edDoc.body.removeChild(divTemp);
                },0);
//enable keydown,keyup,keypress, mousedown;
                enableKeyDown=true;
                objEditor.contentWindow.document.removeEventListener("mousedown",block,false);
                objEditor.contentWindow.document.removeEventListener("keydown",block,false);
                return true;
            }
        }



    })




})()