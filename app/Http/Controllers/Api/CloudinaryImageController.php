<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;

class CloudinaryImageController extends Controller
{
    /**
     * Sube una imagen a Cloudinary y retorna la URL pública.
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'image' => 'required|image|max:5120', // Máx 5MB
        ]);

        $file = $request->file('image');
        $path = Storage::disk('cloudinary')->put('productos', $file);

        // Construir la URL pública estándar de Cloudinary
        $cloudName = config('filesystems.disks.cloudinary.cloud');
        $publicUrl = "https://res.cloudinary.com/{$cloudName}/image/upload/{$path}";

        return response()->json([
            'url' => $publicUrl,
            'public_id' => $path,
        ]);
    }
}
