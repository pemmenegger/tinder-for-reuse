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


# class ItemCrawlerEnum(RondasTypesEnum):
#     TUTTI = (1, "Tutti")
#     ANIBIS = (2, "Anibis")
#     RICARDO = (3, "Ricardo")


class BuildingElementUnitEnum(RondasTypesEnum):
    ML = (1, "ml")
    M2 = (2, "m²")
    M3 = (3, "m³")
    U = (4, "U")
    ENS = (5, "ens")
