import json

breed = ["orange tabby", "bengal", "tuxedo", "british shorthair", "turtleshell calico"]
with open('prompts.json', 'r') as file:
    lookup = json.loads(file.read())


def extract(val, lk):
    for e in lk.items():
        val -= e[1]
        if val < 0: return e[0]

    return None


def decode_genes(gene):
    attr = [int((gene >> i * 20) & 0b11111) for i in range(12)]
    chain = gene >> 240 & 0b1111
    return attr


def compose(chain, gene):
    attr = decode_genes(int(gene))

    prompt = "Create a striking and vibrant illustration in the style of the Memphis Group, known for its 1980s postmodern design. The artwork should feature Memphis's signature aesthetic, characterized by bright, contrasting colors and graphic patterns. The image should have a sense of joyful, eclectic exuberance, with a mix of unconventional and abstract elements. The overall design should evoke a sense of playful irreverence, breaking traditional design norms with its daring use of color, pattern, and form. Aim for a composition that is both energetic and whimsically sophisticated, reflecting the Memphis Group's unique blend of modern and kitsch"
    prompt += "The subject of the illustration is a {} cat. ".format(breed[chain])
    for e in lookup:
        val = extract(int(attr.pop(0)), e["options"])
        if val:
            prompt += e["prompt"].format(val)

    prompt += "The illustration should be one holistic piece tying together all its elements. "
    print(prompt)
    return prompt
