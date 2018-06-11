import os
import re

import markdown
from bs4 import BeautifulSoup
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = os.path.split(os.path.abspath(__file__))[0]
FONT_PATH = os.path.join(BASE_DIR, "NotoSansCJK-Bold.ttc")
BG_PATH = os.path.join(BASE_DIR, "twitter_puzzle_bg.png")
TITLE_FONTSIZE = 18
TITLE_SPLIT = 12
CONTENT_FONTSIZE = 16
CONTENT_MAXLINENUM = 14
CONTENT_SPLIT = 15
LINE_HEIGHT = 25
OUTPUT_IMAGE_NAME = '/tmp/puzzle_render_output.png'


def _split_lines(text, stop):
    text = re.split(r'\n+', text)
    text = [[part[i:i + stop] for i in range(0, len(part), stop)]
            for part in text if part]
    return sum(text, [])


def render(title, content):
    img = Image.open(BG_PATH)
    draw = ImageDraw.Draw(img)
    title_font = ImageFont.truetype(FONT_PATH, TITLE_FONTSIZE)
    content_font = ImageFont.truetype(FONT_PATH, CONTENT_FONTSIZE)

    draw.text((0, 5), title, (0, 0, 0), font=title_font)
    for i, txt in enumerate(_split_lines(content, CONTENT_SPLIT)):
        if i >= CONTENT_MAXLINENUM:
            break
        draw.text((0, i * LINE_HEIGHT + 55), txt, (0, 0, 0), font=content_font)

    img.save(OUTPUT_IMAGE_NAME)
    return OUTPUT_IMAGE_NAME


def textify(md):
    html = markdown.markdown(md)
    soup = BeautifulSoup(html, 'html.parser')
    return soup.get_text()
