-- EVGuide SL Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Vehicles Table
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    body_type VARCHAR(30) NOT NULL, -- SUV, Sedan, Hatchback, Crossover
    price_lkr INTEGER NOT NULL,
    price_registered_lkr INTEGER,
    battery_kwh DECIMAL(5,2) NOT NULL,
    range_wltp INTEGER NOT NULL,
    range_sl_estimate INTEGER NOT NULL, -- WLTP * 0.85
    motor_power_kw DECIMAL(6,2) NOT NULL,
    top_speed_kmh INTEGER,
    acceleration_0_100 DECIMAL(4,2), -- seconds
    charging_time_ac_hours DECIMAL(4,1) NOT NULL,
    charging_time_dc_minutes INTEGER NOT NULL,
    seating_capacity INTEGER NOT NULL DEFAULT 5,
    cargo_space_liters INTEGER,
    drive_type VARCHAR(10) NOT NULL, -- FWD, RWD, AWD
    tax_bracket VARCHAR(50),
    image_url TEXT,
    features JSONB, -- Array of features
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Charging Stations Table
CREATE TABLE IF NOT EXISTS public.charging_stations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    operator VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    connector_types JSONB NOT NULL, -- ['CCS2', 'CHAdeMO', 'Type 2']
    power_output_kw DECIMAL(6,2) NOT NULL,
    charging_type VARCHAR(10) NOT NULL CHECK (charging_type IN ('AC', 'DC', 'Both')),
    status VARCHAR(20) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'maintenance', 'unknown')),
    is_public BOOLEAN NOT NULL DEFAULT true,
    cost_per_kwh DECIMAL(6,2),
    amenities JSONB, -- ['parking', 'restroom', 'cafe', 'wifi']
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for better query performance
CREATE INDEX idx_vehicles_make_model ON public.vehicles(make, model);
CREATE INDEX idx_vehicles_price ON public.vehicles(price_lkr);
CREATE INDEX idx_vehicles_range ON public.vehicles(range_sl_estimate);
CREATE INDEX idx_vehicles_body_type ON public.vehicles(body_type);
CREATE INDEX idx_charging_stations_location ON public.charging_stations(latitude, longitude);
CREATE INDEX idx_charging_stations_status ON public.charging_stations(status);

-- Enable Row Level Security (RLS)
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charging_stations ENABLE ROW LEVEL SECURITY;

-- Policies: Allow public read access (anyone can view vehicles and stations)
CREATE POLICY "Allow public read access to vehicles"
    ON public.vehicles FOR SELECT
    USING (true);

CREATE POLICY "Allow public read access to charging stations"
    ON public.charging_stations FOR SELECT
    USING (true);

-- Insert Sample Data: Popular EVs in Sri Lanka
INSERT INTO public.vehicles (make, model, year, body_type, price_lkr, price_registered_lkr, battery_kwh, range_wltp, range_sl_estimate, motor_power_kw, top_speed_kmh, acceleration_0_100, charging_time_ac_hours, charging_time_dc_minutes, seating_capacity, cargo_space_liters, drive_type, tax_bracket, image_url, features) VALUES
('BYD', 'Atto 3', 2024, 'SUV', 10500000, 11500000, 60.48, 420, 357, 150, 160, 7.3, 9.5, 30, 5, 440, 'FWD', '>100kW Motor', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800', '["Panoramic Sunroof", "360 Camera", "Wireless Charging", "Adaptive Cruise Control"]'),
('Nissan', 'Leaf', 2023, 'Hatchback', 7500000, 8200000, 40, 270, 230, 110, 144, 7.9, 8.0, 35, 5, 405, 'FWD', '<100kW Motor', 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800', '["ProPilot Assist", "e-Pedal", "Apple CarPlay", "LED Headlights"]'),
('MG', 'ZS EV', 2024, 'SUV', 9200000, 10000000, 50.3, 320, 272, 130, 140, 8.5, 8.5, 40, 5, 448, 'FWD', '>100kW Motor', 'https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?w=800', '["Panoramic Sunroof", "Leather Seats", "Fast Charging", "Rain Sensing Wipers"]'),
('BYD', 'Dolphin', 2024, 'Hatchback', 6800000, 7500000, 44.9, 340, 289, 70, 150, 10.5, 7.5, 30, 5, 345, 'FWD', '<100kW Motor', 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800', '["Rotating Screen", "Voice Control", "LED Ambient Lighting", "Keyless Entry"]'),
('Tesla', 'Model 3', 2024, 'Sedan', 18500000, 19500000, 60, 491, 417, 208, 225, 4.4, 9.0, 25, 5, 425, 'RWD', '>100kW Motor', 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800', '["Autopilot", "Premium Audio", "Glass Roof", "Supercharger Access", "OTA Updates"]');

-- Insert Sample Charging Stations in Sri Lanka
INSERT INTO public.charging_stations (name, operator, address, latitude, longitude, connector_types, power_output_kw, charging_type, status, is_public, cost_per_kwh, amenities) VALUES
('ChargeNET - One Galle Face', 'ChargeNET', '1 & 2 One Galle Face, Colombo 02', 6.9319, 79.8437, '["CCS2", "CHAdeMO", "Type 2"]', 50, 'DC', 'available', true, 45, '["parking", "cafe", "restroom", "wifi"]'),
('ChargeNET - Marino Mall', 'ChargeNET', 'Marine Drive, Colombo 03', 6.9194, 79.8475, '["CCS2", "Type 2"]', 30, 'Both', 'available', true, 40, '["parking", "shopping"]'),
('ChargeNET - Cinnamon Grand', 'ChargeNET', '77 Galle Road, Colombo 03', 6.9147, 79.8501, '["Type 2"]', 22, 'AC', 'available', false, 35, '["parking", "hotel", "restaurant"]'),
('ChargeNET - Kandy City Centre', 'ChargeNET', 'Dalada Veediya, Kandy', 7.2933, 80.6351, '["CCS2", "CHAdeMO"]', 50, 'DC', 'available', true, 45, '["parking", "shopping", "restroom"]'),
('Tesla Supercharger - Colombo', 'Tesla', 'Bauddhaloka Mawatha, Colombo 04', 6.8978, 79.8591, '["Tesla Supercharger"]', 150, 'DC', 'available', false, null, '["parking", "wifi"]');

-- Fuel Prices Table (for TCO Calculator)
CREATE TABLE IF NOT EXISTS public.fuel_prices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    fuel_type VARCHAR(20) NOT NULL CHECK (fuel_type IN ('petrol', 'diesel')),
    price_lkr DECIMAL(6,2) NOT NULL, -- Price per liter in LKR
    effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Index for fuel prices
CREATE INDEX idx_fuel_prices_active ON public.fuel_prices(fuel_type, is_active);
CREATE INDEX idx_fuel_prices_date ON public.fuel_prices(effective_date DESC);

-- Enable RLS for fuel prices
ALTER TABLE public.fuel_prices ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to fuel prices
CREATE POLICY "Allow public read access to fuel prices"
    ON public.fuel_prices FOR SELECT
    USING (true);

-- Insert Current Fuel Prices (as of Feb 2026)
INSERT INTO public.fuel_prices (fuel_type, price_lkr, effective_date, is_active) VALUES
('petrol', 350.00, '2026-02-01', true),
('diesel', 320.00, '2026-02-01', true);

COMMENT ON TABLE public.vehicles IS 'Electric vehicles available in Sri Lanka with localized specifications';
COMMENT ON TABLE public.charging_stations IS 'EV charging infrastructure across Sri Lanka';
COMMENT ON TABLE public.fuel_prices IS 'Current fuel prices in Sri Lanka for TCO calculations';
