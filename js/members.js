/**
	@file	: members.js
	@author	: Niclas Frohagen	
	@date	: 050213	
*/

var MEMBERS_XMLRoot = null;

function GetDocTypeScript()
{
	return '<!doctype html public \"-//W3C//DTD HTML 4.0 Transitional//EN\">';
}

function GetHeadScript()
{
	var html = '<head>';
	html += '<link href=\"css/style.css\" type=\"text/css\" rel=\"StyleSheet\">';
	html += '<script language=\"javascript\" src=\"js/members.js\"></script>';
	html += '</head>';
	
	return html;
}

function GetBodyScript()
{
	return '<body onLoad=\"MEMBERS_Create()\">';
}

function GetTitleScript()
{
	var html = '<p class=\"Title\">biography</p>';
	html += '<p class=\"SubTitle\">members</p>';
	
	return html;
}

function GetContainerScript()
{
	var html = '<div id=\"Container\">';
	html += '<div id=\"Content\">';
	
	return html;
}

function GetCloseWindowScript()
{
	var html = "<div class=\"Close\">";
	html += "<a href=\"bio_members.html\">";
	html += "<img src=\"pictures/icon_close.jpg\" border=\"0\">";
	html += "</a>";
	html += "</div>";
	
	return html;
}

function MEMBERS_Create()
{
	MEMBERS_Init();
	MEMBERS_Show();
}

function MEMBERS_Init()
{
	if (window.XMLHttpRequest) // Firefox, Mozilla, Opera, etc.
	{
		xml_http_request = new window.XMLHttpRequest();
    }
	else // IE
	{
		xml_http_request = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	try
	{
		xml_http_request.open("GET", "xml/members.xml", false);
		xml_http_request.send(null);
		MEMBERS_XMLRoot = xml_http_request.responseXML.documentElement;
	}
	catch (e)
	{
		alert(e);
	}
}

function MEMBERS_Show()
{
	if (MEMBERS_XMLRoot)
	{
		var str = "";
		var index = window.location.href.indexOf("?");
		if(index != -1)
		{
			str = window.location.href.substr(index + 1);
			var values = str.split("=");
			if(values.length > 1)
				MEMBERS_ShowMember(values[1]);
		}
		else
		{
			MEMBERS_ShowList();
		}
	}
}

function MEMBERS_ShowList()
{
	var html_current	= "";
	var html_past		= "";
	var html_session	= "";
	
	var member_nodes = MEMBERS_XMLRoot.getElementsByTagName("member");	
	for(i = 0; i < member_nodes.length; i++)
	{
		var type = member_nodes[i].getAttribute("type");
		if(type.length)
		{
			var str = "<tr><td width=\"150\">";
			
			var profile_nodes = member_nodes.item(i).getElementsByTagName("profile");
			if(profile_nodes.length)
			{
				str += "<a href=\"bio_members.html?id=" + i + "\">";
			}
			
			str += member_nodes[i].getAttribute("name");
			
			if(profile_nodes.length)
				str += "</a>";
			
			str += "</td><td width=\"250\">";
			
			var instrument_nodes = member_nodes[i].getElementsByTagName("role");
			for(instr_id = 0; instr_id < instrument_nodes.length; instr_id++)
			{
				if(instr_id > 0)
					str += ", ";
				
				str += instrument_nodes[instr_id].getAttribute("name");
			}
			
			str += "</td><td width=\"100\">";
			
			if(member_nodes.item(i).getAttribute("begin") != null)
			{
				str += member_nodes.item(i).getAttribute("begin") + " - ";
				if(member_nodes.item(i).getAttribute("end") != null)
					str += member_nodes.item(i).getAttribute("end");
			}
						
			str += "</td></tr>";
			
			if(type == "current")
			{
				html_current += str;	
			}
			else if(type == "past")
			{
				html_past += str;
			}
			else if(type == "session")
			{
				html_session += str;
			}
		}
	}
	
	var html = GetDocTypeScript();
	html += GetHeadScript();
	html += GetBodyScript();
	html += GetTitleScript();
	html += GetContainerScript();
	html += "<p class=\"main\"><b>current member</b>";
	html += "<table width=\"450\">";
	html += html_current;
	html += "</table></p>";
	html += "<p class=\"main\"><b>past members</b>";
	html += "<table width=\"450\">";
	html += html_past;
	html += "</table></p>";
	html += "<p class=\"main\"><b>session members</b>";
	html += "<table width=\"450\">";
	html += html_session;
	html += "</table></p>";
	html += '</body>';
		
	document.write(html);
}

function MEMBERS_ShowMember(id)
{
	var member_nodes = MEMBERS_XMLRoot.getElementsByTagName("member");
	if(member_nodes && (id < member_nodes.length))
	{
		var member_node = member_nodes[id];
	
		var html = GetDocTypeScript();
		html += GetHeadScript();
		html += GetBodyScript();
		html += GetTitleScript();
		html += GetCloseWindowScript();
		html += GetContainerScript();
				
		html += "<p class=\"main\">";
		html += "<b>" + member_node.getAttribute("name") + "</b>";
		
		// Title
		{
			if(member_node.getAttribute("begin") != null)
			{
				html += " | " + member_node.getAttribute("begin") + " - ";
				if(member_node.getAttribute("end") != null)
					html += member_node.getAttribute("end");
			}
		}
		
		// Instruments
		{
			var instrument_nodes = member_node.getElementsByTagName("role");
			for(instr_id = 0; instr_id < instrument_nodes.length; instr_id++)
			{
				if(instr_id == 0)
				{
					html += "<br>";
				}
				else
				{
					html += ", ";
				}
				
				html += instrument_nodes[instr_id].getAttribute("name");
			}
		}
		
		html += "</p>";
		var has_image = false;
			
		// Image
		{
			var image_nodes = member_node.getElementsByTagName("image");
			if(image_nodes.length)
			{
				has_image = true;
				html += "<table width=\"440\"><tr>";
				html += "<td width=\"200\"><img class=\"Member\" src=\"" + image_nodes[0].getAttribute("src") + "\"></td>";
			}
		}
		
		if(has_image)
			html += "<td width=\"240\">";
		
		// Birthdate
		{
			var birthdate_nodes = member_node.getElementsByTagName("birthdate");
			if(birthdate_nodes.length)
			{
				html += "<p class=\"main\">";
				html += "<b>birthdate</b><br>";
				html += birthdate_nodes[0].firstChild.nodeValue;
				html += "</p>";
			}
		}
		
		// Location
		{
			var location_nodes = member_node.getElementsByTagName("location");
			if(location_nodes.length)
			{
				html += "<p class=\"main\">";
				html += "<b>location</b><br>";
				html += location_nodes[0].firstChild.nodeValue;
				html += "</p>";
			}
		}
		
		// Equipment
		{
			var equipment_nodes = member_node.getElementsByTagName("equipment");
			if(equipment_nodes.length)
			{
				html += "<p class=\"main\">";
				html += "<b>equipment</b><br>";
				html += equipment_nodes[0].firstChild.nodeValue;
				html += "</p>";
			}
		}
		
		// Trivia
		{
			var trivia_nodes = member_node.getElementsByTagName("trivia");
			if(trivia_nodes.length)
			{
				html += "<p class=\"main\">";
				html += "<b>trivia</b><br>";
				html += trivia_nodes[0].firstChild.nodeValue;
				html += "</p>";
			}
		}
		
		// Bands
		{
			var band_nodes = member_node.getElementsByTagName("band");
			if(band_nodes.length)
			{
				html += "<p class=\"main\">";
				html += "<b>other musical appereances</b><br>";
						
				for(band_id = 0; band_id < band_nodes.length; band_id++)
				{
					var link = band_nodes[band_id].getAttribute("link");
					if(link != null)
						html += "<a href=\"" + link + "\" target=\"_blank\">";
						
					html += band_nodes[band_id].getAttribute("name");
					
					var begin = band_nodes[band_id].getAttribute("begin");
					if(begin != null)
					{
						html += " " + begin + " - ";
						var end = band_nodes[band_id].getAttribute("end");
						if(end != null)
							html += end;
					}
					
					if(link != null)
						html += "</a>";
						
					html += "<br>";
				}
				
				html += "</p>";
			}
		}
		
		if(has_image)
			html += "</td></tr></table>";
		
		html += '</body>';
		document.write(html);
	}
}
