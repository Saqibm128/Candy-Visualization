import pandas as pd
import requests
import json
from addict import Dict
import traceback

apiKey = "AIzaSyBHYiMZxXN8LeLlsymohDr562U3hxPCKCE"

endpoint = "https://maps.googleapis.com/maps/api/geocode/json?"

candyDF = pd.read_csv("candy.csv")
candyDF["longitude"] = pd.Series(index=candyDF.index)
candyDF["latitude"] = pd.Series(index=candyDF.index)
candyDF["State"] = pd.Series(index=candyDF.index)
candyDF["fips"] = pd.Series(index=candyDF.index)
fipCodes = Dict(json.load(open("stateToFips.json", "r")))
for i in candyDF.index:
    if i % 10 == 0:
        print("beginning:", i)
    try:
        payload = {"address": str(candyDF["Q5_STATE_PROVINCE_COUNTY_ETC"][i]) + ", " + str(candyDF["Q4_COUNTRY"][i]), "key": apiKey}
        r = requests.get(endpoint, params=payload)
        resp = Dict(json.loads(r.content.decode('utf-8')))
        if "results" in resp \
            and "address_components" in resp.results[0]:
            for comp in resp.results[0].address_components:
                if "administrative_area_level_1" in comp.types:
                    candyDF.loc[i, "State"] = comp.long_name;
                    if (comp.long_name in fipCodes):
                        candyDF.loc[i, "fips"] = fipCodes[comp.long_name]

        if "results" in resp \
            and "geometry" in resp.results[0] \
            and "location" in resp.results[0].geometry:
                candyDF.loc[i, "longitude"] = resp.results[0].geometry.location.lng
                candyDF.loc[i, "latitude"] = resp.results[0].geometry.location.lat
    except:
        traceback.print_exc()
        print("could not process:", i)

candyDF.to_csv("candy2.csv")
