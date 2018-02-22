Instructions:
1. Unzip the "OhioHealthDynamicDashboard" folder and save it to desktop.
2. In the "OhioHealthDynamicDashboard" folder find the OhioHealthDynamicDashboard.html file.
3.The OhioHealthDynamicDashboard.html file should be launched using Firefox version 58.0.2 (64-bit) and above (Chrome will not work). 

Functionality:
1.	2018 Flu Activity (shows 2018 YTD data): 
	a.	Click any state to zoom into the state. 
	b.	The zoomed view shows county level data, click anywhere inside the state to zoom back out to USA view.
2.	Flu Related Hospitalizations in Ohio (shows yearly trend from 2012-2017):
	a.	Dynamically updates yearly view via the "Year" slider. 
	b.	Tooltip: Hovering over the bars shows you the number of cases of hospitalization for that period.
3.	News Sentiment Score: 
	a.	Shows the Sentiment Score obtained using Natural Language Processing on news articles in which the 4 hospitals appeared over time. Pulled the articles from the respective hospital websites. 2 is a positive sentiment ; 1 is a neural sentiment; 0 is a negative sentiment. 
	b.	Clicking on the legend color square, filters the view for a given hospital. 
	c.	Clicking the color square again reverts to full view. 
	d.	Tooltip: Hovering over each point in the scatter plot shows you the hospital the given news article belonged to.
4.	News Mentions: 
	a.	Shows a stacked bar chart with the number of news articles the 4 hospitals appeared in over time. 
b.	Tooltip: Hovering over each stack shows you the number of news articles a given hospital appeared in for a given time.
