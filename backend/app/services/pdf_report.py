import os
import json
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_pdf_report(idea: dict, prediction: dict, report: dict, output_dir: str) -> str:
    # Ensure static directory exists
    os.makedirs(output_dir, exist_ok=True)
    filename = f"report_{idea['id']}.pdf"
    file_path = os.path.join(output_dir, filename)

    # Styles setup
    styles = getSampleStyleSheet()
    
    # Custom Styles for premium look
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=28,
        leading=34,
        textColor=colors.HexColor('#7C3AED'),
        spaceAfter=15
    )
    
    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor('#6B7280'),
        spaceAfter=40
    )
    
    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#0F172A'),
        spaceBefore=15,
        spaceAfter=10,
        keepWithNext=True
    )
    
    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=colors.HexColor('#1E293B'),
        spaceBefore=10,
        spaceAfter=5,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#334155'),
        spaceAfter=8
    )

    label_style = ParagraphStyle(
        'Label_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=12,
        textColor=colors.HexColor('#1E293B')
    )

    story = []

    # --- COVER PAGE ---
    story.append(Spacer(1, 100))
    story.append(Paragraph("StartSmart AI", title_style))
    story.append(Paragraph("Startup Evaluation & Business Mentor Report", subtitle_style))
    story.append(Spacer(1, 20))
    
    # General Info Table
    info_data = [
        [Paragraph("Startup Name", label_style), Paragraph(idea['name'], body_style)],
        [Paragraph("Industry Sector", label_style), Paragraph(idea['industry'], body_style)],
        [Paragraph("Target Country", label_style), Paragraph(idea['country'], body_style)],
        [Paragraph("Target Launch Date", label_style), Paragraph(idea['expected_launch_date'], body_style)],
        [Paragraph("Report Generated On", label_style), Paragraph(str(datetime_now()), body_style)]
    ]
    
    info_table = Table(info_data, colWidths=[150, 300])
    info_table.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('BACKGROUND', (0,0), (0,-1), colors.HexColor('#F8FAFC')),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(info_table)
    story.append(PageBreak())

    # --- SECTION 1: EXECUTIVE DESCRIPTION ---
    story.append(Paragraph("1. Business Model & Objectives", h1_style))
    story.append(Spacer(1, 5))
    story.append(Paragraph("<b>Description:</b>", h2_style))
    story.append(Paragraph(idea['description'], body_style))
    story.append(Paragraph("<b>Problem:</b>", h2_style))
    story.append(Paragraph(idea['problem'], body_style))
    story.append(Paragraph("<b>Solution:</b>", h2_style))
    story.append(Paragraph(idea['solution'], body_style))
    story.append(Paragraph("<b>Target Audience:</b>", h2_style))
    story.append(Paragraph(idea['target_audience'], body_style))
    story.append(Spacer(1, 15))

    # --- SECTION 2: MACHINE LEARNING METRICS ---
    story.append(Paragraph("2. Machine Learning Quantitative Projections", h1_style))
    story.append(Spacer(1, 5))

    metrics_data = [
        [
            Paragraph("Metric", label_style), 
            Paragraph("Prediction", label_style), 
            Paragraph("Status / Value", label_style)
        ],
        [
            Paragraph("Startup Success Probability", body_style),
            Paragraph(f"{prediction['success_probability']}%", body_style),
            Paragraph("High Success Chance" if prediction['success_probability'] >= 65 else ("Moderate Success Chance" if prediction['success_probability'] >= 40 else "High Risk / Low Chance"), body_style)
        ],
        [
            Paragraph("Predicted Startup Category", body_style),
            Paragraph(prediction['predicted_category'], body_style),
            Paragraph("Matched by AI description analysis", body_style)
        ],
        [
            Paragraph("Funding Readiness Score", body_style),
            Paragraph(prediction['funding_readiness'], body_style),
            Paragraph("Based on team, experience, and budget", body_style)
        ]
    ]

    metrics_table = Table(metrics_data, colWidths=[180, 100, 170])
    metrics_table.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#EDE9FE')),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(metrics_table)
    story.append(Spacer(1, 15))

    # Risk Metrics Table
    story.append(Paragraph("<b>Risk Matrix Profile:</b>", h2_style))
    risk_data = [
        [Paragraph("Market Risk", body_style), Paragraph(f"{prediction['risk_market']}%", body_style)],
        [Paragraph("Financial Risk", body_style), Paragraph(f"{prediction['risk_financial']}%", body_style)],
        [Paragraph("Execution Risk", body_style), Paragraph(f"{prediction['risk_execution']}%", body_style)],
        [Paragraph("Technology Risk", body_style), Paragraph(f"{prediction['risk_technology']}%", body_style)],
        [Paragraph("Legal Risk", body_style), Paragraph(f"{prediction['risk_legal']}%", body_style)]
    ]
    risk_table = Table(risk_data, colWidths=[200, 250])
    risk_table.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('PADDING', (0,0), (-1,-1), 6),
        ('BACKGROUND', (0,0), (0,-1), colors.HexColor('#FFF1F2')),
    ]))
    story.append(risk_table)
    story.append(PageBreak())

    # --- SECTION 3: REVENUE FORECAST ---
    story.append(Paragraph("3. Financial Revenue Forecast", h1_style))
    story.append(Spacer(1, 5))
    
    rev_data = [
        [Paragraph("Forecast Horizon", label_style), Paragraph("Estimated Revenue", label_style)],
        [Paragraph("Year 1 Revenue", body_style), Paragraph(f"Rs. {prediction['revenue_y1']:,.2f}", body_style)],
        [Paragraph("Year 2 Revenue", body_style), Paragraph(f"Rs. {prediction['revenue_y2']:,.2f}", body_style)],
        [Paragraph("Year 3 Revenue", body_style), Paragraph(f"Rs. {prediction['revenue_y3']:,.2f}", body_style)],
    ]
    
    rev_table = Table(rev_data, colWidths=[200, 250])
    rev_table.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F0FDF4')),
        ('PADDING', (0,0), (-1,-1), 8),
        ('ALIGN', (1,0), (1,-1), 'RIGHT'),
    ]))
    story.append(rev_table)
    story.append(Spacer(1, 20))

    # --- SECTION 4: SWOT & LEAN CANVAS ---
    story.append(Paragraph("4. SWOT & Qualitative Analysis", h1_style))
    story.append(Spacer(1, 5))
    
    swot = {}
    try:
        swot = json.loads(report['swot_analysis'])
    except Exception:
        swot = report['swot_analysis'] if isinstance(report['swot_analysis'], dict) else {}

    story.append(Paragraph("<b>Strengths:</b>", h2_style))
    for strength in swot.get('strengths', []):
        story.append(Paragraph(f"- {strength}", body_style))
        
    story.append(Paragraph("<b>Weaknesses:</b>", h2_style))
    for weakness in swot.get('weaknesses', []):
        story.append(Paragraph(f"- {weakness}", body_style))
        
    story.append(Paragraph("<b>Opportunities:</b>", h2_style))
    for opportunity in swot.get('opportunities', []):
        story.append(Paragraph(f"- {opportunity}", body_style))
        
    story.append(Paragraph("<b>Threats:</b>", h2_style))
    for threat in swot.get('threats', []):
        story.append(Paragraph(f"- {threat}", body_style))

    doc = SimpleDocTemplate(file_path, pagesize=letter, rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40)
    doc.build(story)
    
    return filename

def datetime_now():
    import datetime
    return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
