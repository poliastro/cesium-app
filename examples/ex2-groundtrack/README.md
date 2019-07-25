How to generate the file
========================

```python
    from poliastro.examples import iss
    
    start_epoch = iss.epoch
    end_epoch = iss.epoch + iss.period

    sample_points = 50

    extractor = CZMLExtractor(start_epoch, end_epoch, sample_points)

    extractor.add_orbit(
        iss, rtol=1e-4, label_text="Iss", show_groundtrack=True, label_fill_color=[125, 80, 120, 255],
    )

```
