function ajaxMain() {
	$.ajax({
	    url:"http://localhost:3000/sessionInfo",
	    type:"GET",
	    dataType:"json",
	    success: function(obj) {
    	  console.log(obj.userid);
	      console.log(obj.userName);
	      var userid = obj.userid;
	      var userName = obj.userName;
	      $("#userName").html(userName);
	    }
	});
}