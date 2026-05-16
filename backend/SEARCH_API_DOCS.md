# Backend Search & Filter API Documentation

## Overview
Comprehensive search and filter API endpoints for DokoCafe backend. All endpoints connect to the Supabase database and support multiple filter criteria.

## Base URL
```
http://localhost:3001/api
```

## Search Endpoints

### 1. Advanced Search
**Endpoint:** `GET /search/advanced`

Combines keyword search with multiple filters, sorting, and pagination.

**Query Parameters:**
- `keyword` (string): Search in name (JP/VN) and address
- `isOpen` (boolean): Filter by open status (true/false)
- `isCrowded` (boolean): Filter by crowded status (true/false)
- `minRating` (number): Minimum rating (0-5)
- `hasWifi` (boolean): Has WiFi (true/false)
- `hasAc` (boolean): Has AC (true/false)
- `hasOutlets` (boolean): Has outlets (true/false)
- `isNonSmoking` (boolean): Non-smoking cafe (true/false)
- `isQuiet` (boolean): Quiet cafe (true/false)
- `hasSnacks` (boolean): Has snacks (true/false)
- `sortBy` (string): Sort by 'rating', 'name', or 'newest'
- `limit` (number): Results per page (default: 20)
- `offset` (number): Pagination offset (default: 0)

**Example Request:**
```bash
GET /search/advanced?keyword=coffee&hasWifi=true&minRating=4&sortBy=rating&limit=10
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "filters": {
    "keyword": "coffee",
    "hasWifi": "true",
    "minRating": 4
  },
  "data": [
    {
      "id": 1,
      "name_jp": "ハノイロースタリー",
      "name_vn": "Hanoi Roastery",
      "address": "123 Phố Cổ, Hoàn Kiếm, Hà Nội",
      "average_rating": 4.5,
      "review_count": 128,
      "is_open": true,
      "has_wifi": true,
      "has_ac": true,
      ...
    }
  ]
}
```

---

### 2. Keyword Search
**Endpoint:** `GET /search/keyword`

Simple search by keyword (name, address).

**Query Parameters:**
- `q` (string, required): Keyword to search
- `limit` (number): Results per page (default: 20)

**Example Request:**
```bash
GET /search/keyword?q=cafe&limit=10
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "keyword": "cafe",
  "data": [...]
}
```

---

### 3. Nearby Search
**Endpoint:** `GET /search/nearby`

Find cafes near a specific location.

**Query Parameters:**
- `lat` (number, required): Latitude
- `lng` (number, required): Longitude
- `radius` (number): Search radius in km (default: 5)

**Example Request:**
```bash
GET /search/nearby?lat=21.0285&lng=105.8542&radius=2
```

**Response:**
```json
{
  "success": true,
  "count": 8,
  "location": {
    "lat": 21.0285,
    "lng": 105.8542,
    "radiusKm": 2
  },
  "data": [...]
}
```

---

### 4. Filter by Amenities
**Endpoint:** `POST /search/filter`

Filter cafes by specific amenities.

**Request Body:**
```json
{
  "amenities": ["wifi", "ac", "quiet"],
  "limit": 15
}
```

**Supported Amenities:**
- `wifi`: Has WiFi
- `ac`: Has Air Conditioning
- `outlets`: Has electrical outlets
- `smoking`: Non-smoking
- `quiet`: Quiet environment
- `snacks`: Has snacks/food

**Response:**
```json
{
  "success": true,
  "count": 6,
  "amenities": ["wifi", "ac", "quiet"],
  "data": [...]
}
```

---

### 5. Trending Cafes
**Endpoint:** `GET /search/trending`

Get most popular cafes sorted by rating and review count.

**Query Parameters:**
- `limit` (number): Number of results (default: 10)

**Example Request:**
```bash
GET /search/trending?limit=5
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [...]
}
```

---

### 6. Open Cafes
**Endpoint:** `GET /search/open`

Get all currently open cafes.

**Query Parameters:**
- `limit` (number): Number of results (default: 20)

**Example Request:**
```bash
GET /search/open?limit=20
```

**Response:**
```json
{
  "success": true,
  "count": 15,
  "data": [...]
}
```

---

## Original Search Endpoint (Updated)

**Endpoint:** `GET /cafes/search`

The existing search endpoint has been improved with better filter support.

**Query Parameters:**
Same as Advanced Search (see above)

---

## Database Integration

All endpoints connect to Supabase PostgreSQL database with these tables:

### Cafes Table
- `id`: Unique identifier
- `owner_id`: Cafe owner
- `name_jp`: Japanese name
- `name_vn`: Vietnamese name
- `address`: Full address
- `phone_number`: Contact number
- `open_hours`: Opening hours
- `is_open`: Current status
- `is_crowded`: Crowd level
- `average_rating`: Average rating (0-5)
- `review_count`: Number of reviews

### Amenities Table
- `cafe_id`: Foreign key to cafes
- `has_wifi`: WiFi availability
- `has_ac`: Air conditioning
- `has_outlets`: Electrical outlets
- `is_non_smoking`: Non-smoking
- `is_quiet`: Quiet environment
- `has_snacks`: Food/snacks available
- `has_high_tables`: High tables available

---

## Error Handling

All endpoints return standardized error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

---

## Performance Tips

1. **Use pagination** for large result sets:
   ```bash
   GET /search/advanced?keyword=coffee&limit=20&offset=20
   ```

2. **Combine filters** to narrow down results:
   ```bash
   GET /search/advanced?keyword=coffee&hasWifi=true&minRating=4&isOpen=true
   ```

3. **Sort strategically**:
   - By rating for quality-focused searches
   - By name for alphabetical listing
   - By newest for recently added cafes

4. **Use specific endpoints** when applicable:
   - Use `/trending` instead of `/advanced` for popular cafes
   - Use `/keyword` for simple text searches
   - Use `/nearby` for location-based searches

---

## Testing

### Using cURL:

```bash
# Advanced search
curl "http://localhost:3001/api/search/advanced?keyword=coffee&hasWifi=true&limit=10"

# Keyword search
curl "http://localhost:3001/api/search/keyword?q=cafe&limit=5"

# Nearby search
curl "http://localhost:3001/api/search/nearby?lat=21.0285&lng=105.8542&radius=2"

# Trending cafes
curl "http://localhost:3001/api/search/trending?limit=5"

# Open cafes
curl "http://localhost:3001/api/search/open?limit=10"

# Filter by amenities
curl -X POST http://localhost:3001/api/search/filter \
  -H "Content-Type: application/json" \
  -d '{"amenities":["wifi","quiet"],"limit":15}'
```

---

## Future Enhancements

- [ ] Add geospatial queries for better location filtering
- [ ] Implement full-text search for better keyword matching
- [ ] Add saved searches/favorites
- [ ] Add real-time cafe status updates
- [ ] Add user preference-based recommendations
