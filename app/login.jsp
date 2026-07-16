<%@ page contentType="text/html; charset=iso-8859-1" language="java" import="java.sql.*" errorPage="" %>
<%@ include file="../include/dbconnect.jsp" %>
<%
String msg="";

try
{
String un=request.getParameter("uname");
String pw=request.getParameter("pass");
	
		String qry="select * from register where uname='"+un+"' && pass='"+pw+"'";
		ResultSet rs=stmt.executeQuery(qry);
			if(rs.next())
			{
			out.print("success");
			}
			else
			{
			out.print("fail");
			}

}
catch(Exception e)
{

}


%>