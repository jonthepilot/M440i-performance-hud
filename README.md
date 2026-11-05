# M440i right-side HUD prototype v0.2

**Status: developer prototype, NOT ready to install in MGU Store.**

Uses the documented `cluster-render` v1 Unix stream protocol to send one RGBA image layer to the `hud` target. It displays static example oil, coolant, and boost readings in three stacked right-side tiles, preserving transparency outside the tiles. The layer is nonexclusive and uses `contend:0` to avoid forcibly taking over the HUD. It has no live sensor feed, startup service, packaging, or tested placement on the user's BMW.

Source: https://github.com/robertnisipeanu/idrive-apps/blob/main/native/cluster-render/PROTOCOL.md

Requires Python 3 and Pillow **on a development environment** with access to the renderer socket. It is **not** designed to be executed from an iPhone. Do not attempt to install this ZIP via MGU Store.

Next tasks: confirm v0.4.0 protocol compatibility, test position while parked, integrate read-only BMW CDS engine temperatures and calibrated boost source, add staleness checks, avoid interfering with factory HUD, build native runtime and publish a proper MGU Store release.

The boost example is gauge pressure. If reading manifold absolute pressure, subtract ambient absolute pressure before converting to PSI. Do not show a value if its provenance is unknown.
