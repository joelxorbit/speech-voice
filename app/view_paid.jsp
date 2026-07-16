<%@ page contentType="text/html; charset=iso-8859-1" language="java" import="java.sql.*" errorPage="" %>
<%@ include file="../include/dbconnect.jsp" %>
<%
String msg="";

try
{
String uname=request.getParameter("uname");

	
		String qry="select * from payment where uname='"+uname+"'";
		ResultSet rs=stmt.executeQuery(qry);
			while(rs.next())
			{
			out.print(rs.getString("vno")+"|"rs.getString("vtype")+"|"+rs.getString("source")+"|"+rs.getString("destination")+"|"+rs.getString("amount")+"#");
			}
			
}
catch(Exception e)
{

}


%>