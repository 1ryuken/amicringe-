from cairosvg import svg2png
import os

# Get the directory of this script
script_dir = os.path.dirname(os.path.abspath(__file__))
svg_path = os.path.join(script_dir, 'images', 'icon.svg')

# Sizes needed for the extension
sizes = [16, 48, 128]

for size in sizes:
    output_path = os.path.join(script_dir, 'images', f'icon{size}.png')
    svg2png(url=svg_path, write_to=output_path, output_width=size, output_height=size)
    print(f'Created {size}x{size} icon') 