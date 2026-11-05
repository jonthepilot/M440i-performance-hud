# Experimental MGU Store source repository

This is a **development build** with the required repository manifest, source manifest, staged OAP package, and HUD renderer socket implementation. **It has not been built by MGU Store or tested on an MGU head unit.** The RHMI descriptor is a placeholder and may be rejected by the head unit; a successful installation is NOT guaranteed.

The overlay uses static placeholder values, never ECU commands. No Waze settings are changed. Keep the car parked during tests.

To publish: extract ZIP, upload the **contents** (mgu-repo.json and apps/) to the root of your GitHub repo. In MGU Store add the GitHub repository as a branch source, then inspect whether the app appears and whether installation succeeds. If it fails, capture the exact MGU Store error.

This project is not a production-ready vehicle app.
