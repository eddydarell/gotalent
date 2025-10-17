#!/bin/bash

# Create PWA icons using ImageMagick (if available) or generate placeholder SVGs
# This script creates basic mining-themed icons for the Go Talent PWA

ICON_DIR="icons"
SIZES=(16 32 72 96 128 144 152 192 384 512)

# Create a simple SVG icon template
create_svg_icon() {
    local size=$1
    local filename="$ICON_DIR/icon-${size}x${size}.png"
    
    # Create SVG content
    cat > temp_icon.svg << EOF
<svg xmlns="http://www.w3.org/2000/svg" width="$size" height="$size" viewBox="0 0 24 24">
    <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
    </defs>
    <rect width="24" height="24" rx="4" fill="url(#grad1)"/>
    <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 9 5.16.74 9-3.45 9-9V7l-10-5z" fill="white" opacity="0.9"/>
    <circle cx="12" cy="12" r="2" fill="white"/>
</svg>
EOF

    # Try to convert with ImageMagick if available, otherwise keep as SVG
    if command -v convert &> /dev/null; then
        convert temp_icon.svg "$filename"
        echo "Created PNG icon: $filename"
    else
        cp temp_icon.svg "${filename/.png/.svg}"
        echo "Created SVG icon: ${filename/.png/.svg} (ImageMagick not available)"
    fi
    
    rm -f temp_icon.svg
}

# Create all icon sizes
for size in "${SIZES[@]}"; do
    create_svg_icon $size
done

echo "Icon generation completed!"
