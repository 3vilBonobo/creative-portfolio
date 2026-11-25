"""Weather-only masks for the 1672x941 wide hero. Never modifies artwork.

Use unobstructed glass above the workstation, keeping the person, lamps,
telescope, aquarium and plants out of all precipitation. Night is a full plate,
so no hand-traced human silhouette participates in day/night compositing.
"""
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "public/hero/loft-v2"
WEATHER = "M314 198H375V332H314ZM385 198H650V422H385ZM661 198H1094V385H974V422H661ZM1107 198H1231V422H1107Z"
SKY = "M314 198H375V346H314ZM385 198H650V348L620 345 600 350 580 344 560 349 540 344 520 350 500 346 480 350 460 345 440 351 420 348 401 352 385 349ZM661 198H1094V252L1088 256 1088 274 1074 280 1071 348 1055 352 1042 349 1026 355 1010 350 994 355 978 351 960 353 943 351 926 355 909 350 890 351 876 347 863 347 855 340 845 339 840 329 831 328 824 321 813 322 809 317 793 317 788 325 772 327 762 325 757 332 742 331 737 337 722 338 716 344 701 346 695 351 682 353 671 359 661 366Z"


def write_mask(name, path):
    # A short fade prevents visible bands at the lower edge of weather while
    # staying above the head (which begins around y=431 in the native image).
    gradient = '<linearGradient id="fade" gradientUnits="userSpaceOnUse" x1="0" y1="198" x2="0" y2="422"><stop offset="0" stop-color="white"/><stop offset=".92" stop-color="white"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient>'
    fill = 'url(#fade)' if name == "weather" else "white"
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1672 941"><defs>{gradient}</defs><path d="{path}" fill="{fill}"/></svg>\n'
    (OUT / f'{name}-mask.svg').write_text(svg, encoding="utf-8")


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    write_mask("weather", WEATHER)
    write_mask("sky", SKY)
    print("Prepared wide-hero sky and weather masks; artwork unchanged.")
