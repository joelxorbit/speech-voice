<%@ page contentType="text/html; charset=iso-8859-1" language="java" import="java.sql.*" errorPage="" %>
<%@ include file="../include/dbconnect.jsp" %>
<%
String msg="";
Statement stmt2=Con.createStatement();
try
{
String src="",dest="",vtype="";
String location=request.getParameter("location");
String vno=request.getParameter("vno");
int amount=0;	
		String qry="select * from payment where vno='"+vno+"' order by id desc";
		ResultSet rs=stmt.executeQuery(qry);
			if(rs.next())
			{
			src=rs.getString("source");
			dest=rs.getString("destination");
			ResultSet rs2=stmt2.executeQuery("select * from toll_details where source='"+src+"' && destination='"+dest+"' && tname='"+location+"'");
				if(rs2.next())
				{
				vid=rs2.getString("id");
				amount=rs2.getInt("amount");
				}
			}
			
			out.print(vno+"#"+vid+"#"+amount);
			
}
catch(Exception e)
{

}

%>