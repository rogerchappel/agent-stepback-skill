# Stuck Run

- Found that the package install failed with a registry timeout.
- Decided to retry once before classifying the candidate as blocked.
- Assumption: the package name is still available.
- Next inspect npm config and retry with a shorter command.
- Ask the user before publishing or changing external metadata.
