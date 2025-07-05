<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ComandaParaImprimir implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $orderId;
    public $printData;

    public function __construct($orderId, $printData)
    {
        $this->orderId = $orderId;
        $this->printData = $printData;
    }

    public function broadcastOn()
    {
        // Canal exclusivo para cocina
        return new Channel('impresion-cocina');
    }
}
