# APPROVED ASSETS — awaiting supply

Externally generated painterly assets go here. They are the visual authority
once supplied.

Expected structure (per `docs/ASSET_MANIFEST.json`), which is also the path
shape `coded_reference/index.html` already references:

    assets/heading_backgrounds/png/   blank_heading_wash_{short,medium,long}.png
                                      blank_page_title_wash.png
    assets/decorative/png/            corner_{top,bottom}_{left,right}.png
                                      gold_splatter.png
    assets/divider_backgrounds/png/   divider_background_{light,dark}.png
    assets/cover_backgrounds/png/     cover_background_{light,dark}.png
    assets/table_elements/svg/        table_left_accent_strip.svg
                                      gold_fine_rule.svg
                                      checkbox_outline_5mm.svg

Rules on receipt:
- use as supplied — no cropping, no auto-trim of transparent margins
- heading/divider/cover art carries no wording; all heading text stays live HTML
- day/date/week/term/year stay generated in JS, never baked into an image
- only simple vector elements (rules, checkbox, accent strip) may be coded
