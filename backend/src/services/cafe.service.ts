import supabase from '../utils/db';

// 1. READ: Lấy danh sách quán 
export const getAllCafes = async () => {
    const { data, error } = await supabase
        .from('cafes')
        .select('*, amenities(*)');

    if (error) throw new Error(error.message);

    return data.map((cafe: any) => {
        const { amenities, ...cafeData } = cafe;
        const amenityObj = Array.isArray(amenities) ? amenities[0] : amenities;
        return { ...cafeData, ...(amenityObj || {}) };
    });
};

// 2. READ: Lấy chi tiết 1 quán kèm Menu và Amenities (Phục vụ P_ID 4 và Màn hình ID 10)
export const getCafeById = async (cafeId: number) => {
    const { data: cafe, error } = await supabase
        .from('cafes')
        .select('*, amenities(*), menus(*)')
        .eq('id', cafeId)
        .single();

    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    if (!cafe) return null;

    const { amenities, menus, ...cafeData } = cafe;
    const amenityObj = Array.isArray(amenities) ? amenities[0] : amenities;
    
    return {
        ...cafeData,
        ...(amenityObj || {}),
        menus: menus || []
    };
};

// 3. CREATE: Thêm quán mới (Kèm tiện ích mặc định)
export const createCafe = async (data: any) => {
    const { owner_id, name_jp, name_vn, address, phone_number, open_hours, cover_image_url } = data;

    const { data: cafeResult, error: cafeError } = await supabase
        .from('cafes')
        .insert([{ owner_id, name_jp, name_vn, address, phone_number, open_hours, cover_image_url }])
        .select('id')
        .single();

    if (cafeError) throw new Error(cafeError.message);

    const newCafeId = cafeResult.id;

    const { error: amenityError } = await supabase
        .from('amenities')
        .insert([{ cafe_id: newCafeId }]);

    if (amenityError) throw new Error(amenityError.message);

    return newCafeId;
};

export const updateCafe = async (cafeId: number, updateData: any) => {
    const { is_open, is_crowded } = updateData;
    
    const payload: any = {};
    if (is_open !== undefined) payload.is_open = is_open;
    if (is_crowded !== undefined) payload.is_crowded = is_crowded;

    if (Object.keys(payload).length === 0) return false;

    const { error } = await supabase
        .from('cafes')
        .update(payload)
        .eq('id', cafeId);

    if (error) throw new Error(error.message);
    return true;
};

export const deleteCafe = async (cafeId: number) => {
    const { error } = await supabase
        .from('cafes')
        .delete()
        .eq('id', cafeId);

    if (error) throw new Error(error.message);
    return true;
};

// SEARCH&FILTER: tìm kiếm và lọc quán cafe
export const searchCafes = async (filters: any) => {
    try {
        let selectString = '*, amenities(*)';

        // Start with base query
        let query = supabase.from('cafes').select(selectString);

        // 1. SEARCH by keyword (tên quán, địa chỉ)
        if (filters.keyword && filters.keyword.trim()) {
            const keyword = filters.keyword.trim();
            query = query.or(
                `name_jp.ilike.%${keyword}%,name_vn.ilike.%${keyword}%,address.ilike.%${keyword}%`
            );
        }

        // 2. FILTER by status (mở cửa)
        if (filters.isOpen === 'true') {
            query = query.eq('is_open', true);
        }

        // 3. FILTER by crowded status
        if (filters.isCrowded === 'true') {
            query = query.eq('is_crowded', true);
        } else if (filters.isCrowded === 'false') {
            query = query.eq('is_crowded', false);
        }

        // 4. FILTER by rating (cần rating >= giá trị)
        if (filters.minRating) {
            const minRating = parseFloat(filters.minRating);
            if (!isNaN(minRating)) {
                query = query.gte('average_rating', minRating);
            }
        }

        // 5. FILTER by amenities
        // WiFi filter
        if (filters.hasWifi === 'true') {
            selectString = '*, amenities!inner(*)';
            query = supabase.from('cafes').select(selectString);
            query = query.eq('amenities.has_wifi', true);
        }

        // AC filter
        if (filters.hasAc === 'true') {
            if (filters.hasWifi !== 'true') {
                selectString = '*, amenities!inner(*)';
                query = supabase.from('cafes').select(selectString);
            }
            query = query.eq('amenities.has_ac', true);
        }

        // Outlets filter
        if (filters.hasOutlets === 'true') {
            if (filters.hasWifi !== 'true' && filters.hasAc !== 'true') {
                selectString = '*, amenities!inner(*)';
                query = supabase.from('cafes').select(selectString);
            }
            query = query.eq('amenities.has_outlets', true);
        }

        // Non-smoking filter
        if (filters.isNonSmoking === 'true') {
            if (filters.hasWifi !== 'true' && filters.hasAc !== 'true' && filters.hasOutlets !== 'true') {
                selectString = '*, amenities!inner(*)';
                query = supabase.from('cafes').select(selectString);
            }
            query = query.eq('amenities.is_non_smoking', true);
        }

        // Quiet filter
        if (filters.isQuiet === 'true') {
            if (filters.hasWifi !== 'true' && filters.hasAc !== 'true' && 
                filters.hasOutlets !== 'true' && filters.isNonSmoking !== 'true') {
                selectString = '*, amenities!inner(*)';
                query = supabase.from('cafes').select(selectString);
            }
            query = query.eq('amenities.is_quiet', true);
        }

        // 6. SORTING
        let orderBy = 'id';
        let ascending = true;
        
        if (filters.sortBy === 'rating') {
            orderBy = 'average_rating';
            ascending = false; // Sort by highest rating first
        } else if (filters.sortBy === 'name') {
            orderBy = 'name_vn';
            ascending = true;
        } else if (filters.sortBy === 'newest') {
            orderBy = 'id';
            ascending = false;
        }

        query = query.order(orderBy, { ascending });

        // 7. PAGINATION (optional)
        const limit = parseInt(filters.limit) || 20;
        const offset = parseInt(filters.offset) || 0;
        
        if (limit > 0) {
            query = query.range(offset, offset + limit - 1);
        }

        const { data, error } = await query;

        if (error) throw new Error(error.message);

        // Format response data
        return data.map((cafe: any) => {
            const { amenities, ...cafeData } = cafe;
            const amenityObj = Array.isArray(amenities) ? amenities[0] : amenities;
            return {
                ...cafeData,
                ...(amenityObj || {})
            };
        });
    } catch (error) {
        throw error;
    }
};
