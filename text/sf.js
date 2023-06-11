window.onload = function() { 
    // 页面启动加载
    setInterval(change,1000)
    // 周期
  }
  var count=1;
  function change() {
    var img = document.getElementById("fnimg01");
    // 根据id寻找对象
    img.src="./fnimg/"+count+".jpg"
    count++
    if (count>5){
      count = 1
      //返回第一张图片
    }
  }
  