# Data Pruning Logic (Internal Audit)

Use these rules while manually checking listings for duplicates and closures.

## Merge Rule

**If two restaurants have the same name and are within 0.5 miles of each other, merge them into one entry.**

- In practice: same name + same city (or same address) → treat as one; keep the row with the best info (phone, website, address) and remove the duplicate from the CSV.
- If you add lat/long to the CSV later, you can compute distance and flag pairs within 0.5 miles.

## Closure Check

**If you find a "Permanently Closed" notice (e.g. on Google Maps), do not delete the row from the CSV permanently.**

- **Move the entry to `deleted_restaurants.json`** using the script:
  ```bash
  node scripts/move-to-deleted.mjs <slug>
  ```
- This removes the row from `restaurants.csv` and appends it to `data/deleted_restaurants.json` with a timestamp and optional reason. That way you avoid re-adding the same closed business later.

## Standardization (Ghost Kitchens)

**Normalize names and use the Type tag for Ghost Kitchens.**

- Change names like **"Aria Suya (Wilcrest Ghost)"** to **"Aria Suya"** and set the **Type** (category) to **Ghost Kitchen**.
- Run the normalization script to strip parenthetical ghost labels and set category:
  ```bash
  node scripts/normalize-ghost-names.mjs [--fix]
  ```

After any CSV change, run `npm run import:restaurants` to regenerate app data.
