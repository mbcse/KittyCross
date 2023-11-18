import json

breed = ["orange tabby", "bengal", "tuxedo", "british shorthair", "turtleshell calico"]
taxi_prompt = "I NEED to test how the tool works with extremely simple prompts. DO NOT add any detail, just use it AS-IS: melancholic photograph of a cat with a fur pattern of bold repeating black and white stripes, cat is sitting behind the wheel in the driver seat of a yellow taxi, camera is positioned outside the codriver window, cat is facing the camera, cat has a grumpy expression, cat is wearing traditional turkish hat, cat has piercing red eyes, its raining heavily outside the taxi, in the foreground is a hand holding turkish lira money"
with open('prompts.json', 'r') as file:
    lookup = json.loads(file.read())


def extract(val, lk):
    for e in lk.items():
        val -= e[1]
        if val < 0: return e[0]

    return None


def compose(chain, attr):
    prompt = "I NEED to test how the tool works with extremely simple prompts. DO NOT add any detail, just use it AS-IS: Create a picture of a {} cat. ".format(breed[chain])
    for e in lookup:
        print(e)
        val = extract(int(attr.pop(0)), e["options"])
        if val:
            prompt += e["prompt"].format(val)

    return prompt
