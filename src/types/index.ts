// src/types/index.ts

export interface Variante {
  id?: number;
  producto_id?: number;
  unidad: string;
  precio: number;
  stock_disponible: boolean;
  calidad?: string;
}

export interface Categoria {
  id: number;
  nombre: string;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string | null;
  imagen_url: string | null;
  activo: boolean;
  es_canasta: boolean;
  categoria_id: number;
  categorias?: Categoria;
  variantes: Variante[];
  created_at?: string;
}