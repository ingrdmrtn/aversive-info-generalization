import json

def flip_signs(data):
    if isinstance(data, dict):
        return {key: flip_signs(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [flip_signs(element) for element in data]
    elif isinstance(data, (int, float)):
        return -data
    else:
        return data

# Load JSON data from sample_grid1.json
with open('sample_grid1.json', 'r') as f:
    data = json.load(f)

# Flip the signs of all the numbers in the JSON data
flipped_data = flip_signs(data)

# Save the modified data to sample_grid2.json
with open('sample_grid2.json', 'w') as f:
    json.dump(flipped_data, f, indent=2)

print("The signs of all numbers in sample_grid1.json have been flipped and saved to sample_grid2.json")
