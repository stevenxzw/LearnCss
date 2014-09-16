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
             choosedMax : 1,
             floatCs : 'chooseFloat',
             choosedCs : 'choosed',
             timer : null,
             choosed : '<span id="{.id}">{.text} <span class="del">X</span></span>',
             itemTemp : '<li rel="{.id}"><a href="#">{.text}</a></li>',
             floatTemp : '<ul class="chooseFloat">{.lis}</ul>'
         }, opt);
         this.init();
    }

    AutoInput.prototype = {

        couser : null,
        cache : {},

        init : function(){

            var that = this;
            this.input = this.input || this.view;
            //this.couser = new cursorControl(this.input[0]);
            $(this.input).on('keyup click', function(e){
                clearTimeout(that.timer);
                that.timer = setTimeout(function(){that.get.call(that,e)}, that.delay);
            });
            $('body').on('click', function(e){
                if($(e.target).closest(that.view).length === 0 || $(e.target).has(that.input).length){
                    that.removeFloat();
                }
            });
            this.view.on('click', '.'+this.floatCs+' li', function(e){
                e.preventDefault();
                //console.log($(this).text());
                that.afterChoosed($(this));
                that.removeFloat();
            });

            this.view.on('click', '.'+this.choosedCs+' .del', function(e){
                $(this).parent().remove();
            })
        },

        afterChoosed : function(dom){
            var text = dom.text(), id = dom.attr('rel');
            this.createChoosed(id, text);
            this.clearInput('');
        },

        clearInput : function(v){
            this.setVal(v);
        },

        removeFloat : function(){
            this.view.find('.'+this.floatCs).remove();
        },

        getVal : function(){
            if(this.input.attr('type') === 'text' || this.input.attr('type') === 'textarea')
                return $.trim(this.input.val());
            else
                return $.trim(this.input.text());
        },

        setVal : function(v){
            if(this.input.attr('type') === 'text' || this.input.attr('type') === 'textarea')
                this.input.val(v);
            else
                this.input.text(v);
        },

        get : function(e){
            var v = this.getVal();
            console.log(v);
            this.input.focus();
            //console.log(this.couser.getStart());
            if(v)
                this.getByAjax(v);
        },

        getByAjax : function(str){
            var data = this.cache[str];
            if(!data) //ajax
                data = this.cache[str] = [{'id':'1',text:"小学"}, {'id':2,text:'中学'}, {'id':3,text:'大学'}];
            this.reader(data);
        },

        reader : function(data){
            var lis = [], that = this;
            $.each(data, function(i, item){
                lis.push(that.parse(that.itemTemp, item));
            });
            var ul = that.parse(that.floatTemp, {lis:lis.join('')});
            this.removeFloat();
            this.view.append(ul);
            this.view.find('.'+this.floatCs).css({'top':this.input.offset().top-15});
            console.log(ul);
        },

        createChoosed : function(id, text){
            var cd = this.view.find('.'+this.choosedCs);
            if(this.choosedMax === 1){
                cd.html(this.parse(this.choosed, {id:id, text:text})).show();
            }else if(cd.children().length < this.choosedMax){
                cd.append(this.parse(this.choosed, {id:id, text:text})).show();
            }
        },

        parse : function(htmls, map){
            var tplReg =  /\{(\.?[\w_|$]+)(\.[\w_$]+)?\}/g;
            return htmls.replace(tplReg, function(s, k , k1){
                var v, modfs, k_str, key;

                if (k.charCodeAt(0) === 46)  {
                    k_str = k.substr(1);
                    modfs = k_str.split('|');
                    key = modfs.shift();
                    v = map[key];
                }
                return v;
            });
        }

    }

    $(function(){

        console.log('init');
        new AutoInput({view : $('.inputPanel').eq(0), input : $('#ableDiv')});

    })


})()