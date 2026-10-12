import os
from PIL import Image

public_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public"))

icons_to_resize = [
    {"name": "favicon-16x16.png", "size": (16, 16)},
    {"name": "favicon-32x32.png", "size": (32, 32)},
    {"name": "apple-touch-icon.png", "size": (180, 180)},
    {"name": "android-chrome-192x192.png", "size": (192, 192)},
    {"name": "android-chrome-512x512.png", "size": (512, 512)}
]

print("Starting Icon Resize and Optimization...")

for icon in icons_to_resize:
    file_path = os.path.join(public_dir, icon["name"])
    if not os.path.exists(file_path):
        print(f"Warning: {icon['name']} not found at {file_path}")
        continue
        
    print(f"Optimizing {icon['name']} to {icon['size'][0]}x{icon['size'][1]}...")
    
    try:
        # Open image
        with Image.open(file_path) as img:
            # Preserve transparency if present
            if img.mode not in ("RGBA", "LA") and "transparency" not in img.info:
                img = img.convert("RGBA")
            
            # Resize using high quality Lanczos resampling
            resized_img = img.resize(icon["size"], Image.Resampling.LANCZOS)
            
            # Save optimized PNG
            resized_img.save(file_path, "PNG", optimize=True, compress_level=9)
            
            # Report size improvement
            new_size_kb = os.path.getsize(file_path) / 1024
            print(f"Success! New size for {icon['name']}: {new_size_kb:.2f} KB")
            
    except Exception as e:
        print(f"Error resizing {icon['name']}: {e}")

print("Icon optimization completed!")
