var Util = (function(){
    var dw = function(_info){
        var div = document.createElement('div');
        div.innerHTML = _info + '</br>';
        document.body.appendChild(div);
        //document.write(_info+'</br>')
    }
    return {
        dw:dw
    }
})();	