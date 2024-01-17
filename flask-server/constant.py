from opc_tags import OPC_Tag

tables_list = ["level", "liquid_temperature", "heating_temperature", "input_flow", "output_flow", "agitator_speed", "states"]

tags = {
    "agitator_speed": None,
    "agitator_state": None,
    "cleaning": None,
    "emptying_state": None,
    "filling_state": None,
    "heating_state": None,
    "heating_temperature": None,
    "input_flow": None,
    "input_state": None,
    "level": None,
    "liquid_temperature": None,
    "maintenance": None,
    "manual_mode": None,
    "output_flow": None,
    "output_state": None,
}

state_tags = [
    OPC_Tag("agitator_state", False),
    OPC_Tag("cleaning_state", False),
    OPC_Tag("heating_state", False),
    OPC_Tag("input_state", False),
    OPC_Tag("maintenance", False),
    OPC_Tag("operating_state", False),
    OPC_Tag("manual_mode", False),
    OPC_Tag("output_state", False),
]
