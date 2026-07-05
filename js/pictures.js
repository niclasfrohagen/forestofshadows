/**
	@file	: pictures.js
	@author	: Niclas Frohagen	
	@date	: 050217	
*/

var PICTURES_XMLRoot = null;

function GetDocTypeScript()
{
	return '<!doctype html public \"-//W3C//DTD HTML 4.0 Transitional//EN\">';
}

function GetHeadScript()
{
	var html = '<head>';
	html += '<link href=\"css/style.css\" type=\"text/css\" rel=\"StyleSheet\">';
	html += '<script language=\"javascript\" src=\"js/pictures.js\"></script>';
	html += '<script language=\"javascript\" src=\"js/scroll.js\"></script>';
	html += '</head>';
	
	return html;
}

function GetBodyScript()
{
	return '<body onLoad=\"PICTURES_Create()\">';
}

function GetTitleScript()
{
	var html = '<p class=\"Title\">biography</p>';
	html += '<p class=\"SubTitle\">pictures</p>';
	
	return html;
}

function GetContainerScript()
{
	var html = '<div id=\"Container\">';
	html += '<div id=\"Content\">';
	
	return html;
}

function GetCloseWindowScript(parent_href)
{
	var html = "<div class=\"Close\">";
	html += "<a href=\""+parent_href+"\">";
	html += "<img src=\"pictures/icon_close.jpg\" border=\"0\">";
	html += "</a>";
	html += "</div>";
	
	return html;
}

function GetNavigationScript()
{
	var html = '<div class=\"UpControl2\">';
	html += '<a onmousedown=\"SCROLL_ScrollElement(\'Container\', \'up\', 8);\" onmouseup=\"SCROLL_ScrollElement(\'Container\',\'up\',2);\" onmouseover=\"SCROLL_ScrollElement(\'Container\',\'up\',2);\" onmouseout=\"SCROLL_Stop();\">';
	html += '<img src=\"pictures/icon_up.jpg\" border=\"0\">';
	html += '</a></div>';
	html += '<div class=\"DownControl\">';
	html += '<a onmousedown=\"SCROLL_ScrollElement(\'Container\', \'down\', 8);\" onmouseup=\"SCROLL_ScrollElement(\'Container\',\'down\',2);\" onmouseover=\"SCROLL_ScrollElement(\'Container\',\'down\',2);\" onmouseout=\"SCROLL_Stop();\">';
	html += '<img src=\"pictures/icon_down.jpg\" border=\"0\">';
	html += '</a></div>';
	
	return html;
}

function PICTURES_Create()
{
	PICTURES_Init();
	PICTURES_Show();
}

function PICTURES_Init()
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
		xml_http_request.open("GET", "xml/pictures.xml", false);
		xml_http_request.send(null);
		PICTURES_XMLRoot = xml_http_request.responseXML.documentElement;
	}
	catch (e)
	{
		alert(e);
	}
}

function PICTURES_Show()
{
	if (PICTURES_XMLRoot)
	{
		var index = window.location.href.indexOf("?");
		if(index != -1)
		{
			var location_pair = window.location.href.split("?");
			var params = location_pair[1].split(";");
			if(params.length == 1)
			{
				var param_parts = params[0].split("=");
				if(param_parts.length == 2)
					PICTURES_ShowSession(param_parts[1]);
			}
			else if(params.length == 2)
			{
				var param_parts = params[1].split("=");
				if(param_parts.length == 2)
				{
					var session_id = 0;
					var session_parts = params[0].split("=");
					if(session_parts.length == 2)
						session_id = session_parts[1];
						
					PICTURES_ShowPicture(location_pair[0]+"?"+params[0], param_parts[1], session_id);
				}
			}
		}
		else
		{
			PICTURES_ShowList();
		}
	}
}

function PICTURES_ShowList()
{
	var html = GetDocTypeScript();
	html += GetHeadScript();
	html += GetBodyScript();
	html += GetTitleScript();
	html += GetContainerScript();
	
	var session_nodes = PICTURES_XMLRoot.getElementsByTagName("session");	
	for(i = 0; i < session_nodes.length; i++)
	{
		var has_pictures = false;
		var picture_nodes = session_nodes[i].getElementsByTagName("picture");
		if(picture_nodes.length)
			has_pictures = true;
		
		html += "<p class=\"main\">";
		
		if(has_pictures)
			html += "<a href=\"bio_pictures.html?session=" + i + "\">";
			
		html += "<b>" + session_nodes[i].getAttribute("name") + "</b><br>";
		html += "photographer: " + session_nodes[i].getAttribute("photographer");
		
		if(has_pictures)
			html += "</a>";
			
		html += "</p>";
	}
	
	html += "</body>";
	document.write(html);
}

function PICTURES_ShowSession(id)
{
	var html = GetDocTypeScript();
	html += GetHeadScript();
	html += GetBodyScript();
	html += GetNavigationScript();
	html += GetTitleScript();
	html += GetCloseWindowScript("bio_pictures.html");
	html += GetContainerScript();
	
	var session_node = null;
	{
		var session_nodes = PICTURES_XMLRoot.getElementsByTagName("session");
		if(session_nodes && (id < session_nodes.length))
			session_node = session_nodes[id];
	}
	
	if(session_node)
	{
		html += "<p class=\"main\">";
		html += "<b>" + session_node.getAttribute("name") + "</b> | ";
		html += "photographer: " + session_node.getAttribute("photographer");
		html += "</p>";
		
		var picture_nodes = session_node.getElementsByTagName("picture");
		for(i = 0; i < picture_nodes.length; i++)
		{
			var img_small = picture_nodes[i].getAttribute("small");
			if((img_small == null) || (img_small == ""))
				img_small = picture_nodes[i].getAttribute("src");
			
			if((img_small != null) && (img_small != ""))
			{
				var img_src = picture_nodes[i].getAttribute("src");
				if((img_src != null) && (img_src != ""))
					html += "<a href=\"bio_pictures.html?session="+id+";picture="+img_src+"\">";
							
				html += "<img class=\"Thumbnail\" src=\"" + img_small + "\" width=\"100\" height=\"100\">";
				
				if((img_src != null) && (img_src != ""))
					html += "</a>";
				
				if((i % 3) == 2)
					html += "<br>";
			}
		}
		
		html += "</div></div></body></html>";
		document.write(html);
	}
}

function PICTURES_ShowPicture(parent_href, img_src, session_id)
{
	var session_name;
	{
		var session_nodes = PICTURES_XMLRoot.getElementsByTagName("session");
		if(session_nodes && (session_id < session_nodes.length))
			session_name = session_nodes[session_id].getAttribute("name");
	}
	
	var html = GetDocTypeScript();
	html += GetHeadScript();
	html += GetBodyScript();
	html += GetTitleScript();
	html += GetCloseWindowScript(parent_href);
	html += GetContainerScript();
	html += "<p class=\"picture\">";
	html += "<b>"+session_name+"</b>";
	html += "</p><p class=\"picture\">";
	html += "<img class=\"Large\" src=\""+img_src+"\">";
	html += "</p></div></div></body></html>";
	document.write(html);
}