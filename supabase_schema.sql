-- ============================================================================
-- ESQUEMA DE BANCO DE DADOS & SEGURANÇA SUPABASE (POSTGRESQL)
-- PROJETO: Vivi Carvalho Boty (E-commerce & Vitrine Digital)
-- DIRETRIZES: Supabase Postgres Best Practices & Row Level Security (RLS)
-- ============================================================================

-- Habilitar extensões essenciais
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. TABELA DE PRODUTOS (public.products)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL CHECK (char_length(trim(nome)) > 0),
    marca TEXT NOT NULL CHECK (char_length(trim(marca)) > 0),
    categoria TEXT NOT NULL CHECK (categoria IN ('Perfumes', 'Cremes', 'Corpo e Banho', 'Cabelos', 'Maquiagem', 'Presentes', 'Outros')),
    genero TEXT NOT NULL DEFAULT 'Feminino' CHECK (genero IN ('Feminino', 'Masculino', 'Unissex')),
    preco NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (preco >= 0),
    preco_original NUMERIC(10, 2) DEFAULT NULL CHECK (preco_original IS NULL OR preco_original >= 0),
    estoque INTEGER NOT NULL DEFAULT 0 CHECK (estoque >= 0),
    descricao TEXT,
    imagem TEXT,
    ativo BOOLEAN NOT NULL DEFAULT true,
    destaque BOOLEAN NOT NULL DEFAULT false,
    promocao BOOLEAN NOT NULL DEFAULT false,
    pronta_entrega BOOLEAN GENERATED ALWAYS AS (estoque > 0) STORED,
    data_criacao TIMESTAMPTZ NOT NULL DEFAULT now(),
    data_atualizacao TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices otimizados para consultas de catálogo (filtros combinados)
CREATE INDEX IF NOT EXISTS idx_products_active_catalog 
    ON public.products (ativo, categoria, destaque, promocao);

CREATE INDEX IF NOT EXISTS idx_products_sorting_price 
    ON public.products (ativo, preco ASC);

CREATE INDEX IF NOT EXISTS idx_products_created 
    ON public.products (data_criacao DESC);

-- Índice de texto completo para buscas rápidas (Gastro/Português)
CREATE INDEX IF NOT EXISTS idx_products_fulltext 
    ON public.products USING GIN (
        to_tsvector('portuguese', coalesce(nome, '') || ' ' || coalesce(marca, '') || ' ' || coalesce(descricao, ''))
    );

-- ============================================================================
-- 2. TABELA DE PEDIDOS (public.orders)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo TEXT UNIQUE NOT NULL CHECK (char_length(codigo) >= 4),
    cliente_nome TEXT,
    cliente_bairro TEXT,
    itens JSONB NOT NULL DEFAULT '[]'::jsonb,
    total NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (total >= 0),
    forma_pagamento TEXT DEFAULT 'Pix',
    is_presente BOOLEAN NOT NULL DEFAULT false,
    status TEXT NOT NULL DEFAULT 'novo' CHECK (status IN ('novo', 'em_atendimento', 'concluido', 'cancelado')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_status_created 
    ON public.orders (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_orders_codigo 
    ON public.orders (codigo);

-- ============================================================================
-- 3. TABELA DE DEPOIMENTOS & PROVA SOCIAL (public.testimonials)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL CHECK (char_length(trim(nome)) > 0),
    cidade TEXT DEFAULT 'Assis/SP',
    produto TEXT,
    nota INTEGER NOT NULL DEFAULT 5 CHECK (nota BETWEEN 1 AND 5),
    texto TEXT NOT NULL CHECK (char_length(trim(texto)) > 0),
    aprovado BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_approved 
    ON public.testimonials (aprovado, created_at DESC);

-- ============================================================================
-- 4. TABELA DE CONFIGURAÇÕES DA LOJA (public.store_settings)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.store_settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 5. TABELA DE ANALYTICS (public.analytics_events)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    product_id TEXT,
    product_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analytics_type_date 
    ON public.analytics_events (event_type, created_at DESC);

-- ============================================================================
-- 6. POLÍTICAS DE ROW LEVEL SECURITY (RLS) - SEGURANÇA MÁXIMA
-- ============================================================================

-- Ativação de RLS em todas as tabelas
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- 6.1 PRODUTOS:
-- Visitantes públicos podem visualizar produtos ativos (ou qualquer produto caso autenticado)
CREATE POLICY "Public read active products"
    ON public.products
    FOR SELECT
    USING (ativo = true OR auth.role() = 'authenticated');

-- Administradora autenticada pode criar, editar e excluir produtos
CREATE POLICY "Admin full manage products"
    ON public.products
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 6.2 PEDIDOS:
-- Clientes podem registrar pedidos (INSERT apenas)
CREATE POLICY "Public insert orders"
    ON public.orders
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- APENAS a administradora autenticada pode ler, atualizar ou excluir pedidos
-- (Proteção contra espionagem de concorrentes ou vazamento de dados de clientes)
CREATE POLICY "Admin select orders"
    ON public.orders
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admin update orders"
    ON public.orders
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin delete orders"
    ON public.orders
    FOR DELETE
    TO authenticated
    USING (true);

-- 6.3 DEPOIMENTOS:
-- Público pode ver depoimentos aprovados
CREATE POLICY "Public read approved testimonials"
    ON public.testimonials
    FOR SELECT
    USING (aprovado = true OR auth.role() = 'authenticated');

-- Clientes podem enviar novos depoimentos (nascem com aprovado = false por segurança)
CREATE POLICY "Public insert testimonials"
    ON public.testimonials
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (aprovado = false);

-- Administradora modera depoimentos
CREATE POLICY "Admin manage testimonials"
    ON public.testimonials
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 6.4 CONFIGURAÇÕES DA LOJA:
-- Público pode ler configurações operacionais seguras (WhatsApp, templates de texto)
-- Chaves sensíveis (como chaves de IA) ficam restritas ao perfil autenticado
CREATE POLICY "Public read safe settings"
    ON public.store_settings
    FOR SELECT
    USING (
        key NOT ILIKE '%key%' 
        AND key NOT ILIKE '%secret%' 
        AND key NOT ILIKE '%token%'
        OR auth.role() = 'authenticated'
    );

-- Administradora pode alterar qualquer configuração
CREATE POLICY "Admin manage settings"
    ON public.store_settings
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 6.5 ANALYTICS:
-- Clientes anônimos podem registrar eventos (page view, add to cart, whatsapp click)
CREATE POLICY "Public insert analytics"
    ON public.analytics_events
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Apenas administradora visualiza relatórios de métricas
CREATE POLICY "Admin read analytics"
    ON public.analytics_events
    FOR SELECT
    TO authenticated
    USING (true);

-- ============================================================================
-- 7. TRIGGER PARA ATUALIZAÇÃO AUTOMÁTICA DE TIMESTAMP (data_atualizacao)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.data_atualizacao = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_products_updated_at ON public.products;
CREATE TRIGGER trigger_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 8. STORAGE BUCKET POLICIES (site-assets)
-- ============================================================================
-- Leitura pública para fotos do catálogo:
-- CREATE POLICY "Public read catalog images"
--     ON storage.objects FOR SELECT
--     USING (bucket_id = 'site-assets');
--
-- Upload restrito a usuários autenticados:
-- CREATE POLICY "Admin upload catalog images"
--     ON storage.objects FOR INSERT
--     TO authenticated
--     WITH CHECK (bucket_id = 'site-assets');
