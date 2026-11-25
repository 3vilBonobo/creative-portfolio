from pathlib import Path
from html import escape
out=Path('public/projects/enterprise-traceability');out.mkdir(exist_ok=True)
def text(x,y,value,size=20,color='#d4dfdf',weight=400):
 return f'<text x="{x}" y="{y}" fill="{color}" font-size="{size}" font-weight="{weight}">{escape(value)}</text>'
def rect(x,y,w,h,fill='#14252d',stroke='#354a52',rx=10):
 return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}"/>'
def line(x1,y1,x2,y2,color='#4ed8ce',dash=''):
 return f'<path d="M{x1} {y1}H{x2}" stroke="{color}" fill="none"/>' if y1==y2 and not dash else f'<path d="M{x1} {y1}L{x2} {y2}" stroke="{color}" stroke-dasharray="{dash}" fill="none"/>'
def base(title,subtitle,number):
 return f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760" viewBox="0 0 1200 760" role="img" aria-labelledby="title desc"><title id="title">{escape(title)} — fictional engineering illustration</title><desc id="desc">{escape(subtitle)}. All information and interface arrangements are fictional; no production system is represented.</desc><defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#182c36"/><stop offset="1" stop-color="#09151d"/></linearGradient><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#abcaca" stroke-opacity=".035"/></pattern><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto"><path d="M0 0L8 4L0 8" fill="none" stroke="#4ed8ce" stroke-width="1.5"/></marker></defs><rect width="1200" height="760" fill="url(#bg)"/><rect width="1200" height="760" fill="url(#grid)"/><g font-family="Segoe UI,Arial,sans-serif">'''+text(52,65,number+' / ENGINEERING STUDY',16,'#50d8cd',600)+text(52,120,title,42,'#f4f0e5',700)+text(52,159,subtitle,20,'#b1c5cc')
def finish():
 return line(52,698,1148,698,'#42555b')+text(52,729,'ILLUSTRATIVE CONCEPT / FICTIONAL INTERFACE AND INVENTED DATA',15,'#9fb6bd',600)+'</g></svg>'
def field(x,y,w,label,value,warning=False):
 return text(x,y,label,16,'#a3bbc4',600)+rect(x,y+12,w,52,'#101e27','#d9a54f' if warning else '#3b535d',6)+text(x+16,y+45,value,19,'#f2c67e' if warning else '#e7efec')
s=base('Complex forms, clear decisions','Dependent inputs · validation feedback · draft recovery','01')
s+=rect(52,199,1096,466,'#0e1c25','#40535c')
s+=text(80,241,'01  DETAILS',18,'#54dace',700)+text(280,241,'02  ENTRIES',18,'#94a9b2')+text(480,241,'03  REVIEW',18,'#94a9b2')+line(80,259,242,259)
s+=field(80,301,285,'REFERENCE','DEMO-104')+field(393,301,285,'LOCATION','Example depot')
s+=field(80,410,285,'ITEM','Sample item A')+field(393,410,285,'QUANTITY','12 illustrative units')
s+=field(80,519,598,'DEPENDENT VALUE','Choose a sample handling method',True)
s+=rect(725,224,395,413,'#192d35','#45636a')+text(750,266,'Make state understandable',24,'#e9eee4',600)
for y,label,color in [(320,'Required fields present','#55d6b5'),(373,'One dependent value missing','#f2bc65'),(426,'Draft available for recovery','#55d6b5')]:
 s+=f'<circle cx="758" cy="{y-7}" r="5" fill="{color}"/>'+text(776,y,label,18,'#d9e3df')
s+=line(750,461,1094,461,'#44616a')+text(750,501,'Illustration of a problem space,',18,'#a9c1c9')+text(750,530,'not a production form or schema.',18,'#a9c1c9')+text(80,624,'Example record / all values invented',16,'#9cb4bd')
(out/'complex-form.svg').write_text(s+finish(),encoding='utf-8')
s=base('Data management, visible context','Searchable records · selection · data-quality feedback','02')
s+=rect(52,199,1096,466,'#0e1c25','#40535c')+rect(80,225,720,54,'#182a33','#45616c',6)+text(102,259,'Search illustrative records…',20,'#b4c8ce')+text(833,259,'SAMPLE RECORDS',16,'#5bd7ce',600)
s+=rect(80,306,1040,48,'#223941','#223941',4)
for x,label in [(112,'SELECT'),(215,'REFERENCE'),(450,'ITEM'),(700,'LOCATION'),(935,'REVIEW')]:s+=text(x,337,label,15,'#bacfd5',600)
rows=[('DEMO-104','Sample item A','Example depot','Ready'),('DEMO-105','Sample item B','Example hub','Check value'),('DEMO-106','Sample item C','Example depot','Ready')]
for i,row in enumerate(rows):
 y=366+i*72
 s+=rect(80,y,1040,64,'#192f38' if i==1 else '#11232c','#55747d' if i==1 else '#253f49',4)+rect(117,y+22,20,20,'#4ed8ce' if i==1 else '#101e27','#6c8c98',3)
 for x,label in zip([215,450,700],row[:3]):s+=text(x,y+40,label,20,'#e2e9e6')
 s+=rect(925,y+16,170,33,'#473a23' if i==1 else '#173f37','#946e37' if i==1 else '#2c7160',16)+text(946,y+39,row[3],17,'#f0c67e' if i==1 else '#8ce2bb',600)
s+=line(80,598,1120,598,'#44616a')+text(80,633,'Find the record',19,'#f3c36d',600)+text(375,633,'Keep selection visible',19,'#dce7e4')+text(760,633,'Explain what needs attention',19,'#dce7e4')
(out/'data-management.svg').write_text(s+finish(),encoding='utf-8')
s=base('Workflows that can recover','Editing · validation · API boundaries · interrupted operations','03')
s+=rect(52,199,1096,466,'#0e1c25','#40535c')
def node(x,y,title,sub,accent='#4ed8ce',w=224):
 return rect(x,y,w,118,'#17303a',accent)+text(x+20,y+41,title,23,'#f0eee3',600)+text(x+20,y+78,sub,16,'#b3cbd0')
s+=node(80,262,'Edit draft','Fictional record')+node(352,262,'Validate','Explain missing values')+node(624,262,'Submit','Illustrative boundary')+node(896,262,'Confirm','Show outcome')
for x in [306,578,850]:s+=f'<path d="M{x} 321H{x+39}" fill="none" stroke="#4ed8ce" stroke-width="2" marker-end="url(#arrow)"/>'
s+=node(624,474,'Recover / retry','Keep user input available','#edb55c',w=288)
s+='<path d="M736 382V454" fill="none" stroke="#edb55c" stroke-width="2" stroke-dasharray="6 6"/>'+text(762,425,'If interrupted',16,'#edc27c')
s+='<path d="M624 532H464V399" fill="none" stroke="#4ed8ce" stroke-width="2" stroke-dasharray="6 6" marker-end="url(#arrow)"/>'+text(86,484,'Happy paths are only part',24,'#ebeee4',600)+text(86,520,'of the interface problem.',24,'#ebeee4',600)+text(86,563,'Make the recovery path legible.',18,'#b1c6cf')
s+=text(80,632,'Conceptual flow only — not an implementation or system architecture diagram.',18,'#a7c0c9')
(out/'workflow.svg').write_text(s+finish(),encoding='utf-8')
for p in out.glob('*.svg'):print(p,p.stat().st_size)
