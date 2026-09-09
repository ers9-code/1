# APPROVED ASSETS

Externally generated painterly assets. These are the visual authority.
Imported byte-identical from the approved asset pack — no cropping, no
auto-trim, no re-encoding.

    heading_backgrounds/png/  blank_heading_{short,medium,long}.png   2172x724 RGBA
                              blank_page_title_wash.png               2172x724 RGBA
    decorative/png/           corner_{top,bottom}_{left,right}.png    1254x1254 RGBA
                              gold_splatter.png                       1774x887 RGBA
    divider_backgrounds/png/  divider_{light,dark}_master.png         1055x1491 RGB
    cover_backgrounds/png/    cover_{light,dark}_master.png           1055x1491 RGB
    table_elements/svg/       table_left_accent_strip.svg
                              gold_fine_rule.svg
                              checkbox_outline_5mm.svg

Handling rules in force:
- assets are used as supplied; no cropping or auto-trim of transparent margins
- heading/divider/cover art carries no wording; heading text is live HTML
- day/date/week/term/year are generated in JS, never baked into an image
- only simple vector elements (rules, checkbox, accent strip) are coded

Orientation note: the plume assets (corner_top_*) are painted rising from
their canvas bottom, and the bracket assets (corner_bottom_*) are massed at
their canvas top. Monday therefore uses corner_top_left / corner_top_right
at the bottom outer corners, in their drawn orientation with no rotation.
