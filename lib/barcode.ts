import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

export async function startScan() {
  const permission = await BarcodeScanner.requestPermissions();

  if (permission.camera !== 'granted') {
    throw new Error('Camera permission denied');
  }

  const result = await BarcodeScanner.scan();

  return result.barcodes;
}
