#!/bin/bash

echo "=== BOARD GAMES WITH ONLY SVG (need real images) ==="
cd /home/halfgood/Desktop/boernespilguiden/public/images/games/board
for f in *.svg; do
  base="${f%.svg}"
  if [ ! -f "${base}.jpg" ] && [ ! -f "${base}.png" ]; then
    echo "$base"
  fi
done

echo ""
echo "=== DIGITAL GAMES WITH ONLY SVG (need real images) ==="
cd /home/halfgood/Desktop/boernespilguiden/public/images/games/digital
for f in *.svg; do
  base="${f%.svg}"
  if [ ! -f "${base}.jpg" ] && [ ! -f "${base}.png" ]; then
    echo "$base"
  fi
done

echo ""
echo "=== BOARD GAMES WITH ONLY 1 IMAGE (need additional) ==="
cd /home/halfgood/Desktop/boernespilguiden/public/images/games/board
ls | sed 's/\.[^.]*$//' | sort | uniq -c | while read count name; do
  if [ "$count" -eq 1 ]; then
    echo "$name"
  fi
done

echo ""
echo "=== DIGITAL GAMES WITH ONLY 1 IMAGE (need additional) ==="
cd /home/halfgood/Desktop/boernespilguiden/public/images/games/digital
ls | sed 's/\.[^.]*$//' | sort | uniq -c | while read count name; do
  if [ "$count" -eq 1 ]; then
    echo "$name"
  fi
done
