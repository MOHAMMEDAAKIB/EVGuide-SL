export interface Database {
  public: {
    Tables: {
      vehicles: {
        Row: Vehicle;
        Insert: Omit<Vehicle, 'id' | 'created_at'>;
        Update: Partial<Omit<Vehicle, 'id' | 'created_at'>>;
      };
      charging_stations: {
        Row: ChargingStation;
        Insert: Omit<ChargingStation, 'id' | 'created_at'>;
        Update: Partial<Omit<ChargingStation, 'id' | 'created_at'>>;
      };
    };
  };
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  body_type: string; // SUV, Sedan, Hatchback, etc.
  price_lkr: number;
  price_registered_lkr: number | null;
  battery_kwh: number;
  range_wltp: number; // Manufacturer claimed range
  range_sl_estimate: number; // Real-world Sri Lankan estimate (WLTP * 0.85)
  motor_power_kw: number;
  top_speed_kmh: number | null;
  acceleration_0_100: number | null; // seconds
  charging_time_ac_hours: number; // 0-100% home charging
  charging_time_dc_minutes: number; // 20-80% fast charging
  seating_capacity: number;
  cargo_space_liters: number | null;
  drive_type: string; // FWD, RWD, AWD
  tax_bracket: string;
  image_url: string | null;
  features: string[] | null; // JSON array of features
  created_at: string;
  updated_at: string | null;
}

export interface ChargingStation {
  id: string;
  name: string;
  operator: string; // ChargeNET, etc.
  address: string;
  latitude: number;
  longitude: number;
  connector_types: string[]; // ['CCS2', 'CHAdeMO', 'Type 2']
  power_output_kw: number;
  charging_type: 'AC' | 'DC' | 'Both';
  status: 'available' | 'maintenance' | 'unknown';
  is_public: boolean;
  cost_per_kwh: number | null;
  amenities: string[] | null; // ['parking', 'restroom', 'cafe']
  created_at: string;
  updated_at: string | null;
}
