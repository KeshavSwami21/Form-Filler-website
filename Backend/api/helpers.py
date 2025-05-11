import re
import uuid
from bs4 import BeautifulSoup
import os
import uuid

def replace_placeholders(html, input_fields):
    for field in input_fields:
        placeholder = field.get("name")
        value = field.get("value", "")
        if placeholder:
            html = re.sub(rf"\{{{{\s*{re.escape(placeholder)}\s*}}}}", value, html)
    return html

def create_template_id():
    return f"temp_{uuid.uuid4()}"

def create_filled_temp_id():
    return f"FT_{uuid.uuid4()}"

def fill_template_file(html_file, input_fields):
    # Read the original HTML
    soup = BeautifulSoup(html_file, 'html.parser')
    print(2)
    # Fill in values based on id
    for field in input_fields:
        if not field["value"]:
            continue
        if field['id']=="Jap_NatMonth":
            tag1 = soup.find('div', id="exYear")
            tag2 = soup.find('div', id="exMonth")
            val_lst = field["value"].split("-")
            if tag1:
                tag1.string = val_lst[0][2:]
            if tag2:
                tag2.string =val_lst[1]

        elif field['id']=="dob":
            lst = ["dobYear","dobMonth","dobDay"]
            val_lst = field["value"].split("-")
            for i in range(3):
                tag = soup.find('div', id=lst[i])
                if tag:
                    tag.string = val_lst[i]

        elif field['id']=="PFMonth":
            lst = ["PFyear","PFmonth"]
            val_lst = field["value"].split("-")
            for i in range(2):
                tag = soup.find('div', id=lst[i])
                if tag:
                    tag.string = val_lst[i]
        elif field['id']=="PTMonth":
            lst = ["PTyear","PTmonth"]
            val_lst = field["value"].split("-")
            for i in range(2):
                tag = soup.find('div', id=lst[i])
                if tag:
                    tag.string = val_lst[i]
        elif field['id']=="VisitTMonth":
            lst = ["VisitTyear","VisitTmonth"]
            val_lst = field["value"].split("-")
            for i in range(2):
                tag = soup.find('div', id=lst[i])
                if tag:
                    tag.string = val_lst[i]
        elif field['id']=="LSFMonth":
            lst = ["LSFyear","LSFmonth"]
            val_lst = field["value"].split("-")
            for i in range(2):
                tag = soup.find('div', id=lst[i])
                if tag:
                    tag.string = val_lst[i]
        elif field['id']=="LSTMonth":
            lst = ["LSTyear","LSTmonth"]
            val_lst = field["value"].split("-")
            for i in range(2):
                tag = soup.find('div', id=lst[i])
                if tag:
                    tag.string = val_lst[i]
        elif field['id']=="USFMonth":
            lst = ["USFyear","USFmonth"]
            val_lst = field["value"].split("-")
            for i in range(2):
                tag = soup.find('div', id=lst[i])
                if tag:
                    tag.string = val_lst[i]
        elif field['id']=="USTMonth":
            lst = ["USTyear","USTmonth"]
            val_lst = field["value"].split("-")
            for i in range(2):
                tag = soup.find('div', id=lst[i])
                if tag:
                    tag.string = val_lst[i]
        elif field['id']=="TFMonth":
            lst = ["TFyear","TFmonth"]
            val_lst = field["value"].split("-")
            for i in range(2):
                tag = soup.find('div', id=lst[i])
                if tag:
                    tag.string = val_lst[i]
        elif field['id']=="TTMonth":
            lst = ["TTyear","TTmonth"]
            val_lst = field["value"].split("-")
            for i in range(2):
                tag = soup.find('div', id=lst[i])
                if tag:
                    tag.string = val_lst[i]
        elif field['id']=="VisitFMonth":
            lst = ["VisitFyear","VisitFmonth"]
            val_lst = field["value"].split("-")
            for i in range(2):
                tag = soup.find('div', id=lst[i])
                if tag:
                    tag.string = val_lst[i]
        elif field['id']=="VisitFMonth2":
            lst = ["VisitFyear2","VisitFmonth2"]
            val_lst = field["value"].split("-")
            for i in range(2):
                tag = soup.find('div', id=lst[i])
                if tag:
                    tag.string = val_lst[i]
        elif field['id']=="VisitTMonth2":
            lst = ["VisitTyear2","VisitTmonth2"]
            val_lst = field["value"].split("-")
            for i in range(2):
                tag = soup.find('div', id=lst[i])
                if tag:
                    tag.string = val_lst[i]
        elif field['id']=="DOA":
            lst = ["DOAYear","DOAMonth","DOADay"]
            val_lst = field["value"].split("-")
            for i in range(3):
                tag = soup.find('div', id=lst[i])
                if tag:
                    if i==0:
                        tag.string = val_lst[i][2:]
                    else:
                        tag.string = val_lst[i]
        else:
            tag = soup.find('div', id=field['id'])
            if tag:
                tag.string = field['value']
    print(3)
    output_path = f"{uuid.uuid4()}_filled.html"

    # Write the updated HTML to new file
    with open(output_path, 'w', encoding='utf-8') as file:
        file.write(str(soup))
    print(4)
    return output_path

def insert_image_url_in_html(html_path, image_obj, img_tag_id, request):
    """
    Inserts the full image URL into the <img> tag with the given ID for cross-origin frontend use.
    """
    with open(html_path, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f, "html.parser")

    img_tag = soup.find("img", {"id": img_tag_id})
    if img_tag:
        full_url = request.build_absolute_uri(image_obj.url)  # 🔥 Full URL for cross-server
        img_tag['src'] = full_url
    else:
        raise Exception(f"No <img> tag found with id '{img_tag_id}'")

    with open(html_path, "w", encoding="utf-8") as f:
        f.write(str(soup))

    return html_path

