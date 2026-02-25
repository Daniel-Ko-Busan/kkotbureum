import { DEMO_MODE, demoCategories, demoProducts, demoOrders, demoStatusHistory } from './data';
import type { Category, Product, Order, OrderStatusHistory } from '@/types';

/**
 * Demo-aware data layer.
 * When DEMO_MODE=true, returns mock data instead of hitting Supabase.
 * When DEMO_MODE=false, delegates to actual Supabase client.
 */

async function getSupabase() {
  const { createClient } = await import('@/lib/supabase/server');
  return createClient();
}

// ── Categories ──

export async function getActiveCategories(): Promise<Category[]> {
  if (DEMO_MODE) return demoCategories;
  const supabase = await getSupabase();
  const { data } = await supabase.from('categories').select('*').eq('is_active', true).order('display_order');
  return data || [];
}

// ── Products ──

export async function getFeaturedProducts(): Promise<Product[]> {
  if (DEMO_MODE) return demoProducts.filter(p => p.is_featured);
  const supabase = await getSupabase();
  const { data } = await supabase.from('products').select('*').eq('is_featured', true).eq('is_active', true).order('display_order').limit(6);
  return data || [];
}

export async function getProducts(missionSlug?: string): Promise<(Product & { category?: Category })[]> {
  if (DEMO_MODE) {
    if (!missionSlug || missionSlug === 'trust_florist') return demoProducts;
    const cat = demoCategories.find(c => c.slug === missionSlug);
    return cat ? demoProducts.filter(p => p.category_id === cat.id) : demoProducts;
  }
  const supabase = await getSupabase();
  let query = supabase.from('products').select('*, category:categories(*)').eq('is_active', true).order('display_order');
  if (missionSlug && missionSlug !== 'trust_florist') {
    const { data: cat } = await supabase.from('categories').select('id').eq('slug', missionSlug).single();
    if (cat) query = query.eq('category_id', cat.id);
  }
  const { data } = await query;
  return data || [];
}

export async function getProductById(id: string): Promise<(Product & { category?: Category }) | null> {
  if (DEMO_MODE) return demoProducts.find(p => p.id === id) || null;
  const supabase = await getSupabase();
  const { data } = await supabase.from('products').select('*, category:categories(*)').eq('id', id).single();
  return data;
}

export async function getCategoryBySlug(slug: string): Promise<Pick<Category, 'name' | 'emoji'> | null> {
  if (DEMO_MODE) {
    const cat = demoCategories.find(c => c.slug === slug);
    return cat ? { name: cat.name, emoji: cat.emoji } : null;
  }
  const supabase = await getSupabase();
  const { data } = await supabase.from('categories').select('name, emoji').eq('slug', slug).single();
  return data;
}

// ── Orders ──

export async function getRecentOrders(limit = 5): Promise<Order[]> {
  if (DEMO_MODE) return demoOrders.slice(0, limit);
  const supabase = await getSupabase();
  const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(limit);
  return data || [];
}

export async function getTodayOrders(): Promise<Order[]> {
  if (DEMO_MODE) return demoOrders;
  const supabase = await getSupabase();
  const today = new Date().toISOString().split('T')[0];
  const { data } = await supabase.from('orders').select('*').gte('created_at', `${today}T00:00:00`).neq('status', 'cancelled');
  return data || [];
}

export async function getOrders(filterStatus?: string): Promise<Order[]> {
  if (DEMO_MODE) {
    if (filterStatus && filterStatus !== 'all') return demoOrders.filter(o => o.status === filterStatus);
    return demoOrders;
  }
  const supabase = await getSupabase();
  let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (filterStatus && filterStatus !== 'all') query = query.eq('status', filterStatus);
  const { data } = await query;
  return data || [];
}

export async function getOrderById(id: string): Promise<Order | null> {
  if (DEMO_MODE) return demoOrders.find(o => o.id === id) || null;
  const supabase = await getSupabase();
  const { data } = await supabase.from('orders').select('*').eq('id', id).single();
  return data;
}

export async function getOrderStatusHistory(orderId: string): Promise<OrderStatusHistory[]> {
  if (DEMO_MODE) return demoStatusHistory.filter(h => h.order_id === orderId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const supabase = await getSupabase();
  const { data } = await supabase.from('order_status_history').select('*').eq('order_id', orderId).order('created_at', { ascending: false });
  return data || [];
}

// ── Admin Products (for listing) ──

export async function getAllProducts(): Promise<(Product & { category?: Pick<Category, 'name' | 'emoji'> })[]> {
  if (DEMO_MODE) return demoProducts;
  const supabase = await getSupabase();
  const { data } = await supabase.from('products').select('*, category:categories(name, emoji)').order('display_order');
  return data || [];
}
