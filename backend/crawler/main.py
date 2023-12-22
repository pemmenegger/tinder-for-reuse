import json
import os
import random

import requests
from app.schemas.collector_schema import CollectorCreate
from app.types import (
    AuthorizedVehicleType,
    CircularStrategyType,
    MaterialType,
    WasteCodeType,
    get_unified_types,
)
from dotenv import load_dotenv

# current directory
BASEDIR = os.path.abspath(os.path.dirname(__file__))
# load environment variables
load_dotenv(os.path.join(BASEDIR, "../.env"))


def request_backend(method, endpoint, data=None, timeout=None):
    BACKEND_URL = os.getenv("NEXT_PUBLIC_BACKEND_URL")
    url = f"{BACKEND_URL}{endpoint}"
    headers = {"Content-Type": "application/json"}

    if method == "GET":
        resp = requests.get(url, headers=headers, timeout=timeout)
    elif method == "POST":
        resp = requests.post(url, data=json.dumps(data), headers=headers, timeout=timeout)
    elif method == "PUT":
        resp = requests.put(url, data=json.dumps(data), headers=headers, timeout=timeout)
    elif method == "DELETE":
        resp = requests.delete(url, data=json.dumps(data), headers=headers, timeout=timeout)
    else:
        raise ValueError(f"Invalid HTTP method: {method}")

    return resp


def translate_tags(tag_name):
    translation_map = {
        "flux_laine_de_verre": MaterialType.GLASS_WOOL,
        "flux_revetements_de_sols_en_pvc": MaterialType.PVC_FLOOR_COVERINGS,
        "flux_laine_de_roche": MaterialType.ROCK_WOOL,
        "flux_plastiques": MaterialType.RIGID_PLASTICS_AND_PVC,
        "flux_revetements_de_sols_hors_pvc": MaterialType.NON_PVC_FLOOR_COVERINGS,
        "flux_pse": MaterialType.EXPANDED_POLYSTYRENE,
        "flux_membranes_bitumeuses": MaterialType.BITUMINOUS_MEMBRANES,
        "flux_menuiseries_vitrees": MaterialType.GLAZED_WINDOWS,
        "flux_platre": MaterialType.PLASTER,
        "flux_metaux": MaterialType.METALS,
        "flux_inertes": MaterialType.INERT,
        "flux_biosources": MaterialType.BIO_BASED_INSULATORS,
        "flux_beton": MaterialType.CONCRETE,
        "flux_poly": MaterialType.POLYURETHANE,
        "flux_bois": MaterialType.WOOD,
    }

    return translation_map.get(tag_name, None).type_label


def format_phone_number_corrected(phone_number):
    formatted_number = "+33 " + phone_number[1]

    for i in range(2, len(phone_number), 2):
        formatted_number += " " + phone_number[i : i + 2]

    return formatted_number


def random_choices(type_class, n):
    return random.sample(get_unified_types([type_class]), n)


def select_random_options():
    p = random.random()
    if p <= 0.7:
        return 1
    elif p <= 0.9:
        return 2
    else:
        return 3


def import_valobat():
    from pathlib import Path

    for page in range(1, 15):
        path = Path(__file__).parent / f"./collectors/valobat-{page}.json"
        with path.open() as f:
            data = json.load(f)

        collectors_create = []
        for feature in data["features"]:
            properties = feature["properties"]
            geometry = feature["geometry"]
            phone_number = properties["contact"].get("phone")

            waste_code_types = [
                unified_type["type_label"] for unified_type in random_choices(WasteCodeType, select_random_options())
            ]
            authorized_vehicle_types = [
                unified_type["type_label"]
                for unified_type in random_choices(AuthorizedVehicleType, select_random_options())
            ]
            circular_strategy_types = [
                unified_type["type_label"]
                for unified_type in random_choices(CircularStrategyType, select_random_options())
            ]

            collector = CollectorCreate(
                name=properties["name"],
                address=", ".join(properties["address"]["lines"]),
                zip_code=properties["address"]["zipcode"],
                city=properties["address"]["city"],
                latitude=geometry["coordinates"][1],
                longitude=geometry["coordinates"][0],
                phone=format_phone_number_corrected(phone_number) if phone_number else None,
                material_types=[translate_tags(tag) for tag in properties["tags"]],
                waste_code_types=waste_code_types,
                authorized_vehicle_types=authorized_vehicle_types,
                circular_strategy_types=circular_strategy_types,
            )
            collectors_create.append(collector)

        payload = [json.loads(collector_create.json()) for collector_create in collectors_create]
        response = request_backend("POST", "/api/collectors/", data=payload, timeout=300)
        print(response.status_code)


if __name__ == "__main__":
    import_valobat()
