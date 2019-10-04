
Molniya Orbit
=============

A simple example demonstrating the basic functionality of the extractor.

How to generate the file
------------------------

```python
    from poliastro.examples import molniya
    from poliastro.bodies import Earth
    
    start_epoch = molniya.epoch
    end_epoch = molniya.epoch + molniya.period

    sample_points = 50
    
    extractor = CZMLExtractor(
        molniya.epoch,
        molniya.epoch + molniya.period,
        sample_points,
        attractor=Earth,
        pr_map="https://upload.wikimedia.org/wikipedia/commons/c/c4/Earthmap1000x500compac.jpg",
    )

    extractor.add_orbit(
        molniya, rtol=1e-4, label_text="Molniya", label_fill_color=[125, 80, 120, 255],
    )
```

