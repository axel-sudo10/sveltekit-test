import { error } from '@sveltejs/kit';

const API_BASE_URL = 'https://backbone-web-api.production.regensburg.delcom.nl';

/**
 * Holt Produkte von der API
 */
export async function fetchProducts(options = {}) {
	const { limit = 100, page = 1, customFetch = fetch } = options;

	const params = new URLSearchParams([
		['limit', String(limit)],
		['page', String(page)],
		['join', 'tags'],
		['join', 'documents'],
		['join', 'translations'],
		['join', 'location'],
		['s', JSON.stringify({ isActive: 1, 'tags.activeState': true, allowAsLinkedProduct: true })]
	]);

	const res = await customFetch(`${API_BASE_URL}/products?${params}`);
	if (!res.ok) {
		error(res.status, 'Failed to fetch products from external API.');
	}
	return res.json();
}

/**
 * Holt ein einzelnes Produkt
 */
export async function fetchProduct(id, customFetch = fetch) {
	const params = new URLSearchParams([
		['join', 'tags'],
		['join', 'location'],
		['join', 'documents'],
		['join', 'translations'],
		['join', 'linkedSubscriptions'],
		['join', 'courses']
	]);

	const res = await customFetch(`${API_BASE_URL}/products/${id}?${params}`);
	if (!res.ok) {
		error(res.status, 'Failed to fetch product from external API.');
	}
	return res.json();
}

/**
 * Holt Buchungen für ein Produkt
 */
export async function fetchBookings(productId, options = {}) {
	const { limit = 60, page = 1, customFetch = fetch } = options;

	const params = new URLSearchParams([
		['limit', String(limit)],
		['page', String(page)],
		['s', JSON.stringify({ linkedProductId: { $in: [productId] } })]
	]);

	const res = await customFetch(`${API_BASE_URL}/bookings?${params}`);
	if (!res.ok) {
		error(res.status, 'Failed to fetch bookings from external API.');
	}
	return res.json();
}
