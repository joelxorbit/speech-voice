<%@ page contentType="text/html; charset=iso-8859-1" language="java" import="java.sql.*" errorPage="" %>
<%@ include file="../include/dbconnect.jsp" %>
<%
String uname=request.getParameter("uname");
String pid=request.getParameter("pid");
String key=request.getParameter("key");

ResultSet rs=stmt.executeQuery("select * from payment where uname='"+uname+"' && id="+pid+"");
rs.next();
String sec=rs.getString("secret");
	if(key.equals(sec))
	{
	stmt.executeUpdate("update payment set status='1' where uname='"+uname+"' && id="+pid+"");
	out.print("success");
	}
	else
	{
	out.print("fail");
	}

%>