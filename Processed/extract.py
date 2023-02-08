import re  
import json
with open("races.json", "r") as ff:

    file_content = json.load(ff)

    data = file_content["subjectMappings"][0]

    class_name = data["typeMappings"][0]["valueSource"]["constant"]
    class_prefix = data["typeMappings"][0]["prefix"]
    print(f"{class_prefix}:{class_name} a rdf:Class .")

    bnode_class_defined = []

    for prop in data["propertyMappings"]:

        prop_name = prop["valueSource"]["constant"]

        type_prop = prop["objectMappings"][0]["valueType"]["type"]

        if type_prop == "iri":
            type_prefix = prop["objectMappings"][0]["typeMappings"][0]["prefix"]
            type_name = prop["objectMappings"][0]["typeMappings"][0]["valueSource"]["constant"]
        elif type_prop == "datatype_literal":
            type_prefix = prop["objectMappings"][0]["valueType"]["datatype"]["prefix"]
            type_name = prop["objectMappings"][0]["valueType"]["datatype"]["valueSource"]["constant"]
        elif type_prop == "literal":
            type_prefix = "xsd"
            type_name = "string"
        elif type_prop == "bnode":
            
            bnode_class = prop["objectMappings"][0]["typeMappings"][0]["valueSource"]["constant"]
            print(f"\n:{bnode_class} a rdf:Class .")

            if bnode_class not in bnode_class_defined:

                bnode_class_defined.append(bnode_class)

                for bnode_prop in prop["objectMappings"][0]["propertyMappings"]:

                    bnode_prop_name = bnode_prop["valueSource"]["constant"]
                    bnode_type_prop = bnode_prop["objectMappings"][0]["valueType"]["type"]

                    if bnode_type_prop == "iri":
                        bnode_type_prefix = bnode_prop["objectMappings"][0]["typeMappings"][0]["prefix"]
                        bnode_type_name = bnode_prop["objectMappings"][0]["typeMappings"][0]["valueSource"]["constant"]
                    elif bnode_type_prop == "datatype_literal":
                        bnode_type_prefix = bnode_prop["objectMappings"][0]["valueType"]["datatype"]["prefix"]
                        bnode_type_name = bnode_prop["objectMappings"][0]["valueType"]["datatype"]["valueSource"]["constant"]
                    elif bnode_type_prop == "literal":
                        bnode_type_prefix = "xsd"
                        bnode_type_name = "string"

                    print()
                    print(":" + bnode_prop_name + " a rdf:Property" + " .")
                    print(":" + bnode_prop_name + " rdfs:domain :" + bnode_class + " .")
                    print(":" + bnode_prop_name + " rdfs:range " + bnode_type_prefix + ":" + bnode_type_name + " .")

        else:
            print("ERROR : type_prop -->", type_prop)
            exit()
        print()
        print(":" + prop_name + " a rdf:Property" + " .")
        print(":" + prop_name + " rdfs:domain :" + class_name + " .")
        print(":" + prop_name + " rdfs:range " + type_prefix + ":" + type_name + " .")