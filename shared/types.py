######################################################################
# THIS FILE WILL BE SHARED AND COPIED TO THE RELEVANT CONTAINERS     #
# DO ONLY CHANGE IT IN ./shared/                                     #
######################################################################

from enum import Enum

######################################################################
# IMPORTANT: SYNC ID AND NAME/LABEL WITH CORRESPINDING DATABASE TYPE #
######################################################################


class RondasTypesEnum(Enum):
    """
    Base class for custom enums.
    Provides a common constructor for enums with additional fields.
    """

    def __init__(self, *args):
        self.id = args[0]
        if len(args) > 1:
            self.label = args[1]
        if len(args) > 2:
            self.slug = args[2]


class ItemCategoryEnum(RondasTypesEnum):
    BUILDING_ELEMENT = (1, "Building Element", "building-elements")


class BuildingElementUnitEnum(RondasTypesEnum):
    ML = (1, "ml")
    M2 = (2, "m²")
    M3 = (3, "m³")
    U = (4, "U")
    ENS = (5, "ens")


class MaterialEnum(RondasTypesEnum):
    INERT_WASTE = (1, "Inert Waste")
    CONCRETE = (2, "Concrete")
    WOOD = (3, "Wood")
    METALS = (4, "Metals")
    PLASTER = (5, "Plaster")
    RIGID_PLASTICS_AND_PVC = (6, "Rigid Plastics & PVC")
    GLAZED_JOINERY = (7, "Glazed Joinery")
    GLASS_WOOL = (8, "Glass Wool")
    ROCK_WOOL = (9, "Rock Wool")
    EXPANDED_POLYSTYRENE = (10, "Expanded Polystyrene (EPS)")
    POLYURETHANE = (11, "Polyurethane")
    BIO_BASED_INSULATORS = (12, "Bio-based Insulators")
    BITUMINOUS_MEMBRANES = (13, "Bituminous Membranes")
    NON_PVC_FLOOR_COVERINGS = (14, "Non-PVC Floor Coverings")
    PVC_FLOOR_COVERINGS = (15, "PVC Floor Coverings")


class AuthorizedVehicleEnum(RondasTypesEnum):
    SMALL_VAN = (1, "Small Van (3 to 5 m³)")
    MEDIUM_VAN = (2, "Medium Van (6 to 12 m³)")
    FLATBED_TRUCK = (3, "Flatbed Truck (Over 12 m³)")


class CircularStrategyEnum(RondasTypesEnum):
    REUSE = (1, "Reuse")
    RECYCLING = (2, "Recycling")
    REPARATION = (3, "Reparation")
    ENERGY_VALORIZATION = (4, "Energy Valorization")
    DISPOSAL = (5, "Disposal")


class WasteCodeEnum(RondasTypesEnum):
    _170101 = (1, "17 01 01")
    _170102 = (2, "17 01 02")
    _170103 = (3, "17 01 03")
    _170106 = (4, "17 01 06")
    _170107 = (5, "17 01 07")
    _170201 = (6, "17 02 01")
    _170202 = (7, "17 02 02")
    _170203 = (8, "17 02 03")
    _170204 = (9, "17 02 04")
    _170301 = (10, "17 03 01")
    _170302 = (11, "17 03 02")
    _170303 = (12, "17 03 03")
    _170401 = (13, "17 04 01")
    _170402 = (14, "17 04 02")
    _170403 = (15, "17 04 03")
    _170404 = (16, "17 04 04")
    _170405 = (17, "17 04 05")
    _170406 = (18, "17 04 06")
    _170407 = (19, "17 04 07")
    _170409 = (20, "17 04 09")
    _170410 = (21, "17 04 10")
    _170411 = (22, "17 04 11")
    _170503 = (23, "17 05 03")
    _170504 = (24, "17 05 04")
    _170505 = (25, "17 05 05")
    _170506 = (26, "17 05 06")
    _170507 = (27, "17 05 07")
    _170508 = (28, "17 05 08")
    _170601 = (29, "17 06 01")
    _170603 = (30, "17 06 03")
    _170604 = (31, "17 06 04")
    _170605 = (32, "17 06 05")
    _170801 = (33, "17 08 01")
    _170802 = (34, "17 08 02")
    _170901 = (35, "17 09 01")
    _170902 = (36, "17 09 02")
    _170903 = (37, "17 09 03")
    _170904 = (38, "17 09 04")
