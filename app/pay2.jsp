<%@ page contentType="text/html; charset=iso-8859-1" language="java" import="java.sql.*" errorPage="" %>
<%@ include file="../include/dbconnect.jsp" %>
<%
String msg="";
Statement stmt2=Con.createStatement();
Statement stmt3=Con.createStatement();

String uname=request.getParameter("uname");
String tway=request.getParameter("tway");
String src=request.getParameter("src");
String dest=request.getParameter("dest");
String vno=request.getParameter("vno");


ResultSet rs2=stmt2.executeQuery("select * from register where uname='"+uname+"'");
rs2.next();
String card=rs2.getString("cardno");

ResultSet rs3=stmt3.executeQuery("select * from vehicle_det where uname='"+uname+"' && vno='"+vno+"'");
rs3.next();
String vtype=rs3.getString("vtype");

try
{


int amt=0;	
		String qry="select * from toll_details where source='"+src+"' && destination='"+dest+"' && vtype='"+vtype+"'";
		
		ResultSet rs=stmt.executeQuery(qry);
			while(rs.next())
			{
			amt+=rs.getInt("amount");
			
			
			}
			
		int tt=Integer.parseInt(tway);	
		int total=amt*tt;

		
		out.print(card+"#"+src+"#"+dest+"#"+vno+"#"+vtype+"#"+tway+"#"+total);	
			
			
}
catch(Exception e)
{

}


%>