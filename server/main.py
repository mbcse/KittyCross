# app.py
import json
from flask import Flask, request, jsonify
from openai import OpenAI
import requests
import PromptComposer
import base64
from io import BytesIO

app = Flask(__name__)
client = OpenAI(api_key="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",)
pinata_jwp = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJjYjU3OTViNi01MDIzLTQxZjItYTYyMS1kOWIzNWY2NTJiYzAiLCJlbWFpbCI6ImFibGF6ZWR0b3JjaEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiODFhZTM2YWM5ZmY5MWZjMzk4M2UiLCJzY29wZWRLZXlTZWNyZXQiOiJmYTZjMjU5YzA3YTA4OTIzMjQ0ZjMzNzM2YWUzYjA0OWEzOGY2NDZkMTkyYmRlOGU4NjUwNTQzMjJiYjMyZWU1IiwiaWF0IjoxNzAwMzIwNjQwfQ.L22Eobs88kJDu4lBgQNjy5HdZ_1My9Ln_L793ryjSJQ"

with open('storage.json', 'r') as file:
    storage = json.loads(file.read())


def upload_to_pinata(id, base64_data):
    # Decode the base64 image
    image_data = base64.b64decode(base64_data)

    # Use BytesIO to create a file-like object from the decoded data
    image_file = BytesIO(image_data)
    image_file.name = "{}.jpg".format(id)  # Assign a filename (required by Pinata)

    # Setup the request to Pinata
    url = "https://api.pinata.cloud/pinning/pinFileToIPFS"
    headers = {
        "Authorization": "Bearer {}".format(pinata_jwp)
    }
    files = {"file": image_file}

    # Send the request
    response = requests.post(url, files=files, headers=headers)
    return response.json()


@app.get("/taxi")
def get_taxidriver():
    return jsonify("scam")


@app.get("/storage")
def get_storage():
    return jsonify(storage)


@app.post("/kitties")
def get_kitties():
    if request.is_json:
        ls = request.get_json()

        print("request", ls)
        ret = {}

        for ck in ls:
            id = str(ck["id"])

            if id not in storage:
                # query dalle
                response = client.images.generate(
                    model="dall-e-3",
                    prompt=PromptComposer.compose(ck["chain"], ck["genes"]),
                    size="1024x1024",
                    quality="standard",
                    n=1,
                    response_format="b64_json"
                )
                pinata = upload_to_pinata(id, response.data[0].b64_json)
                image_url = "https://gateway.pinata.cloud/ipfs/{}".format(pinata["IpfsHash"])

                storage[id] = image_url
                with open("storage.json", "w") as f:
                    f.write(json.dumps(storage))
            ret[id] = storage[id]

        return jsonify(ret)

    return {"error": "Request must be JSON"}, 415


# start the server with the 'run()' method
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
