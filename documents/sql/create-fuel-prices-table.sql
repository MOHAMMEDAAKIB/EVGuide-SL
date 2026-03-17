-- Run this in your Supabase SQL Editor to create the fuel_prices table.

-- Fuel Prices Table (for TCO Calculator)
CREATE TABLE IF NOT EXISTS public.fuel_prices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    fuel_type VARCHAR(20) NOT NULL CHECK (fuel_type IN ('petrol', 'diesel')),
    price_lkr DECIMAL(6,2) NOT NULL,
    effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_fuel_prices_active ON public.fuel_prices(fuel_type, is_active);
CREATE INDEX IF NOT EXISTS idx_fuel_prices_date ON public.fuel_prices(effective_date DESC);

-- Enable RLS
ALTER TABLE public.fuel_prices ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access
CREATE POLICY "Allow public read access to fuel prices"
    ON public.fuel_prices FOR SELECT
    USING (true);

-- Policy: Allow admin insert
CREATE POLICY "Allow admin insert on fuel prices"
    ON public.fuel_prices FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE email = (SELECT auth.jwt()->>'email')
            AND is_active = true
        )
    );

-- Policy: Allow admin update
CREATE POLICY "Allow admin update on fuel prices"
    ON public.fuel_prices FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE email = (SELECT auth.jwt()->>'email')
            AND is_active = true
        )
    );

-- Policy: Allow admin delete
CREATE POLICY "Allow admin delete on fuel prices"
    ON public.fuel_prices FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE email = (SELECT auth.jwt()->>'email')
            AND is_active = true
        )
    );

-- Seed with current Sri Lanka fuel prices (March 2026)
INSERT INTO public.fuel_prices (fuel_type, price_lkr, effective_date, is_active) VALUES
('petrol', 350.00, '2026-03-01', true),
('diesel', 320.00, '2026-03-01', true)
ON CONFLICT DO NOTHING;

COMMENT ON TABLE public.fuel_prices IS 'Current fuel prices in Sri Lanka for TCO calculations';
