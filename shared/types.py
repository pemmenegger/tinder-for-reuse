######################################################################
# THIS FILE WILL BE SHARED AND COPIED TO THE RELEVANT CONTAINERS     #
# DO ONLY CHANGE IT IN ./shared/                                     #
######################################################################


class UnifiedType:
    def __init__(self, discriminator: str, type_id: int, type_label: str):
        self.discriminator = discriminator
        self.type_id = type_id
        self.type_label = type_label


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
        unified_types.extend(
            {
                "discriminator": attr_value.discriminator,
                "type_id": attr_value.type_id,
                "type_label": attr_value.type_label,
            }
            for _, attr_value in type_class.__dict__.items()
            if isinstance(attr_value, UnifiedType)
        )
    return unified_types


class BuildingElementUnitType:
    DISCRIMINATOR = "BUILDING_ELEMENT_UNIT"

    ML = UnifiedType(discriminator=DISCRIMINATOR, type_id=1, type_label="ml")
    M2 = UnifiedType(discriminator=DISCRIMINATOR, type_id=2, type_label="m²")
    M3 = UnifiedType(discriminator=DISCRIMINATOR, type_id=3, type_label="m³")
    U = UnifiedType(discriminator=DISCRIMINATOR, type_id=4, type_label="U")
    ENS = UnifiedType(discriminator=DISCRIMINATOR, type_id=5, type_label="ens")
    KG = UnifiedType(discriminator=DISCRIMINATOR, type_id=6, type_label="kg")


class BuildingElementWorksheetType:
    DISCRIMINATOR = "BUILDING_ELEMENT_WORKSHEET"

    STRUCTURE = UnifiedType(discriminator=DISCRIMINATOR, type_id=1, type_label="STRUCTURE")
    SECOND_OEUVRE = UnifiedType(discriminator=DISCRIMINATOR, type_id=2, type_label="SECOND OEUVRE")
    RESEAUX = UnifiedType(discriminator=DISCRIMINATOR, type_id=3, type_label="RESEAUX")
    AMENAGEMENT_EXT = UnifiedType(discriminator=DISCRIMINATOR, type_id=4, type_label="AMENAGEMENT EXT")
    DECHETS_RESIDUELS = UnifiedType(discriminator=DISCRIMINATOR, type_id=5, type_label="DECHETS RESIDUELS")
    DEEE = UnifiedType(discriminator=DISCRIMINATOR, type_id=6, type_label="DEEE")
    DEA = UnifiedType(discriminator=DISCRIMINATOR, type_id=7, type_label="DEA")


class MaterialType:
    DISCRIMINATOR = "MATERIAL"

    INERT = UnifiedType(discriminator=DISCRIMINATOR, type_id=1, type_label="Inert")
    HAZARDOUS = UnifiedType(discriminator=DISCRIMINATOR, type_id=2, type_label="Hazardous")
    CONCRETE = UnifiedType(discriminator=DISCRIMINATOR, type_id=3, type_label="Concrete")
    WOOD = UnifiedType(discriminator=DISCRIMINATOR, type_id=4, type_label="Wood")
    METALS = UnifiedType(discriminator=DISCRIMINATOR, type_id=5, type_label="Metals")
    PLASTER = UnifiedType(discriminator=DISCRIMINATOR, type_id=6, type_label="Plaster")
    RIGID_PLASTICS_AND_PVC = UnifiedType(discriminator=DISCRIMINATOR, type_id=7, type_label="Rigid Plastics & PVC")
    GLAZED_WINDOWS = UnifiedType(discriminator=DISCRIMINATOR, type_id=8, type_label="Glazed Windows")
    GLASS_WOOL = UnifiedType(discriminator=DISCRIMINATOR, type_id=9, type_label="Glass Wool")
    ROCK_WOOL = UnifiedType(discriminator=DISCRIMINATOR, type_id=10, type_label="Rock Wool")
    EXPANDED_POLYSTYRENE = UnifiedType(discriminator=DISCRIMINATOR, type_id=11, type_label="Expanded Polystyrene (EPS)")
    POLYURETHANE = UnifiedType(discriminator=DISCRIMINATOR, type_id=12, type_label="Polyurethane")
    BIO_BASED_INSULATORS = UnifiedType(discriminator=DISCRIMINATOR, type_id=13, type_label="Bio-based Insulators")
    BITUMINOUS_MEMBRANES = UnifiedType(discriminator=DISCRIMINATOR, type_id=14, type_label="Bituminous Membranes")
    NON_PVC_FLOOR_COVERINGS = UnifiedType(discriminator=DISCRIMINATOR, type_id=15, type_label="Non-PVC Floor Coverings")
    PVC_FLOOR_COVERINGS = UnifiedType(discriminator=DISCRIMINATOR, type_id=16, type_label="PVC Floor Coverings")
    VINTAGE = UnifiedType(discriminator=DISCRIMINATOR, type_id=17, type_label="Vintage")
    FLAT_GLASS = UnifiedType(discriminator=DISCRIMINATOR, type_id=18, type_label="Flat Glass")
    ELECTRICAL_AND_ELECTRONIC_EQUIPMENT = UnifiedType(
        discriminator=DISCRIMINATOR, type_id=19, type_label="Electrical and Electronic Equipment"
    )
    FURNITURE_COMPONENTS = UnifiedType(discriminator=DISCRIMINATOR, type_id=20, type_label="Furniture Components")
    UNSORTED = UnifiedType(discriminator=DISCRIMINATOR, type_id=21, type_label="Unsorted")
    TEXTILE = UnifiedType(discriminator=DISCRIMINATOR, type_id=22, type_label="Textile")


class AuthorizedVehicleType:
    DISCRIMINATOR = "AUTHORIZED_VEHICLE"

    SMALL_VAN = UnifiedType(discriminator=DISCRIMINATOR, type_id=1, type_label="Small Van (3 to 5 m³)")
    MEDIUM_VAN = UnifiedType(discriminator=DISCRIMINATOR, type_id=2, type_label="Medium Van (6 to 12 m³)")
    FLATBED_TRUCK = UnifiedType(discriminator=DISCRIMINATOR, type_id=3, type_label="Flatbed Truck (Over 12 m³)")


class CircularStrategyType:
    DISCRIMINATOR = "CIRCULAR_STRATEGY"

    REUSE = UnifiedType(discriminator=DISCRIMINATOR, type_id=1, type_label="Reuse")
    RECYCLING = UnifiedType(discriminator=DISCRIMINATOR, type_id=2, type_label="Recycling")
    REPARATION = UnifiedType(discriminator=DISCRIMINATOR, type_id=3, type_label="Reparation")
    ENERGY_VALORIZATION = UnifiedType(discriminator=DISCRIMINATOR, type_id=4, type_label="Energy Valorization")
    DISPOSAL = UnifiedType(discriminator=DISCRIMINATOR, type_id=5, type_label="Disposal")


class WasteCodeType:
    DISCRIMINATOR = "WASTE_CODE"

    _020103 = UnifiedType(discriminator=DISCRIMINATOR, type_id=1, type_label="02 01 03")
    _160504 = UnifiedType(discriminator=DISCRIMINATOR, type_id=2, type_label="16 05 04*")
    _170101 = UnifiedType(discriminator=DISCRIMINATOR, type_id=3, type_label="17 01 01")
    _170102 = UnifiedType(discriminator=DISCRIMINATOR, type_id=4, type_label="17 01 02")
    _170103 = UnifiedType(discriminator=DISCRIMINATOR, type_id=5, type_label="17 01 03")
    _170106 = UnifiedType(discriminator=DISCRIMINATOR, type_id=6, type_label="17 01 06*")
    _170107 = UnifiedType(discriminator=DISCRIMINATOR, type_id=7, type_label="17 01 07")
    _170201 = UnifiedType(discriminator=DISCRIMINATOR, type_id=8, type_label="17 02 01")
    _170202 = UnifiedType(discriminator=DISCRIMINATOR, type_id=9, type_label="17 02 02")
    _170203 = UnifiedType(discriminator=DISCRIMINATOR, type_id=10, type_label="17 02 03")
    _170204 = UnifiedType(discriminator=DISCRIMINATOR, type_id=11, type_label="17 02 04")
    _170301 = UnifiedType(discriminator=DISCRIMINATOR, type_id=12, type_label="17 03 01")
    _170302 = UnifiedType(discriminator=DISCRIMINATOR, type_id=13, type_label="17 03 02")
    _170303 = UnifiedType(discriminator=DISCRIMINATOR, type_id=14, type_label="17 03 03")
    _170401 = UnifiedType(discriminator=DISCRIMINATOR, type_id=15, type_label="17 04 01")
    _170402 = UnifiedType(discriminator=DISCRIMINATOR, type_id=16, type_label="17 04 02")
    _170403 = UnifiedType(discriminator=DISCRIMINATOR, type_id=17, type_label="17 04 03")
    _170404 = UnifiedType(discriminator=DISCRIMINATOR, type_id=18, type_label="17 04 04")
    _170405 = UnifiedType(discriminator=DISCRIMINATOR, type_id=19, type_label="17 04 05")
    _170406 = UnifiedType(discriminator=DISCRIMINATOR, type_id=20, type_label="17 04 06")
    _170407 = UnifiedType(discriminator=DISCRIMINATOR, type_id=21, type_label="17 04 07")
    _170409 = UnifiedType(discriminator=DISCRIMINATOR, type_id=22, type_label="17 04 09")
    _170410 = UnifiedType(discriminator=DISCRIMINATOR, type_id=23, type_label="17 04 10")
    _170411 = UnifiedType(discriminator=DISCRIMINATOR, type_id=24, type_label="17 04 11")
    _170503 = UnifiedType(discriminator=DISCRIMINATOR, type_id=25, type_label="17 05 03")
    _170504 = UnifiedType(discriminator=DISCRIMINATOR, type_id=26, type_label="17 05 04")
    _170505 = UnifiedType(discriminator=DISCRIMINATOR, type_id=27, type_label="17 05 05")
    _170506 = UnifiedType(discriminator=DISCRIMINATOR, type_id=28, type_label="17 05 06")
    _170507 = UnifiedType(discriminator=DISCRIMINATOR, type_id=29, type_label="17 05 07")
    _170508 = UnifiedType(discriminator=DISCRIMINATOR, type_id=30, type_label="17 05 08")
    _170601 = UnifiedType(discriminator=DISCRIMINATOR, type_id=31, type_label="17 06 01*")
    _170603 = UnifiedType(discriminator=DISCRIMINATOR, type_id=32, type_label="17 06 03")
    _170604 = UnifiedType(discriminator=DISCRIMINATOR, type_id=33, type_label="17 06 04")
    _170605 = UnifiedType(discriminator=DISCRIMINATOR, type_id=34, type_label="17 06 05")
    _170801 = UnifiedType(discriminator=DISCRIMINATOR, type_id=35, type_label="17 08 01")
    _170802 = UnifiedType(discriminator=DISCRIMINATOR, type_id=36, type_label="17 08 02")
    _170901 = UnifiedType(discriminator=DISCRIMINATOR, type_id=37, type_label="17 09 01")
    _170902 = UnifiedType(discriminator=DISCRIMINATOR, type_id=38, type_label="17 09 02")
    _170903 = UnifiedType(discriminator=DISCRIMINATOR, type_id=39, type_label="17 09 03")
    _170904 = UnifiedType(discriminator=DISCRIMINATOR, type_id=40, type_label="17 09 04")
    _200136 = UnifiedType(discriminator=DISCRIMINATOR, type_id=41, type_label="20 01 36")


class CircularServiceType:
    DISCRIMINATOR = "CIRCULAR_SERVICE"

    DEMOLITION = UnifiedType(discriminator=DISCRIMINATOR, type_id=1, type_label="Demolition")
    CLEANING = UnifiedType(discriminator=DISCRIMINATOR, type_id=2, type_label="Cleaning")
    CAREFUL_REMOVAL = UnifiedType(discriminator=DISCRIMINATOR, type_id=3, type_label="Careful Removal")
    REPARATION = UnifiedType(discriminator=DISCRIMINATOR, type_id=4, type_label="Reparation")
    RECLAMATION = UnifiedType(discriminator=DISCRIMINATOR, type_id=5, type_label="Reclamation")


class HealthStatusType:
    DISCRIMINATOR = "HEALTH_STATUS"

    ASBESTOS = UnifiedType(discriminator=DISCRIMINATOR, type_id=1, type_label="Asbestos")
    LEAD = UnifiedType(discriminator=DISCRIMINATOR, type_id=2, type_label="Lead")
    TERMITES = UnifiedType(discriminator=DISCRIMINATOR, type_id=3, type_label="Termites")
    DAMAGED = UnifiedType(discriminator=DISCRIMINATOR, type_id=4, type_label="Damaged")
    NOT_DAMAGED = UnifiedType(discriminator=DISCRIMINATOR, type_id=5, type_label="Not Damaged")
    HETEROGENEOUS = UnifiedType(discriminator=DISCRIMINATOR, type_id=6, type_label="Heterogeneous")
    UNCLEAR = UnifiedType(discriminator=DISCRIMINATOR, type_id=7, type_label="Unclear")
    NOT_VERIFIED_YET = UnifiedType(discriminator=DISCRIMINATOR, type_id=8, type_label="Not Verified Yet")


class ReusePotentialType:
    DISCRIMINATOR = "REUSE_POTENTIAL"

    IN_SITU = UnifiedType(discriminator=DISCRIMINATOR, type_id=1, type_label="IN SITU")
    HIGH = UnifiedType(discriminator=DISCRIMINATOR, type_id=2, type_label="High")
    MEDIUM = UnifiedType(discriminator=DISCRIMINATOR, type_id=3, type_label="Medium")
    LOW = UnifiedType(discriminator=DISCRIMINATOR, type_id=4, type_label="Low")


class RecyclingPotentialType:
    DISCRIMINATOR = "RECYCLING_POTENTIAL"

    IN_SITU = UnifiedType(discriminator=DISCRIMINATOR, type_id=1, type_label="IN SITU")
    HIGH = UnifiedType(discriminator=DISCRIMINATOR, type_id=2, type_label="High")
    MEDIUM = UnifiedType(discriminator=DISCRIMINATOR, type_id=3, type_label="Medium")
    LOW = UnifiedType(discriminator=DISCRIMINATOR, type_id=4, type_label="Low")
