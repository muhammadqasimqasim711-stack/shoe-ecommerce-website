# Simple APIs: navbar, filters, brands → products

## Overview

Minimal API surface so navbar categories (New / Men / Women / Kids / Sale), activity filters, and brands all load products via **one listing endpoint** plus two small helper endpoints.

Most of this already exists. Keep it simple: navbar and filters only pass query params; backend returns matching product cards. No separate controller per nav item.

---

## Goal

```
Navbar / filters / brands  →  /shop?...  →  GET /products?...  →  product cards
Brands page               →  GET /brands  →  then /shop?brand=Name
Category tiles            →  /shop?category=running
```

---

## APIs (3 total)

### 1. `GET /products` — list products (main)

| Query | Example | Use |
|---|---|---|
| `gender` | `men` \| `women` \| `kids` | Navbar Men / Women / Kids |
| `onSale` | `true` | Navbar Sale |
| `sort` + `days` | `newest` + `30` | Navbar New |
| `brand` | `Asics` | Brands → products |
| `category` | `running` | Activity filter (Running, etc.) |
| `search` | `air` | Search box |
| `limit` | `48` | Page size |

**Navbar mapping**

| Nav | API call |
|---|---|
| New | `GET /products?sort=newest&days=30` |
| Men | `GET /products?gender=men` |
| Women | `GET /products?gender=women` |
| Kids | `GET /products?gender=kids` |
| Sale | `GET /products?onSale=true` |
| Brands | `GET /brands` then `GET /products?brand={name}` |

**Response (product card)**

```json
{
  "id": "...",
  "name": "Studio Flow",
  "brand": "Asics",
  "price": 119.99,
  "oldPrice": 199.99,
  "img": "https://...",
  "tag": "New",
  "gender": "women",
  "colors": ["#111", "#fff"],
  "rating": 4.8,
  "reviewCount": 312,
  "defaultVariantId": "..."
}
```

### 2. `GET /brands` — brand list

Powers `/brands` page. Each brand links to `/shop?brand=Nike`.

### 3. `GET /categories` — category list

Running, Basketball, Lifestyle, Training. Links to `/shop?category=running`.

Optional later (not required): `GET /catalog/nav` for live nav counts.

---

## Frontend contract

| UI | Route / call |
|---|---|
| Navbar | `/shop` with search params (`site-header.tsx`) |
| Shop page | `api.getProducts(params)` (`shop.tsx`) |
| Brands page | `api.getBrands()` → `/shop?brand=...` (`brands.tsx`) |
| Home category tiles | `/shop?category={id}` |
| Home gender chips | Client filter of catalog **or** same `/shop?gender=` |

---

## Small follow-ups

1. Verify brand filter is case-insensitive (`Asics` / `ASICS`)
2. Wire home category tiles to `/shop?category=...`
3. Align footer shop links with the same `/shop?...` URLs as the navbar

## Do not add

- Six endpoints like `/products/men`, `/products/sale`
- Checkout / wishlist / admin CRUD in this slice
- Heavy faceted search or cursor pagination (keep `limit` for now)

---

## Flow

```
[New] ──────────────► GET /products?sort=newest&days=30
[Men] ──────────────► GET /products?gender=men
[Women] ────────────► GET /products?gender=women
[Kids] ─────────────► GET /products?gender=kids
[Sale] ─────────────► GET /products?onSale=true
[Brands] ─► GET /brands ─► GET /products?brand=Nike
[Running tile] ─────► GET /products?category=running
```

## Related code

- Backend: `backend/src/products/`, `backend/src/brands/`, `backend/src/categories/`
- Frontend: `src/components/site-header.tsx`, `src/routes/shop.tsx`, `src/routes/brands.tsx`, `src/lib/api.ts`
