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


class CollectorCollectionEnum(RondasTypesEnum):
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


class CollectorAuthorizedVehicleEnum(RondasTypesEnum):
    SMALL_VAN = (1, "Small Van (3 to 5 m³)")
    MEDIUM_VAN = (2, "Medium Van (6 to 12 m³)")
    FLATBED_TRUCK = (3, "Flatbed Truck (Over 12 m³)")


class CollectorMaterialRecoveryEnum(RondasTypesEnum):
    REUSE = (1, "Reuse")
    RECYCLING = (2, "Recycling")
    REPARATION = (3, "Reparation")
