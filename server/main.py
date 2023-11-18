# app.py
import json
from flask import Flask, request, jsonify
from openai import OpenAI

import PromptComposer

app = Flask(__name__)
client = OpenAI(api_key="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",)

with open('storage.json', 'r') as file:
    storage = json.loads(file.read())


@app.get("/storage")
def get_storage():
    return jsonify(storage)


@app.get("/kitties")
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
                    model="dall-e-2",
                    prompt=PromptComposer.compose(ck["genes"]),
                    size="512x512",
                    quality="standard",
                    n=1,
                )
                print("response", response)
                image_url = response.data[0].url
                storage[id] = image_url
                with open("storage.json", "w") as f:
                    f.write(json.dumps(storage))
            ret[id] = storage[id]

        return jsonify(ret)

    return {"error": "Request must be JSON"}, 415


# start the server with the 'run()' method
if __name__ == '__main__':
    app.run(debug=True)