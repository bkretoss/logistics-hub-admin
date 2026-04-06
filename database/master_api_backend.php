<?php

// ============================================================
// Master Module - Backend API Structure (Laravel)
// File: routes/api.php  (add these route groups)
// ============================================================

// --- Shipment Types ---
Route::get('/shipment-types',       [ShipmentTypeController::class, 'index']);
Route::post('/shipment-types',      [ShipmentTypeController::class, 'store']);
Route::put('/shipment-types/{id}',  [ShipmentTypeController::class, 'update']);
Route::delete('/shipment-types/{id}', [ShipmentTypeController::class, 'destroy']);

// --- Transport Modes ---
Route::get('/transport-modes',        [TransportModeController::class, 'index']);
Route::post('/transport-modes',       [TransportModeController::class, 'store']);
Route::put('/transport-modes/{id}',   [TransportModeController::class, 'update']);
Route::delete('/transport-modes/{id}',[TransportModeController::class, 'destroy']);

// --- Currencies ---
Route::get('/currencies',        [CurrencyController::class, 'index']);
Route::post('/currencies',       [CurrencyController::class, 'store']);
Route::put('/currencies/{id}',   [CurrencyController::class, 'update']);
Route::delete('/currencies/{id}',[CurrencyController::class, 'destroy']);


// ============================================================
// ShipmentTypeController.php
// ============================================================
class ShipmentTypeController extends Controller
{
    public function index()
    {
        return response()->json(['data' => ShipmentType::orderBy('id', 'desc')->get()]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'   => 'required|string|max:100|unique:shipment_types,name',
            'status' => 'required|in:0,1',
        ]);
        $record = ShipmentType::create($request->only('name', 'description', 'status'));
        return response()->json(['data' => $record], 201);
    }

    public function update(Request $request, $id)
    {
        $record = ShipmentType::findOrFail($id);
        $request->validate([
            'name'   => 'required|string|max:100|unique:shipment_types,name,' . $id,
            'status' => 'required|in:0,1',
        ]);
        $record->update($request->only('name', 'description', 'status'));
        return response()->json(['data' => $record]);
    }

    public function destroy($id)
    {
        ShipmentType::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}


// ============================================================
// TransportModeController.php
// ============================================================
class TransportModeController extends Controller
{
    public function index()
    {
        return response()->json(['data' => TransportMode::orderBy('id', 'desc')->get()]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'   => 'required|string|max:100|unique:transport_modes,name',
            'status' => 'required|in:0,1',
        ]);
        $record = TransportMode::create($request->only('name', 'description', 'status'));
        return response()->json(['data' => $record], 201);
    }

    public function update(Request $request, $id)
    {
        $record = TransportMode::findOrFail($id);
        $request->validate([
            'name'   => 'required|string|max:100|unique:transport_modes,name,' . $id,
            'status' => 'required|in:0,1',
        ]);
        $record->update($request->only('name', 'description', 'status'));
        return response()->json(['data' => $record]);
    }

    public function destroy($id)
    {
        TransportMode::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}


// ============================================================
// CurrencyController.php
// ============================================================
class CurrencyController extends Controller
{
    public function index()
    {
        return response()->json(['data' => Currency::orderBy('id', 'desc')->get()]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'   => 'required|string|max:100',
            'code'   => 'required|string|max:10|unique:currencies,code',
            'symbol' => 'required|string|max:10',
            'status' => 'required|in:0,1',
        ]);
        $record = Currency::create($request->only('name', 'code', 'symbol', 'status'));
        return response()->json(['data' => $record], 201);
    }

    public function update(Request $request, $id)
    {
        $record = Currency::findOrFail($id);
        $request->validate([
            'name'   => 'required|string|max:100',
            'code'   => 'required|string|max:10|unique:currencies,code,' . $id,
            'symbol' => 'required|string|max:10',
            'status' => 'required|in:0,1',
        ]);
        $record->update($request->only('name', 'code', 'symbol', 'status'));
        return response()->json(['data' => $record]);
    }

    public function destroy($id)
    {
        Currency::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
