This is a rudimentary Lenz's Law visualizer through a single loop for an AP Physics 2 curriculum.

Available modifiers include: 
-Magnet orientation
-Position relative to loop
-Dynamic velocity in accordance with position slider

Current strength is calculated in accordance with the following formula:
I(z) = (0.5 * mu_naught * velocity) * (3 * loop_radius^2 * rel_height) / (rel_height^2 + loop_radius^2)^(2.5),
where factors like magnetic dipole and resistance are held constant at 1 (velocity is assumed to be constant at 0.1).
