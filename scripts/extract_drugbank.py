import xml.etree.ElementTree as ET
import xml.dom.minidom as minidom

namespace = "http://www.drugbank.ca"
ET.register_namespace('', namespace)

xml_file_path = '../data/drugbank.xml'
tree = ET.parse(xml_file_path)
root = tree.getroot()

new_root = ET.Element("drugbank", xmlns=namespace)

fields_to_keep = [
	"drugbank-id",
	"name",
	"description",
	"atc-codes",
	"food-interactions",
	"drug-interactions"
]

for item in root.findall("ns:drug", namespaces={"ns": namespace}):
	new_item = ET.SubElement(new_root, "drug")
	should_add_item = False

	for field_to_keep in fields_to_keep:
		if field_to_keep == "drugbank-id":
			element = item.find("./ns:drugbank-id[@primary='true']", namespaces={"ns": namespace})
		else:
			element = item.find(f"./ns:{field_to_keep}", namespaces={"ns": namespace})

		if element is not None:
			if field_to_keep == "atc-codes":
				sub_elements = element.findall(f".//ns:atc-code", namespaces={"ns": namespace})
				if sub_elements:
					should_add_item = True
					new_element = ET.SubElement(new_item, field_to_keep)
					for sub_element in sub_elements:
						new_sub_element = ET.SubElement(new_element, sub_element.tag.split("}")[-1])
						new_sub_element.text = sub_element.get('code')
			elif field_to_keep == "food-interactions":
				sub_elements = element.findall(".//ns:*", namespaces={"ns": namespace})
				if sub_elements:
					should_add_item = True
					new_element = ET.SubElement(new_item, field_to_keep)
					for sub_element in sub_elements:
						sub_field_name = sub_element.tag.split("}")[-1]
						new_sub_element = ET.SubElement(new_element, sub_field_name)
						new_sub_element.text = sub_element.text.strip() if sub_element.text else ""
			elif field_to_keep == "drug-interactions":
				sub_elements = element.findall(".//ns:drug-interaction", namespaces={"ns": namespace})
				if sub_elements:
					should_add_item = True
					new_element = ET.SubElement(new_item, field_to_keep)
					for sub_element in sub_elements:
						new_sub_element = ET.SubElement(new_element, "drug-interaction")
						for sub_sub_element in sub_element:
							new_sub_sub_element = ET.SubElement(new_sub_element, sub_sub_element.tag.split("}")[-1])
							new_sub_sub_element.text = sub_sub_element.text.strip() if sub_sub_element.text else ""
			else:
				if field_to_keep == "description" and element.text and element.text.strip():
					should_add_item = True
					new_element = ET.SubElement(new_item, field_to_keep)
					new_element.text = element.text.strip()
				elif field_to_keep != "description":
					should_add_item = True
					new_element = ET.SubElement(new_item, field_to_keep)
					if element.text is not None:
						new_element.text = element.text.strip()

	if not should_add_item:
		new_root.remove(new_item)

new_tree = ET.ElementTree(new_root)
new_xml_file_path = "../data/drugbank_filtered.xml"
new_tree.write(new_xml_file_path, encoding="utf-8", xml_declaration=True, method="xml", short_empty_elements=False)

xml_content = ET.tostring(new_root, encoding="utf-8", method="xml").decode()
dom = minidom.parseString(xml_content)
pretty_xml = dom.toprettyxml(indent="   ")

with open(new_xml_file_path, "w", encoding="utf-8") as output_file:
	output_file.write(pretty_xml)
