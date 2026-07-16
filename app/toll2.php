<%@ page contentType="text/html; charset=iso-8859-1" language="java" import="java.sql.*" errorPage="" %>
<%@ include file="../include/dbconnect.jsp" %>
<%
String msg="";
Statement stmt2=Con.createStatement();
try
{
String src="",dest="",vtype="";
String amount=request.getParameter("amount");
String vid=request.getParameter("vid");
String vno=request.getParameter("vno");
int amt=Integer.parseInt(amount);	

	int n=stmt.executeUpdate("update payment set amount=amount+"+amt+" where id="+vid+"");
			if(n==1)
			{
			out.print("success");
			}
}
catch(Exception e)
{

}

%>