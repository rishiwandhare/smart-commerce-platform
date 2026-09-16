# Data Directory Architecture

This directory holds dataset artifacts used throughout the ETL and matching lifecycle:

- `raw/`: Unprocessed payload dumps directly received from permitted retailer APIs and feeds. Kept untouched for traceability.
- `processed/`: Cleansed, normalized, and validated records prepared for ingestion into PostgreSQL or feature extraction.
- `product_data/`: Static product metadata caches, taxonomies, and category trees.

> **Note**: Actual data files are ignored by git (`.gitignore`) to avoid committing bulky or sensitive local dumps.
