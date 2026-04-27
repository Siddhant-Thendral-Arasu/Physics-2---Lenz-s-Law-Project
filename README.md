This is an interactive 3D Lenz's Law visualizer through a single loop for an AP Physics 2 curriculum.

The simulation showcases how changing magnetic fields induce current in a loop, with direction determined by changes in magnetic flux.

## Features:
-Magnet orientation
-Position relative to loop
-Dynamic velocity driven by position slider

## Physics Model

Current strength is approximated by the following dipole-based formula:
I(z) = (0.5 * μ₀ * velocity) * (3 * loop_radius^2 * rel_height) / (rel_height^2 + loop_radius^2)^(2.5),

Where:
- μ₀ is the magnetic constant (treated as one for current normalization)
- Factors like magnetic dipole and resistance are held constant at 1.
- Velocity is assumed to be constant at 0.1.

# Built With:
JavaScript, Three.js, Vite
