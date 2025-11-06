#!/usr/bin/env python3
"""Generate a clean PDF from the Masha OakNorth Fit Analysis markdown file."""

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak,
    Table, TableStyle, HRFlowable
)
from reportlab.lib import colors
import re

def parse_markdown_to_pdf(md_file, pdf_file):
    """Convert markdown content to a formatted PDF."""

    # Read the markdown file
    with open(md_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Create PDF document
    doc = SimpleDocTemplate(
        pdf_file,
        pagesize=letter,
        rightMargin=0.75*inch,
        leftMargin=0.75*inch,
        topMargin=0.75*inch,
        bottomMargin=0.75*inch
    )

    # Get default styles and create custom ones
    styles = getSampleStyleSheet()

    # Custom styles
    styles.add(ParagraphStyle(
        name='CustomTitle',
        parent=styles['Title'],
        fontSize=24,
        textColor=colors.HexColor('#1a1a1a'),
        spaceAfter=20,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    ))

    styles.add(ParagraphStyle(
        name='CustomHeading1',
        parent=styles['Heading1'],
        fontSize=18,
        textColor=colors.HexColor('#2c3e50'),
        spaceAfter=12,
        spaceBefore=20,
        fontName='Helvetica-Bold'
    ))

    styles.add(ParagraphStyle(
        name='CustomHeading2',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=colors.HexColor('#34495e'),
        spaceAfter=10,
        spaceBefore=16,
        fontName='Helvetica-Bold'
    ))

    styles.add(ParagraphStyle(
        name='CustomHeading3',
        parent=styles['Heading3'],
        fontSize=12,
        textColor=colors.HexColor('#7f8c8d'),
        spaceAfter=8,
        spaceBefore=12,
        fontName='Helvetica-Bold'
    ))

    styles.add(ParagraphStyle(
        name='CustomBody',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        alignment=TA_JUSTIFY,
        spaceAfter=8,
        fontName='Helvetica'
    ))

    styles.add(ParagraphStyle(
        name='BulletPoint',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        leftIndent=20,
        spaceAfter=6,
        fontName='Helvetica'
    ))

    styles.add(ParagraphStyle(
        name='CodeBlock',
        parent=styles['Code'],
        fontSize=9,
        leftIndent=20,
        rightIndent=20,
        spaceAfter=10,
        spaceBefore=10,
        fontName='Courier'
    ))

    # Build story (content)
    story = []

    # Split content into lines
    lines = content.split('\n')

    i = 0
    in_table = False
    table_data = []

    while i < len(lines):
        line = lines[i].rstrip()

        # Skip empty lines (but add small spacer)
        if not line:
            if not in_table:
                story.append(Spacer(1, 6))
            i += 1
            continue

        # Title (# heading)
        if line.startswith('# ') and not line.startswith('## '):
            text = line[2:].strip()
            story.append(Paragraph(text, styles['CustomTitle']))
            story.append(Spacer(1, 12))

        # Heading 2 (## heading)
        elif line.startswith('## ') and not line.startswith('### '):
            text = line[3:].strip()
            story.append(Paragraph(text, styles['CustomHeading1']))

        # Heading 3 (### heading)
        elif line.startswith('### '):
            text = line[4:].strip()
            story.append(Paragraph(text, styles['CustomHeading2']))

        # Horizontal rule
        elif line.strip() == '---':
            story.append(Spacer(1, 12))
            story.append(HRFlowable(width="100%", thickness=1, color=colors.grey))
            story.append(Spacer(1, 12))

        # Bullet points
        elif line.startswith('- ') or re.match(r'^\d+\.', line):
            if line.startswith('- '):
                text = '• ' + line[2:].strip()
            else:
                text = line.strip()

            # Handle bold text
            text = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', text)
            # Handle italic text
            text = re.sub(r'\*(.*?)\*', r'<i>\1</i>', text)

            story.append(Paragraph(text, styles['BulletPoint']))

        # Table detection
        elif '|' in line and not in_table:
            # Start of table
            in_table = True
            table_data = []
            # Parse table row
            cells = [cell.strip() for cell in line.split('|')[1:-1]]
            table_data.append(cells)

        elif in_table:
            if '|' in line:
                # Check if it's a separator row
                if re.match(r'^\|[\s\-:|]+\|$', line):
                    # Skip separator row
                    i += 1
                    continue

                # Parse table row
                cells = [cell.strip() for cell in line.split('|')[1:-1]]
                table_data.append(cells)
            else:
                # End of table
                in_table = False
                if table_data:
                    # Create table
                    t = Table(table_data)
                    t.setStyle(TableStyle([
                        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3498db')),
                        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                        ('FONTSIZE', (0, 0), (-1, 0), 10),
                        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
                        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
                        ('FONTSIZE', (0, 1), (-1, -1), 9),
                        ('TOPPADDING', (0, 1), (-1, -1), 6),
                        ('BOTTOMPADDING', (0, 1), (-1, -1), 6),
                    ]))
                    story.append(t)
                    story.append(Spacer(1, 12))
                    table_data = []
                continue

        # Bold text paragraphs (starts with **)
        elif line.startswith('**') and line.endswith('**'):
            text = line[2:-2]
            story.append(Paragraph(f'<b>{text}</b>', styles['CustomBody']))

        # Regular paragraphs
        else:
            text = line
            # Handle bold text
            text = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', text)
            # Handle italic text
            text = re.sub(r'\*(.*?)\*', r'<i>\1</i>', text)
            # Handle code blocks
            if text.startswith('    ') or text.startswith('\t'):
                story.append(Paragraph(text, styles['CodeBlock']))
            else:
                story.append(Paragraph(text, styles['CustomBody']))

        i += 1

    # Build PDF
    doc.build(story)
    print(f"PDF successfully created: {pdf_file}")

if __name__ == '__main__':
    input_file = '/Users/thomasmustier/MASHA OAKNORTH FIT.md'
    output_file = '/Users/thomasmustier/MASHA OAKNORTH FIT.pdf'

    parse_markdown_to_pdf(input_file, output_file)
