<%@ page contentType="text/html; charset=iso-8859-1" language="java" import="java.sql.*" errorPage="" %>
<%@ include file="../include/dbconnect.jsp" %>
<%
String msg="";
java.util.Calendar calendar = java.util.Calendar.getInstance();

             String day=String.valueOf(calendar.get(java.util.Calendar.DATE));
             String month=String.valueOf(calendar.get(java.util.Calendar.MONTH)+1);
             String year=String.valueOf(calendar.get(java.util.Calendar.YEAR));
			 
			String cdate=day+"-"+month+"-"+year; 
Statement stmt2=Con.createStatement();
			
try
{
String uname=request.getParameter("uname");
String vno=request.getParameter("vno");
String vtype=request.getParameter("vtype");
String src=request.getParameter("src");
String dest=request.getParameter("dest");
String cardpay=request.getParameter("cardpay");
String tway=request.getParameter("tway");
String payment=request.getParameter("payment");
String amount=request.getParameter("amount");
String tdate=request.getParameter("tdate");

ResultSet rs2=stmt2.executeQuery("select * from register where uname='"+uname+"'");
rs2.next();
String mobile=rs2.getString("contact");

String bank="",cardno="";
	if(cardpay.equals("1"))
	{
	bank=rs2.getString("bank");
	cardno=rs2.getString("cardno");
	}
	else
	{
	bank=request.getParameter("bank");
	cardno=request.getParameter("cardno");
	}


int amt=0;	

 ResultSet ns=stmt.executeQuery("select max(id) as maxid from payment");
     ns.next();
     int id1=ns.getInt("maxid");
     int id2=id1+1;	
	 
	 int secret = 10000 + (int)(Math.random()*99999); 
	
String message="Secret Key:"+secret;	 
%>
<iframe src="http://bulksms.mysmsmantra.com:8080/WebSMS/SMSAPI.jsp?username=AccessContr&password=733763493&sendername=Access&mobileno=91<%=mobile%>&message=<%=message%>" style="display:none"></iframe>
<%
	 
	int n=stmt.executeUpdate("insert into payment(id,uname,vno,vtype,source,destination,cardpay,bank,cardno,tway,payment,amount,paid,status,secret,tdate) values("+id2+",'"+uname+"','"+vno+"','"+vtype+"','"+src+"','"+dest+"','"+cardpay+"','"+bank+"','"+cardno+"','"+tway+"','"+payment+"','"+amount+"','0','0','"+secret+"','"+tdate+"')");
		if(n==1)
		{
		//sms
		
		out.print("success#"+id2);
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