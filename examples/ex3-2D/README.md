How to generate the file
------------------------

``` python
    from poliastro.examples import molniya

    start_epoch = molniya.epoch
    end_epoch = molniya.epoch + 2 * molniya.period

    sample_points = 100

    extractor = CZMLExtractor(start_epoch, end_epoch, sample_points, scene3D=False)

    extractor.add_orbit(
        molniya,
        rtol=1e-4,
        label_text="Molniya",
        show_groundtrack=True,
        groundtrack_lead_time=200,
        groundtrack_trail_time=200,
        path_show=False,
        label_fill_color=[125, 80, 120, 255],
    )
```
