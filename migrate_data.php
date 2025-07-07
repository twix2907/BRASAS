<?php
// Script para migrar datos de local a Railway
// Ejecutar en local: php migrate_data.php

echo "=== MIGRACIÓN DE DATOS LOCAL → RAILWAY ===\n";

try {
    // Conexión LOCAL
    echo "Conectando a base de datos local...\n";
    $localDB = new PDO('mysql:host=127.0.0.1;dbname=brasas_db', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    echo "✅ Conectado a BD local\n";

    // Conexión RAILWAY
    echo "Conectando a Railway...\n";
    $railwayDB = new PDO(
        'mysql:host=nozomi.proxy.rlwy.net;port=21498;dbname=railway', 
        'root', 
        'CbawdBucCcqPsoZgKSgiYenUArNaPTSY',
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    echo "✅ Conectado a Railway\n";

} catch (PDOException $e) {
    die("❌ Error de conexión: " . $e->getMessage() . "\n");
}

// Tablas a migrar (en orden por dependencias)
$tables = ['users', 'tables', 'products', 'orders', 'order_items'];

foreach ($tables as $table) {
    echo "Migrando tabla: $table\n";
    
    // Obtener datos locales
    $data = $localDB->query("SELECT * FROM $table")->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($data)) {
        echo "  - Sin datos en $table\n";
        continue;
    }
    
    // Limpiar tabla en Railway (opcional)
    $railwayDB->exec("DELETE FROM $table");
    
    // Insertar datos
    foreach ($data as $row) {
        $columns = implode(',', array_keys($row));
        $placeholders = ':' . implode(', :', array_keys($row));
        
        $sql = "INSERT INTO $table ($columns) VALUES ($placeholders)";
        $stmt = $railwayDB->prepare($sql);
        $stmt->execute($row);
    }
    
    echo "  - Migrados " . count($data) . " registros\n";
}

echo "=== MIGRACIÓN COMPLETADA ===\n";
?>
