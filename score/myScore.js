//用indexDB xiao wang
//1.初始化
var db = null;
// 设置变量初始值
var request, objStore1;
// 请求 系统商场
var DBName = "myScore", DBVersion = 1;
// 数据库名 版本号
var scoreLists = [
    { people: "杜荣凯", subject: "web前端开发技术",  sid: "2206010901" },
    { people: "陈光锐", subject: "web前端开发技术",  sid: "2206010929" },
    { people: "李宇成", subject: "web前端开发技术",  sid: "2206010930" },
    { people: "王子轩", subject: "web前端开发技术",  sid: "2206010931" }
];
// 初始
//2.浏览器支持判断
var indexedDB = window.indexedDB || window.mozIndexedDB 	|| window.msIndexedDB 	|| window.webkitIndexedDB; 	 	//IE
function createDB(dbName, dbVersion) {
    //名称 版本号
    request = indexedDB.open(dbName, dbVersion);
    //将IDBOpenDB Request对象赋值给变量request，以便在后续的代码中使用
    request.onerror = function(event) {
        alert("打开数据库失败:" + event.target.errorCode);
        //警告弹窗
        console.log("打开数据库失败:" + event.target.errorCode);
        //在控制台输出一个错误信息，告知用户打开数据库失败，并给出失败的具体原因。////
    }
    //显示错误消息 不要忘记发生错误。};//确认成功连接到数据库 检查是否选择了“同步”版本
    request.onsuccess = function(event){
        //本质是将IDBOpenDB 对象赋值
        alert("打开数据库成功");
        db = event.target.result; //将DB对象存储在变量db中。 
        var trans1 = db.transaction(["scores"], "readwrite"); //创建一个事件对象transl
        objStore1 = trans1.objectStore("scores"); //创建一个scores仓库
    }
    request.onupgradeneeded = function(event){ //创建库存储并发送事件aevience 创建indexedDB
        alert("版本变化!" + "版本号为" + event.newVersion);
        console.log("版本变化!" + event.newVersion);
        db = event.target.result; //数据库打开结果给db

        if (!db.objectStoreNames.contains("scores")) {
            //不存在时操作
            objStore1 = db.createObjectStore("scores", { keyPath: "sid" });

            objStore1.createindex("by_people", 'people', { unique: false });
            objStore1.createindex("by_subject", 'subject', { unique: false });
            objStore1.createindex("by_score", 'score', { unique: true });
            objStore1.createindex("by_sid", 'sid', { unique: true });
            //唯一
        }
        loadScore();
        window.location.reload();
        window.location.hash = "#list";
        $("scorelist").value = "";

    }

}

createDB(DBName,DBVersion);
function $(id) {
    return document.getElementById(id); //returns the element with the given id.
}

function loadScore() {
    $("scorelist").innerHTML = "";
    alert("开始装载信息...");
    var trans = db.transaction("scores", "readwrite");
    var objStore1 = trans.objectStore("scores");
    for (var i = 0; i < scoreLists.length; i++) {
        var request = objStore1.put(scoreLists[i]);
        request.onerror = function() {
            console.error('数据库中已有该对象，不能重复添加！!');
        };
        request.onsuccess = function () {
            console.log('对象已成功存入对象仓库中！');
        };

    }
}

function showScore() {

    var query = document.forms.list.query.value;
    $("scorelist").value = "" ;//清空输出页面上的内容 。。。。。。。。。。。。。。。。。。。    
    var transaction = db.transaction(["scores"], "readonly");

    var objStore = transaction.objectStore("scores");

    var index = objStore.index("by_people");
    var range = IDBKeyRange.bound(query, query+"z");

    var result = (query.length > 0) ? index.openCursor(range) : index.openCursor();
    var i = 1;
    result.onsuccess = function(e){
        //索引游标
        var cursor = e.target.result;
        if(cursor){
            text1 = i + "-" + cursor.value.people + "," + cursor.value.subject + "," + cursor.value.score + "," + cursor.value.sid;
            $("scorelist").value += text1 + "\n"
            cursor.continue();
            i++;
            //下移游标 
        }
        else {
            console.log("没有检索到对象");
            //可替代
        }
    };
    result.onerror = function(e) {console.log("检索失败！")};
}
function addScore() {
    //添加 score 
    var people = document.forms.add.people.value;
    var subject = document.forms.add.subject.value;
    var score = document.forms.add.score.value;
    var sid = document.forms.add.sid.value;
    var onescore = {
        people: people,
        subject: subject,
        score: score,
        sid: sid
    };
    //这样就创建了一个名为 onescore 的对象，它包含了这个人的名字、所属科目、成绩和唯一标识符
    if (people.length > 0 && subject.length > 0 && score.length > 0 && sid.length > 0) {
        var trans2 = db.transaction("scores", "readwrite");
        var objStore2 = trans2.objectStore("scores");
        var request1 = objStore2.add(onescore);
        //创建一个写入数据库的行动态行为对象
        trans2.oncomplete = function(event) {
            //trans2事件完成 触发function(event)
            alert("成功添加！");
            document.forms.add.people.value = "";
            document.forms.add.subject.value = "";
            document.forms.add.score.value = "";
            document.forms.add.sid.value = "";  //重置id 或 按钮点击后重置 或 按钮
            window.location.reload();  //刷新当前文档
        };
    }
}
function deleteDatabase() {
    //百度：deleteDatabase() 函数用于删除数据库中的一个名为 onescore 的行动态对象。 如果没有对应的行动态对象，则不可删除数据库。 如果删除行动态对象和数据库中的一个对象相关联，则会发生状态异常。 删除数据库时，只有在数据库不存在时才执行删除操作。 删除行动态对象和数据库中
    if (indexedDB) {

        var deleteDB = indexedDB.deleteDatabase("scores");
        deleteDB.onsuccess = function(e) {
            alert("数据库删除成功,即将初始化");
            window.location.reload();
        }
    }
}
function deleteAllScores() {
    var trans1 = db.transaction("scores", "readwrite");
    var objStore1 = trans1.objectStore("scores");
    objStore1.clear();
    trans1.oncomplete = function(e) {
        alert("信息删除成功");
    }   //alert("数据库删除成功"; 
    trans1.onerror = function(e) {
        alert("信息删除出现异常");
    }
    window.location.reload();
}

//最关键的一步 section随导航切换
window.addEventListener('hashchange', function(){
    //锚点
    switch (location.hash) {
        case "#add":
            //页面加载完成后，页面顶部显示 "loading..." 动画效果 （不要再次加载页面时显示） 
            document.body.className = "add";
            break;
        //跳过页面加载完成后的页面顶部动画效果 不要再次加载页面时
        case "#setting":
            document.body.className = "setting";
            break;
        default:
            document.body.className = "list";
    }
}, false);
