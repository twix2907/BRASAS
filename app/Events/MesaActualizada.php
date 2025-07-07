<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Support\Facades\Log;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MesaActualizada implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $mesa;

    public function __construct($mesa)
    {
        $this->mesa = $mesa;
        Log::info('MesaActualizada EVENT fired', ['mesa_id' => $mesa->id, 'mesa_name' => $mesa->name]);
    }

    public function broadcastOn()
    {
        return new Channel('mesas');
    }
    
    // Broadcasting inmediato, no usar queue para máxima velocidad
    public function shouldQueue()
    {
        return false;
    }
}
