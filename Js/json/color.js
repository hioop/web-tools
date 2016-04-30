// 这里需要制表符来表示空格，而不是用CSS的magin-left属性
// 这是为了确保直接复制和粘贴时的格式(译注：若用margin-left会导致复制时复制不到空白)。
window.TAB = "  ";

function IsArray(obj) {
  return obj &&
          typeof obj === 'object' &&
          typeof obj.length === 'number' &&
          !(obj.propertyIsEnumerable('length'));
}

//json着色工具函数
function Process(){

  var json = document.getElementById("json_input").value;
     document.getElementById("Canvas").style.display="block";
  var html = "";
//  var closeX ='<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>';
  try{

    if(json == "") json = "\"\"";
    var obj = eval("["+json+"]");
    html = ProcessObject(obj[0], 0, false, false, false);
    document.getElementById("Canvas").innerHTML =  "<PRE class='CodeContainer'>"+html+"</PRE>";
  }catch(e){
    alert("JSON语法错误,不能格式化,错误信息:\n"+e.message);
    document.getElementById("Canvas").innerHTML = "";
  }
}

function ProcessObject(obj, indent, addComma, isArray, isPropertyContent){
  var html = "";
  var comma = (addComma) ? "<span class='Comma'>,</span> " : "";
  var type = typeof obj;

  if(IsArray(obj)){
    if(obj.length == 0){
      html += GetRow(indent, "<span class='ArrayBrace'>[ ]</span>"+comma, isPropertyContent);
    }else{
      html += GetRow(indent, "<span class='ArrayBrace'>[</span>", isPropertyContent);
      for(var i = 0; i < obj.length; i++){
        html += ProcessObject(obj[i], indent + 1, i < (obj.length - 1), true, false);
      }
      html += GetRow(indent, "<span class='ArrayBrace'>]</span>"+comma);
    }

  }else if(type == 'object' && obj == null){
      
    html += FormatLiteral("null", "", comma, indent, isArray, "Null");
    
  }else if(type == 'object'){
      
    var numProps = 0;
    for(var prop in obj) numProps++;
    if(numProps == 0){
      html += GetRow(indent, "<span class='ObjectBrace'>{ }</span>"+comma, isPropertyContent);
      
    }else{

      html += GetRow(indent, "<span class='ObjectBrace'>{</span>", isPropertyContent);
      var j = 0;

      for(var prop in obj){
        html += GetRow(indent + 1, '<span class="PropertyName">"'+prop+'"</span>: '+ProcessObject(obj[prop], indent + 1, ++j < numProps, false, true));
      }

      html += GetRow(indent, "<span class='ObjectBrace'>}</span>"+comma);

    }

  }else if(type == 'number'){

    html += FormatLiteral(obj, "", comma, indent, isArray, "Number");

  }else if(type == 'boolean'){

    html += FormatLiteral(obj, "", comma, indent, isArray, "Boolean");

  }else if(type == 'function'){

    obj = FormatFunction(indent, obj);
    html += FormatLiteral(obj, "", comma, indent, isArray, "Function");

  }else if(type == 'undefined'){

    html += FormatLiteral("undefined", "", comma, indent, isArray, "Null");

  }else{

    html += FormatLiteral(obj, "\"", comma, indent, isArray, "String");

  }

  return html;

}

function FormatLiteral(literal, quote, comma, indent, isArray, style){

  if(typeof literal == 'string')

    literal = literal.split("<").join("&lt;").split(">").join("&gt;");

  var str = "<span class='"+style+"'>"+quote+literal+quote+comma+"</span>";

  if(isArray) str = GetRow(indent, str);

  return str;

}

function FormatFunction(indent, obj){

  var tabs = "";

  for(var i = 0; i < indent; i++) tabs += window.TAB;

  var funcStrArray = obj.toString().split("\n");

  var str = "";

  for(var i = 0; i < funcStrArray.length; i++){

    str += ((i==0)?"":tabs) + funcStrArray[i] + "\n";
  }
  return str;
}

function GetRow(indent, data, isPropertyContent){

  var tabs = "";

  for(var i = 0; i < indent && !isPropertyContent; i++) tabs += window.TAB;

  if(data != null && data.length > 0 && data.charAt(data.length-1) != "\n")

    data = data+"\n";

  return tabs+data;                      

}

function givemeajson(){
    var egJson ={
            "website": "http://tool.hioop.net", 
            "description": "一些好用的web 开发者工具 !", 
            "unix时间戳转换": "http://tool.hioop.net/index/time", 
            "json格式验证": "http://tool.hioop.net/index/json", 
            "迷宫游戏": "http://tool.hioop.net/index/maze", 
            "html转MarkDown": "http://tool.hioop.net/index/json", 
            "more": "......"
          }; 
 
}



  
//1:压缩 2:转义  3:压缩转义 4:去除转义
    function compressJson(ii) {
        var txtA = document.getElementById("json_input");
        var text = txtA.value;
        if (ii == 1 || ii == 3) {
            text = text.split("\n").join(" ");
            var t = [];
            var inString = false;
            for (var i = 0, len = text.length; i < len; i++) {
                var c = text.charAt(i);
                if (inString && c === inString) {
                    if (text.charAt(i - 1) !== '\\') {
                        inString = false;
                    }
                } else if (!inString && (c === '"' || c === "'")) {
                    inString = c;
                } else if (!inString && (c === ' ' || c === "\t")) {
                    c = '';
                }
                t.push(c);
            }
            text = t.join('');
        }
        if (ii == 2 || ii == 3) {
            text = text.replace(/\\/g, "\\\\").replace(/\"/g, "\\\"");
        }
        if (ii == 4) {
            text = text.replace(/\\\\/g, "\\").replace(/\\\"/g, '\"');
        }
        txtA.value = text;
        
    }

    String.prototype.trim = function() {
        return this.replace(/(^\s*)|(\s*$)/g, '');
    }

    var GB2312UnicodeConverter = {
        ToUnicode: function(str) {
            var txt = escape(str).toLocaleLowerCase().replace(/%u/gi, '\\u');
            //var txt= escape(str).replace(/([%3F]+)/gi,'\\u');
            return txt.replace(/%7b/gi, '{').replace(/%7d/gi, '}').replace(/%3a/gi, ':').replace(/%2c/gi, ',').replace(/%27/gi, '\'').replace(/%22/gi, '"').replace(/%5b/gi, '[').replace(/%5d/gi, ']').replace(/%3D/gi, '=').replace(/%20/gi, ' ').replace(/%3E/gi, '>').replace(/%3C/gi, '<').replace(/%3F/gi, '?');//
        }
        , ToGB2312: function(str) {
            return unescape(str.replace(/\\u/gi, '%u'));
        }
    };

//Unicode转中文函数
    function u2h() {
        var txtA = document.getElementById("json_input");
        var text = txtA.value;
        text = text.trim();
        // text = text.replace(/\u/g,"");
        txtA.value = GB2312UnicodeConverter.ToGB2312(text);
    }

//中文转Unicode函数
    function h2u() {
        var txtA = document.getElementById("json_input");
        var text = txtA.value;
        text = text.trim();
        // text = text.replace(/\u/g,"");
        txtA.value = GB2312UnicodeConverter.ToUnicode(text);
    }

    //中文符号转英文符号函数
    function cnChar2EnChar() {
        var txtA = document.getElementById("json_input");
        var str = txtA.value;
        str = str.replace(/\’|\‘/g, "'").replace(/\“|\”/g, "\"");
        str = str.replace(/\【/g, "[").replace(/\】/g, "]").replace(/\｛/g, "{").replace(/\｝/g, "}");
        str = str.replace(/，/g, ",").replace(/：/g, ":");
        txtA.value = str;
    }