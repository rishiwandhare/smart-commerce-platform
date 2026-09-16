# Product Matching Module

## Purpose
This module handles cross-retailer product entity resolution and deduplication.
When products are ingested from disparate retailer feeds and APIs:
- Identifies identical items using identifiers (UPC, EAN, MPN, ISBN) when available.
- Employs text similarity, token matching, and future NLP embeddings to match equivalent listings with different naming conventions.
- Links multi-retailer offers to a single canonical `product_id`.

## Status
Placeholder. AI models and matching pipelines will be developed in future iterations.
