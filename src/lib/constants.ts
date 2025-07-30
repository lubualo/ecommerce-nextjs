// Centralized constants and API endpoints for the project

export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const MEDIA_API = process.env.NEXT_PUBLIC_MEDIA_API;
export const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL;

export const ENDPOINTS = {
    adminUsers: '/admin/users',
    user: "/user",
    address: "/address",
    category: "/category",
    product: "/product",
    order: "/order",
    stock: "/stock"
};

export const TOKEN = "token";
export const BASKET = "basket";
