import calendar
import os
from datetime import datetime


def create_file(folder, filename):
    os.makedirs(folder, exist_ok=True)
    timestamp = datetime.now().strftime("%Y-%m-%d_%H:%M:%S,%f")[:-3]
    return os.path.join(folder, f"{timestamp}_{filename}")


def from_datetime_to_unix_timestamp(timestamp):
    return calendar.timegm(timestamp.utctimetuple())
