<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    // Forzar cierre de sesión (elimina el session_token)
    public function forceLogout($id)
    {
        $user = User::findOrFail($id);
        $user->session_token = null;
        $user->save();
        \Illuminate\Support\Facades\Log::info('Emitiendo evento UserActualizado', ['user_id' => $user->id, 'session_token' => $user->session_token]);
        event(new \App\Events\UserActualizado($user));
        return response()->json(['message' => 'Sesión forzada cerrada']);
    }

    // Reactivar usuario (poner active=true)
    public function reactivate($id)
    {
        $user = User::findOrFail($id);
        $user->active = true;
        $user->save();
        event(new \App\Events\UserActualizado($user));
        return response()->json(['message' => 'Usuario reactivado']);
    }

    // Listar todos los usuarios (incluye inhabilitados)
    // Cambio de PIN por el propio usuario (requiere PIN actual)
    public function changePin(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $validated = $request->validate([
            'current_pin' => 'required|digits:4',
            'new_pin' => 'required|digits:4|different:current_pin',
        ]);
        if ($user->pin !== $validated['current_pin']) {
            return response()->json(['message' => 'El PIN actual es incorrecto'], 422);
        }
        $user->pin = $validated['new_pin'];
        $user->save();
        event(new \App\Events\UserActualizado($user));
        return response()->json(['message' => 'PIN actualizado correctamente']);
    }

    // Reseteo de PIN por el admin (no requiere PIN actual)
    public function resetPin(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $validated = $request->validate([
            'new_pin' => 'required|digits:4',
        ]);
        $user->pin = $validated['new_pin'];
        $user->save();
        event(new \App\Events\UserActualizado($user));
        return response()->json(['message' => 'PIN reseteado correctamente']);
    }

    // Forzar sesión única: guardar un token/dispositivo activo
    public function setActiveSession(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $validated = $request->validate([
            'session_token' => 'required|string|max:255',
        ]);
        $user->session_token = $validated['session_token'];
        $user->save();
        event(new \App\Events\UserActualizado($user));
        return response()->json(['message' => 'Sesión activa actualizada']);
    }

    public function index()
    {
        return response()->json(User::all());
    }

    // Crear un nuevo usuario
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'username' => 'required|string|max:50|unique:users,username',
            'pin' => 'required|digits:4',
            'role' => 'required|in:admin,mesero,cajero',
        ]);
        $validated['active'] = true;
        $user = User::create($validated);
        event(new \App\Events\UserActualizado($user));
        return response()->json($user, 201);
    }

    // Mostrar un usuario específico
    public function show($id)
    {
        $user = User::findOrFail($id);
        // event(new UserActualizado($user));
        return response()->json($user);
    }

    // Actualizar usuario
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:100',
            'username' => 'sometimes|required|string|max:50|unique:users,username,' . $user->id,
            'pin' => 'sometimes|required|digits:4',
            'role' => 'sometimes|required|in:admin,mesero,cajero',
            'active' => 'sometimes|boolean',
        ]);
        $user->update($validated);
        event(new \App\Events\UserActualizado($user));
        return response()->json($user);
    }

    // Inhabilitar usuario (no se borra físicamente)
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->active = false;
        $user->save();
        event(new \App\Events\UserActualizado($user));
        return response()->json(['message' => 'Usuario inhabilitado']);
    }

    // Autenticación: valida username y pin
    public function login(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string',
            'pin' => 'required|digits:4',
        ]);
        $user = User::where('username', $validated['username'])
            ->where('pin', $validated['pin'])
            ->where('active', true)
            ->first();
        if (!$user) {
            return response()->json(['message' => 'Usuario o PIN incorrecto'], 401);
        }
        // Generar y asignar session_token único
        $user->last_login_at = now();
        $user->session_token = bin2hex(random_bytes(32));
        $user->save();
        event(new \App\Events\UserActualizado($user));
        return response()->json($user);
    }

    // Login de admin con Sanctum (email + password)
    public function loginAdmin(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);
        $user = \App\Models\User::where('email', $validated['email'])
            ->where('role', 'admin')
            ->where('active', true)
            ->first();
        if (!$user || !\Illuminate\Support\Facades\Hash::check($validated['password'], $user->password)) {
            return response()->json(['message' => 'Credenciales incorrectas o usuario no autorizado'], 401);
        }
        // Generar y asignar session_token único
        $user->session_token = bin2hex(random_bytes(32));
        $user->last_login_at = now();
        $user->save();
        // Para SPA con Sanctum, no usamos Auth::login() ya que puede regenerar sesión
        // En su lugar, confiamos en que Sanctum maneje la autenticación vía cookies
        event(new \App\Events\UserActualizado($user));
        return response()->json(['message' => 'Login exitoso', 'user' => $user]);
    }
}
