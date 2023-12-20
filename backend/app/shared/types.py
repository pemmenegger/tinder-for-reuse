######################################################################
# THIS FILE WILL BE SHARED AND COPIED TO THE RELEVANT CONTAINERS     #
# DO ONLY CHANGE IT IN ./shared/                                     #
######################################################################


class UnifiedType:
    def __init__(self, id: int, discriminator: str, value: str):
        self.id = id
        self.discriminator = discriminator
        self.value = value


def get_all_unified_types():
    type_classes = [
        BuildingElementUnitType,
        BuildingElementWorksheetType,
        MaterialType,
        AuthorizedVehicleType,
        CircularStrategyType,
        WasteCodeType,
        CircularServiceType,
        HealthStatusType,
        ReusePotentialType,
        RecyclingPotentialType,
    ]
    unified_types = []
    for type_class in type_classes:
        for _, attr_value in type_class.__dict__.items():
            if isinstance(attr_value, UnifiedType):
                unified_types.append(
                    {"id": attr_value.id, "discriminator": attr_value.discriminator, "value": attr_value.value}
                )
    return unified_types


######################################################################
# IMPORTANT: SYNC ID AND NAME/LABEL WITH CORRESPINDING DATABASE TYPE #
######################################################################


class BuildingElementUnitType:
    DISCRIMINATOR = "BUILDING_ELEMENT_UNIT"

    ML = UnifiedType(id=1, discriminator=DISCRIMINATOR, value="ml")
    M2 = UnifiedType(id=2, discriminator=DISCRIMINATOR, value="m²")
    M3 = UnifiedType(id=3, discriminator=DISCRIMINATOR, value="m³")
    U = UnifiedType(id=4, discriminator=DISCRIMINATOR, value="U")
    ENS = UnifiedType(id=5, discriminator=DISCRIMINATOR, value="ens")
    KG = UnifiedType(id=6, discriminator=DISCRIMINATOR, value="kg")


class BuildingElementWorksheetType:
    DISCRIMINATOR = "BUILDING_ELEMENT_WORKSHEET"

    STRUCTURE = UnifiedType(id=1, discriminator=DISCRIMINATOR, value="STRUCTURE")
    SECOND_OEUVRE = UnifiedType(id=2, discriminator=DISCRIMINATOR, value="SECOND OEUVRE")
    RESEAUX = UnifiedType(id=3, discriminator=DISCRIMINATOR, value="RESEAUX")
    AMENAGEMENT_EXT = UnifiedType(id=4, discriminator=DISCRIMINATOR, value="AMENAGEMENT EXT")
    DECHETS_RESIDUELS = UnifiedType(id=5, discriminator=DISCRIMINATOR, value="DECHETS RESIDUELS")
    DEEE = UnifiedType(id=6, discriminator=DISCRIMINATOR, value="DEEE")
    DEA = UnifiedType(id=7, discriminator=DISCRIMINATOR, value="DEA")


class MaterialType:
    DISCRIMINATOR = "MATERIAL"

    INERT = UnifiedType(id=1, discriminator=DISCRIMINATOR, value="Inert")
    HAZARDOUS = UnifiedType(id=2, discriminator=DISCRIMINATOR, value="Hazardous")
    CONCRETE = UnifiedType(id=3, discriminator=DISCRIMINATOR, value="Concrete")
    WOOD = UnifiedType(id=4, discriminator=DISCRIMINATOR, value="Wood")
    METALS = UnifiedType(id=5, discriminator=DISCRIMINATOR, value="Metals")
    PLASTER = UnifiedType(id=6, discriminator=DISCRIMINATOR, value="Plaster")
    RIGID_PLASTICS_AND_PVC = UnifiedType(id=7, discriminator=DISCRIMINATOR, value="Rigid Plastics & PVC")
    GLAZED_WINDOWS = UnifiedType(id=8, discriminator=DISCRIMINATOR, value="Glazed Windows")
    GLASS_WOOL = UnifiedType(id=9, discriminator=DISCRIMINATOR, value="Glass Wool")
    ROCK_WOOL = UnifiedType(id=10, discriminator=DISCRIMINATOR, value="Rock Wool")
    EXPANDED_POLYSTYRENE = UnifiedType(id=11, discriminator=DISCRIMINATOR, value="Expanded Polystyrene (EPS)")
    POLYURETHANE = UnifiedType(id=12, discriminator=DISCRIMINATOR, value="Polyurethane")
    BIO_BASED_INSULATORS = UnifiedType(id=13, discriminator=DISCRIMINATOR, value="Bio-based Insulators")
    BITUMINOUS_MEMBRANES = UnifiedType(id=14, discriminator=DISCRIMINATOR, value="Bituminous Membranes")
    NON_PVC_FLOOR_COVERINGS = UnifiedType(id=15, discriminator=DISCRIMINATOR, value="Non-PVC Floor Coverings")
    PVC_FLOOR_COVERINGS = UnifiedType(id=16, discriminator=DISCRIMINATOR, value="PVC Floor Coverings")
    VINTAGE = UnifiedType(id=17, discriminator=DISCRIMINATOR, value="Vintage")
    FLAT_GLASS = UnifiedType(id=18, discriminator=DISCRIMINATOR, value="Flat Glass")
    ELECTRICAL_AND_ELECTRONIC_EQUIPMENT = UnifiedType(
        id=19, discriminator=DISCRIMINATOR, value="Electrical and Electronic Equipment"
    )
    FURNITURE_COMPONENTS = UnifiedType(id=20, discriminator=DISCRIMINATOR, value="Furniture Components")
    UNSORTED = UnifiedType(id=21, discriminator=DISCRIMINATOR, value="Unsorted")


class AuthorizedVehicleType:
    DISCRIMINATOR = "AUTHORIZED_VEHICLE"

    SMALL_VAN = UnifiedType(id=1, discriminator=DISCRIMINATOR, value="Small Van (3 to 5 m³)")
    MEDIUM_VAN = UnifiedType(id=2, discriminator=DISCRIMINATOR, value="Medium Van (6 to 12 m³)")
    FLATBED_TRUCK = UnifiedType(id=3, discriminator=DISCRIMINATOR, value="Flatbed Truck (Over 12 m³)")


class CircularStrategyType:
    DISCRIMINATOR = "CIRCULAR_STRATEGY"

    REUSE = UnifiedType(id=1, discriminator=DISCRIMINATOR, value="Reuse")
    RECYCLING = UnifiedType(id=2, discriminator=DISCRIMINATOR, value="Recycling")
    REPARATION = UnifiedType(id=3, discriminator=DISCRIMINATOR, value="Reparation")
    ENERGY_VALORIZATION = UnifiedType(id=4, discriminator=DISCRIMINATOR, value="Energy Valorization")
    DISPOSAL = UnifiedType(id=5, discriminator=DISCRIMINATOR, value="Disposal")


class WasteCodeType:
    DISCRIMINATOR = "WASTE_CODE"

    _020103 = UnifiedType(id=1, discriminator=DISCRIMINATOR, value="02 01 03")
    _160504 = UnifiedType(id=2, discriminator=DISCRIMINATOR, value="16 05 04*")
    _170101 = UnifiedType(id=3, discriminator=DISCRIMINATOR, value="17 01 01")
    _170102 = UnifiedType(id=4, discriminator=DISCRIMINATOR, value="17 01 02")
    _170103 = UnifiedType(id=5, discriminator=DISCRIMINATOR, value="17 01 03")
    _170106 = UnifiedType(id=6, discriminator=DISCRIMINATOR, value="17 01 06*")
    _170107 = UnifiedType(id=7, discriminator=DISCRIMINATOR, value="17 01 07")
    _170201 = UnifiedType(id=8, discriminator=DISCRIMINATOR, value="17 02 01")
    _170202 = UnifiedType(id=9, discriminator=DISCRIMINATOR, value="17 02 02")
    _170203 = UnifiedType(id=10, discriminator=DISCRIMINATOR, value="17 02 03")
    _170204 = UnifiedType(id=11, discriminator=DISCRIMINATOR, value="17 02 04")
    _170301 = UnifiedType(id=12, discriminator=DISCRIMINATOR, value="17 03 01")
    _170302 = UnifiedType(id=13, discriminator=DISCRIMINATOR, value="17 03 02")
    _170303 = UnifiedType(id=14, discriminator=DISCRIMINATOR, value="17 03 03")
    _170401 = UnifiedType(id=15, discriminator=DISCRIMINATOR, value="17 04 01")
    _170402 = UnifiedType(id=16, discriminator=DISCRIMINATOR, value="17 04 02")
    _170403 = UnifiedType(id=17, discriminator=DISCRIMINATOR, value="17 04 03")
    _170404 = UnifiedType(id=18, discriminator=DISCRIMINATOR, value="17 04 04")
    _170405 = UnifiedType(id=19, discriminator=DISCRIMINATOR, value="17 04 05")
    _170406 = UnifiedType(id=20, discriminator=DISCRIMINATOR, value="17 04 06")
    _170407 = UnifiedType(id=21, discriminator=DISCRIMINATOR, value="17 04 07")
    _170409 = UnifiedType(id=22, discriminator=DISCRIMINATOR, value="17 04 09")
    _170410 = UnifiedType(id=23, discriminator=DISCRIMINATOR, value="17 04 10")
    _170411 = UnifiedType(id=24, discriminator=DISCRIMINATOR, value="17 04 11")
    _170503 = UnifiedType(id=25, discriminator=DISCRIMINATOR, value="17 05 03")
    _170504 = UnifiedType(id=26, discriminator=DISCRIMINATOR, value="17 05 04")
    _170505 = UnifiedType(id=27, discriminator=DISCRIMINATOR, value="17 05 05")
    _170506 = UnifiedType(id=28, discriminator=DISCRIMINATOR, value="17 05 06")
    _170507 = UnifiedType(id=29, discriminator=DISCRIMINATOR, value="17 05 07")
    _170508 = UnifiedType(id=30, discriminator=DISCRIMINATOR, value="17 05 08")
    _170601 = UnifiedType(id=31, discriminator=DISCRIMINATOR, value="17 06 01")
    _170603 = UnifiedType(id=32, discriminator=DISCRIMINATOR, value="17 06 03")
    _170604 = UnifiedType(id=33, discriminator=DISCRIMINATOR, value="17 06 04")
    _170605 = UnifiedType(id=34, discriminator=DISCRIMINATOR, value="17 06 05")
    _170801 = UnifiedType(id=35, discriminator=DISCRIMINATOR, value="17 08 01")
    _170802 = UnifiedType(id=36, discriminator=DISCRIMINATOR, value="17 08 02")
    _170901 = UnifiedType(id=37, discriminator=DISCRIMINATOR, value="17 09 01")
    _170902 = UnifiedType(id=38, discriminator=DISCRIMINATOR, value="17 09 02")
    _170903 = UnifiedType(id=39, discriminator=DISCRIMINATOR, value="17 09 03")
    _170904 = UnifiedType(id=40, discriminator=DISCRIMINATOR, value="17 09 04")
    _200136 = UnifiedType(id=41, discriminator=DISCRIMINATOR, value="20 01 36")


class CircularServiceType:
    DISCRIMINATOR = "CIRCULAR_SERVICE"

    DEMOLITION = UnifiedType(id=1, discriminator=DISCRIMINATOR, value="Demolition")
    CLEANING = UnifiedType(id=2, discriminator=DISCRIMINATOR, value="Cleaning")
    CAREFUL_REMOVAL = UnifiedType(id=3, discriminator=DISCRIMINATOR, value="Careful Removal")
    REPARATION = UnifiedType(id=4, discriminator=DISCRIMINATOR, value="Reparation")
    RECLAMATION = UnifiedType(id=5, discriminator=DISCRIMINATOR, value="Reclamation")


class HealthStatusType:
    DISCRIMINATOR = "HEALTH_STATUS"

    ASBESTOS = UnifiedType(id=1, discriminator=DISCRIMINATOR, value="Asbestos")
    LEAD = UnifiedType(id=2, discriminator=DISCRIMINATOR, value="Lead")
    TERMITES = UnifiedType(id=3, discriminator=DISCRIMINATOR, value="Termites")
    DAMAGED = UnifiedType(id=4, discriminator=DISCRIMINATOR, value="Damaged")
    NOT_DAMAGED = UnifiedType(id=5, discriminator=DISCRIMINATOR, value="Not Damaged")
    HETEROGENEOUS = UnifiedType(id=6, discriminator=DISCRIMINATOR, value="Heterogeneous")
    UNCLEAR = UnifiedType(id=7, discriminator=DISCRIMINATOR, value="Unclear")


class ReusePotentialType:
    DISCRIMINATOR = "REUSE_POTENTIAL"

    IN_SITU = UnifiedType(id=1, discriminator=DISCRIMINATOR, value="IN SITU")
    HIGH = UnifiedType(id=2, discriminator=DISCRIMINATOR, value="High")
    MEDIUM = UnifiedType(id=3, discriminator=DISCRIMINATOR, value="Medium")
    LOW = UnifiedType(id=4, discriminator=DISCRIMINATOR, value="Low")


class RecyclingPotentialType:
    DISCRIMINATOR = "RECYCLING_POTENTIAL"

    IN_SITU = UnifiedType(id=1, discriminator=DISCRIMINATOR, value="IN SITU")
    HIGH = UnifiedType(id=2, discriminator=DISCRIMINATOR, value="High")
    MEDIUM = UnifiedType(id=3, discriminator=DISCRIMINATOR, value="Medium")
    LOW = UnifiedType(id=4, discriminator=DISCRIMINATOR, value="Low")
