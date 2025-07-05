<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Events\OrderActualizada;
use App\Events\ComandaParaImprimir;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    /**
     * Devuelve los datos estructurados para impresión de ticket/comanda
     */
    public function printData($id)
    {
        $order = Order::with(['items.product', 'user'])->findOrFail($id);
        $logoUrl = asset('images/logo.png'); // Asegúrate de tener el logo en public/images/logo.png
        $data = [
            'restaurante' => [
                'nombre' => "D'Brasas y Carbón",
                'logo_url' => $logoUrl,
                'eslogan' => 'El sabor auténtico a la brasa',
            ],
            'pedido' => [
                'id' => $order->id,
                'tipo' => $order->type,
                'mesa' => $order->table_id,
                'usuario' => $order->user ? ['id' => $order->user->id, 'name' => $order->user->name] : null,
                'fecha' => $order->created_at ? $order->created_at->format('Y-m-d H:i') : null,
                'productos' => $order->items->map(function($item) {
                    return [
                        'nombre' => $item->product ? $item->product->name : 'Producto',
                        'cantidad' => $item->quantity,
                        'precio' => $item->price,
                        'notas' => $item->notes,
                    ];
                }),
                'total' => $order->total,
                'notas' => $order->notes,
                'client_name' => $order->client_name,
                'delivery_location' => $order->delivery_location,
            ]
        ];
        return response()->json($data);
    }
    /**
     * Display a listing of the resource.
     */
    // Listar todos los pedidos (con productos)
    public function index()
    {
        // Cargar pedidos con items y producto asociado a cada item
        $orders = Order::with(['items.product', 'user'])->get();
        return response()->json($orders);
    }

    /**
     * Store a newly created resource in storage.
     */
    // Crear un nuevo pedido con productos
    public function store(Request $request)
    {
        Log::info('[OrderController@store] SESSION', [
            'session_id' => session()->getId(),
            'user_id' => $request->user() ? $request->user()->id : null,
            'cookies' => $request->cookies->all(),
        ]);

        $validated = $request->validate([
            'table_id' => 'nullable|exists:tables,id',
            'user_id' => 'required|exists:users,id',
            'type' => 'required|in:mesa,para_llevar,delivery',
            'notes' => 'nullable|string',
            'client_name' => 'required_if:type,delivery|nullable|string',
            'delivery_location' => 'required_if:type,delivery|nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.notes' => 'nullable|string',
        ]);

        // Validación: solo un pedido activo por mesa
        if ($validated['type'] === 'mesa' && !empty($validated['table_id'])) {
            $yaExiste = Order::where('table_id', $validated['table_id'])
                ->where('status', 'activo')
                ->exists();
            if ($yaExiste) {
                return response()->json([
                    'message' => 'Ya existe un pedido activo para esta mesa. Solo puede haber un pedido activo por mesa.'
                ], 422);
            }
        }
        $order = Order::create([
            'table_id' => $validated['table_id'] ?? null,
            'user_id' => $validated['user_id'],
            'type' => $validated['type'],
            'notes' => $validated['notes'] ?? null,
            'client_name' => $validated['type'] === 'delivery' ? $validated['client_name'] : null,
            'delivery_location' => $validated['type'] === 'delivery' ? $validated['delivery_location'] : null,
            'status' => $validated['type'] === 'delivery' ? 'por_cobrar' : 'activo',
            'total' => collect($validated['items'])->sum(function($item) { return $item['price'] * $item['quantity']; }),
        ]);

        foreach ($validated['items'] as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
                'notes' => $item['notes'] ?? null,
            ]);
        }

        // Si es pedido de mesa, emitir evento MesaActualizada siempre (estado derivado)
        if ($validated['type'] === 'mesa' && !empty($validated['table_id'])) {
            $mesa = \App\Models\Table::find($validated['table_id']);
            if ($mesa) {
                \Illuminate\Support\Facades\Log::info('Llamando a event MesaActualizada desde store', ['mesa_id' => $mesa->id, 'mesa_name' => $mesa->name]);
                event(new \App\Events\MesaActualizada($mesa));
            }
        }

        $orderWithItems = $order->load(['items.product', 'user']);
        event(new OrderActualizada($orderWithItems));

        // Emitir evento SOLO para cocina: impresión automática de comanda
        if ($validated['type'] === 'mesa' || $validated['type'] === 'para_llevar' || $validated['type'] === 'delivery') {
            // Obtener datos de impresión (igual que printData)
            $logoUrl = asset('images/logo.png');
            $printData = [
                'restaurante' => [
                    'nombre' => "D'Brasas y Carbón",
                    'logo_url' => $logoUrl,
                    'eslogan' => 'El sabor auténtico a la brasa',
                ],
                'pedido' => [
                    'id' => $orderWithItems->id,
                    'tipo' => $orderWithItems->type,
                    'mesa' => $orderWithItems->table_id,
                    'usuario' => $orderWithItems->user ? ['id' => $orderWithItems->user->id, 'name' => $orderWithItems->user->name] : null,
                    'fecha' => $orderWithItems->created_at ? $orderWithItems->created_at->format('Y-m-d H:i') : null,
                    'productos' => $orderWithItems->items->map(function($item) {
                        return [
                            'nombre' => $item->product ? $item->product->name : 'Producto',
                            'cantidad' => $item->quantity,
                            'precio' => $item->price,
                            'notas' => $item->notes,
                        ];
                    }),
                    'total' => $orderWithItems->total,
                    'notas' => $orderWithItems->notes,
                    'client_name' => $orderWithItems->client_name,
                    'delivery_location' => $orderWithItems->delivery_location,
                ]
            ];
            event(new ComandaParaImprimir($orderWithItems->id, $printData));
        }
        return response()->json($orderWithItems, 201);
    }

    /**
     * Display the specified resource.
     */
    // Mostrar un pedido específico (con productos)
    
            public function show($id)
            {
                $order = Order::with(['items.product', 'user'])->findOrFail($id);
                return response()->json($order);
            }

    /**
     * Update the specified resource in storage.
     */
    // Actualizar notas o estado del pedido (no productos)
    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $validated = $request->validate([
            'notes' => 'nullable|string',
            'status' => 'sometimes|required|in:activo,por_cobrar,cerrado,cancelado',
            'client_name' => 'nullable|string',
            'delivery_location' => 'nullable|string',
        ]);
        $order->update($validated);
        $order->refresh(); // Asegura que el status esté actualizado
        $orderWithItems = $order->load(['items.product', 'user']);
        event(new OrderActualizada($orderWithItems));

        // Emitir evento MesaActualizada si la orden es de mesa y cambia a por_cobrar o cerrado
        if ($order->type === 'mesa' && $order->table_id && isset($validated['status'])) {
            if (in_array($validated['status'], ['por_cobrar', 'cerrado', 'cancelado', 'activo'])) {
                $mesa = \App\Models\Table::find($order->table_id);
                if ($mesa) {
                    \Illuminate\Support\Facades\Log::info('Llamando a event MesaActualizada desde update', ['mesa_id' => $mesa->id, 'mesa_name' => $mesa->name, 'nuevo_estado_orden' => $validated['status']]);
                    event(new \App\Events\MesaActualizada($mesa));
                }
            }
        }

        return response()->json($orderWithItems);
    }

    /**
     * Remove the specified resource from storage.
     */
    // Cancelar pedido (no se borra físicamente)
    public function destroy($id)
    {
        $order = Order::findOrFail($id);
        $order->status = 'cancelado';
        $order->save();
        $orderWithItems = $order->load(['items.product', 'user']);
        event(new OrderActualizada($orderWithItems));
        // Emitir evento MesaActualizada si el pedido era de mesa
        if ($order->type === 'mesa' && $order->table_id) {
            $mesa = \App\Models\Table::find($order->table_id);
            if ($mesa) {
                \Illuminate\Support\Facades\Log::info('Llamando a event MesaActualizada desde destroy', ['mesa_id' => $mesa->id, 'mesa_name' => $mesa->name]);
                event(new \App\Events\MesaActualizada($mesa));
            }
        }
        return response()->json(['message' => 'Pedido cancelado']);
    }
}
