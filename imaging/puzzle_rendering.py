import os
import re

import markdown
from bs4 import BeautifulSoup
from PIL import Image, ImageDraw, ImageFont

from .wcstring import wcstr

BASE_DIR = os.path.split(os.path.abspath(__file__))[0]
FONT_PATH = "NotoSansCJK-Bold.ttc"
CANVAS_WIDTH = 600
TITLE_FONTSIZE = 18
TITLE_SPLIT = 63
CONTENT_FONTSIZE = 16
CONTENT_SPLIT = 72
LINE_HEIGHT = 25
OUTPUT_IMAGE_NAME = '/tmp/puzzle_render_output.png'
APPENDS = 'ウミガメのスープ出題サイトCindy：www.cindythink.com'
APPENDS_INDENT = 200
APPENDS_FONTSIZE = 14


def _split_lines(text, stop):
    output = []
    text = re.split(r'[\r\n]+', text)
    for part in text:
        if not part:
            continue
        part = wcstr(part)
        for i in range(0, len(part), stop):
            output.append(part[i:i + stop])

    return output


def render(title,
           content,
           appends=APPENDS,
           canvas_width=CANVAS_WIDTH,
           font_path=FONT_PATH,
           title_fontsize=TITLE_FONTSIZE,
           title_split=TITLE_SPLIT,
           content_fontsize=CONTENT_FONTSIZE,
           content_split=CONTENT_SPLIT,
           appends_indent=APPENDS_INDENT,
           appends_fontsize=APPENDS_FONTSIZE,
           line_height=LINE_HEIGHT,
           output_image_name=OUTPUT_IMAGE_NAME):
    title = _split_lines(title, title_split)
    content = _split_lines(content, content_split)
    hTitle = len(title) * line_height + line_height // 2
    hContent = len(content) * line_height + line_height // 2
    hAppends = int(line_height * 1.2)
    img = Image.new('RGB', (canvas_width, hTitle + hContent + hAppends), "#fcf4dc")
    draw = ImageDraw.Draw(img)
    title_font = ImageFont.truetype(font_path, title_fontsize)
    content_font = ImageFont.truetype(font_path, content_fontsize)
    appends_font = ImageFont.truetype(font_path, appends_fontsize)

    # Drawing border
    draw.rectangle((0, 0, 2, hTitle + hContent), fill="#c6aa4b")
    draw.rectangle(
        (canvas_width - 3, 0, canvas_width - 1, hTitle + hContent),
        fill="#c6aa4b")
    draw.rectangle((0, hTitle + hContent, canvas_width, hTitle + hContent + 2), fill="#c6aa4b")

    # Drawing Title background
    draw.rectangle((0, 0, canvas_width, hTitle), fill="#c6aa4b")

    for i, txt in enumerate(title):
        draw.text(
            (5, i * line_height + 5), txt, font=title_font, fill="#fcf4dc")

    for i, txt in enumerate(content):
        draw.text(
            (5, i * line_height + hTitle + 5),
            txt,
            font=content_font,
            fill="#c6aa4b")

    draw.text((appends_indent, hTitle + hContent + 5), appends, font=appends_font, fill="#888")

    img.save(output_image_name)
    return output_image_name


def textify(md):
    html = markdown.markdown(md, [
        'markdown.extensions.extra',
        'markdown.extensions.nl2br',
        'markdown.extensions.tables'
    ]) # yapf: disable
    soup = BeautifulSoup(html, 'html.parser')
    return soup.get_text()
