'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Input from '@/components/ui/Input';
import { TextArea } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import type { Category } from '@/types';
import { DEMO_MODE, demoCategories, demoProducts } from '@/lib/demo/data';

export default function AdminProductFormPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-text-tertiary">로딩 중...</div>}>
      <AdminProductFormContent />
    </Suspense>
  );
}

function AdminProductFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    short_description: '',
    price: '',
    sale_price: '',
    category_id: '',
    size: '',
    flower_types: '',
    is_active: true,
    is_featured: false,
    display_order: '0',
    images: [] as string[],
  });

  const supabase = createClient();

  const loadProductData = (data: Record<string, unknown>) => {
    setForm({
      name: (data.name as string) || '',
      description: (data.description as string) || '',
      short_description: (data.short_description as string) || '',
      price: String(data.price || ''),
      sale_price: data.sale_price ? String(data.sale_price) : '',
      category_id: (data.category_id as string) || '',
      size: (data.size as string) || '',
      flower_types: (data.flower_types as string[])?.join(', ') || '',
      is_active: data.is_active as boolean ?? true,
      is_featured: data.is_featured as boolean ?? false,
      display_order: String(data.display_order || 0),
      images: (data.images as string[]) || [],
    });
  };

  useEffect(() => {
    if (DEMO_MODE) {
      setCategories(demoCategories as Category[]);
      if (editId) {
        const product = demoProducts.find(p => p.id === editId);
        if (product) loadProductData(product as unknown as Record<string, unknown>);
      }
      return;
    }

    supabase.from('categories').select('*').order('display_order').then(({ data }) => {
      if (data) setCategories(data);
    });

    if (editId) {
      supabase.from('products').select('*').eq('id', editId).single().then(({ data }) => {
        if (data) loadProductData(data);
      });
    }
  }, [editId]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setImageUploading(true);

    try {
      const newImages: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`${file.name}: 파일 크기가 5MB를 초과해요`);
          continue;
        }

        if (DEMO_MODE) {
          // Demo mode: use FileReader for base64 preview
          const url = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
          newImages.push(url);
        } else {
          // Production: upload to Supabase Storage
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${i}.${fileExt}`;
          const filePath = `products/${fileName}`;

          const { error } = await supabase.storage
            .from('product-images')
            .upload(filePath, file);

          if (error) {
            alert(`${file.name}: 업로드에 실패했어요`);
            continue;
          }

          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

          newImages.push(publicUrl);
        }
      }

      setForm((prev) => ({ ...prev, images: [...prev.images, ...newImages] }));
    } finally {
      setImageUploading(false);
      // Reset input so same file can be re-selected
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      alert('상품명을 입력해주세요');
      return;
    }
    if (!form.price || parseInt(form.price) <= 0) {
      alert('올바른 가격을 입력해주세요');
      return;
    }
    if (form.sale_price && parseInt(form.sale_price) >= parseInt(form.price)) {
      alert('할인가는 정가보다 낮아야 해요');
      return;
    }

    setLoading(true);
    try {
      const productData = {
        name: form.name,
        description: form.description || null,
        short_description: form.short_description || null,
        price: parseInt(form.price),
        sale_price: form.sale_price ? parseInt(form.sale_price) : null,
        category_id: form.category_id || null,
        size: form.size || null,
        flower_types: form.flower_types ? form.flower_types.split(',').map((s) => s.trim()).filter(Boolean) : null,
        is_active: form.is_active,
        is_featured: form.is_featured,
        display_order: parseInt(form.display_order) || 0,
        images: form.images,
      };

      if (DEMO_MODE) {
        alert(editId ? '상품이 수정되었어요 (데모)' : '상품이 등록되었어요 (데모)');
        router.push('/admin/products');
        return;
      }

      if (editId) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert(productData);
        if (error) throw error;
      }

      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      alert('저장에 실패했어요');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!editId || !confirm('정말 비활성화하시겠어요?')) return;

    setLoading(true);
    try {
      if (DEMO_MODE) {
        alert('상품이 비활성화되었어요 (데모)');
        router.push('/admin/products');
        return;
      }

      await supabase.from('products').update({ is_active: false }).eq('id', editId);
      router.push('/admin/products');
      router.refresh();
    } catch {
      alert('비활성화에 실패했어요');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="p-1 -ml-1 hover:bg-bg-secondary rounded-lg">
          <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-text-primary">
          {editId ? '상품 수정' : '상품 추가'}
        </h1>
      </div>

      <p className="text-xs text-text-tertiary mb-2"><span className="text-error">*</span> 표시는 필수 입력 항목이에요</p>

      <div className="max-w-xl flex flex-col gap-4">
        <Input
          label="상품명 *"
          placeholder="예쁜 꽃다발"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <TextArea
          label="상품 설명"
          placeholder="상품에 대해 자세히 적어주세요"
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <Input
          label="한줄 소개"
          placeholder="상품 카드에 표시되는 짧은 설명"
          value={form.short_description}
          onChange={(e) => setForm({ ...form, short_description: e.target.value })}
          hint="상품 목록에 표시돼요"
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="정가 (원) *"
            type="number"
            placeholder="50000"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <Input
            label="할인가 (원)"
            type="number"
            placeholder="비워두면 할인 없음"
            value={form.sale_price}
            onChange={(e) => setForm({ ...form, sale_price: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-text-primary block mb-1.5">카테고리</label>
          <select
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-border bg-white text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">카테고리 선택</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.emoji} {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-text-primary block mb-1.5">사이즈</label>
            <select
              value={form.size}
              onChange={(e) => setForm({ ...form, size: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-border bg-white text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">선택 안 함</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
            </select>
          </div>
          <Input
            label="정렬 순서"
            type="number"
            value={form.display_order}
            onChange={(e) => setForm({ ...form, display_order: e.target.value })}
          />
        </div>

        <Input
          label="꽃 종류"
          placeholder="장미, 튤립, 카네이션 (쉼표로 구분)"
          value={form.flower_types}
          onChange={(e) => setForm({ ...form, flower_types: e.target.value })}
        />

        {/* Image Upload */}
        <div>
          <label className="text-sm font-medium text-text-primary block mb-1.5">
            상품 이미지 {form.images.length > 0 && `(${form.images.length})`}
          </label>
          <div className="flex gap-2 flex-wrap">
            {form.images.map((url, i) => (
              <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border group">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
                {i === 0 && (
                  <span className="absolute bottom-0 left-0 right-0 bg-primary/80 text-white text-[10px] text-center py-0.5">
                    대표
                  </span>
                )}
              </div>
            ))}
            <label className={`w-20 h-20 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:bg-bg-secondary transition-colors ${imageUploading ? 'opacity-50 pointer-events-none' : ''}`}>
              {imageUploading ? (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span className="text-xl text-text-tertiary">+</span>
                  <span className="text-[10px] text-text-tertiary">이미지</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                disabled={imageUploading}
              />
            </label>
          </div>
          <p className="text-xs text-text-tertiary mt-1">첫 번째 이미지가 대표 이미지로 사용돼요 (최대 5MB)</p>
        </div>

        {/* Toggles */}
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="rounded border-border w-4 h-4"
            />
            활성
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
              className="rounded border-border w-4 h-4"
            />
            인기 상품
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          {editId && (
            <Button variant="danger" onClick={handleDelete} disabled={loading}>
              비활성화
            </Button>
          )}
          <Button onClick={handleSubmit} loading={loading} fullWidth size="lg">
            {editId ? '수정하기' : '등록하기'}
          </Button>
        </div>
      </div>
    </div>
  );
}
