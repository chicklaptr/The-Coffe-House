import supabase from '../utils/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'dokocafe-secret-key-default';

export const register = async (userData: any) => {
    const { email, password, full_name, role_id = 1 } = userData;

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();

    if (checkError) {
        throw new Error(checkError.message);
    }
    
    if (existingUser) {
        throw new Error('Email already in use');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Insert new user
    const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([{ 
            email, 
            password_hash, 
            full_name, 
            role_id 
        }])
        .select('id, email, full_name, role_id, avatar_url')
        .single();

    if (insertError) {
        throw new Error(insertError.message);
    }

    return newUser;
};

export const login = async (loginData: any) => {
    const { email, password } = loginData;

    // Find user by email
    const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

    if (userError) {
        throw new Error(userError.message);
    }

    if (!user) {
        throw new Error('Invalid email or password');
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
        throw new Error('Invalid email or password');
    }

    // Create JWT payload
    const payload = {
        id: user.id,
        role_id: user.role_id
    };

    // Sign token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    // Exclude password_hash from response
    const { password_hash, ...userWithoutPassword } = user;

    return {
        token,
        user: userWithoutPassword
    };
};

export const getCurrentUser = async (userId: number) => {
    const { data: user, error } = await supabase
        .from('users')
        .select('id, email, full_name, role_id, avatar_url')
        .eq('id', userId)
        .maybeSingle();

    if (error) {
        throw new Error(error.message);
    }

    return user;
};
