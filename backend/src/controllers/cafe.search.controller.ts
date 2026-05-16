import { Request, Response } from 'express';
import * as cafeSearchService from '../services/cafe.search.service';

/**
 * Advanced search endpoint
 */
export const advancedSearch = async (req: Request, res: Response) => {
    try {
        const filters: cafeSearchService.SearchFilter = {
            ...(req.query.keyword && { keyword: req.query.keyword as string }),
            ...(req.query.isOpen && { isOpen: req.query.isOpen as 'true' | 'false' }),
            ...(req.query.isCrowded && { isCrowded: req.query.isCrowded as 'true' | 'false' }),
            ...(req.query.minRating && { minRating: parseFloat(req.query.minRating as string) }),
            ...(req.query.hasWifi && { hasWifi: req.query.hasWifi as 'true' | 'false' }),
            ...(req.query.hasAc && { hasAc: req.query.hasAc as 'true' | 'false' }),
            ...(req.query.hasOutlets && { hasOutlets: req.query.hasOutlets as 'true' | 'false' }),
            ...(req.query.isNonSmoking && { isNonSmoking: req.query.isNonSmoking as 'true' | 'false' }),
            ...(req.query.isQuiet && { isQuiet: req.query.isQuiet as 'true' | 'false' }),
            ...(req.query.hasSnacks && { hasSnacks: req.query.hasSnacks as 'true' | 'false' }),
            ...(req.query.sortBy && { sortBy: req.query.sortBy as 'rating' | 'name' | 'newest' }),
            limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
            offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
        };

        console.log('Advanced search filters:', filters);

        const results = await cafeSearchService.advancedSearch(filters);

        res.status(200).json({
            success: true,
            count: results.length,
            filters,
            data: results
        });
    } catch (error: any) {
        console.error('Error in advancedSearch:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi tìm kiếm quán',
            error: error.message
        });
    }
};

/**
 * Keyword search endpoint
 */
export const keywordSearch = async (req: Request, res: Response) => {
    try {
        const keyword = req.query.q as string;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

        if (!keyword || keyword.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập từ khóa tìm kiếm'
            });
        }

        console.log(`Keyword search: "${keyword}"`);

        const results = await cafeSearchService.keywordSearch(keyword, limit);

        res.status(200).json({
            success: true,
            count: results.length,
            keyword,
            data: results
        });
    } catch (error: any) {
        console.error('Error in keywordSearch:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi tìm kiếm theo từ khóa',
            error: error.message
        });
    }
};

/**
 * Nearby search endpoint
 */
export const nearbySearch = async (req: Request, res: Response) => {
    try {
        const lat = parseFloat(req.query.lat as string);
        const lng = parseFloat(req.query.lng as string);
        const radius = req.query.radius ? parseFloat(req.query.radius as string) : 5;

        if (isNaN(lat) || isNaN(lng)) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp tọa độ hợp lệ (lat, lng)'
            });
        }

        console.log(`Nearby search: lat=${lat}, lng=${lng}, radius=${radius}km`);

        const results = await cafeSearchService.nearbySearch(lat, lng, radius);

        res.status(200).json({
            success: true,
            count: results.length,
            location: { lat, lng, radiusKm: radius },
            data: results
        });
    } catch (error: any) {
        console.error('Error in nearbySearch:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi tìm kiếm gần đó',
            error: error.message
        });
    }
};

/**
 * Filter by amenities endpoint
 */
export const filterByAmenities = async (req: Request, res: Response) => {
    try {
        const { amenities = [], limit = 20 } = req.body;

        if (!Array.isArray(amenities) || amenities.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng chọn ít nhất một tiện ích'
            });
        }

        console.log('Filter by amenities:', amenities);

        const results = await cafeSearchService.filterByAmenities(amenities, limit);

        res.status(200).json({
            success: true,
            count: results.length,
            amenities,
            data: results
        });
    } catch (error: any) {
        console.error('Error in filterByAmenities:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi lọc theo tiện ích',
            error: error.message
        });
    }
};

/**
 * Trending cafes endpoint
 */
export const getTrendingCafes = async (req: Request, res: Response) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

        const results = await cafeSearchService.getTrendingCafes(limit);

        res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });
    } catch (error: any) {
        console.error('Error in getTrendingCafes:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi lấy quán cafe xu hướng',
            error: error.message
        });
    }
};

/**
 * Open cafes endpoint
 */
export const getOpenCafes = async (req: Request, res: Response) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

        const results = await cafeSearchService.getOpenCafes(limit);

        res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });
    } catch (error: any) {
        console.error('Error in getOpenCafes:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi lấy quán cafe đang mở',
            error: error.message
        });
    }
};
