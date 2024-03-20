import xml.etree.ElementTree as ET
import xml.dom.minidom as minidom

namespace = "http://www.kith.no/xmlstds/eresept/m30/2014-12-01"
ET.register_namespace('', namespace)

xml_file_path = 'fest251.xml'
tree = ET.parse(xml_file_path)
root = tree.getroot()

new_root = ET.Element("DrugInteractions", xmlns=namespace)

ns = {"ns": namespace}
fields_to_keep = [
	{
		"field": "Relevans",
		"engField": "Severity"
	},
	{
		"field": "Situasjonskriterium",
		"engField": "SituationCriterion"
	},
	{
		"field": "KliniskKonsekvens",
		"engField": "ClinicalConsequence"
	},
	{
		"field": "Handtering",
		"engField": "Instructions"
	}
]

for oppf_interaksjon in root.findall(".//ns:OppfInteraksjon", namespaces=ns):
	for interaksjon in oppf_interaksjon.findall("ns:Interaksjon", namespaces=ns):
		new_interaksjon = ET.SubElement(new_root, "Interaction")

		for field_to_keep in fields_to_keep:
			element = interaksjon.find(f".//ns:{field_to_keep["field"]}", namespaces=ns)

			if element is not None:
				new_element = ET.SubElement(new_interaksjon, field_to_keep["engField"])

				for attr_key, attr_value in element.attrib.items():
					new_element.set(attr_key, attr_value)

				if element.text is not None:
					new_element.text = element.text.strip()

		substansgruppe_elements = interaksjon.findall("ns:Substansgruppe", namespaces=ns)
		for substansgruppe_element in substansgruppe_elements:
			substans_elements = substansgruppe_element.findall("ns:Substans", namespaces=ns)

			if substans_elements:
				new_substansgruppe = ET.SubElement(new_interaksjon, "DrugGroup")

				for substans_element in substans_elements:
					new_substans = ET.SubElement(new_substansgruppe, "Drug")

					substans_name_element = substans_element.find("ns:Substans", namespaces=ns)
					if substans_name_element is not None:
						new_substans_name = ET.SubElement(new_substans, "DrugName")
						new_substans_name.text = substans_name_element.text.strip()

					atc_element = substans_element.find("ns:Atc", namespaces=ns)
					if atc_element is not None:
						new_atc = ET.SubElement(new_substans, "Atc")

						for atc_attr_key, atc_attr_value in atc_element.attrib.items():
							if atc_attr_key != "DN":
								new_atc.set(atc_attr_key, atc_attr_value)

new_tree = ET.ElementTree(new_root)
new_xml_file_path = "drug_interactions.xml"
new_tree.write(new_xml_file_path, encoding="utf-8", xml_declaration=True, method="xml", short_empty_elements=False)

xml_content = ET.tostring(new_root, encoding="utf-8", method="xml").decode()
dom = minidom.parseString(xml_content)
pretty_xml = dom.toprettyxml(indent="   ")

with open(new_xml_file_path, "w", encoding="utf-8") as output_file:
	output_file.write(pretty_xml)
