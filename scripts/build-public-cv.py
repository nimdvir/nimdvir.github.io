"""Build the public CV PDF from src/data/cv-public.md.
Optional tooling: python -m pip install reportlab markdown lxml
The ordinary Astro build uses the committed PDF and does not need Python.
"""
from pathlib import Path
from html import escape
import re
import markdown
from lxml import html
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, KeepTogether
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT=Path(__file__).resolve().parents[1]
import reportlab
FONT=Path(reportlab.__file__).parent/'fonts'
for name,file in [('CV','Vera.ttf'),('CV-Bold','VeraBd.ttf'),('CV-Italic','VeraIt.ttf'),('CV-BoldItalic','VeraBI.ttf')]:
    pdfmetrics.registerFont(TTFont(name,str(FONT/file)))
pdfmetrics.registerFontFamily('CV',normal='CV',bold='CV-Bold',italic='CV-Italic',boldItalic='CV-BoldItalic')
text=(ROOT/'src/data/cv-public.md').read_text(encoding='utf-8')
text=re.sub(r'^---\n.*?\n---\n','',text,flags=re.S)
text=text.replace('📄','').replace('\u200e','').replace('\u200f','').replace('\u2011','-').replace('–','-').replace('—','-')
node=html.fromstring('<div>'+markdown.markdown(text)+'</div>')
styles=getSampleStyleSheet()
base=dict(fontName='CV',fontSize=9.3,leading=13.2,textColor=colors.HexColor('#16202b'),spaceAfter=7)
styles.add(ParagraphStyle(name='CVBody',**base))
styles.add(ParagraphStyle(name='CVBullet',leftIndent=12,firstLineIndent=-9,**base))
for n,size,space in [(1,15,19),(2,11.5,11),(3,10,9)]:
    styles.add(ParagraphStyle(name=f'CVH{n}',fontName='CV-Bold',fontSize=size,leading=size*1.25,spaceBefore=space,spaceAfter=7,keepWithNext=True,textColor=colors.HexColor('#0b5fb0') if n==1 else colors.HexColor('#16202b')))
def inline(el):
    out=escape(el.text or '')
    for child in el:
        tag=child.tag.lower()
        if tag in ('ul','ol'):continue
        inner=inline(child)
        if tag in ('em','i'):out+='<i>'+inner+'</i>'
        elif tag in ('strong','b'):out+='<b>'+inner+'</b>'
        elif tag=='a':out+='<a href="'+escape(child.get('href',''),quote=True)+'" color="#0b5fb0">'+inner+'</a>'
        elif tag=='br':out+='<br/>'
        else:out+=inner
        out+=escape(child.tail or '')
    return out
story=[Paragraph('Nimrod (Nim) Dvir, PhD, MBA',ParagraphStyle('TitleCV',fontName='CV-Bold',fontSize=22,leading=28,textColor=colors.HexColor('#0b5fb0'),spaceAfter=7)),Paragraph('CURRICULUM VITAE | SEPTEMBER 2026',ParagraphStyle('SubCV',fontName='CV',fontSize=9,leading=13,textColor=colors.HexColor('#4d5966'),spaceAfter=14))]
def add(el,depth=0):
    tag=el.tag.lower()
    if tag in ('ul','ol'):
        for i,c in enumerate(el):
            value=inline(c)
            label=f'{i+1}. ' if tag=='ol' else '• '
            if value.strip():story.append(Paragraph(label+value,styles['CVBullet']))
            for nested in c:
                if nested.tag in ('ul','ol'):add(nested,depth+1)
    elif tag in ('h2','h3','h4'):
        story.append(Paragraph(inline(el),styles['CVH'+str(int(tag[1])-1)]))
    elif tag=='p':story.append(Paragraph(inline(el),styles['CVBody']))
for element in node:add(element)
out=ROOT/'public/files/Nim-Dvir-CV-2026-09.pdf';out.parent.mkdir(exist_ok=True)
def page_footer(c,doc):
    c.setStrokeColor(colors.HexColor('#cbd3dc'));c.line(43,40,569,40)
    c.setFont('CV',8);c.setFillColor(colors.HexColor('#4d5966'));c.drawString(43,27,'Nim Dvir | Curriculum vitae | September 2026');c.drawRightString(569,27,str(doc.page))
SimpleDocTemplate(str(out),pagesize=(612,792),rightMargin=43,leftMargin=43,topMargin=40,bottomMargin=54,title='Nim Dvir - Curriculum Vitae - September 2026',author='Nim Dvir').build(story,onFirstPage=page_footer,onLaterPages=page_footer)
print(out)
