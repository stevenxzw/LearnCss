/**
 * Created by zhiwen on 14-9-15.
 */
(function(){

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

        init : function(){

            var cursor = 0;// 光标位置

            document.onselectionchange = function() {
                var range = document.selection.createRange();
                var srcele = range.parentElement();
                var copy = document.body.createTextRange();
                copy.moveToElementText(srcele);

                for (cursor = 0; copy.compareEndPoints("StartToStart", range) < 0; cursor++) {
                    copy.moveStart("character", 1);
                }
            }
                var that = this;
            this.input = this.input || this.view;
            $(this.input).on('keyup', function(e){
                clearTimeout(that.timer);
                that.timer = setTimeout(function(){that.get.call(that)}, that.delay);
            })
        },

        getVal : function(){

          return this.input.text();
        },

        get : function(){
            console.log(this.getVal());
            
        }

    }

    $(function(){

        console.log('init');
        new AutoInput({view : $('#ableDiv')});

    })


})()