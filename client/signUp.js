var checkedEmail;
var checkedPassword;
var checkedPassword2;
var checkedNick;
$(document).ready(function(){
	$("#member_PWD").keyup(function(){
		var pwd = $("#member_PWD").val();
		if(pwd.length >= 8) {
			switch(isPWD(pwd)) {
			case 'pwdHighLV':
				$("#password_alert").html(" 보안 높음.");
				$("#password_alert").css({"color":"green"});
				checkedPassword2 = true;
				break;
			case 'pwdMidLV':
				$("#password_alert").html(" 보안 중간.");
				$("#password_alert").css({"color":"yellow"});
				checkedPassword2 = true;
				break;
			case 'pwdLowLV':
				$("#password_alert").html(" 보안 낮음.");
				$("#password_alert").css({"color":"red"});
				checkedPassword2 = true;
				break;
			case 'pwdFailed':
				$("#password_alert").html(" 1한글 및 \$ \; \& \| \% \' \" \= \# ? ＼. 사용 불가");
				$("#password_alert").css({"color":"black"});
				checkedPassword2 = false;
				break;
			case 'pwdRefuse':
				$("#password_alert").html(" 2가지 이상 조합1");
				$("#password_alert").css({"color":"black"});
				checkedPassword2 = false;
				break;
			}
		} else if(isPWD(pwd) == "pwdFailed"){
			$("#password_alert").html(" 2한글 및 \$ \; \& \| \% \' \" \= \# ? ＼. 사용 불가");
			$("#password_alert").css({"color":"black"});
			checkedPassword2 = false;
		} else if(isPWD(pwd) == "pwdRefuse"){
			$("#password_alert").html(" 2가지 이상 조합해주세요");
			$("#password_alert").css({"color":"black"});
			checkedPassword2 = false;
		} else if(pwd.length == 0){
			$("#password_alert").html("");
			$("#password_alert").css({"color":"black"});
			checkedPassword2 = false;
		} else if(isPWD(pwd) == "pwdTooShort"){
			$("#password_alert").html(" 8자 이상 써주세요.");
			$("#password_alert").css({"color":"black"});
			checkedPassword2 = false;
		} else if(isPWD(pwd) =="pwdTooShortandRefuse") {
			$("#password_alert").html(" 8자 이상 2가지 이상 조합해주세요");
			$("#password_alert").css({"color":"black"});
			checkedPassword2 = false;
		}
	});
	$("#check_member_PWD").keyup(function(){
		var pw1 = $("#member_PWD").val();
		var pw2 = $("#check_member_PWD").val();
		if(pw1.length >= 1) {
			if(pw1 != pw2) {
				$("#check_PWD_msg").html("비번호가 일치하지 않습니다.");
				checkedPassword = false;
			} else {
				$("#check_PWD_msg").html("비번호가 일치합니다.");
				checkedPassword = true;
			}
		} else {
			$("#check_PWD_msg").html("");
		}
	});
});
$("#submitMember").click(function(event){
	var memberData = {
		userId: $("#member_ID").val(),
		userPwd: $("#member_PWD").val(),
		userName: $("#member_Name").val(),
	}
	ajaxSignup(memberData);
});
// 이메일 유효성
function isEmail(email) {
	var regex=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;   
	if(regex.test(email) === false) {
		return false;  
	} else {
		return true;
	}
}
// 닉네임 유효성
function isNick(nick) {
	var regex = /[\s\{\}\[\]\/?.,;:|\)*~`!^\+<>@\#$%&\'\"\\\(\=]/gi;
	if(regex.test(nick) === false){
		return true;
	} else {
		return false;
	}
}
// \w 알파벳+숫자+언더바 
// 패스워드 유효성
function isPWD(pwd) {
	var pwdLowLV_checker = 
		/^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*\d))|((?=.*[a-z])(?=.*[\s\{\}\[\]\/.,:\)*~`!^\+<>@\(\-\_]))|((?=.*[A-Z])(?=.*\d))|((?=.*[A-Z])(?=.*[\s\{\}\[\]\/.,:\)*~`!^\+<>@\(\-\_]))|((?=.*\d)(?=.*[\s\{\}\[\]\/.,:\)*~`!^\+<>@\(\-\_])))/;
	var pwdMidLV_checker =
		/^(((?=.*[a-z])(?=.*[A-Z])(?=.*\d))|((?=.*[a-z])(?=.*[A-Z])(?=.*[\s\{\}\[\]\/.,:\)*~`!^\+<>@\(\-\_]))|((?=.*[A-Z])(?=.*\d)(?=.*[\s\{\}\[\]\/.,:\)*~`!^\+<>@\(\-\_]))|((?=.*[a-z])(?=.*\d)(?=.*[\s\{\}\[\]\/.,:\)*~`!^\+<>@\(\-\_])))/;
	var pwdHighLV_checker =
		/^((?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\s\{\}\[\]\/.,:\)*~`!^\+<>@\(\-\_]))/;
	var exceptions = /[\#\$\;\&\|\%\'\"\=\?\\]/;
	var regexK = /^(?=.*[ㄱ-ㅎ|ㅏ-ㅣ|가-힣])/;
	if(!exceptions.test(pwd) && !regexK.test(pwd)) {
		if(pwd.length > 7 && pwdHighLV_checker.test(pwd)){
			return "pwdHighLV";
		} else if(pwd.length > 7 && pwdMidLV_checker.test(pwd)){
			return "pwdMidLV";
		} else if(pwd.length > 7 && pwdLowLV_checker.test(pwd)) {
			return "pwdLowLV";
		} else if(pwd.length < 8){
			if(!pwdHighLV_checker.test(pwd)&&!pwdMidLV_checker.test(pwd)&&!pwdLowLV_checker.test(pwd)) {
				return "pwdTooShortandRefuse";
			} else {
				return "pwdTooShort";
			}
		} else {
			return "pwdRefuse";
		}
	} else {
		return "pwdFailed";
	}
}
function ajaxSignup(params) {
	$.ajax({
		url:"http://localhost:3000/signUp_User",
		type: "POST",
		dataType: "json",
		data: params,
		success: function (obj) {
			if (obj.state != "success") {
//				||checkedEmail!=true||checkedPassword!=true||checkedPassword2!=true) {
				alert("가입실패 하였습니다. 정확히 입력 후 재시도 해주세요")
				return
			}
			alert("축하합니다 가입되었습니다.<br>로그인페이지로 이동합니다.")
			location.href = "/signIn"
		}
	});
}

