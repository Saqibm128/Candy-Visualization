import pandas as pd
import requests
import json
from addict import Dict

apiKey = "AIzaSyBHYiMZxXN8LeLlsymohDr562U3hxPCKCE"

endpoint = "https://maps.googleapis.com/maps/api/geocode/json?"

candyDF = pd.read_csv("candy.csv")
candyDF["longitude"] = pd.Series(index=candyDF.index)
candyDF["latitude"] = pd.Series(index=candyDF.index)
for i in candyDF.index:
    if i % 10 == 0:
        print("beginning:", i)
    try:
        payload = {"address": str(candyDF["Q5_STATE_PROVINCE_COUNTY_ETC"][i]) + ", " + str(candyDF["Q4_COUNTRY"][i]), "key": apiKey}
        r = requests.get(endpoint, params=payload)
        resp = Dict(json.loads(r.content.decode('utf-8')))
        if "results" in resp \
            and "geometry" in resp.results[0] \
            and "location" in resp.results[0].geometry:
                candyDF.loc[i, "longitude"] = resp.results[0].geometry.location.lng
                candyDF.loc[i, "latitude"] = resp.results[0].geometry.location.lat
    except:
        print("could not process:", i)

candyDF.to_csv("candy2.csv")
