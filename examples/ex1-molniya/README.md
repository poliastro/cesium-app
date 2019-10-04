
Molniya Orbit
=============

A simple example demonstrating the basic functionality of the extractor.

How to generate the file
------------------------

```python
    from poliastro.examples import molniya
    from poliastro.bodies import Moon
    
    start_epoch = molniya.epoch
    end_epoch = molniya.epoch + molniya.period

    sample_points = 50

    extractor = CZMLExtractor(
        start_epoch,
        end_epoch,
        sample_points,
        attractor=Earth,
        pr_map="https://upload.wikimedia.org/wikipedia/commons/c/c4/Earthmap1000x500compac.jpg",
    )

```

