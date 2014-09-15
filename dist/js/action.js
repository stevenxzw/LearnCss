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

    $(function(){

        console.log('init');
        new AutoInput({view : $('#ableDiv')});

    })


})()