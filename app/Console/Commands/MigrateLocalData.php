<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class MigrateLocalData extends Command
{
    protected $signature = 'migrate:local-data';
    protected $description = 'Migrate data from local database to current database';

    public function handle()
    {
        $this->info('=== MIGRACIÓN DE DATOS LOCALES ===');
        
        // Configuración de BD local
        $localConfig = [
            'driver' => 'mysql',
            'host' => '127.0.0.1',
            'database' => 'brasas',
            'username' => 'root',
            'password' => '',
        ];
        
        // Crear conexión local
        config(['database.connections.local' => $localConfig]);
        $localDB = DB::connection('local');
        
        // Tablas a migrar
        $tables = ['users', 'tables', 'products', 'orders', 'order_items'];
        
        foreach ($tables as $table) {
            $this->info("Migrando tabla: $table");
            
            // Obtener datos locales
            $data = $localDB->table($table)->get()->toArray();
            
            if ($data->isEmpty()) {
                $this->warn("  - Sin datos en $table");
                continue;
            }
            
            // Limpiar tabla actual
            DB::table($table)->delete();
            
            // Insertar datos
            foreach ($data->chunk(100) as $chunk) {
                DB::table($table)->insert($chunk->toArray());
            }
            
            $this->info("  - Migrados " . $data->count() . " registros");
        }
        
        $this->info('=== MIGRACIÓN COMPLETADA ===');
    }
}
