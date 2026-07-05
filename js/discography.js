/**
	@file	: discography.js
	@author	: Niclas Frohagen	
	@date	: 050127	
*/

var DISCOGRAPHY_XMLRoot = null;

function GetDocTypeScript()
{
	return '<!doctype html public \"-//W3C//DTD HTML 4.0 Transitional//EN\">';
}

function GetHeadScript()
{
	var html = '<head>';
	html += '<link href=\"css/style.css\" type=\"text/css\" rel=\"StyleSheet\">';
	html += '<script language=\"javascript\" src=\"js/discography.js\"></script>';
	html += '<script language=\"javascript\" src=\"js/scroll.js\"></script>';
	html += '</head>';
	
	return html;
}

function GetBodyScript()
{
	return '<body onLoad=\"DISCOGRAPHY_Create()\">';
}

function GetTitleScript()
{
	return '<p class=\"Title\">discography</p>';
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

function GetNavigationScript(has_close)
{
	var html = '<div ';
	
	if(has_close)
	{
		html += 'class=\"UpControl2\">';
	}
	else
	{
		html += 'class=\"UpControl\">';
	}
	
	html += '<a onmousedown=\"SCROLL_ScrollElement(\'Container\', \'up\', 8);\" onmouseup=\"SCROLL_ScrollElement(\'Container\',\'up\',2);\" onmouseover=\"SCROLL_ScrollElement(\'Container\',\'up\',2);\" onmouseout=\"SCROLL_Stop();\">';
	html += '<img src=\"pictures/icon_up.jpg\" border=\"0\">';
	html += '</a></div>';
	html += '<div class=\"DownControl\">';
	html += '<a onmousedown=\"SCROLL_ScrollElement(\'Container\', \'down\', 8);\" onmouseup=\"SCROLL_ScrollElement(\'Container\',\'down\',2);\" onmouseover=\"SCROLL_ScrollElement(\'Container\',\'down\',2);\" onmouseout=\"SCROLL_Stop();\">';
	html += '<img src=\"pictures/icon_down.jpg\" border=\"0\">';
	html += '</a></div>';
	
	return html;
}

function DISCOGRAPHY_Create()
{
	DISCOGRAPHY_Init();
	DISCOGRAPHY_Show();
}

function DISCOGRAPHY_Init()
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
		xml_http_request.open("GET", "xml/discography.xml", false);
		xml_http_request.send(null);
		DISCOGRAPHY_XMLRoot = xml_http_request.responseXML.documentElement;
	}
	catch (e)
	{
		alert(e);
	}
}
		
function DISCOGRAPHY_Show()
{
	if (DISCOGRAPHY_XMLRoot)
	{
		// Get value from address bar
		var index = window.location.href.indexOf("?");
		if(index != -1)
		{
			var str = window.location.href.substr(index + 1);
					
			var params = str.split(":");
			if(params.length > 0)
			{
				var album_id;
			
				var album_values = params[0].split("=");
				if((album_values.length > 1) && album_values[1].length)
				{
					album_id = album_values[1];
					
					if(params.length > 1)
					{
						var song_id = -1;
						var song_values = params[1].split("=");
						if((song_values.length > 1) && song_values[1].length)
						{
							song_id = song_values[1];
							DISCOGRAPHY_ShowSong(album_id, song_id);
						}
					}
					else
					{
						DISCOGRAPHY_ShowAlbum(album_id);
					}
				}
			}
		}
		else
		{
			DISCOGRAPHY_ShowList();
		}
	}
}

function DISCOGRAPHY_ShowList()
{
	var html = GetDocTypeScript();
	html += GetHeadScript();
	html += GetBodyScript();
	html += GetNavigationScript(false);
	html += GetTitleScript();
	html += GetContainerScript();
	
	var album_nodes = DISCOGRAPHY_XMLRoot.getElementsByTagName("album");
	for(i = 0; i < album_nodes.length; i++)
	{
		// Title
		html += "<p class=\"Main\"><a href=\"discography.html?album=" + i + "\" target=\"frame_center_right\">";
		html += "<b>" + album_nodes[i].getAttribute("name") + "</b><br>";
		html += album_nodes[i].getAttribute("media") + " ";
		html += album_nodes[i].getAttribute("date") + " | ";
		html += album_nodes[i].getAttribute("label");
		
		var id = album_nodes[i].getAttribute("album_id");
		if((id != "") && (id != null))
		{
			html += " " + id;
		}
		
		html += "&nbsp;<br>&nbsp;<br>";
		
		// Image
		var image_nodes = album_nodes[i].getElementsByTagName("image");
		if(image_nodes.length)
			html += "<img class=\"Album\" src=\"" + image_nodes[0].getAttribute("small") + "\" width=\"100\" height=\"100\">";
						
		html += "</a>";
		html += "</p>";
		html += "<br>";
	}
	
	html += '</div></div></body></html>';
	document.write(html);
}

function DISCOGRAPHY_ShowAlbum(id)
{
	var html = GetDocTypeScript();
	html += GetHeadScript();
	html += GetBodyScript();
	html += GetNavigationScript(true);
	html += GetTitleScript();
	html += GetCloseWindowScript("discography.html");
	html += GetContainerScript();
	
	var album_node = null;
	{
		var album_nodes = DISCOGRAPHY_XMLRoot.getElementsByTagName("album");
		if(album_nodes && (id < album_nodes.length))
			album_node = album_nodes[id];
	}
	
	if(album_node)
	{
		// Title
		{
			html += "<p class=\"Main\">";
			html += "<b>" + album_node.getAttribute("name") + "</b><br>";
			html += album_node.getAttribute("media") + " ";
			html += album_node.getAttribute("date") + " | ";
			html += album_node.getAttribute("label");
			
			var id = album_node.getAttribute("album_id");
			if((id != "") && (id != null))
			{
				html += " " + id;
			}
		}
		
		html += "&nbsp;<br>&nbsp;<br>";
		
		// Image
		{
			var image_nodes = album_node.getElementsByTagName("image");
			if(image_nodes.length)
			{
				html += "<img class=\"Album\" src=\"";
				html += image_nodes[0].getAttribute("small");
				html += "\" width=\"200\" height=\"200\">";
			}
		}
		
		html += "</p>";
			
		// Information
		{
			var info_nodes = album_node.getElementsByTagName("info");
			if(info_nodes.length && (info_nodes[0].parentNode == album_node))
			{
				html += "<p class=\"Main\"><b>information</b><br>";
				html += info_nodes[0].firstChild.nodeValue;
				html += "</p>";
			}
		}
		
		// Songs
		{
			var song_nodes = album_node.getElementsByTagName("song");
			if(song_nodes && song_nodes.length)
			{
				html += "<table><tr><td colspan=\"3\"><b>tracklist</b></td></tr>";
				
				for(i = 0; i < song_nodes.length; i++)
				{
					var song_ref = "";
					if(song_nodes[i].firstChild != null)
						song_ref += window.location.href + ":song=" + i;
													
					html += "<tr><td>";
					
					if(song_ref != "")
						html += "<a href=\"" + song_ref + "\" target=\"frame_center_right\">";
						
					if(i < 9)
						html += "0";
						
					html += (i + 1) + ". ";
					html += song_nodes[i].getAttribute("name");
					
					if(song_ref != "")
						html += "</a>";
						
					html += "</td><td width=\"10\"></td>";
					
					var length = song_nodes[i].getAttribute("length");
					if(length && (length != ""))
					{
						html += "<td align=\"right\">";
						html += song_nodes[i].getAttribute("length") + "min<br>";
						html += "</td>";
					}
					
					html += "</tr>";
				}
				
				html += "</table>";
			}
		}
		
		// Downloadable content
		{
			var dlc_nodes = album_node.getElementsByTagName("dlc");
			if(dlc_nodes && dlc_nodes.length)
			{
				html += "&nbsp;<br><table width=\"400\">";
				html += "<tr><td colspan=\"4\"><b>downloadables</b></td></tr>";
				
				for(i = 0; i < dlc_nodes.length; i++)
				{
					html += "<tr><td width=\"225\">";
					html += "<a href=\"" + dlc_nodes[i].getAttribute("data") + "\" target=\"_blank\">";
					html += dlc_nodes[i].getAttribute("name");
					html += "</a></td><td width=\"25\">";
					html += dlc_nodes[i].getAttribute("type");
					html += "</td><td width=\"75\" align=\"right\">";
					html += dlc_nodes[i].getAttribute("info");
					html += "</td><td width=\"75\" align=\"right\">";
					html += dlc_nodes[i].getAttribute("size");
					html += "</td></tr>";
				}
				
				html += "</table>";
			}
		}
	}
		
	html += "&nbsp;<br></div></div></body></html>";
	document.write(html);
}

function DISCOGRAPHY_ShowSong(album_id, song_id)
{
	var album_node = null;
	{
		var album_nodes = DISCOGRAPHY_XMLRoot.getElementsByTagName("album");
		if(album_nodes && (album_id < album_nodes.length))
			album_node = album_nodes[album_id];
	}
	
	if(album_node)
	{
		var song_node = null;
		{
			var song_nodes = album_node.getElementsByTagName("song");
			if(song_nodes && (song_id < song_nodes.length))
				song_node = song_nodes[song_id];
		}
		
		if(song_node)
		{
			var html = GetDocTypeScript();
			html += GetHeadScript();
			html += GetBodyScript();
			html += GetNavigationScript(true);
			html += GetTitleScript();
			html += GetCloseWindowScript("discography.html?album="+album_id);
			html += GetContainerScript();
			
			// Title
			{
				html += "<p class=\"main\">";
				html += "<b>" + song_node.getAttribute("name") + "</b><br>";
			}
					
			// Information
			{
				var info_nodes = song_node.getElementsByTagName("info");
				if(info_nodes && info_nodes.length)
				{
					var text = info_nodes[0].firstChild.nodeValue.replace(/\n/g, "<br>");
					html += text + "<br>";
				}
			}
			
			html += "</p>";
			
			// Lyrics
			{
				var lyrics_nodes = song_node.getElementsByTagName("lyrics");
				if(lyrics_nodes && lyrics_nodes.length)
				{
					var text = lyrics_nodes[0].firstChild.nodeValue.replace(/\n\n/g, "&nbsp;<br>&nbsp;<br>");
					text = text.replace(/\n/g, "<br>");
					
					html += "<p class=\"main\">" + text + "</p>";
				}
			}
			
			html += "&nbsp;<br></div></div></body></html>";
			document.write(html);
		}
	}
}
