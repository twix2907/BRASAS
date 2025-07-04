<?php

declare(strict_types=1);

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CloudinaryImageUploadTest extends TestCase
{
    /** @test */
    public function it_uploads_an_image_to_cloudinary_and_returns_url()
    {
        Storage::fake('cloudinary');
        $file = UploadedFile::fake()->image('test.jpg');

        $response = $this->postJson('/api/cloudinary/upload', [
            'image' => $file,
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['url', 'public_id']);
    }
}
