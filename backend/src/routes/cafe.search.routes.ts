import { Router } from 'express';
import * as cafeSearchController from '../controllers/cafe.search.controller';

const router = Router();

/**
 * GET /api/search/advanced
 * Advanced search with multiple filters
 * Query params:
 *   - keyword: search by name, address
 *   - isOpen: filter by open status (true/false)
 *   - isCrowded: filter by crowded status (true/false)
 *   - minRating: minimum rating
 *   - hasWifi: has WiFi (true/false)
 *   - hasAc: has AC (true/false)
 *   - hasOutlets: has outlets (true/false)
 *   - isNonSmoking: non-smoking (true/false)
 *   - isQuiet: quiet cafe (true/false)
 *   - hasSnacks: has snacks (true/false)
 *   - sortBy: rating, name, newest
 *   - limit: results per page
 *   - offset: pagination offset
 */
router.get('/advanced', cafeSearchController.advancedSearch);

/**
 * GET /api/search/keyword
 * Simple keyword search
 * Query params:
 *   - q: keyword to search
 *   - limit: results per page
 */
router.get('/keyword', cafeSearchController.keywordSearch);

/**
 * GET /api/search/nearby
 * Search cafes near a location
 * Query params:
 *   - lat: latitude
 *   - lng: longitude
 *   - radius: search radius in km (default: 5)
 */
router.get('/nearby', cafeSearchController.nearbySearch);

/**
 * GET /api/search/trending
 * Get trending cafes
 * Query params:
 *   - limit: number of results
 */
router.get('/trending', cafeSearchController.getTrendingCafes);

/**
 * GET /api/search/open
 * Get currently open cafes
 * Query params:
 *   - limit: number of results
 */
router.get('/open', cafeSearchController.getOpenCafes);

/**
 * POST /api/search/filter
 * Filter cafes by amenities
 * Body:
 *   - amenities: array of amenity names
 *   - limit: number of results
 */
router.post('/filter', cafeSearchController.filterByAmenities);

export default router;
