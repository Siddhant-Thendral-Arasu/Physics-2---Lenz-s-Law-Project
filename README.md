This is an interactive 3D Lenz's Law visualizer through a single loop for an AP Physics 2 curriculum.

The simulation showcases how changing magnetic fields induce current in a loop, with direction determined by changes in magnetic flux.

## Features
- Magnet orientation
- Position relative to loop
- Dynamic velocity driven by position slider

## Physics Model

Current strength is approximated by the following dipole-based formula:


$$I(z) = (0.5 \cdot \mu_0 \cdot v) \cdot \frac{3 \cdot R^2 \cdot z}{(z^2 + R^2)^{2.5}}$$

Where:
- μ₀: the magnetic constant (treated as one for current normalization)
- v: the magnet's velocity (assumed to be constant at 0.1)
- z: the magnet's height relative to the loop
- R: the loop's radius

Factors like magnetic dipole and resistance are held constant at 1.

## Built With
JavaScript, Three.js, Vite
