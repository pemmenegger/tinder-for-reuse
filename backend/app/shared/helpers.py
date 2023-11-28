######################################################################
# THIS FILE WILL BE SHARED AND COPIED TO THE RELEVANT CONTAINERS     #
# DO ONLY CHANGE IT IN ./shared/                                     #
######################################################################

import calendar

# import logging
import os
from datetime import datetime

# from app.config import settings


def create_file(folder, filename):
    os.makedirs(folder, exist_ok=True)
    timestamp = datetime.now().strftime("%Y-%m-%d_%H:%M:%S,%f")[:-3]
    return os.path.join(folder, f"{timestamp}_{filename}")


def init_logging(filename):
    pass
    # log_filename = None
    # if settings.ENV != "local":
    #     log_filename = create_file(f"{settings.LOG_FOLDER_ON_CONTAINER}", filename)
    #     print(f"LOGGING TO {log_filename}")
    # else:
    #     print("LOGGING TO STDOUT")

    # logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s", filename=log_filename)
    # logging.info("Rondas Crawler has been (re)started")


def from_datetime_to_unix_timestamp(timestamp):
    return calendar.timegm(timestamp.utctimetuple())
